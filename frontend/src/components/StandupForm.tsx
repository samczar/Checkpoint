// frontend/src/components/StandupForm.tsx
import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { standupService } from "../services/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StandupForm() {
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    yesterday: "",
    today: "",
    blockers: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const [standups, setStandups] = useState([]);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().slice(0, 10);
  const didInit = useRef(false);

  // Only auto-load today's standup if not editing
  // useEffect(() => {
  //   if (!didInit.current) {
  //     api.get('/standups/mine').then(res => {
  //       const entry = res.data.find((s: any) => s.date === today);
  //       if (entry) setForm({ ...entry, date: today });
  //       else setForm({ yesterday: '', today: '', blockers: '', date: today });
  //     });
  //     didInit.current = true;
  //   }
  //   // eslint-disable-next-line
  // }, [today]);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      standupService
        .getMine()
        .then((response) => {
          // Filter standups to only today's
          const todaysStandups = response.data.filter(
            (s: any) => s.date === today
          );
          setStandups(todaysStandups);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch standups:", err);
          setError("Failed to load standups. Please try again.");
          setLoading(false);
        });
    }
  }, [isAuthenticated, today]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleSelectChange = (value: string) => {
    setForm((f) => ({ ...f, blockers: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await api.post("/standups", form);
    setLoading(false);
    setEditMode(false);
    // Optionally, refresh standups after submit
    // Refresh standups after submit, filtered to today
    if (isAuthenticated) {
      standupService
        .getMine()
        .then((response) => {
          const todaysStandups = response.data.filter(
            (s: any) => s.date === today
          );
          setStandups(todaysStandups);
        })
        .catch(() => {});
    }
    // Reset form to today's standup after editing
    setForm({ yesterday: "", today: "", blockers: "", date: today });
  };

  // Handler to edit a standup from history (does not trigger today's auto-load)
  const handleEdit = (standup: any) => {
    setEditMode(true);
    setForm({ ...standup, date: standup.date });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          name="yesterday"
          value={form.yesterday}
          onChange={handleChange}
          placeholder="What did you do yesterday?"
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="today"
          value={form.today}
          onChange={handleChange}
          placeholder="What will you do today?"
          required
          className="w-full p-2 border rounded"
        />
        <Select onValueChange={handleSelectChange} value={form.blockers}>
          <SelectTrigger className="w-full p-2 border rounded">
            <SelectValue placeholder="Any Blockers?" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Any Blockers?</SelectLabel>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button type="submit" className="px-4 py-2 rounded" disabled={loading}>
          {loading ? "Saving..." : "Save Standup"}
        </Button>
      </form>
      {/* Cards for users' tasks for the day */}
      <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {standups.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg py-8">
            You haven't added a task for today.
          </div>
        ) : (
          <>
            {standups.map((standup: any, idx) => (
              <Card key={standup?._id || idx}>
                <CardHeader>
                  <CardTitle>
                    {standup.user?.name || "You"} - {standup.date}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <strong>Yesterday:</strong>
                    <div className="mb-2">{standup.yesterday}</div>
                  </div>
                  <div>
                    <strong>Today:</strong>
                    <div className="mb-2">{standup.today}</div>
                  </div>
                  <div>
                    <strong>Blockers:</strong>
                    <div>{standup.blockers ? standup.blockers : "None"}</div>
                  </div>
                  <Button
                    type="button"
                    className="mt-2 px-3 py-1 rounded bg-yellow-400 text-black"
                    onClick={() => handleEdit(standup)}
                  >
                    Edit
                  </Button>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
    </>
  );
}

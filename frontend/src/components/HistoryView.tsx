// frontend/src/components/HistoryView.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Button } from "@/components/ui/button";

interface Standup {
  _id: string;
  date: string;
  yesterday: string;
  today: string;
  blockers: string;
  createdAt: string;
}

type SortBy = "date-desc" | "date-asc" | "today-az" | "today-za";

export default function HistoryView() {
  const [standups, setStandups] = useState<Standup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const fetchStandups = async (page = 1) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: itemsPerPage,
      };
      // Only send search if not empty
      if (search.trim()) params.search = search.trim();

      const res = await api.get("/standups/mine", { params });

      let data: Standup[] = [];
      if (res.data.standups && res.data.totalPages) {
        data = res.data.standups;
        // setTotalPages(res.data.totalPages);
      } else {
        data = res.data;
        // setTotalPages(Math.ceil(res.data.length / itemsPerPage));
      }

      // Client-side sort
      let sorted = [...data];
      if (sortBy === "date-desc") {
        sorted.sort((a, b) => b.date.localeCompare(a.date));
      } else if (sortBy === "date-asc") {
        sorted.sort((a, b) => a.date.localeCompare(b.date));
      } else if (sortBy === "today-az") {
        sorted.sort((a, b) => a.today.localeCompare(b.today));
      } else if (sortBy === "today-za") {
        sorted.sort((a, b) => b.today.localeCompare(a.today));
      }

      setStandups(sorted);
    } catch (err: any) {
      setError("Failed to load standups");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandups(currentPage);
    // eslint-disable-next-line
  }, [currentPage, search, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchStandups(1);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const paginatedStandups = standups;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Standup History</h2>
        <Link
          to="/"
          className="bg-zinc-800 text-white px-4 py-2 rounded-md hover:bg-zinc-900 transition-colors"
        >
          New Standup
        </Link>
      </div>

      <div className="mb-6 flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
        <form onSubmit={handleSearch} className="flex flex-1 space-x-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by content..."
            className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            type="submit"
          >
            Search
          </Button>
        </form>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortBy)}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="date-desc">Sort by Date (Newest)</option>
          <option value="date-asc">Sort by Date (Oldest)</option>
          <option value="today-az">Sort by Today (A-Z)</option>
          <option value="today-za">Sort by Today (Z-A)</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : standups.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">No standups found</p>
          <Link
            to="/"
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            Create your first standup
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {paginatedStandups.map((standup) => (
            <div
              key={standup._id}
              className="p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-blue-800">
                  {formatDate(standup.date)}
                </h3>
              </div>
              <div className="mb-1">
                <span className="font-semibold">Yesterday: </span>
                <span>{standup.yesterday}</span>
              </div>
              <div className="mb-1">
                <span className="font-semibold">Today: </span>
                <span>{standup.today}</span>
              </div>
              <div>
                <span className="font-semibold">Blockers: </span>
                <span>{standup.blockers || "None"}</span>
              </div>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
}
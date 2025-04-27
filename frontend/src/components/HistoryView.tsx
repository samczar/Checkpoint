// frontend/src/components/HistoryView.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

interface Standup {
  _id: string;
  date: string;
  yesterday: string;
  today: string;
  blockers: string;
  createdAt: string;
}

export default function HistoryView() {
  const [standups, setStandups] = useState<Standup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const fetchStandups = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/standups/mine", {
        params: {
          page,
          limit: itemsPerPage,
          search: filter,
        },
      });

      // Check if API returns paginated data or just an array
      if (res.data.standups && res.data.totalPages) {
        setStandups(res.data.standups);
        setTotalPages(res.data.totalPages);
      } else {
        // For APIs that don't support pagination yet
        setStandups(res.data);
        setTotalPages(Math.ceil(res.data.length / itemsPerPage));
      }
    } catch (err: any) {
      setError("Failed to load standups");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandups(currentPage);
  }, [currentPage, filter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
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
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          New Standup
        </Link>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by content..."
            className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </form>
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
          <ul className="space-y-4">
            {paginatedStandups.map((standup) => (
              <li
                key={standup._id}
                className="p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-blue-800">
                    {formatDate(standup.date)}
                  </h3>
                  <Link
                    to={`/edit/${standup._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Edit Standup
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

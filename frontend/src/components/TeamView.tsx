// frontend/src/components/TeamView.tsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface TeamStandup {
  _id: string;
  date: string;
  yesterday: string;
  today: string;
  blockers: string;
  user: User;
  createdAt: string;
}

export default function TeamView() {
  const [teamStandups, setTeamStandups] = useState<TeamStandup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().slice(0, 10));
  const [view, setView] = useState<'cards' | 'table'>('cards');

  const fetchTeamStandups = async (date: string) => {
    setLoading(true);
    try {
      const res = await api.get('/team/standups', { 
        params: { date } 
      });
      setTeamStandups(res.data);
    } catch (err: any) {
      setError('Failed to load team standups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamStandups(dateFilter);
  }, [dateFilter]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const UserAvatar = ({ user }: { user: User }) => (
    <div className="flex items-center space-x-2">
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="w-8 h-8 rounded-full"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
          {user.name.charAt(0).toUpperCase()}
        </div>
      )}
      <span className="font-medium">{user.name}</span>
    </div>
  );

  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teamStandups.map((standup) => (
        <div key={standup._id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-4">
            <UserAvatar user={standup.user} />
          </div>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-600">Yesterday</h4>
              <p className="text-gray-800">{standup.yesterday}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600">Today</h4>
              <p className="text-gray-800">{standup.today}</p>
            </div>
            {standup.blockers && (
              <div>
                <h4 className="text-sm font-medium text-red-600">Blockers</h4>
                <p className="text-gray-800">{standup.blockers}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const TableView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Team Member
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Yesterday
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Today
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Blockers
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {teamStandups.map((standup) => (
            <tr key={standup._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <UserAvatar user={standup.user} />
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-gray-900">{standup.yesterday}</p>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-gray-900">{standup.today}</p>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-red-600">{standup.blockers || '-'}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Team Standups</h2>
        <p className="text-gray-600">{formatDate(dateFilter)}</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setDateFilter(new Date().toISOString().slice(0, 10))}
            className="text-blue-600 hover:text-blue-800"
          >
            Today
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView('cards')}
            className={`px-3 py-1 rounded-md ${
              view === 'cards' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cards
          </button>
          <button
            onClick={() => setView('table')}
            className={`px-3 py-1 rounded-md ${
              view === 'table' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Table
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : teamStandups.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No standups found for this date</p>
        </div>
      ) : (
        view === 'cards' ? <CardView /> : <TableView />
      )}
    </div>
  );
}
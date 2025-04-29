// frontend/src/components/TeamView.tsx
import  { useEffect, useState } from 'react';
import api from '../services/api';
import { Button } from "@/components/ui/button";

interface User {
  _id: string;
  name: string;
  email: string;
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
  const [range, setRange] = useState<'day' | 'week'>('day');
  const [users, setUsers] = useState<User[]>([]);
  const [userFilter, setUserFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().slice(0, 10));
  const [view, setView] = useState<'cards' | 'table'>('cards');

    // Fetch all users for the user filter dropdown
    useEffect(() => {
      api.get('/auth/users').then(res => setUsers(res.data)).catch(() => {});
    }, []);

      // Fetch most recent standup from each user, with optional filters
  const fetchTeamStandups = async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = {};
      if (range === 'week') {
        params.range = 'week';
      } else if (dateFilter) {
        params.date = dateFilter;
      }
      console.log('Fetching team standups with params:', params);
      console.log('userFilter ', userFilter)
      if (userFilter) params.userId = userFilter;
      const res = await api.get('/standups/team', { params });
      setTeamStandups(res.data);
    } catch (err: any) {
      setError('Failed to load team standups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamStandups();
    // eslint-disable-next-line
  }, [dateFilter, range, userFilter]);


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
    
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
          {user?.name.charAt(0).toUpperCase()}
        </div>
    
      <span className="font-medium">{user?.name}</span>
    </div>
  );
const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teamStandups.map((standup) => (
        <div
          key={standup._id}
          className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="mb-4">
            <UserAvatar user={standup.user} />
            <div className="text-xs text-gray-500">{formatDate(standup.date)}</div>
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
              Date
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
              <td className="px-6 py-4 text-xs text-gray-500">{formatDate(standup.date)}</td>
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
      </div>

      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => {
              setRange('day');
              setDateFilter('');
            }}
            variant={ range === 'day' ? 'default'  : 'secondary' }
            
          >
            By Date
          </Button>
          <Button
            onClick={() => {
              setRange('week');
              setDateFilter('');
            }}
            variant={ range === 'week' ? 'default'  : 'secondary' }
          >
            Last 7 Days
          </Button>
        </div>
        {range === 'day' && (
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Filter by date"
          />
        )}
        <select
          value={userFilter}
          onChange={e => {
            console.log('User filter changed:', e.target.value);
            setUserFilter(e.target.value)}}
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Users</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </select>
        <div className="flex items-center space-x-2 ml-auto">
          <Button
            onClick={() => setView('cards')}
            variant={view === 'cards' ? 'default' : 'secondary'}
          >
            Cards
          </Button>
          <Button
            onClick={() => setView('table')}
            variant={view === 'table' ? 'default' : 'secondary'}
            
          >
            Table
          </Button>
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
          <p className="text-gray-500">No standups found for this filter</p>
        </div>
      ) : (
        view === 'cards' ? <CardView /> : <TableView />
      )}
    </div>
  );
}
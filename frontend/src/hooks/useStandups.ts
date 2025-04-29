
import { useState, useEffect, useCallback } from 'react';
import { standupService } from '../services/api';

interface Standup {
  _id: string;
  date: string;
  yesterday: string;
  today: string;
  blockers: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse {
  standups: Standup[];
  currentPage: number;
  totalPages: number;
  total: number;
}

interface UseStandupsReturn {
  standups: Standup[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  fetchStandups: (page?: number, search?: string) => Promise<void>;
  createStandup: (data: { date: string; yesterday: string; today: string; blockers?: string }) => Promise<void>;
  updateStandup: (id: string, data: { yesterday: string; today: string; blockers?: string }) => Promise<void>;
  deleteStandup: (id: string) => Promise<void>;
}

export function useStandups(initialPage = 1, initialSearch = ''): UseStandupsReturn {
  const [standups, setStandups] = useState<Standup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [search, setSearch] = useState<string>(initialSearch);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchStandups = useCallback(async (newPage?: number, newSearch?: string) => {
    const currentPage = newPage !== undefined ? newPage : page;
    const currentSearch = newSearch !== undefined ? newSearch : search;
    
    if (newPage !== undefined) setPage(newPage);
    if (newSearch !== undefined) setSearch(newSearch);
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await standupService.getMine({ 
        page: currentPage, 
        limit: 5, 
        search: currentSearch 
      });
      
      const data = response.data as PaginatedResponse;
      setStandups(data.standups);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch standups');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  const createStandup = async (data: { date: string; yesterday: string; today: string; blockers?: string }) => {
    setLoading(true);
    try {
      await standupService.create(data);
      fetchStandups(1); // Refresh and go to first page
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create standup');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStandup = async (id: string, data: { yesterday: string; today: string; blockers?: string }) => {
    setLoading(true);
    try {
      await standupService.update(id, data);
      fetchStandups(); // Refresh current page
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update standup');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteStandup = async (id: string) => {
    setLoading(true);
    try {
      await standupService.delete(id);
      fetchStandups(); // Refresh current page
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete standup');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStandups();
  }, [fetchStandups]);

  return {
    standups,
    loading,
    error,
    page,
    totalPages,
    fetchStandups,
    createStandup,
    updateStandup,
    deleteStandup
  };
}


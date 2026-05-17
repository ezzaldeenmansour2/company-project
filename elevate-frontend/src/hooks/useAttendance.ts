import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useAttendance = (sessionId: number | null) => {
  return useQuery({
    queryKey: ['attendance', sessionId],
    queryFn: async () => {
      if (!sessionId) return { records: [] };
      const res = await api.get(`/attendance/${sessionId}/attendees`);
      return res.data;
    },
    enabled: !!sessionId,
    refetchInterval: 3000, // Enterprise-grade polling as fallback for WS
    staleTime: 2000,
  });
};

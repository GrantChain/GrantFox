import { useQuery } from '@tanstack/react-query';
import { fetchGrants } from '../services/grants.service';

export const useGrants = () => {
  return useQuery({
    queryKey: ['grants'],
    queryFn: fetchGrants,
  });
}; 
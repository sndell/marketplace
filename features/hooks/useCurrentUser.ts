import { useQuery } from '@tanstack/react-query';
import { RegisteredDatabaseUserAttributes } from 'lucia';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () =>
      fetch('/api/v1/user/current').then(async (res) => (await res.json()) as RegisteredDatabaseUserAttributes),
  });
};

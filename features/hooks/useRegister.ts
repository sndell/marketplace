import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useRegister = (handleRegisterErrors: (error: string) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: { data: { email: string; displayName: string; password: string } }) =>
      fetch('/api/v1/user/register', { method: 'POST', body: JSON.stringify(data) }),
    onError: (error) => {
      console.error(error);
    },
    onSuccess: async (response) => {
      const data = await response.json();
      if (data.error) handleRegisterErrors(data.error);
      else queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

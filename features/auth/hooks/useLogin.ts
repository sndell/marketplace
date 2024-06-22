import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useLogin = (handleRegisterErrors: (error: string) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: { data: { email: string; password: string } }) =>
      fetch('/api/v1/user/login', { method: 'POST', body: JSON.stringify(data) }).then(async (res) => await res.json()),
    onError: (error) => {
      console.error(error);
    },
    onSuccess: async (data) => {
      if (data.error) handleRegisterErrors(data.error);
      else queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from './useToast';

interface MutationOptions {
  successTitle?: string;
  successDescription?: string;
  errorTitle?: string;
  errorDescription?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  invalidateQueries?: string[];
}

export const useApiMutation = (
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  options: MutationOptions = {}
) => {
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest(method, url, data);
    },
    onSuccess: (data) => {
      if (options.successTitle) {
        showSuccess(options.successTitle, options.successDescription);
      }
      
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        });
      }
      
      options.onSuccess?.(data);
    },
    onError: (error: any) => {
      const title = options.errorTitle || 'Error';
      const description = options.errorDescription || error.message || 'An error occurred. Please try again.';
      showError(title, description);
      options.onError?.(error);
    },
  });
};
import { useToast as useToastPrimitive } from '@/hooks/use-toast';

export const useToast = () => {
  const { toast } = useToastPrimitive();

  const showSuccess = (title: string, description?: string) => {
    toast({
      title,
      description,
    });
  };

  const showError = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  };

  const showInfo = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
    });
  };

  return {
    toast,
    showSuccess,
    showError,
    showInfo,
  };
};
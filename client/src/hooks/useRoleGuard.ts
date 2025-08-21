import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useLocation } from 'wouter';
import { useToast } from './useToast';

type UserRole = 'ND_ADULT' | 'EMPLOYER' | 'ADMIN' | 'MANAGER';

export const useRoleGuard = (allowedRoles: UserRole[], redirectTo: string = '/') => {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { showError } = useToast();

  useEffect(() => {
    if (isAuthenticated && user?.user_role && !allowedRoles.includes(user.user_role as UserRole)) {
      showError(
        'Access Restricted',
        `This feature is only available for ${allowedRoles.join(', ').toLowerCase()} users.`
      );
      setLocation(redirectTo);
    }
  }, [isAuthenticated, user, allowedRoles, redirectTo, setLocation, showError]);

  return {
    hasAccess: isAuthenticated && user?.user_role && allowedRoles.includes(user.user_role as UserRole),
    isLoading: !isAuthenticated,
  };
};
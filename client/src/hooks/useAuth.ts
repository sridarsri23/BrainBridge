import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
// User type as used by the frontend (camelCase)
type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  userRole: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
};

type LoginData = {
  email: string;
  password: string;
};

export function useAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  function transformUser(raw: any): User {
    const roleMap: Record<string, string> = {
      ND_ADULT: "ND_Adult",
      EMPLOYER: "Employer",
      ADMIN: "Admin",
      MANAGER: "Manager",
      MENTOR: "Mentor",
      GUARDIAN: "Guardian",
    };
    return {
      id: raw.id,
      email: raw.email,
      firstName: raw.first_name,
      lastName: raw.last_name,
      userRole: roleMap[raw.user_role] || raw.user_role,
      phone: raw.phone,
      isActive: raw.is_active,
      createdAt: raw.created_at,
    };
  }

  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch("/api/auth/user", {
          credentials: "include",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        
        if (res.status === 401) {
          return null; // Not authenticated
        }
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const raw = await res.json();
        return transformUser(raw);
      } catch (error) {
        console.error("Auth check failed:", error);
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        // FastAPI returns error details in 'detail' field, not 'message'
        const errorMessage = errorData.detail || errorData.message || `Login failed with status ${res.status}`;
        throw new Error(errorMessage);
      }

      const data = await res.json();
      // Persist JWT for Authorization header usage
      if (data?.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/user"], transformUser(data.user));
      toast({
        title: "Success!",
        description: "You have been logged in successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      // Transform camelCase frontend data to snake_case for backend
      const backendUserData = {
        email: userData.email,
        first_name: userData.firstName || userData.first_name,
        last_name: userData.lastName || userData.last_name,
        user_role: userData.userRole || userData.user_role,
        phone: userData.phone,
        password: userData.password,
      };
      
      // Validation check before sending
      if (!backendUserData.user_role) {
        console.error('ERROR: user_role is missing!', {
          'userData.userRole': userData.userRole,
          'userData.user_role': userData.user_role,
          'backendUserData.user_role': backendUserData.user_role
        });
      }
      
      console.log('\n=== FRONTEND REGISTRATION DEBUG ===');
      console.log('1. Raw form data received:', JSON.stringify(userData, null, 2));
      console.log('2. userRole field specifically:', userData.userRole);
      console.log('3. typeof userRole:', typeof userData.userRole);
      console.log('4. Transformed backend data:', JSON.stringify(backendUserData, null, 2));
      console.log('5. user_role being sent:', backendUserData.user_role);
      console.log('6. About to send HTTP request to /api/auth/register');
      console.log('7. Request body:', JSON.stringify(backendUserData));
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(backendUserData),
      });
      
      console.log('8. HTTP Response status:', res.status);
      console.log('9. HTTP Response ok:', res.ok);

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch (e) {
          errorData = { detail: 'Unable to process server response' };
        }
        
        console.log('Registration error details:', { status: res.status, errorData });
        
        let errorMessage = 'Registration failed. Please try again.';
        
        if (res.status === 422) {
          if (errorData.detail) {
            if (Array.isArray(errorData.detail)) {
              // Pydantic validation errors - make them user-friendly
              const validationErrors = errorData.detail.map((err: any) => {
                const field = err.loc?.[err.loc.length - 1] || 'field';
                let fieldName = field;
                
                // Convert snake_case to user-friendly names
                switch (field) {
                  case 'first_name': fieldName = 'First name'; break;
                  case 'last_name': fieldName = 'Last name'; break;
                  case 'user_role': fieldName = 'Role'; break;
                  case 'email': fieldName = 'Email'; break;
                  case 'password': fieldName = 'Password'; break;
                  case 'phone': fieldName = 'Phone number'; break;
                  default: fieldName = field;
                }
                
                return `• ${fieldName}: ${err.msg}`;
              });
              errorMessage = `Please fix the following errors:\n${validationErrors.join('\n')}`;
            } else if (typeof errorData.detail === 'string') {
              // Handle backend formatted validation error string
              if (errorData.detail.includes('Validation error:')) {
                console.log('Parsing validation error:', errorData.detail);
                const cleanedMessage = errorData.detail
                  .replace('Validation error: ', '')  // Note the space after colon
                  .trim()
                  .split(', ')
                  .map((err: string) => {
                    console.log('Processing error:', err);
                    const [field, ...messageParts] = err.split(': ');
                    const message = messageParts.join(': '); // Rejoin in case message has colons
                    let fieldName = field;
                    switch (field) {
                      case 'first_name': fieldName = 'First name'; break;
                      case 'last_name': fieldName = 'Last name'; break;
                      case 'user_role': fieldName = 'Role'; break;
                      case 'email': fieldName = 'Email'; break;
                      case 'password': fieldName = 'Password'; break;
                      case 'phone': fieldName = 'Phone number'; break;
                    }
                    return `• ${fieldName}: ${message}`;
                  })
                  .join('\n');
                errorMessage = `Please fix the following errors:\n\n${cleanedMessage}`;
                console.log('Final error message:', errorMessage);
              } else {
                errorMessage = errorData.detail;
              }
            }
          }
        } else if (res.status === 400) {
          errorMessage = errorData.detail || 'Invalid request. Please check your information.';
        } else if (res.status === 401) {
          errorMessage = errorData.detail || 'Authentication failed.';
        } else {
          errorMessage = errorData.detail || errorData.message || `Server error (${res.status}). Please try again.`;
        }
        
        throw new Error(errorMessage);
      }

      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/user"], transformUser(data));
      toast({
        title: "Welcome to BrainBridge!",
        description: "Your account has been created successfully.",
      });
    },
    onError: (error: Error) => {
      console.log('Mutation error:', error.message);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }
    },
    onSuccess: () => {
      localStorage.removeItem("access_token");
      queryClient.setQueryData(["/api/auth/user"], null);
      queryClient.clear(); // Clear all cached data
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      // Redirect to landing page after logout
      window.location.href = "/";
    },
  });

  // User is authenticated if we have user data and no error
  const isAuthenticated = !!user && user !== null;

  return {
    user: user || undefined,
    isLoading,
    isAuthenticated,
    error,
    loginMutation,
    registerMutation,
    logoutMutation,
  };
}

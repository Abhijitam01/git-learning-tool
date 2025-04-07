import { QueryClient } from '@tanstack/react-query';

// Helper function to throw error if response is not ok
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorText = '';
    try {
      const errorData = await res.json();
      errorText = errorData.error || 'Unknown error';
    } catch {
      errorText = 'Failed to parse error response';
    }
    throw new Error(`API Error: ${res.status} ${errorText}`);
  }
}

// API request helper function
export async function apiRequest(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const url = path.startsWith('/') ? `/api${path}` : `/api/${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  await throwIfResNotOk(res);
  return res.json();
}

// Default query function
type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => (path: string) => Promise<T | null> = (options) => {
  return async (path) => {
    try {
      return await apiRequest(path);
    } catch (error) {
      if (options.on401 === "returnNull") {
        return null;
      }
      throw error;
    }
  };
};

// Create query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      queryFn: getQueryFn<any>({ on401: "throw" }),
    },
  },
});
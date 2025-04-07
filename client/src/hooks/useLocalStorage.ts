interface UseLocalStorageReturn {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
  }
  
  export function useLocalStorage(): UseLocalStorageReturn {
    const getItem = (key: string): string | null => {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error('Error getting item from localStorage:', error);
        return null;
      }
    };
    
    const setItem = (key: string, value: string): void => {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('Error setting item in localStorage:', error);
      }
    };
    
    const removeItem = (key: string): void => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing item from localStorage:', error);
      }
    };
    
    return {
      getItem,
      setItem,
      removeItem,
    };
  }
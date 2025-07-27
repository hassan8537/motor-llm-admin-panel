// utils/auth.ts
export const authUtils = {
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    return !!(token && user);
  },

  // Get auth token
  getToken: (): string | null => {
    return localStorage.getItem("authToken");
  },

  // Get user data
  getUser: (): any | null => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // Check if token is expired (enhance this based on your token structure)
  isTokenExpired: (): boolean => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return true;

      // Add your JWT expiry logic here if needed
      // const payload = JSON.parse(atob(token.split('.')[1]));
      // return payload.exp * 1000 < Date.now();

      return false;
    } catch {
      return true;
    }
  },

  // Clear auth data
  clearAuth: (): void => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("sessionToken");
    sessionStorage.clear();
  },
};

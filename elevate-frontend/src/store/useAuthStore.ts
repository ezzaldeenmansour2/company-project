import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
      },
      clearAuth: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('device_uuid');
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateUser: (userData) => 
        set((state) => {
          const newUser = state.user ? { ...state.user, ...userData } : null;
          if (newUser) {
            localStorage.setItem('user', JSON.stringify(newUser));
          }
          return { user: newUser };
        }),
    }),
    {
      name: 'elevate-auth-storage',
    }
  )
);

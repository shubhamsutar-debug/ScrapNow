import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface User {
  userId: string;
  name: string;
  phone: string;
  location: string;
  createdAt: string;
}

export type AuthIntent = 'sell-scrap' | null;

interface AuthContextValue {
  user: User | null;
  isAuthModalOpen: boolean;
  authRedirectIntent: AuthIntent;
  openAuthModal: (intent?: AuthIntent) => void;
  closeAuthModal: () => void;
  login: (user: User) => void;
  logout: () => void;
  isExistingUser: (phone: string) => User | null;
  registerUser: (phone: string, name: string) => User;
}

// ─── Storage Keys ────────────────────────────────────────────────────────────

const CURRENT_USER_KEY = 'scrapnow_user';
const ALL_USERS_KEY = 'scrapnow_users';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function loadAllUsers(): User[] {
  try {
    const raw = localStorage.getItem(ALL_USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

function saveCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

function saveAllUsers(users: User[]) {
  localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadCurrentUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRedirectIntent, setAuthRedirectIntent] = useState<AuthIntent>(null);

  // Persist current user whenever it changes
  useEffect(() => {
    saveCurrentUser(user);
  }, [user]);

  const openAuthModal = useCallback((intent: AuthIntent = null) => {
    setAuthRedirectIntent(intent);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthRedirectIntent(null);
  }, []);

  const login = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const isExistingUser = useCallback((phone: string): User | null => {
    const all = loadAllUsers();
    return all.find((u) => u.phone === phone) ?? null;
  }, []);

  const registerUser = useCallback((phone: string, name: string): User => {
    const newUser: User = {
      userId: crypto.randomUUID(),
      name,
      phone,
      location: 'Pune',
      createdAt: new Date().toISOString(),
    };
    const all = loadAllUsers();
    all.push(newUser);
    saveAllUsers(all);
    return newUser;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        authRedirectIntent,
        openAuthModal,
        closeAuthModal,
        login,
        logout,
        isExistingUser,
        registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

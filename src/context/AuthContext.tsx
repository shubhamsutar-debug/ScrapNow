import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type UserRole = 'user' | 'collector';

export interface User {
  userId: string;
  name: string;
  phone: string;
  location: string;
  createdAt: string;
  role: UserRole;
  businessName?: string;
  vehicleType?: string;
}

export interface PickupItem {
  id: string;
  name: string;
  category: string;
  weightKg: number;
  pricePerKg: number;
  amount: number;
}

export interface PickupRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  collectorId: string;
  collectorName: string;
  collectorRating: number;
  collectorDistance: string;
  collectorAddress: string;
  pickupAddress: string;
  timeSlot: string;
  estimatedValue: number;
  status: 'Collector Confirmed' | 'Pending Pickup' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
  completedAt?: string;
  items: PickupItem[];
  paymentMethod?: string;
}

export type AuthIntent = 'sell-scrap' | null;

interface AuthContextValue {
  user: User | null;
  isAuthModalOpen: boolean;
  authRedirectIntent: AuthIntent;
  pickups: PickupRequest[];
  openAuthModal: (intent?: AuthIntent) => void;
  closeAuthModal: () => void;
  login: (user: User) => void;
  logout: () => void;
  isExistingUser: (phone: string) => User | null;
  registerUser: (phone: string, name: string) => User;
  upgradeToCollector: (businessName: string, vehicleType: string) => User;
  addPickupRequest: (request: Omit<PickupRequest, 'id' | 'createdAt'>) => PickupRequest;
}

// ─── Storage Keys ────────────────────────────────────────────────────────────

const CURRENT_USER_KEY = 'scrapnow_user';
const ALL_USERS_KEY = 'scrapnow_users';
const PICKUPS_KEY = 'scrapnow_pickups';

// ─── Initial Mock Pickups for Demo ──────────────────────────────────────────

const INITIAL_MOCK_PICKUPS: PickupRequest[] = [
  {
    id: 'SN-402910',
    userId: 'demo-user-1',
    userName: 'Shubham Sutar',
    userPhone: '9876543210',
    collectorId: 'col-1',
    collectorName: 'Raj Scrap Center',
    collectorRating: 4.8,
    collectorDistance: '1.2 km away',
    collectorAddress: 'Kothrud, Pune',
    pickupAddress: 'Paud Road, Kothrud, Pune, Maharashtra - 411038',
    timeSlot: 'Tomorrow • 10:30 AM',
    estimatedValue: 420,
    status: 'Collector Confirmed',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    items: [
      { id: 'newspaper', name: 'Newspaper', category: 'Paper', weightKg: 10, pricePerKg: 26, amount: 260 },
      { id: 'plastic-bottles', name: 'PET Water Bottles', category: 'Plastic', weightKg: 5, pricePerKg: 32, amount: 160 },
    ],
  },
  {
    id: 'SN-391024',
    userId: 'demo-user-1',
    userName: 'Shubham Sutar',
    userPhone: '9876543210',
    collectorId: 'col-2',
    collectorName: 'GreenCycle Pune Mart',
    collectorRating: 4.9,
    collectorDistance: '2.1 km away',
    collectorAddress: 'Viman Nagar, Pune',
    pickupAddress: 'Paud Road, Kothrud, Pune, Maharashtra - 411038',
    timeSlot: 'Completed on Aug 8',
    estimatedValue: 130,
    status: 'Completed',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    completedAt: 'Aug 8, 2026',
    paymentMethod: 'UPI',
    items: [
      { id: 'plastic-bottles', name: 'Plastic Bottles', category: 'Plastic', weightKg: 5, pricePerKg: 26, amount: 130 },
    ],
  },
  {
    id: 'SN-281940',
    userId: 'demo-user-1',
    userName: 'Shubham Sutar',
    userPhone: '9876543210',
    collectorId: 'col-3',
    collectorName: 'EcoScrap Traders',
    collectorRating: 4.6,
    collectorDistance: '3.4 km away',
    collectorAddress: 'Hadapsar, Pune',
    pickupAddress: 'Paud Road, Kothrud, Pune, Maharashtra - 411038',
    timeSlot: 'Completed on Aug 5',
    estimatedValue: 208,
    status: 'Completed',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    completedAt: 'Aug 5, 2026',
    paymentMethod: 'Cash',
    items: [
      { id: 'newspaper', name: 'Newspaper', category: 'Paper', weightKg: 8, pricePerKg: 26, amount: 208 },
    ],
  },
];

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

function loadPickups(): PickupRequest[] {
  try {
    const raw = localStorage.getItem(PICKUPS_KEY);
    return raw ? (JSON.parse(raw) as PickupRequest[]) : INITIAL_MOCK_PICKUPS;
  } catch {
    return INITIAL_MOCK_PICKUPS;
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

function savePickups(pickups: PickupRequest[]) {
  localStorage.setItem(PICKUPS_KEY, JSON.stringify(pickups));
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadCurrentUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRedirectIntent, setAuthRedirectIntent] = useState<AuthIntent>(null);
  const [pickups, setPickups] = useState<PickupRequest[]>(loadPickups);

  useEffect(() => {
    saveCurrentUser(user);
  }, [user]);

  useEffect(() => {
    savePickups(pickups);
  }, [pickups]);

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
      role: 'user',
    };
    const all = loadAllUsers();
    all.push(newUser);
    saveAllUsers(all);
    return newUser;
  }, []);

  const upgradeToCollector = useCallback((businessName: string, vehicleType: string): User => {
    if (!user) throw new Error('Must be logged in to upgrade to collector');
    const updatedUser: User = {
      ...user,
      role: 'collector',
      businessName,
      vehicleType,
    };
    setUser(updatedUser);
    const all = loadAllUsers().map((u) => (u.phone === user.phone ? updatedUser : u));
    saveAllUsers(all);
    return updatedUser;
  }, [user]);

  const addPickupRequest = useCallback(
    (reqData: Omit<PickupRequest, 'id' | 'createdAt'>): PickupRequest => {
      const newReq: PickupRequest = {
        ...reqData,
        id: `SN-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString(),
      };
      setPickups((prev) => [newReq, ...prev]);
      return newReq;
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        authRedirectIntent,
        pickups,
        openAuthModal,
        closeAuthModal,
        login,
        logout,
        isExistingUser,
        registerUser,
        upgradeToCollector,
        addPickupRequest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

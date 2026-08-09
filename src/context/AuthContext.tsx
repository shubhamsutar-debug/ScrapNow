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
  collectorProfile?: CollectorProfile;
}

export interface CollectorProfile {
  collectorId: string;
  name: string;
  phone: string;
  businessName: string;
  shopAddress: string;
  city: string;
  pincode: string;
  acceptedCategories: string[];
  pickupAvailable: boolean;
  pickupRadiusKm: number;
  workingDays: string;
  workingHours: string;
  minPickupKg: number;
  createdAt: string;
}

export interface PickupItem {
  id: string;
  name: string;
  category: string;
  weightKg: number;
  pricePerKg: number;
  amount: number;
}

export type PickupStatus =
  | 'Pending Pickup'
  | 'Accepted'
  | 'Collector Confirmed'
  | 'On the Way'
  | 'Arrived'
  | 'Scrap Collected'
  | 'Completed'
  | 'Rejected'
  | 'Cancelled';

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
  status: PickupStatus;
  createdAt: string;
  completedAt?: string;
  items: PickupItem[];
  paymentMethod?: string;
}

export type AuthIntent = 'sell-scrap' | 'collector-register' | null;

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
  registerUser: (phone: string, name: string, role?: UserRole) => User;
  registerCollector: (collectorData: {
    name: string;
    phone: string;
    businessName: string;
    shopAddress: string;
    city: string;
    pincode: string;
    acceptedCategories: string[];
    pickupAvailable: boolean;
    pickupRadiusKm: number;
    workingDays: string;
    workingHours: string;
    minPickupKg: number;
  }) => User;
  updateCollectorProfile: (data: Partial<CollectorProfile>) => void;
  upgradeToCollector: (businessName: string, vehicleType: string) => User;
  addPickupRequest: (request: Omit<PickupRequest, 'id' | 'createdAt'>) => PickupRequest;
  acceptPickupRequest: (requestId: string, collectorName: string) => void;
  rejectPickupRequest: (requestId: string) => void;
  updatePickupStatus: (requestId: string, status: PickupStatus, paymentMethod?: string) => void;
  updatePickupItems: (requestId: string, updatedItems: PickupItem[]) => void;
}

// ─── Storage Keys ────────────────────────────────────────────────────────────

const CURRENT_USER_KEY = 'scrapnow_user';
const ALL_USERS_KEY = 'scrapnow_users';
const PICKUPS_KEY = 'scrapnow_pickups_v2'; // Key updated for fresh demo pickups

// ─── Rich Initial Mock Pickups for Demo ─────────────────────────────────────

const INITIAL_MOCK_PICKUPS: PickupRequest[] = [
  {
    id: 'SN-508210',
    userId: 'demo-user-1',
    userName: 'Shubham Sutar',
    userPhone: '9876543210',
    collectorId: 'col-1',
    collectorName: 'Raj Scrap Center',
    collectorRating: 4.8,
    collectorDistance: '1.2 km away',
    collectorAddress: 'Kothrud, Pune',
    pickupAddress: 'Flat 402, Mayur Colony, Kothrud, Pune, Maharashtra - 411038',
    timeSlot: 'Today, 2:30 PM',
    estimatedValue: 417,
    status: 'Accepted',
    createdAt: new Date().toISOString(),
    items: [
      { id: 'newspaper', name: 'Newspaper', category: 'Paper', weightKg: 12, pricePerKg: 11, amount: 132 },
      { id: 'pet-bottles', name: 'PET Water Bottles', category: 'Plastic', weightKg: 6, pricePerKg: 26, amount: 156 },
      { id: 'hard-plastic', name: 'Hard Plastic Buckets', category: 'Plastic', weightKg: 4, pricePerKg: 2, amount: 8 },
      { id: 'iron', name: 'Iron Scrap', category: 'Metal', weightKg: 5, pricePerKg: 24, amount: 120 },
    ],
  },
  {
    id: 'SN-509340',
    userId: 'cust-104',
    userName: 'Ananya Deshmukh',
    userPhone: '9823456789',
    collectorId: 'col-1',
    collectorName: 'Raj Scrap Center',
    collectorRating: 4.8,
    collectorDistance: '1.8 km away',
    collectorAddress: 'Erandwane, Pune',
    pickupAddress: 'Bunglow 14, Prabhat Road, Erandwane, Pune',
    timeSlot: 'Today, 5:00 PM',
    estimatedValue: 1530,
    status: 'On the Way',
    createdAt: new Date().toISOString(),
    items: [
      { id: 'copper', name: 'Copper Cable Wire', category: 'Metal', weightKg: 2, pricePerKg: 620, amount: 1240 },
      { id: 'books', name: 'Books & Notebooks', category: 'Paper', weightKg: 15, pricePerKg: 10, amount: 150 },
      { id: 'aluminium', name: 'Aluminium Cans', category: 'Metal', weightKg: 1, pricePerKg: 140, amount: 140 },
    ],
  },
  {
    id: 'SN-1024',
    userId: 'cust-101',
    userName: 'Ramesh Kumar',
    userPhone: '9822012345',
    collectorId: 'col-1',
    collectorName: 'Raj Scrap Center',
    collectorRating: 4.8,
    collectorDistance: '1.2 km away',
    collectorAddress: 'Kothrud, Pune',
    pickupAddress: 'Ideal Colony, Kothrud, Pune',
    timeSlot: 'Today, 4:00 PM',
    estimatedValue: 280,
    status: 'Pending Pickup',
    createdAt: new Date().toISOString(),
    items: [
      { id: 'newspaper', name: 'Newspaper', category: 'Paper', weightKg: 10, pricePerKg: 11, amount: 110 },
      { id: 'mix-plastic', name: 'Mix Plastic', category: 'Plastic', weightKg: 8, pricePerKg: 10, amount: 80 },
      { id: 'iron', name: 'Iron', category: 'Metal', weightKg: 4, pricePerKg: 23, amount: 90 },
    ],
  },
  {
    id: 'SN-1025',
    userId: 'cust-102',
    userName: 'Priya Sharma',
    userPhone: '9890123456',
    collectorId: 'col-1',
    collectorName: 'Raj Scrap Center',
    collectorRating: 4.8,
    collectorDistance: '2.5 km away',
    collectorAddress: 'Baner, Pune',
    pickupAddress: 'High Street, Baner, Pune',
    timeSlot: 'Tomorrow, 10:30 AM',
    estimatedValue: 443,
    status: 'Pending Pickup',
    createdAt: new Date().toISOString(),
    items: [
      { id: 'aluminium', name: 'Aluminium', category: 'Metal', weightKg: 2, pricePerKg: 150, amount: 300 },
      { id: 'newspaper', name: 'Newspaper', category: 'Paper', weightKg: 13, pricePerKg: 11, amount: 143 },
    ],
  },
  {
    id: 'SN-391024',
    userId: 'demo-user-1',
    userName: 'Rahul Verma',
    userPhone: '9876500000',
    collectorId: 'col-1',
    collectorName: 'Raj Scrap Center',
    collectorRating: 4.8,
    collectorDistance: '1.5 km away',
    collectorAddress: 'Kothrud, Pune',
    pickupAddress: 'FC Road, Pune',
    timeSlot: 'Aug 8, 2026',
    estimatedValue: 420,
    status: 'Completed',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    completedAt: 'Aug 8, 2026',
    paymentMethod: 'Cash',
    items: [
      { id: 'paper-mix', name: 'Paper + Plastic', category: 'Paper', weightKg: 24, pricePerKg: 17.5, amount: 420 },
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

  const registerUser = useCallback((phone: string, name: string, role: UserRole = 'user'): User => {
    const newUser: User = {
      userId: crypto.randomUUID(),
      name,
      phone,
      location: 'Pune',
      createdAt: new Date().toISOString(),
      role,
    };
    const all = loadAllUsers();
    all.push(newUser);
    saveAllUsers(all);
    return newUser;
  }, []);

  const registerCollector = useCallback(
    (collectorData: {
      name: string;
      phone: string;
      businessName: string;
      shopAddress: string;
      city: string;
      pincode: string;
      acceptedCategories: string[];
      pickupAvailable: boolean;
      pickupRadiusKm: number;
      workingDays: string;
      workingHours: string;
      minPickupKg: number;
    }): User => {
      const all = loadAllUsers();
      const existing = all.find((u) => u.phone === collectorData.phone);

      const profile: CollectorProfile = {
        collectorId: `COL-${Math.floor(1000 + Math.random() * 9000)}`,
        ...collectorData,
        createdAt: new Date().toISOString(),
      };

      let updatedUser: User;

      if (existing) {
        updatedUser = {
          ...existing,
          role: 'collector',
          businessName: collectorData.businessName,
          collectorProfile: profile,
        };
        const updatedAll = all.map((u) => (u.phone === collectorData.phone ? updatedUser : u));
        saveAllUsers(updatedAll);
      } else {
        updatedUser = {
          userId: crypto.randomUUID(),
          name: collectorData.name,
          phone: collectorData.phone,
          location: collectorData.city,
          createdAt: new Date().toISOString(),
          role: 'collector',
          businessName: collectorData.businessName,
          collectorProfile: profile,
        };
        all.push(updatedUser);
        saveAllUsers(all);
      }

      setUser(updatedUser);
      return updatedUser;
    },
    []
  );

  const updateCollectorProfile = useCallback(
    (data: Partial<CollectorProfile>) => {
      if (!user || user.role !== 'collector') return;
      const currentProf = user.collectorProfile || {
        collectorId: `COL-1001`,
        name: user.name,
        phone: user.phone,
        businessName: user.businessName || `${user.name} Scrap Center`,
        shopAddress: 'Kothrud, Pune',
        city: 'Pune',
        pincode: '411038',
        acceptedCategories: ['Paper', 'Plastic', 'Metal'],
        pickupAvailable: true,
        pickupRadiusKm: 10,
        workingDays: 'Mon - Sat',
        workingHours: '9:00 AM - 7:00 PM',
        minPickupKg: 5,
        createdAt: new Date().toISOString(),
      };

      const updatedProfile: CollectorProfile = {
        ...currentProf,
        ...data,
      };

      const updatedUser: User = {
        ...user,
        name: data.name || user.name,
        phone: data.phone || user.phone,
        businessName: data.businessName || user.businessName,
        collectorProfile: updatedProfile,
      };

      setUser(updatedUser);
      const all = loadAllUsers().map((u) => (u.userId === user.userId ? updatedUser : u));
      saveAllUsers(all);
    },
    [user]
  );

  const upgradeToCollector = useCallback(
    (businessName: string, vehicleType: string): User => {
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
    },
    [user]
  );

  const addPickupRequest = useCallback(
    (reqData: Omit<PickupRequest, 'id' | 'createdAt'>): PickupRequest => {
      const newReq: PickupRequest = {
        ...reqData,
        id: `SN-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
      };
      setPickups((prev) => [newReq, ...prev]);
      return newReq;
    },
    []
  );

  const acceptPickupRequest = useCallback((requestId: string, collectorName: string) => {
    setPickups((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? { ...req, status: 'Accepted', collectorName }
          : req
      )
    );
  }, []);

  const rejectPickupRequest = useCallback((requestId: string) => {
    setPickups((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? { ...req, status: 'Rejected' }
          : req
      )
    );
  }, []);

  const updatePickupStatus = useCallback(
    (requestId: string, status: PickupStatus, paymentMethod: string = 'Cash') => {
      setPickups((prev) =>
        prev.map((req) => {
          if (req.id === requestId) {
            const isCompleted = status === 'Completed';
            return {
              ...req,
              status,
              ...(isCompleted
                ? {
                    completedAt: new Date().toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }),
                    paymentMethod,
                  }
                : {}),
            };
          }
          return req;
        })
      );
    },
    []
  );

  const updatePickupItems = useCallback((requestId: string, updatedItems: PickupItem[]) => {
    setPickups((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          const recalculatedTotal = updatedItems.reduce(
            (sum, item) => sum + item.pricePerKg * item.weightKg,
            0
          );
          return {
            ...req,
            items: updatedItems,
            estimatedValue: Math.round(recalculatedTotal),
          };
        }
        return req;
      })
    );
  }, []);

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
        registerCollector,
        updateCollectorProfile,
        upgradeToCollector,
        addPickupRequest,
        acceptPickupRequest,
        rejectPickupRequest,
        updatePickupStatus,
        updatePickupItems,
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

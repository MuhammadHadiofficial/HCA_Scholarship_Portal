"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "STAFF" | "ALUMNI" | "STUDENT";
  adminProfile?: {
    adminId: string;
    permissions: string[];
    isActive: boolean;
  };
  staffProfile?: {
    staffId: string;
    department: string;
    designation: string;
    isActive: boolean;
  };
  studentProfile?: {
    studentId: string;
    enrollmentYear: number;
    currentSemester: number;
    department: string;
    cgpa: number;
    meritListNumber: string;
    familyIncome: number;
    goals: string;
    isActive: boolean;
  };
  alumniProfile?: {
    alumniId: string;
    graduationYear: number;
    department: string;
    category: string;
    rank: string;
    digitalSignature: string;
    isVerified: boolean;
    totalContributed: number;
    totalPledged: number;
    isActive: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  getUserRole: () => string | null;
  getUserId: () => string | null;
  getProfileId: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage or session)
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          // Verify token and get user data
          const response = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            if (userData.user) {
              setUser(userData.user);
            } else {
              // Invalid response, remove token
              localStorage.removeItem("authToken");
            }
          } else {
            // Token is invalid, remove it
            localStorage.removeItem("authToken");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("authToken");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store the token from the response
        if (data.user) {
          setUser(data.user);
                  // Store token in localStorage for API calls
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  const getUserRole = (): string | null => {
    return user?.role || null;
  };

  const getUserId = (): string | null => {
    return user?.id || null;
  };

  const getProfileId = (): string | null => {
    if (!user) return null;
    
    switch (user.role) {
      case "ADMIN":
        return user.adminProfile?.adminId || null;
      case "STAFF":
        return user.staffProfile?.staffId || null;
      case "STUDENT":
        return user.studentProfile?.studentId || null;
      case "ALUMNI":
        return user.alumniProfile?.alumniId || null;
      default:
        return null;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    getUserRole,
    getUserId,
    getProfileId,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

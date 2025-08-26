import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig, verifyToken } from "./auth";
import { prisma } from "./prisma";

export interface AuthenticatedUser {
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

export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // First try Better Auth session
    try {
      const session = await getServerSession(authConfig);
      if (session?.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          include: {
            adminProfile: true,
            staffProfile: true,
            studentProfile: true,
            alumniProfile: true,
          },
        });
        if (user) {
          return user as AuthenticatedUser;
        }
      }
    } catch (error) {
      console.log("Better Auth session check failed, trying custom JWT");
    }

    // Fallback to custom JWT token
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      
      if (decoded?.userId) {
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          include: {
            adminProfile: true,
            staffProfile: true,
            studentProfile: true,
            alumniProfile: true,
          },
        });
        if (user) {
          return user as AuthenticatedUser;
        }
      }
    }

    // Try cookie-based token
    const cookieToken = request.cookies.get("auth-token")?.value;
    if (cookieToken) {
      const decoded = verifyToken(cookieToken);
      
      if (decoded?.userId) {
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          include: {
            adminProfile: true,
            staffProfile: true,
            studentProfile: true,
            alumniProfile: true,
          },
        });
        if (user) {
          return user as AuthenticatedUser;
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export async function requireAuth(request: NextRequest): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(request);
  
  if (!user) {
    throw new Error("Authentication required");
  }
  
  return user;
}

export async function requireRole(request: NextRequest, requiredRole: string): Promise<AuthenticatedUser> {
  const user = await requireAuth(request);
  
  if (user.role !== requiredRole) {
    throw new Error(`Access denied. Required role: ${requiredRole}`);
  }
  
  return user;
}

export async function requireAdmin(request: NextRequest): Promise<AuthenticatedUser> {
  return requireRole(request, "ADMIN");
}

export async function requireStaff(request: NextRequest): Promise<AuthenticatedUser> {
  return requireRole(request, "STAFF");
}

export async function requireAlumni(request: NextRequest): Promise<AuthenticatedUser> {
  return requireRole(request, "ALUMNI");
}

export async function requireStudent(request: NextRequest): Promise<AuthenticatedUser> {
  return requireRole(request, "STUDENT");
}

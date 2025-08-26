"use server";

import { prisma } from "./prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Validation schemas
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["STUDENT", "STAFF", "ALUMNI", "ADMIN"]),
  studentId: z.string().optional(),
  alumniId: z.string().optional(),
  staffId: z.string().optional(),
  department: z.string().optional(),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function signUp(formData: FormData) {
  const validatedFields = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    studentId: formData.get("studentId"),
    alumniId: formData.get("alumniId"),
    staffId: formData.get("staffId"),
    department: formData.get("department"),
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { name, email, password, role, studentId, alumniId, staffId, department } = validatedFields.data;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists" };
    }

    // Create user with role-specific profile
    const userData: any = {
      email,
      name,
      role,
    };

    // Add role-specific profile data
    switch (role) {
      case "STUDENT":
        if (!studentId) return { error: "Student ID is required" };
        userData.studentProfile = {
          create: {
            studentId,
            enrollmentYear: new Date().getFullYear(),
            currentSemester: 1,
            department: department || "General",
            isActive: true,
          },
        };
        break;

      case "ALUMNI":
        if (!alumniId) return { error: "Alumni ID is required" };
        userData.alumniProfile = {
          create: {
            alumniId,
            graduationYear: new Date().getFullYear() - 4, // Assume graduated 4 years ago
            department: department || "General",
            digitalSignature: `${alumniId}_SIG_${Date.now()}`,
            isVerified: false,
          },
        };
        break;

      case "STAFF":
        if (!staffId || !department) return { error: "Staff ID and department are required" };
        userData.staffProfile = {
          create: {
            staffId,
            department,
            designation: "Staff Member",
            isActive: true,
          },
        };
        break;

      case "ADMIN":
        userData.adminProfile = {
          create: {
            adminId: `ADMIN_${Date.now()}`,
            permissions: ["ALL"],
            isActive: true,
          },
        };
        break;
    }

    const user = await prisma.user.create({
      data: userData,
      include: {
        studentProfile: true,
        alumniProfile: true,
        staffProfile: true,
        adminProfile: true,
      },
    });

    revalidatePath("/auth/signin");
    redirect("/auth/signin?message=Account created successfully");
  } catch (error) {
    console.error("Sign up error:", error);
    return { error: "Failed to create account" };
  }
}

export async function signIn(formData: FormData) {
  const validatedFields = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        alumniProfile: true,
        staffProfile: true,
        adminProfile: true,
      },
    });

    if (!user) {
      return { error: "Invalid credentials" };
    }

    // TODO: Implement proper password hashing
    // For now, using a simple check
    if (password !== "password") {
      return { error: "Invalid credentials" };
    }

    // TODO: Implement proper session management
    // For now, redirect to dashboard
    redirect("/dashboard");
  } catch (error) {
    console.error("Sign in error:", error);
    return { error: "Failed to sign in" };
  }
}

export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        alumniProfile: true,
        staffProfile: true,
        adminProfile: true,
      },
    });

    return { user };
  } catch (error) {
    console.error("Get user profile error:", error);
    return { error: "Failed to get user profile" };
  }
}

export async function updateUserProfile(userId: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        address,
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error);
    return { error: "Failed to update profile" };
  }
}


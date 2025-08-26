import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, studentId, alumniId, staffId, department } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password, and role are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with role-specific profile
    const userData: any = {
      email,
      name,
      role,
    };

    // Add role-specific profile data
    switch (role) {
      case "STUDENT":
        if (!studentId) {
          return NextResponse.json(
            { error: "Student ID is required" },
            { status: 400 }
          );
        }
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
        if (!alumniId) {
          return NextResponse.json(
            { error: "Alumni ID is required" },
            { status: 400 }
          );
        }
        userData.alumniProfile = {
          create: {
            alumniId,
            graduationYear: new Date().getFullYear() - 4,
            department: department || "General",
            digitalSignature: `${alumniId}_SIG_${Date.now()}`,
            isVerified: false,
          },
        };
        break;

      case "STAFF":
        if (!staffId || !department) {
          return NextResponse.json(
            { error: "Staff ID and department are required" },
            { status: 400 }
          );
        }
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

      default:
        return NextResponse.json(
          { error: "Invalid role" },
          { status: 400 }
        );
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

    return NextResponse.json(
      { 
        success: true, 
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          studentProfile: user.studentProfile,
          alumniProfile: user.alumniProfile,
          staffProfile: user.staffProfile,
          adminProfile: user.adminProfile,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


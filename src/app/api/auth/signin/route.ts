import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password, and role are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        staffProfile: true,
        alumniProfile: true,
        adminProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if user has a password (for email/password auth)
    if (!user.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if user can access the requested role
    let canAccessRole = false;
    let roleProfile = null;

    switch (role) {
      case "STUDENT":
        canAccessRole = user.studentProfile !== null;
        roleProfile = user.studentProfile;
        break;
      case "STAFF":
        canAccessRole = user.staffProfile !== null;
        roleProfile = user.staffProfile;
        break;
      case "ALUMNI":
        canAccessRole = user.alumniProfile !== null;
        roleProfile = user.alumniProfile;
        break;
      case "ADMIN":
        canAccessRole = user.adminProfile !== null;
        roleProfile = user.adminProfile;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid role specified" },
          { status: 400 }
        );
    }

    if (!canAccessRole) {
      return NextResponse.json(
        { error: `You don't have access to the ${role} role. Please select a different role.` },
        { status: 403 }
      );
    }

    // Generate JWT token with role information
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: role,
        roleProfileId: roleProfile?.id,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // Return response with token and user data
    const response = NextResponse.json(
      {
        success: true,
        message: `Successfully logged in as ${role}`,
        token: token, // Include token in response for client-side storage
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: role,
          roleProfile: roleProfile,
        },
      },
      { status: 200 }
    );

    // Also set secure HTTP-only cookie as backup
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    try {
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret") as any;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          studentProfile: true,
          alumniProfile: true,
          staffProfile: true,
          adminProfile: true,
        },
      });

      if (!user) {
        return NextResponse.json({ user: null }, { status: 200 });
      }

      return NextResponse.json({
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
      }, { status: 200 });
    } catch (jwtError) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}


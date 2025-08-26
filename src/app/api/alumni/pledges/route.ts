import { NextRequest, NextResponse } from "next/server";
import { createPledge } from "@/lib/alumni-actions";
import { requireAlumni } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Proper authentication - get authenticated alumni user
    const user = await requireAlumni(request);
    
    // Get alumni ID from authenticated user
    const alumniId = user.alumniProfile?.alumniId;
    
    if (!alumniId) {
      return NextResponse.json(
        { error: "Alumni profile not found" },
        { status: 400 }
      );
    }
    
    const result = await createPledge(alumniId, formData);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Create pledge API error:", error);
    
    // Handle authentication errors specifically
    if (error instanceof Error && error.message.includes("Authentication required")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    if (error instanceof Error && error.message.includes("Access denied")) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

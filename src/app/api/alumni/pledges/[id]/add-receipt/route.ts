import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const pledgeId = params.id;
    const receiptFile = formData.get("receipt") as File;
    
    if (!receiptFile) {
      return NextResponse.json(
        { error: "Receipt file is required" },
        { status: 400 }
      );
    }

    // TODO: Upload file to GCS and get URL
    // For now, we'll store the filename
    const receiptUrl = `uploads/receipts/${Date.now()}_${receiptFile.name}`;
    
    // Update the pledge with receipt information
    const updatedPledge = await prisma.alumniPledge.update({
      where: { id: pledgeId },
      data: {
        receiptUrl,
        status: "PENDING_VERIFICATION", // Move to verification status
      },
      include: {
        alumni: {
          include: {
            user: true,
          },
        },
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      pledge: updatedPledge 
    });
  } catch (error) {
    console.error("Add receipt API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

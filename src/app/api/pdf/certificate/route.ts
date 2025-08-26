import { NextRequest, NextResponse } from "next/server";
import { PDFService } from "@/lib/pdf-service";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { scholarshipId } = await request.json();

    if (!scholarshipId) {
      return NextResponse.json(
        { error: "Scholarship ID is required" },
        { status: 400 }
      );
    }

    // Fetch scholarship data with related information
    const scholarship = await prisma.scholarship.findUnique({
      where: { id: scholarshipId },
      include: {
        application: {
          include: {
            student: true,
            intake: true,
          },
        },
      },
    });

    if (!scholarship) {
      return NextResponse.json(
        { error: "Scholarship not found" },
        { status: 404 }
      );
    }

    // Prepare certificate data
    const certificateData = {
      studentName: scholarship.application.student.name || "Student",
      studentId: scholarship.application.student.studentId || "N/A",
      scholarshipAmount: scholarship.amount,
      scholarshipType: scholarship.type.replace("_", " "),
      intakeName: scholarship.application.intake.name,
      semester: scholarship.application.intake.semester,
      year: scholarship.application.intake.year.toString(),
      awardedDate: scholarship.createdAt.toLocaleDateString(),
      certificateId: `CERT-${scholarship.id.slice(-8).toUpperCase()}`,
    };

    // Generate PDF
    const pdfBuffer = await PDFService.generateScholarshipCertificate(certificateData);

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="scholarship-certificate-${certificateData.certificateId}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Certificate generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate certificate" },
      { status: 500 }
    );
  }
}


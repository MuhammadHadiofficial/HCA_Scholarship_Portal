import { NextRequest, NextResponse } from "next/server";
import { PDFService } from "@/lib/pdf-service";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { scholarshipId: string } }
) {
  try {
    const { scholarshipId } = params;

    // Get scholarship details with related data
    const scholarship = await prisma.scholarship.findUnique({
      where: { id: scholarshipId },
      include: {
        application: {
          include: {
            student: {
              include: {
                studentProfile: true,
              },
            },
            intake: true,
          },
        },
      },
    });

    if (!scholarship) {
      return NextResponse.json({ error: "Scholarship not found" }, { status: 404 });
    }

    // Prepare certificate data
    const certificateData = {
      studentName: scholarship.application.student.studentProfile?.name || "Unknown Student",
      studentId: scholarship.application.student.studentId || "N/A",
      scholarshipAmount: scholarship.amount,
      scholarshipType: scholarship.type.replace("_", " "),
      intakeName: scholarship.application.intake.name,
      semester: scholarship.application.intake.semester,
      year: scholarship.application.intake.year.toString(),
      awardedDate: scholarship.approvedAt 
        ? new Date(scholarship.approvedAt).toLocaleDateString()
        : new Date().toLocaleDateString(),
      certificateId: scholarship.id,
    };

    // Generate PDF
    const pdfBuffer = await PDFService.generateScholarshipCertificate(certificateData);

    // Update scholarship with certificate URL if not already set
    if (!scholarship.certificateUrl) {
      await prisma.scholarship.update({
        where: { id: scholarshipId },
        data: {
          certificateUrl: `/api/pdf/certificate/${scholarshipId}`,
        },
      });
    }

    // Return PDF with proper headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="scholarship-certificate-${scholarshipId}.pdf"`,
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
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

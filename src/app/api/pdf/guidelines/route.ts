import { NextRequest, NextResponse } from "next/server";
import { PDFService } from "@/lib/pdf-service";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get the latest guidelines from the database
    const guidelines = await prisma.guideline.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });

    if (!guidelines) {
      return NextResponse.json({ error: "No active guidelines found" }, { status: 404 });
    }

    // Get contact information from policies or use defaults
    const contactPolicy = await prisma.policy.findFirst({
      where: { 
        title: { contains: "Contact" },
        isActive: true 
      },
    });

    // Prepare guidelines data
    const guidelinesData = {
      title: guidelines.title,
      version: guidelines.version || "1.0",
      lastUpdated: new Date(guidelines.updatedAt).toLocaleDateString(),
      sections: [
        {
          title: "General Information",
          content: guidelines.content,
        },
        {
          title: "Eligibility Criteria",
          content: "Students must meet academic and financial requirements to be eligible for scholarships. This includes maintaining a minimum CGPA and demonstrating financial need.",
          subsections: [
            {
              title: "Academic Requirements",
              content: "Minimum CGPA of 3.0 or higher, depending on the scholarship type. Students must be in good academic standing with no disciplinary issues.",
            },
            {
              title: "Financial Requirements",
              content: "Demonstrated financial need through family income verification and supporting documentation. Students must provide accurate financial information.",
            },
          ],
        },
        {
          title: "Application Process",
          content: "Complete applications must be submitted through the portal with all required documents. Applications are reviewed by staff and approved by the scholarship committee.",
          subsections: [
            {
              title: "Required Documents",
              content: "Academic transcripts, family income proof, utility bills, personal statement, and any additional supporting documents as specified.",
            },
            {
              title: "Submission Deadlines",
              content: "Applications must be submitted by the specified deadline for each intake period. Late submissions will not be considered.",
            },
          ],
        },
        {
          title: "Scholarship Types",
          content: "Various scholarship types are available including full semester, partial semester, and one-time awards. Recurring scholarships may be available for multiple semesters.",
        },
        {
          title: "Maintaining Scholarships",
          content: "Students must maintain academic performance and meet any specific conditions attached to their scholarship. Failure to meet requirements may result in scholarship termination.",
        },
        {
          title: "Disbursement",
          content: "Scholarship funds are disbursed according to the approved schedule. Students will be notified of disbursement dates and amounts.",
        },
      ],
      contactInfo: {
        email: contactPolicy?.content?.includes("@") 
          ? contactPolicy.content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || "scholarships@hca.edu"
          : "scholarships@hca.edu",
        phone: contactPolicy?.content?.includes("+") || contactPolicy?.content?.includes("(")
          ? contactPolicy.content.match(/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0] || "+1 (555) 123-4567"
          : "+1 (555) 123-4567",
        office: "HCA Scholarship Office, Main Campus Building, Room 201",
      },
    };

    // Generate PDF
    const pdfBuffer = await PDFService.generateGuidelines(guidelinesData);

    // Return PDF with proper headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="scholarship-guidelines-${guidelines.version}.pdf"`,
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Guidelines generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate guidelines" },
      { status: 500 }
    );
  }
}

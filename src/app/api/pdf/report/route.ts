import { NextRequest, NextResponse } from "next/server";
import { PDFService } from "@/lib/pdf-service";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { reportType, startDate, endDate } = await request.json();

    if (!reportType) {
      return NextResponse.json(
        { error: "Report type is required" },
        { status: 400 }
      );
    }

    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    let reportData;

    switch (reportType) {
      case "scholarship":
        reportData = await generateScholarshipReport(start, end);
        break;
      case "alumni":
        reportData = await generateAlumniReport(start, end);
        break;
      case "financial":
        reportData = await generateFinancialReport(start, end);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid report type" },
          { status: 400 }
        );
    }

    // Generate PDF
    const pdfBuffer = await PDFService.generateReport(reportData);

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${reportType}-report-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}

async function generateScholarshipReport(startDate: Date, endDate: Date) {
  const scholarships = await prisma.scholarship.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      application: {
        include: {
          student: true,
          intake: true,
        },
      },
    },
  });

  const totalAmount = scholarships.reduce((sum, s) => sum + s.amount, 0);
  const uniqueStudents = new Set(scholarships.map(s => s.application.studentId)).size;

  const details = [
    {
      category: "Full Semester Scholarships",
      count: scholarships.filter(s => s.type === "FULL_SEMESTER").length,
      amount: scholarships.filter(s => s.type === "FULL_SEMESTER").reduce((sum, s) => sum + s.amount, 0),
      percentage: Math.round((scholarships.filter(s => s.type === "FULL_SEMESTER").length / scholarships.length) * 100),
    },
    {
      category: "Partial Semester Scholarships",
      count: scholarships.filter(s => s.type === "PARTIAL_SEMESTER").length,
      amount: scholarships.filter(s => s.type === "PARTIAL_SEMESTER").reduce((sum, s) => sum + s.amount, 0),
      percentage: Math.round((scholarships.filter(s => s.type === "PARTIAL_SEMESTER").length / scholarships.length) * 100),
    },
    {
      category: "One-time Scholarships",
      count: scholarships.filter(s => s.type === "ONE_TIME").length,
      amount: scholarships.filter(s => s.type === "ONE_TIME").reduce((sum, s) => sum + s.amount, 0),
      percentage: Math.round((scholarships.filter(s => s.type === "ONE_TIME").length / scholarships.length) * 100),
    },
  ];

  return {
    title: "Scholarship Report",
    period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
    statistics: {
      totalScholarships: scholarships.length,
      totalAmount,
      totalStudents: uniqueStudents,
      totalAlumni: 0, // Will be calculated separately
      totalDonations: 0, // Will be calculated separately
    },
    details,
  };
}

async function generateAlumniReport(startDate: Date, endDate: Date) {
  const alumni = await prisma.alumniProfile.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      user: true,
      pledges: true,
      payments: true,
    },
  });

  const totalPledged = alumni.reduce((sum, a) => sum + a.totalPledged, 0);
  const totalContributed = alumni.reduce((sum, a) => sum + a.totalContributed, 0);

  const details = [
    {
      category: "Verified Alumni",
      count: alumni.filter(a => a.isVerified).length,
      amount: alumni.filter(a => a.isVerified).reduce((sum, a) => sum + a.totalContributed, 0),
      percentage: Math.round((alumni.filter(a => a.isVerified).length / alumni.length) * 100),
    },
    {
      category: "Pending Verification",
      count: alumni.filter(a => !a.isVerified).length,
      amount: 0,
      percentage: Math.round((alumni.filter(a => !a.isVerified).length / alumni.length) * 100),
    },
  ];

  return {
    title: "Alumni Contribution Report",
    period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
    statistics: {
      totalScholarships: 0,
      totalAmount: 0,
      totalStudents: 0,
      totalAlumni: alumni.length,
      totalDonations: totalContributed,
    },
    details,
  };
}

async function generateFinancialReport(startDate: Date, endDate: Date) {
  const scholarships = await prisma.scholarship.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  const payments = await prisma.alumniPayment.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: "VERIFIED",
    },
  });

  const totalScholarshipAmount = scholarships.reduce((sum, s) => sum + s.amount, 0);
  const totalDonations = payments.reduce((sum, p) => sum + p.amount, 0);

  const details = [
    {
      category: "Scholarship Disbursements",
      count: scholarships.length,
      amount: totalScholarshipAmount,
      percentage: Math.round((totalScholarshipAmount / (totalScholarshipAmount + totalDonations)) * 100),
    },
    {
      category: "Alumni Donations",
      count: payments.length,
      amount: totalDonations,
      percentage: Math.round((totalDonations / (totalScholarshipAmount + totalDonations)) * 100),
    },
  ];

  return {
    title: "Financial Report",
    period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
    statistics: {
      totalScholarships: scholarships.length,
      totalAmount: totalScholarshipAmount,
      totalStudents: 0,
      totalAlumni: 0,
      totalDonations: totalDonations,
    },
    details,
  };
}


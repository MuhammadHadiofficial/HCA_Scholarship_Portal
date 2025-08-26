"use server";

import { prisma } from "./prisma";
import { z } from "zod";
import { EmailService } from "./email-service";
import { RealTimeService } from "./realtime-service";
import { revalidatePath } from "next/cache";

// Validation schemas
const scholarshipSchema = z.object({
  applicationId: z.string(),
  type: z.enum(["FULL_SEMESTER", "PARTIAL_SEMESTER", "ONE_TIME"]),
  amount: z.number().min(0, "Amount must be positive"),
  isRecurring: z.boolean(),
  recurringSemesters: z.array(z.number()).optional(),
  status: z.enum(["APPROVED", "DISBURSED", "CANCELLED", "EXPIRED"]),
});

const disbursementSchema = z.object({
  scholarshipId: z.string(),
  amount: z.number().min(0, "Amount must be positive"),
  semester: z.number().min(1, "Semester must be at least 1"),
  notes: z.string().optional(),
});

export async function createScholarship(formData: FormData) {
  try {
    const validatedFields = scholarshipSchema.safeParse({
      applicationId: formData.get("applicationId"),
      type: formData.get("type"),
      amount: parseFloat(formData.get("amount") as string),
      isRecurring: formData.get("isRecurring") === "true",
      recurringSemesters: formData.getAll("recurringSemesters").map(s => parseInt(s as string)),
      status: formData.get("status"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid scholarship data" };
    }

    const data = validatedFields.data;

    // Check if application already has a scholarship
    const existingScholarship = await prisma.scholarship.findUnique({
      where: { applicationId: data.applicationId },
    });

    if (existingScholarship) {
      return { error: "Application already has a scholarship" };
    }

    // Create scholarship
    const scholarship = await prisma.scholarship.create({
      data: {
        applicationId: data.applicationId,
        type: data.type,
        amount: data.amount,
        isRecurring: data.isRecurring,
        recurringSemesters: data.recurringSemesters || [],
        status: data.status,
        approvedAt: data.status === "APPROVED" ? new Date() : null,
      },
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
        disbursements: true,
      },
    });

    // Update application status if scholarship is approved
    if (data.status === "APPROVED") {
      await prisma.application.update({
        where: { id: data.applicationId },
        data: {
          status: "APPROVED",
          approvedAt: new Date(),
        },
      });

      // Send email notification
      try {
        const student = await prisma.user.findUnique({
          where: { id: scholarship.application.studentId },
          include: { studentProfile: true },
        });

        if (student) {
          await EmailService.sendScholarshipApprovedEmail(
            student.email,
            student.name,
            data.amount,
            scholarship.application.intake.name
          );

          // Send real-time notification
          RealTimeService.sendNotification(student.id, {
            type: "success",
            title: "Scholarship Approved!",
            message: `Congratulations! Your scholarship application has been approved for $${data.amount.toLocaleString()}.`,
            actionUrl: `/dashboard/student/scholarships/${scholarship.id}`,
          });
        }
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    }

    revalidatePath("/dashboard/staff/scholarships");
    revalidatePath("/dashboard/student/scholarships");
    return { success: true, scholarship };
  } catch (error) {
    console.error("Create scholarship error:", error);
    return { error: "Failed to create scholarship" };
  }
}

export async function updateScholarship(scholarshipId: string, formData: FormData) {
  try {
    const validatedFields = scholarshipSchema.safeParse({
      applicationId: formData.get("applicationId"),
      type: formData.get("type"),
      amount: parseFloat(formData.get("amount") as string),
      isRecurring: formData.get("isRecurring") === "true",
      recurringSemesters: formData.getAll("recurringSemesters").map(s => parseInt(s as string)),
      status: formData.get("status"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid scholarship data" };
    }

    const data = validatedFields.data;

    const scholarship = await prisma.scholarship.update({
      where: { id: scholarshipId },
      data: {
        type: data.type,
        amount: data.amount,
        isRecurring: data.isRecurring,
        recurringSemesters: data.recurringSemesters || [],
        status: data.status,
        approvedAt: data.status === "APPROVED" ? new Date() : undefined,
        disbursedAt: data.status === "DISBURSED" ? new Date() : undefined,
      },
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
        disbursements: true,
      },
    });

    revalidatePath("/dashboard/staff/scholarships");
    revalidatePath("/dashboard/student/scholarships");
    return { success: true, scholarship };
  } catch (error) {
    console.error("Update scholarship error:", error);
    return { error: "Failed to update scholarship" };
  }
}

export async function addDisbursement(formData: FormData) {
  try {
    const validatedFields = disbursementSchema.safeParse({
      scholarshipId: formData.get("scholarshipId"),
      amount: parseFloat(formData.get("amount") as string),
      semester: parseInt(formData.get("semester") as string),
      notes: formData.get("notes"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid disbursement data" };
    }

    const data = validatedFields.data;

    // Create disbursement
    const disbursement = await prisma.scholarshipDisbursement.create({
      data: {
        scholarshipId: data.scholarshipId,
        amount: data.amount,
        semester: data.semester,
        notes: data.notes,
      },
    });

    // Update scholarship status to disbursed if not already
    await prisma.scholarship.update({
      where: { id: data.scholarshipId },
      data: {
        status: "DISBURSED",
        disbursedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/staff/scholarships");
    revalidatePath("/dashboard/student/scholarships");
    return { success: true, disbursement };
  } catch (error) {
    console.error("Add disbursement error:", error);
    return { error: "Failed to add disbursement" };
  }
}

export async function getStudentScholarships(studentId: string) {
  try {
    const scholarships = await prisma.scholarship.findMany({
      where: {
        application: {
          studentId,
        },
      },
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
        disbursements: {
          orderBy: { semester: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { scholarships };
  } catch (error) {
    console.error("Get student scholarships error:", error);
    return { error: "Failed to get scholarships" };
  }
}

export async function getAllScholarships() {
  try {
    const scholarships = await prisma.scholarship.findMany({
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
        disbursements: {
          orderBy: { semester: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { scholarships };
  } catch (error) {
    console.error("Get all scholarships error:", error);
    return { error: "Failed to get scholarships" };
  }
}

export async function getScholarshipById(scholarshipId: string) {
  try {
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
        disbursements: {
          orderBy: { semester: "asc" },
        },
      },
    });

    return { scholarship };
  } catch (error) {
    console.error("Get scholarship error:", error);
    return { error: "Failed to get scholarship" };
  }
}

export async function getScholarshipStats() {
  try {
    const stats = await prisma.$transaction([
      prisma.scholarship.count(),
      prisma.scholarship.count({
        where: { status: "APPROVED" },
      }),
      prisma.scholarship.count({
        where: { status: "DISBURSED" },
      }),
      prisma.scholarship.aggregate({
        _sum: {
          amount: true,
        },
      }),
      prisma.scholarshipDisbursement.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      totalScholarships: stats[0],
      approvedScholarships: stats[1],
      disbursedScholarships: stats[2],
      totalAwarded: stats[3]._sum.amount || 0,
      totalDisbursed: stats[4]._sum.amount || 0,
    };
  } catch (error) {
    console.error("Get scholarship stats error:", error);
    return { error: "Failed to get scholarship statistics" };
  }
}

export async function generateScholarshipCertificate(scholarshipId: string) {
  try {
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
      return { error: "Scholarship not found" };
    }

    // TODO: Implement PDF generation
    // For now, return a placeholder URL
    const certificateUrl = `/api/certificates/${scholarshipId}`;

    // Update scholarship with certificate URL
    await prisma.scholarship.update({
      where: { id: scholarshipId },
      data: {
        certificateUrl,
      },
    });

    revalidatePath("/dashboard/student/scholarships");
    return { success: true, certificateUrl };
  } catch (error) {
    console.error("Generate certificate error:", error);
    return { error: "Failed to generate certificate" };
  }
}

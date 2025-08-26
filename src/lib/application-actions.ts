"use server";

import { prisma } from "./prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Validation schemas
const applicationSchema = z.object({
  intakeId: z.string().min(1, "Intake is required"),
  personalInfo: z.object({
    fullName: z.string().min(2, "Full name is required"),
    dateOfBirth: z.string(),
    phone: z.string(),
    address: z.string(),
    emergencyContact: z.string(),
  }),
  academicInfo: z.object({
    cgpa: z.number().min(0).max(4),
    meritListNumber: z.string().optional(),
    currentSemester: z.number().min(1),
    department: z.string(),
    enrollmentYear: z.number(),
  }),
  financialInfo: z.object({
    familyIncome: z.number().min(0),
    utilityBills: z.array(z.string()),
    additionalDocuments: z.array(z.string()).optional(),
  }),
  goals: z.string().min(10, "Goals must be at least 10 characters"),
});

const reviewSchema = z.object({
  applicationId: z.string(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
  vote: z.enum(["APPROVE", "REJECT", "NEEDS_MORE_INFO"]),
  notes: z.string().optional(),
});

export async function createApplication(studentId: string, formData: FormData) {
  try {
    const validatedFields = applicationSchema.safeParse({
      intakeId: formData.get("intakeId"),
      personalInfo: {
        fullName: formData.get("fullName"),
        dateOfBirth: formData.get("dateOfBirth"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        emergencyContact: formData.get("emergencyContact"),
      },
      academicInfo: {
        cgpa: parseFloat(formData.get("cgpa") as string),
        meritListNumber: formData.get("meritListNumber"),
        currentSemester: parseInt(formData.get("currentSemester") as string),
        department: formData.get("department"),
        enrollmentYear: parseInt(formData.get("enrollmentYear") as string),
      },
      financialInfo: {
        familyIncome: parseFloat(formData.get("familyIncome") as string),
        utilityBills: formData.getAll("utilityBills") as string[],
        additionalDocuments: formData.getAll("additionalDocuments") as string[],
      },
      goals: formData.get("goals"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid application data" };
    }

    const data = validatedFields.data;

    // Check if student already has an application for this intake
    const existingApplication = await prisma.application.findUnique({
      where: {
        studentId_intakeId: {
          studentId,
          intakeId: data.intakeId,
        },
      },
    });

    if (existingApplication) {
      return { error: "Application already exists for this intake" };
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        studentId,
        intakeId: data.intakeId,
        status: "DRAFT",
        personalInfo: data.personalInfo,
        academicInfo: data.academicInfo,
        financialInfo: data.financialInfo,
        goals: data.goals,
        documents: [...data.financialInfo.utilityBills, ...(data.financialInfo.additionalDocuments || [])],
      },
      include: {
        student: {
          include: {
            studentProfile: true,
          },
        },
        intake: true,
      },
    });

    revalidatePath("/dashboard/student/applications");
    return { success: true, application };
  } catch (error) {
    console.error("Create application error:", error);
    return { error: "Failed to create application" };
  }
}

export async function submitApplication(applicationId: string) {
  try {
    const application = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
      include: {
        student: {
          include: {
            studentProfile: true,
          },
        },
        intake: true,
      },
    });

    revalidatePath("/dashboard/student/applications");
    revalidatePath("/dashboard/staff/applications");
    return { success: true, application };
  } catch (error) {
    console.error("Submit application error:", error);
    return { error: "Failed to submit application" };
  }
}

export async function updateApplication(applicationId: string, formData: FormData) {
  try {
    const validatedFields = applicationSchema.safeParse({
      intakeId: formData.get("intakeId"),
      personalInfo: {
        fullName: formData.get("fullName"),
        dateOfBirth: formData.get("dateOfBirth"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        emergencyContact: formData.get("emergencyContact"),
      },
      academicInfo: {
        cgpa: parseFloat(formData.get("cgpa") as string),
        meritListNumber: formData.get("meritListNumber"),
        currentSemester: parseInt(formData.get("currentSemester") as string),
        department: formData.get("department"),
        enrollmentYear: parseInt(formData.get("enrollmentYear") as string),
      },
      financialInfo: {
        familyIncome: parseFloat(formData.get("familyIncome") as string),
        utilityBills: formData.getAll("utilityBills") as string[],
        additionalDocuments: formData.getAll("additionalDocuments") as string[],
      },
      goals: formData.get("goals"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid application data" };
    }

    const data = validatedFields.data;

    const application = await prisma.application.update({
      where: { id: applicationId },
      data: {
        personalInfo: data.personalInfo,
        academicInfo: data.academicInfo,
        financialInfo: data.financialInfo,
        goals: data.goals,
        documents: [...data.financialInfo.utilityBills, ...(data.financialInfo.additionalDocuments || [])],
      },
      include: {
        student: {
          include: {
            studentProfile: true,
          },
        },
        intake: true,
      },
    });

    revalidatePath("/dashboard/student/applications");
    return { success: true, application };
  } catch (error) {
    console.error("Update application error:", error);
    return { error: "Failed to update application" };
  }
}

export async function getStudentApplications(studentId: string) {
  try {
    const applications = await prisma.application.findMany({
      where: { studentId },
      include: {
        intake: true,
        reviews: {
          include: {
            reviewer: true,
          },
        },
        notes: {
          include: {
            author: true,
          },
        },
        scholarship: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { applications };
  } catch (error) {
    console.error("Get student applications error:", error);
    return { error: "Failed to get applications" };
  }
}

export async function getAllApplications() {
  try {
    const applications = await prisma.application.findMany({
      include: {
        student: {
          include: {
            studentProfile: true,
          },
        },
        intake: true,
        reviews: {
          include: {
            reviewer: true,
          },
        },
        notes: {
          include: {
            author: true,
          },
        },
        scholarship: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { applications };
  } catch (error) {
    console.error("Get all applications error:", error);
    return { error: "Failed to get applications" };
  }
}

export async function getApplicationById(applicationId: string) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        student: {
          include: {
            studentProfile: true,
          },
        },
        intake: true,
        reviews: {
          include: {
            reviewer: true,
          },
        },
        notes: {
          include: {
            author: true,
          },
        },
        scholarship: true,
      },
    });

    return { application };
  } catch (error) {
    console.error("Get application error:", error);
    return { error: "Failed to get application" };
  }
}

export async function addApplicationReview(reviewerId: string, formData: FormData) {
  try {
    const validatedFields = reviewSchema.safeParse({
      applicationId: formData.get("applicationId"),
      status: formData.get("status"),
      vote: formData.get("vote"),
      notes: formData.get("notes"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid review data" };
    }

    const { applicationId, status, vote, notes } = validatedFields.data;

    // Check if reviewer already reviewed this application
    const existingReview = await prisma.applicationReview.findUnique({
      where: {
        applicationId_reviewerId: {
          applicationId,
          reviewerId,
        },
      },
    });

    if (existingReview) {
      // Update existing review
      const review = await prisma.applicationReview.update({
        where: { id: existingReview.id },
        data: {
          status,
          vote,
          notes,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new review
      const review = await prisma.applicationReview.create({
        data: {
          applicationId,
          reviewerId,
          status,
          vote,
          notes,
        },
      });
    }

    revalidatePath("/dashboard/staff/applications");
    revalidatePath(`/dashboard/staff/applications/${applicationId}`);
    return { success: true };
  } catch (error) {
    console.error("Add review error:", error);
    return { error: "Failed to add review" };
  }
}

export async function addApplicationNote(authorId: string, formData: FormData) {
  try {
    const applicationId = formData.get("applicationId") as string;
    const content = formData.get("content") as string;
    const isInternal = formData.get("isInternal") === "true";

    if (!applicationId || !content) {
      return { error: "Application ID and content are required" };
    }

    const note = await prisma.applicationNote.create({
      data: {
        applicationId,
        authorId,
        content,
        isInternal,
      },
      include: {
        author: true,
      },
    });

    revalidatePath("/dashboard/staff/applications");
    revalidatePath(`/dashboard/staff/applications/${applicationId}`);
    return { success: true, note };
  } catch (error) {
    console.error("Add note error:", error);
    return { error: "Failed to add note" };
  }
}

export async function getActiveIntakes() {
  try {
    const intakes = await prisma.intake.findMany({
      where: { isActive: true },
      orderBy: { startDate: "desc" },
    });

    return { intakes };
  } catch (error) {
    console.error("Get active intakes error:", error);
    return { error: "Failed to get intakes" };
  }
}


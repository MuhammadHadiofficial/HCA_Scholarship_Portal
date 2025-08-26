"use server";

import { prisma } from "./prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { EmailService } from "./email-service";
import { RealTimeService } from "./realtime-service";

// Validation schemas
const alumniOnboardingSchema = z.object({
  userId: z.string(),
  graduationYear: z.number().min(1950).max(new Date().getFullYear()),
  department: z.string().min(1, "Department is required"),
  digitalSignature: z.string().min(1, "Digital signature is required"),
  additionalInfo: z.object({
    currentEmployer: z.string().optional(),
    jobTitle: z.string().optional(),
    industry: z.string().optional(),
    location: z.string().optional(),
    phoneNumber: z.string().optional(),
    linkedinProfile: z.string().url().optional(),
    achievements: z.string().optional(),
    interests: z.string().optional(),
  }).optional(),
});

const alumniVerificationSchema = z.object({
  alumniId: z.string(),
  isVerified: z.boolean(),
  verificationNotes: z.string().optional(),
  category: z.enum(["BASIC", "SILVER", "GOLD", "PLATINUM", "DIAMOND"]),
  rank: z.enum(["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"]),
  verificationDate: z.date().optional(),
  verifiedBy: z.string(),
});

const categoryUpdateSchema = z.object({
  alumniId: z.string(),
  category: z.enum(["BASIC", "SILVER", "GOLD", "PLATINUM", "DIAMOND"]),
  rank: z.enum(["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"]),
  reason: z.string().min(1, "Reason is required"),
  updatedBy: z.string(),
});

export async function createAlumniProfile(formData: FormData) {
  try {
    const validatedFields = alumniOnboardingSchema.safeParse({
      userId: formData.get("userId"),
      graduationYear: parseInt(formData.get("graduationYear") as string),
      department: formData.get("department"),
      digitalSignature: formData.get("digitalSignature"),
      additionalInfo: {
        currentEmployer: formData.get("currentEmployer"),
        jobTitle: formData.get("jobTitle"),
        industry: formData.get("industry"),
        location: formData.get("location"),
        phoneNumber: formData.get("phoneNumber"),
        linkedinProfile: formData.get("linkedinProfile"),
        achievements: formData.get("achievements"),
        interests: formData.get("interests"),
      },
    });

    if (!validatedFields.success) {
      return { error: "Invalid alumni data" };
    }

    const data = validatedFields.data;

    // Check if user already has an alumni profile
    const existingProfile = await prisma.alumniProfile.findUnique({
      where: { userId: data.userId },
    });

    if (existingProfile) {
      return { error: "User already has an alumni profile" };
    }

    // Generate unique alumni ID
    const alumniId = `ALM${Date.now().toString().slice(-6)}`;

    // Create alumni profile
    const alumniProfile = await prisma.alumniProfile.create({
      data: {
        userId: data.userId,
        alumniId,
        graduationYear: data.graduationYear,
        department: data.department,
        digitalSignature: data.digitalSignature,
        category: "BASIC",
        rank: "BRONZE",
        isVerified: false,
        additionalInfo: data.additionalInfo || {},
      },
      include: {
        user: true,
      },
    });

    // Update user role to ALUMNI
    await prisma.user.update({
      where: { id: data.userId },
      data: { role: "ALUMNI" },
    });

    // Send welcome email
    try {
      await EmailService.sendAlumniWelcomeEmail(
        alumniProfile.user.email,
        alumniProfile.user.name,
        alumniId
      );
    } catch (error) {
      console.error("Error sending welcome email:", error);
    }

    revalidatePath("/dashboard/alumni");
    revalidatePath("/dashboard/admin/alumni");
    return { success: true, alumniProfile };
  } catch (error) {
    console.error("Create alumni profile error:", error);
    return { error: "Failed to create alumni profile" };
  }
}

export async function verifyAlumniProfile(formData: FormData) {
  try {
    const validatedFields = alumniVerificationSchema.safeParse({
      alumniId: formData.get("alumniId"),
      isVerified: formData.get("isVerified") === "true",
      verificationNotes: formData.get("verificationNotes"),
      category: formData.get("category"),
      rank: formData.get("rank"),
      verificationDate: new Date(),
      verifiedBy: formData.get("verifiedBy"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid verification data" };
    }

    const data = validatedFields.data;

    // Update alumni profile
    const updatedProfile = await prisma.alumniProfile.update({
      where: { alumniId: data.alumniId },
      data: {
        isVerified: data.isVerified,
        category: data.category,
        rank: data.rank,
        verificationNotes: data.verificationNotes,
        verificationDate: data.verificationDate,
        verifiedBy: data.verifiedBy,
      },
      include: {
        user: true,
      },
    });

    // Send verification notification
    if (data.isVerified) {
      try {
        await EmailService.sendAlumniVerificationEmail(
          updatedProfile.user.email,
          updatedProfile.user.name,
          data.category,
          data.rank
        );

        // Send real-time notification
        RealTimeService.sendNotification(updatedProfile.userId, {
          type: "success",
          title: "Profile Verified!",
          message: `Congratulations! Your alumni profile has been verified. You are now a ${data.category} member with ${data.rank} rank.`,
          actionUrl: `/dashboard/alumni/profile`,
        });
      } catch (error) {
        console.error("Error sending verification email:", error);
      }
    }

    revalidatePath("/dashboard/alumni");
    revalidatePath("/dashboard/admin/alumni");
    return { success: true, alumniProfile: updatedProfile };
  } catch (error) {
    console.error("Verify alumni profile error:", error);
    return { error: "Failed to verify alumni profile" };
  }
}

export async function updateAlumniCategory(formData: FormData) {
  try {
    const validatedFields = categoryUpdateSchema.safeParse({
      alumniId: formData.get("alumniId"),
      category: formData.get("category"),
      rank: formData.get("rank"),
      reason: formData.get("reason"),
      updatedBy: formData.get("updatedBy"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid category update data" };
    }

    const data = validatedFields.data;

    // Update alumni profile
    const updatedProfile = await prisma.alumniProfile.update({
      where: { alumniId: data.alumniId },
      data: {
        category: data.category,
        rank: data.rank,
        categoryUpdateReason: data.reason,
        categoryUpdatedBy: data.updatedBy,
        categoryUpdatedAt: new Date(),
      },
      include: {
        user: true,
      },
    });

    // Send category update notification
    try {
      await EmailService.sendAlumniCategoryUpdateEmail(
        updatedProfile.user.email,
        updatedProfile.user.name,
        data.category,
        data.rank,
        data.reason
      );

      // Send real-time notification
      RealTimeService.sendNotification(updatedProfile.userId, {
        type: "info",
        title: "Category Updated",
        message: `Your alumni category has been updated to ${data.category} with ${data.rank} rank.`,
        actionUrl: `/dashboard/alumni/profile`,
      });
    } catch (error) {
      console.error("Error sending category update email:", error);
    }

    revalidatePath("/dashboard/alumni");
    revalidatePath("/dashboard/admin/alumni");
    return { success: true, alumniProfile: updatedProfile };
  } catch (error) {
    console.error("Update alumni category error:", error);
    return { error: "Failed to update alumni category" };
  }
}

export async function getAllAlumniProfiles() {
  try {
    const alumniProfiles = await prisma.alumniProfile.findMany({
      include: {
        user: true,
        pledges: {
          include: {
            payments: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { alumniProfiles };
  } catch (error) {
    console.error("Get all alumni profiles error:", error);
    return { error: "Failed to get alumni profiles" };
  }
}

export async function getAlumniProfileById(alumniId: string) {
  try {
    const alumniProfile = await prisma.alumniProfile.findUnique({
      where: { alumniId },
      include: {
        user: true,
        pledges: {
          include: {
            payments: true,
          },
        },
        payments: true,
      },
    });

    return { alumniProfile };
  } catch (error) {
    console.error("Get alumni profile error:", error);
    return { error: "Failed to get alumni profile" };
  }
}

export async function getAlumniStats() {
  try {
    const stats = await prisma.$transaction([
      prisma.alumniProfile.count(),
      prisma.alumniProfile.count({ where: { isVerified: true } }),
      prisma.alumniProfile.count({ where: { isVerified: false } }),
      prisma.alumniProfile.groupBy({
        by: ['category'],
        _count: { category: true },
      }),
      prisma.alumniProfile.groupBy({
        by: ['rank'],
        _count: { rank: true },
      }),
      prisma.alumniProfile.aggregate({
        _sum: { totalContributed: true, totalPledged: true },
      }),
    ]);

    return {
      totalAlumni: stats[0],
      verifiedAlumni: stats[1],
      pendingVerification: stats[2],
      categoryDistribution: stats[3],
      rankDistribution: stats[4],
      totalContributed: stats[5]._sum.totalContributed || 0,
      totalPledged: stats[5]._sum.totalPledged || 0,
    };
  } catch (error) {
    console.error("Get alumni stats error:", error);
    return { error: "Failed to get alumni statistics" };
  }
}

export async function searchAlumniProfiles(query: string) {
  try {
    const alumniProfiles = await prisma.alumniProfile.findMany({
      where: {
        OR: [
          { alumniId: { contains: query, mode: 'insensitive' } },
          { department: { contains: query, mode: 'insensitive' } },
          { user: { name: { contains: query, mode: 'insensitive' } } },
          { user: { email: { contains: query, mode: 'insensitive' } } },
        ],
      },
      include: {
        user: true,
        pledges: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { alumniProfiles };
  } catch (error) {
    console.error("Search alumni profiles error:", error);
    return { error: "Failed to search alumni profiles" };
  }
}

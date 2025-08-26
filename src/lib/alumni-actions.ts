"use server";

import { prisma } from "./prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Validation schemas
const pledgeSchema = z.object({
  amount: z.number().min(1, "Amount must be at least 1"),
  currency: z.string().default("USD"),
  paymentMethod: z.enum(["CARD", "BANK_TRANSFER", "MANUAL"]),
  semester: z.string().optional(),
  phoneNumber: z.string().optional(),
  notes: z.string().optional(),
});

const paymentSchema = z.object({
  pledgeId: z.string().optional(),
  amount: z.number().min(1, "Amount must be at least 1"),
  currency: z.string().default("USD"),
  paymentMethod: z.enum(["BANK_TRANSFER", "STRIPE", "CASH", "CHECK", "OTHER"]),
  receiptPath: z.string().optional(),
  notes: z.string().optional(),
});

export async function createPledge(alumniId: string, formData: FormData) {
  try {
    const validatedFields = pledgeSchema.safeParse({
      amount: parseFloat(formData.get("amount") as string),
      currency: formData.get("currency") || "USD",
      paymentMethod: formData.get("paymentMethod") as "CARD" | "BANK_TRANSFER" | "MANUAL",
      semester: formData.get("semester") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      notes: formData.get("notes"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid pledge data" };
    }

    const data = validatedFields.data;

    const pledge = await prisma.alumniPledge.create({
      data: {
        alumniId,
        amount: data.amount,
        currency: data.currency,
        notes: data.notes,
        status: "PENDING",
      },
      include: {
        alumni: {
          include: {
            user: true,
          },
        },
      },
    });

    // Update alumni total pledged amount
    await prisma.alumniProfile.update({
      where: { id: alumniId },
      data: {
        totalPledged: {
          increment: data.amount,
        },
      },
    });

    revalidatePath("/dashboard/alumni/pledges");
    return { success: true, pledge };
  } catch (error) {
    console.error("Create pledge error:", error);
    return { error: "Failed to create pledge" };
  }
}

export async function updatePledge(pledgeId: string, formData: FormData) {
  try {
    const status = formData.get("status") as "PENDING" | "CONFIRMED" | "FULFILLED" | "CANCELLED";
    const notes = formData.get("notes") as string;

    const pledge = await prisma.alumniPledge.update({
      where: { id: pledgeId },
      data: {
        status,
        notes,
        fulfillmentDate: status === "FULFILLED" ? new Date() : null,
      },
      include: {
        alumni: {
          include: {
            user: true,
          },
        },
      },
    });

    revalidatePath("/dashboard/alumni/pledges");
    return { success: true, pledge };
  } catch (error) {
    console.error("Update pledge error:", error);
    return { error: "Failed to update pledge" };
  }
}

export async function addPayment(alumniId: string, formData: FormData) {
  try {
    const validatedFields = paymentSchema.safeParse({
      pledgeId: formData.get("pledgeId"),
      amount: parseFloat(formData.get("amount") as string),
      currency: formData.get("currency") || "USD",
      paymentMethod: formData.get("paymentMethod"),
      receiptUrl: formData.get("receiptUrl"),
      notes: formData.get("notes"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid payment data" };
    }

    const data = validatedFields.data;

    const payment = await prisma.alumniPayment.create({
      data: {
        alumniId,
        pledgeId: data.pledgeId,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.paymentMethod,
        receiptPath: data.receiptPath,
        notes: data.notes,
        status: "PENDING",
        userId: alumniId, // Using alumniId as userId for now
      },
      include: {
        alumni: {
          include: {
            user: true,
          },
        },
        pledge: true,
      },
    });

    revalidatePath("/dashboard/alumni/payments");
    return { success: true, payment };
  } catch (error) {
    console.error("Add payment error:", error);
    return { error: "Failed to add payment" };
  }
}

export async function verifyPayment(paymentId: string, verifierId: string, formData: FormData) {
  try {
    const status = formData.get("status") as "VERIFIED" | "REJECTED";
    const notes = formData.get("notes") as string;

    const payment = await prisma.alumniPayment.update({
      where: { id: paymentId },
      data: {
        status,
        notes,
      },
      include: {
        alumni: {
          include: {
            user: true,
          },
        },
        pledge: true,
      },
    });

    // If payment is verified, update alumni total contributed
    if (status === "VERIFIED") {
      await prisma.alumniProfile.update({
        where: { id: payment.alumniId },
        data: {
          totalContributed: {
            increment: payment.amount,
          },
        },
      });

      // If this payment is linked to a pledge, update pledge status
      if (payment.pledgeId) {
        await prisma.alumniPledge.update({
          where: { id: payment.pledgeId },
          data: {
            status: "FULFILLED",
            fulfillmentDate: new Date(),
          },
        });
      }
    }

    revalidatePath("/dashboard/alumni/payments");
    revalidatePath("/dashboard/staff/payments");
    return { success: true, payment };
  } catch (error) {
    console.error("Verify payment error:", error);
    return { error: "Failed to verify payment" };
  }
}

export async function getAlumniPledges(alumniId: string) {
  try {
    const pledges = await prisma.alumniPledge.findMany({
      where: { alumniId },
      include: {
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { pledges };
  } catch (error) {
    console.error("Get alumni pledges error:", error);
    return { error: "Failed to get pledges" };
  }
}

export async function getAlumniPayments(alumniId: string) {
  try {
    const payments = await prisma.alumniPayment.findMany({
      where: { alumniId },
      include: {
        pledge: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { payments };
  } catch (error) {
    console.error("Get alumni payments error:", error);
    return { error: "Failed to get payments" };
  }
}

export async function getAllPledges() {
  try {
    const pledges = await prisma.alumniPledge.findMany({
      include: {
        alumni: {
          include: {
            user: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { pledges };
  } catch (error) {
    console.error("Get all pledges error:", error);
    return { error: "Failed to get pledges" };
  }
}

export async function getAllPayments() {
  try {
    const payments = await prisma.alumniPayment.findMany({
      include: {
        alumni: {
          include: {
            user: true,
          },
        },
        pledge: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { payments };
  } catch (error) {
    console.error("Get all payments error:", error);
    return { error: "Failed to get payments" };
  }
}

export async function verifyAlumni(alumniId: string, verifierId: string, formData: FormData) {
  try {
    const category = formData.get("category") as "BASIC" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";
    const rank = formData.get("rank") as "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";

    const alumni = await prisma.alumniProfile.update({
      where: { id: alumniId },
      data: {
        isVerified: true,
        category,
        rank,
      },
      include: {
        user: true,
      },
    });

    revalidatePath("/dashboard/admin/alumni");
    return { success: true, alumni };
  } catch (error) {
    console.error("Verify alumni error:", error);
    return { error: "Failed to verify alumni" };
  }
}

export async function getAlumniStats() {
  try {
    const stats = await prisma.$transaction([
      prisma.alumniProfile.count(),
      prisma.alumniProfile.count({
        where: { isVerified: true },
      }),
      prisma.alumniPledge.aggregate({
        _sum: {
          amount: true,
        },
      }),
      prisma.alumniPayment.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: "VERIFIED",
        },
      }),
    ]);

    return {
      totalAlumni: stats[0],
      verifiedAlumni: stats[1],
      totalPledged: stats[2]._sum.amount || 0,
      totalContributed: stats[3]._sum.amount || 0,
    };
  } catch (error) {
    console.error("Get alumni stats error:", error);
    return { error: "Failed to get alumni statistics" };
  }
}

export async function getAlumniById(alumniId: string) {
  try {
    const alumni = await prisma.alumniProfile.findUnique({
      where: { id: alumniId },
      include: {
        user: true,
        pledges: {
          include: {
            payments: true,
          },
        },
        payments: {
          include: {
            pledge: true,
          },
        },
      },
    });

    return { alumni };
  } catch (error) {
    console.error("Get alumni error:", error);
    return { error: "Failed to get alumni" };
  }
}


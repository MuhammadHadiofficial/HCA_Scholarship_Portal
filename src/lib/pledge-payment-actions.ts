"use server";

import { prisma } from "./prisma";
import { z } from "z";
import { revalidatePath } from "next/cache";
import { EmailService } from "./email-service";
import { RealTimeService } from "./realtime-service";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

// Validation schemas
const createPledgeSchema = z.object({
  alumniId: z.string(),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("USD"),
  notes: z.string().optional(),
});

const createPaymentSchema = z.object({
  alumniId: z.string(),
  pledgeId: z.string().optional(),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("USD"),
  paymentMethod: z.string(),
  notes: z.string().optional(),
});

const updatePledgeSchema = z.object({
  pledgeId: z.string(),
  status: z.enum(["PENDING", "CONFIRMED", "FULFILLED", "CANCELLED"]),
  notes: z.string().optional(),
});

const updatePaymentSchema = z.object({
  paymentId: z.string(),
  status: z.enum(["PENDING", "CONFIRMED", "FAILED", "REFUNDED"]),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
});

// Create a new pledge
export async function createPledge(formData: FormData) {
  try {
    const validatedFields = createPledgeSchema.safeParse({
      alumniId: formData.get("alumniId"),
      amount: parseFloat(formData.get("amount") as string),
      currency: formData.get("currency") || "USD",
      notes: formData.get("notes"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid pledge data" };
    }

    const data = validatedFields.data;

    // Check if alumni profile exists and is verified
    const alumniProfile = await prisma.alumniProfile.findUnique({
      where: { id: data.alumniId },
      include: { user: true },
    });

    if (!alumniProfile) {
      return { error: "Alumni profile not found" };
    }

    if (!alumniProfile.isVerified) {
      return { error: "Alumni profile must be verified before making pledges" };
    }

    // Create pledge
    const pledge = await prisma.alumniPledge.create({
      data: {
        alumniId: data.alumniId,
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

    // Update alumni profile total pledged amount
    await prisma.alumniProfile.update({
      where: { id: data.alumniId },
      data: {
        totalPledged: {
          increment: data.amount,
        },
      },
    });

    // Send pledge confirmation email
    try {
      await EmailService.sendPledgeConfirmationEmail(
        alumniProfile.user.email,
        alumniProfile.user.name,
        data.amount,
        data.currency,
        pledge.id
      );
    } catch (error) {
      console.error("Error sending pledge confirmation email:", error);
    }

    // Send real-time notification
    RealTimeService.sendNotification(alumniProfile.userId, {
      type: "success",
      title: "Pledge Created Successfully!",
      message: `Your pledge of ${data.currency} ${data.amount} has been recorded.`,
      actionUrl: `/dashboard/alumni/pledges/${pledge.id}`,
    });

    revalidatePath("/dashboard/alumni/pledges");
    revalidatePath("/dashboard/admin/pledges");
    return { success: true, pledge };
  } catch (error) {
    console.error("Create pledge error:", error);
    return { error: "Failed to create pledge" };
  }
}

// Create a Stripe payment intent
export async function createStripePaymentIntent(formData: FormData) {
  try {
    const validatedFields = createPaymentSchema.safeParse({
      alumniId: formData.get("alumniId"),
      pledgeId: formData.get("pledgeId"),
      amount: parseFloat(formData.get("amount") as string),
      currency: formData.get("currency") || "USD",
      paymentMethod: "stripe",
      notes: formData.get("notes"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid payment data" };
    }

    const data = validatedFields.data;

    // Check if alumni profile exists
    const alumniProfile = await prisma.alumniProfile.findUnique({
      where: { id: data.alumniId },
      include: { user: true },
    });

    if (!alumniProfile) {
      return { error: "Alumni profile not found" };
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100), // Convert to cents
      currency: data.currency.toLowerCase(),
      metadata: {
        alumniId: data.alumniId,
        pledgeId: data.pledgeId || "",
        alumniName: alumniProfile.user.name,
        alumniEmail: alumniProfile.user.email,
      },
      description: `Donation from ${alumniProfile.user.name}`,
    });

    // Create payment record
    const payment = await prisma.alumniPayment.create({
      data: {
        alumniId: data.alumniId,
        pledgeId: data.pledgeId,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: "stripe",
        transactionId: paymentIntent.id,
        status: "PENDING",
        notes: data.notes,
        userId: alumniProfile.userId,
      },
    });

    return { 
      success: true, 
      paymentIntent: {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
      },
      payment,
    };
  } catch (error) {
    console.error("Create Stripe payment intent error:", error);
    return { error: "Failed to create payment intent" };
  }
}

// Create a manual payment (bank transfer, etc.)
export async function createManualPayment(formData: FormData) {
  try {
    const validatedFields = createPaymentSchema.safeParse({
      alumniId: formData.get("alumniId"),
      pledgeId: formData.get("pledgeId"),
      amount: parseFloat(formData.get("amount") as string),
      currency: formData.get("currency") || "USD",
      paymentMethod: formData.get("paymentMethod"),
      notes: formData.get("notes"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid payment data" };
    }

    const data = validatedFields.data;

    // Check if alumni profile exists
    const alumniProfile = await prisma.alumniProfile.findUnique({
      where: { id: data.alumniId },
      include: { user: true },
    });

    if (!alumniProfile) {
      return { error: "Alumni profile not found" };
    }

    // Create payment record
    const payment = await prisma.alumniPayment.create({
      data: {
        alumniId: data.alumniId,
        pledgeId: data.pledgeId,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.paymentMethod,
        status: "PENDING",
        notes: data.notes,
        userId: alumniProfile.userId,
      },
    });

    // Send payment confirmation email
    try {
      await EmailService.sendManualPaymentConfirmationEmail(
        alumniProfile.user.email,
        alumniProfile.user.name,
        data.amount,
        data.currency,
        data.paymentMethod,
        payment.id
      );
    } catch (error) {
      console.error("Error sending payment confirmation email:", error);
    }

    revalidatePath("/dashboard/alumni/payments");
    revalidatePath("/dashboard/admin/payments");
    return { success: true, payment };
  } catch (error) {
    console.error("Create manual payment error:", error);
    return { error: "Failed to create manual payment" };
  }
}

// Update payment status (for admin verification)
export async function updatePaymentStatus(formData: FormData) {
  try {
    const validatedFields = updatePaymentSchema.safeParse({
      paymentId: formData.get("paymentId"),
      status: formData.get("status"),
      transactionId: formData.get("transactionId"),
      notes: formData.get("notes"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid payment update data" };
    }

    const data = validatedFields.data;

    // Update payment
    const payment = await prisma.alumniPayment.update({
      where: { id: data.paymentId },
      data: {
        status: data.status,
        transactionId: data.transactionId,
        notes: data.notes,
        updatedAt: new Date(),
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

    // If payment is confirmed, update alumni profile and pledge
    if (data.status === "CONFIRMED") {
      // Update alumni profile total contributed
      await prisma.alumniProfile.update({
        where: { id: payment.alumniId },
        data: {
          totalContributed: {
            increment: payment.amount,
          },
        },
      });

      // Update pledge status if linked
      if (payment.pledgeId) {
        await prisma.alumniPledge.update({
          where: { id: payment.pledgeId },
          data: {
            status: "FULFILLED",
            fulfillmentDate: new Date(),
          },
        });
      }

      // Send payment confirmation email
      try {
        await EmailService.sendPaymentConfirmedEmail(
          payment.alumni.user.email,
          payment.alumni.user.name,
          payment.amount,
          payment.currency,
          payment.id
        );
      } catch (error) {
        console.error("Error sending payment confirmation email:", error);
      }

      // Send real-time notification
      RealTimeService.sendNotification(payment.alumni.userId, {
        type: "success",
        title: "Payment Confirmed!",
        message: `Your payment of ${payment.currency} ${payment.amount} has been confirmed.`,
        actionUrl: `/dashboard/alumni/payments/${payment.id}`,
      });
    }

    revalidatePath("/dashboard/alumni/payments");
    revalidatePath("/dashboard/admin/payments");
    return { success: true, payment };
  } catch (error) {
    console.error("Update payment status error:", error);
    return { error: "Failed to update payment status" };
  }
}

// Update pledge status
export async function updatePledgeStatus(formData: FormData) {
  try {
    const validatedFields = updatePledgeSchema.safeParse({
      pledgeId: formData.get("pledgeId"),
      status: formData.get("status"),
      notes: formData.get("notes"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid pledge update data" };
    }

    const data = validatedFields.data;

    // Update pledge
    const pledge = await prisma.alumniPledge.update({
      where: { id: data.pledgeId },
      data: {
        status: data.status,
        notes: data.notes,
        updatedAt: new Date(),
      },
      include: {
        alumni: {
          include: {
            user: true,
          },
        },
      },
    });

    // Send status update email
    try {
      await EmailService.sendPledgeStatusUpdateEmail(
        pledge.alumni.user.email,
        pledge.alumni.user.name,
        pledge.amount,
        pledge.currency,
        data.status,
        pledge.id
      );
    } catch (error) {
      console.error("Error sending pledge status update email:", error);
    }

    revalidatePath("/dashboard/alumni/pledges");
    revalidatePath("/dashboard/admin/pledges");
    return { success: true, pledge };
  } catch (error) {
    console.error("Update pledge status error:", error);
    return { error: "Failed to update pledge status" };
  }
}

// Get all pledges for an alumni
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
    return { error: "Failed to get alumni pledges" };
  }
}

// Get all payments for an alumni
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
    return { error: "Failed to get alumni payments" };
  }
}

// Get all pledges (admin view)
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
    return { error: "Failed to get all pledges" };
  }
}

// Get all payments (admin view)
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
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { payments };
  } catch (error) {
    console.error("Get all payments error:", error);
    return { error: "Failed to get all payments" };
  }
}

// Get pledge statistics
export async function getPledgeStats() {
  try {
    const stats = await prisma.$transaction([
      prisma.alumniPledge.count(),
      prisma.alumniPledge.count({ where: { status: "PENDING" } }),
      prisma.alumniPledge.count({ where: { status: "CONFIRMED" } }),
      prisma.alumniPledge.count({ where: { status: "FULFILLED" } }),
      prisma.alumniPledge.aggregate({
        _sum: { amount: true },
      }),
      prisma.alumniPayment.count(),
      prisma.alumniPayment.count({ where: { status: "CONFIRMED" } }),
      prisma.alumniPayment.aggregate({
        _sum: { amount: true },
      }),
    ]);

    return {
      totalPledges: stats[0],
      pendingPledges: stats[1],
      confirmedPledges: stats[2],
      fulfilledPledges: stats[3],
      totalPledgedAmount: stats[4]._sum.amount || 0,
      totalPayments: stats[5],
      confirmedPayments: stats[6],
      totalPaidAmount: stats[7]._sum.amount || 0,
    };
  } catch (error) {
    console.error("Get pledge stats error:", error);
    return { error: "Failed to get pledge statistics" };
  }
}

// Handle Stripe webhook
export async function handleStripeWebhook(payload: any, signature: string) {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        await handlePaymentSuccess(paymentIntent);
        break;
      
      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        await handlePaymentFailure(failedPayment);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return { error: "Webhook signature verification failed" };
  }
}

// Handle successful payment
async function handlePaymentSuccess(paymentIntent: any) {
  try {
    const payment = await prisma.alumniPayment.findFirst({
      where: { transactionId: paymentIntent.id },
      include: {
        alumni: {
          include: {
            user: true,
          },
        },
        pledge: true,
      },
    });

    if (!payment) {
      console.error("Payment not found for Stripe payment intent:", paymentIntent.id);
      return;
    }

    // Update payment status
    await updatePaymentStatus(new FormData([
      ["paymentId", payment.id],
      ["status", "CONFIRMED"],
      ["transactionId", paymentIntent.id],
      ["notes", "Payment confirmed via Stripe"],
    ]));
  } catch (error) {
    console.error("Error handling payment success:", error);
  }
}

// Handle failed payment
async function handlePaymentFailure(paymentIntent: any) {
  try {
    const payment = await prisma.alumniPayment.findFirst({
      where: { transactionId: paymentIntent.id },
    });

    if (!payment) {
      console.error("Payment not found for failed Stripe payment intent:", paymentIntent.id);
      return;
    }

    // Update payment status
    await updatePaymentStatus(new FormData([
      ["paymentId", payment.id],
      ["status", "FAILED"],
      ["notes", "Payment failed via Stripe"],
    ]));
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
}

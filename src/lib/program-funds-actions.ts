"use server";

import { prisma } from "./prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { EmailService } from "./email-service";
import { RealTimeService } from "./realtime-service";

// Validation schemas
const createProgramFundSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  amount: z.number().positive("Amount must be positive"),
  category: z.string().min(1, "Category is required"),
  isActive: z.boolean().default(true),
});

const updateProgramFundSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  amount: z.number().positive("Amount must be positive"),
  category: z.string().min(1, "Category is required"),
  isActive: z.boolean(),
});

const createExpenseSchema = z.object({
  programFundId: z.string(),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  expenseDate: z.string(), // ISO date string
  notes: z.string().optional(),
});

const createEventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  eventDate: z.string(), // ISO date string
  requiredFunds: z.number().positive("Required funds must be positive"),
  intakeId: z.string().optional(),
  programFundId: z.string().optional(),
});

// Create a new program fund
export async function createProgramFund(formData: FormData, userId?: string) {
  try {
    const validatedFields = createProgramFundSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
      amount: parseFloat(formData.get("amount") as string),
      category: formData.get("category"),
      isActive: formData.get("isActive") === "true",
    });

    if (!validatedFields.success) {
      return { error: "Invalid program fund data" };
    }

    const data = validatedFields.data;

    // Check if fund with same name exists
    const existingFund = await prisma.programFund.findFirst({
      where: { name: data.name },
    });

    if (existingFund) {
      return { error: "A program fund with this name already exists" };
    }

    // Create program fund
    const programFund = await prisma.programFund.create({
      data: {
        name: data.name,
        description: data.description,
        amount: data.amount,
        remainingAmount: data.amount,
        category: data.category,
        isActive: data.isActive,
        createdBy: userId || "ADMIN001", // Use provided userId or fallback
      },
    });

    revalidatePath("/dashboard/admin/funds");
    revalidatePath("/dashboard/public");
    return { success: true, programFund };
  } catch (error) {
    console.error("Create program fund error:", error);
    return { error: "Failed to create program fund" };
  }
}

// Update a program fund
export async function updateProgramFund(formData: FormData) {
  try {
    const validatedFields = updateProgramFundSchema.safeParse({
      id: formData.get("id"),
      name: formData.get("name"),
      description: formData.get("description"),
      amount: parseFloat(formData.get("amount") as string),
      category: formData.get("category"),
      isActive: formData.get("isActive") === "true",
    });

    if (!validatedFields.success) {
      return { error: "Invalid program fund data" };
    }

    const data = validatedFields.data;

    // Check if fund exists
    const existingFund = await prisma.programFund.findUnique({
      where: { id: data.id },
      include: { expenses: true },
    });

    if (!existingFund) {
      return { error: "Program fund not found" };
    }

    // Calculate total allocated amount
    const totalAllocated = existingFund.expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Check if new amount is less than allocated amount
    if (data.amount < totalAllocated) {
      return { error: "New amount cannot be less than already allocated amount" };
    }

    // Update program fund
    const programFund = await prisma.programFund.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        amount: data.amount,
        remainingAmount: data.amount - totalAllocated,
        category: data.category,
        isActive: data.isActive,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/admin/funds");
    revalidatePath("/dashboard/public");
    return { success: true, programFund };
  } catch (error) {
    console.error("Update program fund error:", error);
    return { error: "Failed to update program fund" };
  }
}

// Delete a program fund
export async function deleteProgramFund(formData: FormData) {
  try {
    const fundId = formData.get("id") as string;

    if (!fundId) {
      return { error: "Fund ID is required" };
    }

    // Check if fund has expenses
    const fundWithExpenses = await prisma.programFund.findUnique({
      where: { id: fundId },
      include: { expenses: true },
    });

    if (!fundWithExpenses) {
      return { error: "Program fund not found" };
    }

    if (fundWithExpenses.expenses.length > 0) {
      return { error: "Cannot delete fund with existing expenses" };
    }

    // Delete program fund
    await prisma.programFund.delete({
      where: { id: fundId },
    });

    revalidatePath("/dashboard/admin/funds");
    revalidatePath("/dashboard/public");
    return { success: true };
  } catch (error) {
    console.error("Delete program fund error:", error);
    return { error: "Failed to delete program fund" };
  }
}

// Create a new expense
export async function createExpense(formData: FormData, userId?: string) {
  try {
    const validatedFields = createExpenseSchema.safeParse({
      programFundId: formData.get("programFundId"),
      amount: parseFloat(formData.get("amount") as string),
      description: formData.get("description"),
      expenseDate: formData.get("expenseDate"),
      notes: formData.get("notes"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid expense data" };
    }

    const data = validatedFields.data;

    // Check if program fund exists and has sufficient funds
    const programFund = await prisma.programFund.findUnique({
      where: { id: data.programFundId },
    });

    if (!programFund) {
      return { error: "Program fund not found" };
    }

    if (!programFund.isActive) {
      return { error: "Program fund is not active" };
    }

    if (data.amount > programFund.remainingAmount) {
      return { error: "Insufficient funds in program fund" };
    }

    // Create expense
    const expense = await prisma.programExpense.create({
      data: {
        programFundId: data.programFundId,
        amount: data.amount,
        description: data.description,
        expenseDate: new Date(data.expenseDate),
        notes: data.notes,
        approvedBy: userId || "ADMIN001", // Use provided userId or fallback
      },
    });

    // Update program fund remaining amount
    await prisma.programFund.update({
      where: { id: data.programFundId },
      data: {
        allocatedAmount: {
          increment: data.amount,
        },
        remainingAmount: {
          decrement: data.amount,
        },
      },
    });

    revalidatePath("/dashboard/admin/funds");
    revalidatePath("/dashboard/admin/expenses");
    revalidatePath("/dashboard/public");
    return { success: true, expense };
  } catch (error) {
    console.error("Create expense error:", error);
    return { error: "Failed to create expense" };
  }
}

// Create a new event
export async function createEvent(formData: FormData, userId?: string) {
  try {
    const validatedFields = createEventSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
      eventDate: formData.get("eventDate"),
      requiredFunds: parseFloat(formData.get("requiredFunds") as string),
      intakeId: formData.get("intakeId"),
      programFundId: formData.get("programFundId"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid event data" };
    }

    const data = validatedFields.data;

    // Check if program fund exists and has sufficient funds (if specified)
    if (data.programFundId) {
      const programFund = await prisma.programFund.findUnique({
        where: { id: data.programFundId },
      });

      if (!programFund) {
        return { error: "Program fund not found" };
      }

      if (!programFund.isActive) {
        return { error: "Program fund is not active" };
      }

      if (data.requiredFunds > programFund.remainingAmount) {
        return { error: "Insufficient funds in program fund" };
      }
    }

    // Create event
    const event = await prisma.event.create({
      data: {
        name: data.name,
        description: data.description,
        eventDate: new Date(data.eventDate),
        requiredFunds: data.requiredFunds,
        intakeId: data.intakeId,
        programFundId: data.programFundId,
        createdBy: userId || "ADMIN001", // Use provided userId or fallback
      },
    });

    // If program fund is specified, allocate funds
    if (data.programFundId) {
      await prisma.programFund.update({
        where: { id: data.programFundId },
        data: {
          allocatedAmount: {
            increment: data.requiredFunds,
          },
          remainingAmount: {
            decrement: data.requiredFunds,
          },
        },
      });

      // Update event status
      await prisma.event.update({
        where: { id: event.id },
        data: {
          allocatedFunds: data.requiredFunds,
          status: "FUNDED",
        },
      });
    }

    revalidatePath("/dashboard/admin/events");
    revalidatePath("/dashboard/public");
    return { success: true, event };
  } catch (error) {
    console.error("Create event error:", error);
    return { error: "Failed to create event" };
  }
}

// Get all program funds
export async function getAllProgramFunds() {
  try {
    const funds = await prisma.programFund.findMany({
      include: {
        expenses: true,
        events: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { funds };
  } catch (error) {
    console.error("Get all program funds error:", error);
    return { error: "Failed to get program funds" };
  }
}

// Get all expenses
export async function getAllExpenses() {
  try {
    const expenses = await prisma.programExpense.findMany({
      include: {
        programFund: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { expenses };
  } catch (error) {
    console.error("Get all expenses error:", error);
    return { error: "Failed to get expenses" };
  }
}

// Get all events
export async function getAllEvents() {
  try {
    const events = await prisma.event.findMany({
      include: {
        programFund: true,
        intake: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { eventDate: "desc" },
    });

    return { events };
  } catch (error) {
    console.error("Get all events error:", error);
    return { error: "Failed to get events" };
  }
}

// Get public dashboard data
export async function getPublicDashboardData(filters?: {
  startDate?: string;
  endDate?: string;
  category?: string;
  intakeYear?: string;
}) {
  try {
    const whereClause: any = {};

    if (filters?.startDate && filters?.endDate) {
      whereClause.createdAt = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }

    if (filters?.category) {
      whereClause.category = filters.category;
    }

    // Get program funds
    const funds = await prisma.programFund.findMany({
      where: whereClause,
      include: {
        expenses: true,
        events: true,
      },
    });

    // Get alumni pledges and payments
    const pledges = await prisma.alumniPledge.findMany({
      where: whereClause,
      include: {
        alumni: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const payments = await prisma.alumniPayment.findMany({
      where: whereClause,
      include: {
        alumni: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Calculate statistics
    const totalFunds = funds.reduce((sum, fund) => sum + fund.amount, 0);
    const totalAllocated = funds.reduce((sum, fund) => sum + fund.allocatedAmount, 0);
    const totalRemaining = funds.reduce((sum, fund) => sum + fund.remainingAmount, 0);
    const totalExpenses = funds.reduce((sum, fund) => sum + fund.expenses.reduce((expSum, exp) => expSum + exp.amount, 0), 0);
    const totalPledged = pledges.reduce((sum, pledge) => sum + pledge.amount, 0);
    const totalPaid = payments.filter(p => p.status === "CONFIRMED").reduce((sum, payment) => sum + payment.amount, 0);

    // Category breakdown
    const categoryBreakdown = funds.reduce((acc, fund) => {
      if (!acc[fund.category]) {
        acc[fund.category] = { total: 0, allocated: 0, remaining: 0 };
      }
      acc[fund.category].total += fund.amount;
      acc[fund.category].allocated += fund.allocatedAmount;
      acc[fund.category].remaining += fund.remainingAmount;
      return acc;
    }, {} as Record<string, { total: number; allocated: number; remaining: number }>);

    return {
      funds,
      pledges,
      payments,
      statistics: {
        totalFunds,
        totalAllocated,
        totalRemaining,
        totalExpenses,
        totalPledged,
        totalPaid,
      },
      categoryBreakdown,
    };
  } catch (error) {
    console.error("Get public dashboard data error:", error);
    return { error: "Failed to get public dashboard data" };
  }
}

// Get program fund statistics
export async function getProgramFundStats() {
  try {
    const stats = await prisma.$transaction([
      prisma.programFund.count(),
      prisma.programFund.count({ where: { isActive: true } }),
      prisma.programFund.aggregate({
        _sum: { amount: true },
      }),
      prisma.programFund.aggregate({
        _sum: { allocatedAmount: true },
      }),
      prisma.programFund.aggregate({
        _sum: { remainingAmount: true },
      }),
      prisma.programExpense.count(),
      prisma.programExpense.aggregate({
        _sum: { amount: true },
      }),
      prisma.event.count(),
      prisma.event.count({ where: { status: "FUNDED" } }),
    ]);

    return {
      totalFunds: stats[0],
      activeFunds: stats[1],
      totalAmount: stats[2]._sum.amount || 0,
      totalAllocated: stats[3]._sum.allocatedAmount || 0,
      totalRemaining: stats[4]._sum.remainingAmount || 0,
      totalExpenses: stats[5],
      totalExpenseAmount: stats[6]._sum.amount || 0,
      totalEvents: stats[7],
      fundedEvents: stats[8],
    };
  } catch (error) {
    console.error("Get program fund stats error:", error);
    return { error: "Failed to get program fund statistics" };
  }
}

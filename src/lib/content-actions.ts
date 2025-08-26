"use server";

import { prisma } from "./prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Validation schemas
const guidelineSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  version: z.string().min(1, "Version is required"),
});

const policySchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  version: z.string().min(1, "Version is required"),
});

const programFundSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.enum(["STUDENT_WELFARE", "LEARNING_PROGRAMS", "HACKATHON", "COURSES", "SKILLS_DEVELOPMENT", "OTHER"]),
  budget: z.number().min(0, "Budget must be positive"),
  startDate: z.string(),
  endDate: z.string().optional(),
});

const expenseSchema = z.object({
  programFundId: z.string(),
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0, "Amount must be positive"),
  receiptUrl: z.string().optional(),
});

export async function createGuideline(publisherId: string, formData: FormData) {
  try {
    const validatedFields = guidelineSchema.safeParse({
      title: formData.get("title"),
      content: formData.get("content"),
      version: formData.get("version"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid guideline data" };
    }

    const data = validatedFields.data;

    // Deactivate previous versions
    await prisma.guideline.updateMany({
      where: { title: data.title, isActive: true },
      data: { isActive: false },
    });

    const guideline = await prisma.guideline.create({
      data: {
        title: data.title,
        content: data.content,
        version: data.version,
        isActive: true,
        publishedBy: publisherId,
      },
      include: {
        publisher: true,
      },
    });

    revalidatePath("/guidelines");
    revalidatePath("/dashboard/admin/guidelines");
    return { success: true, guideline };
  } catch (error) {
    console.error("Create guideline error:", error);
    return { error: "Failed to create guideline" };
  }
}

export async function updateGuideline(guidelineId: string, formData: FormData) {
  try {
    const validatedFields = guidelineSchema.safeParse({
      title: formData.get("title"),
      content: formData.get("content"),
      version: formData.get("version"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid guideline data" };
    }

    const data = validatedFields.data;

    const guideline = await prisma.guideline.update({
      where: { id: guidelineId },
      data: {
        title: data.title,
        content: data.content,
        version: data.version,
        updatedAt: new Date(),
      },
      include: {
        publisher: true,
      },
    });

    revalidatePath("/guidelines");
    revalidatePath("/dashboard/admin/guidelines");
    return { success: true, guideline };
  } catch (error) {
    console.error("Update guideline error:", error);
    return { error: "Failed to update guideline" };
  }
}

export async function createPolicy(publisherId: string, formData: FormData) {
  try {
    const validatedFields = policySchema.safeParse({
      title: formData.get("title"),
      content: formData.get("content"),
      version: formData.get("version"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid policy data" };
    }

    const data = validatedFields.data;

    // Deactivate previous versions
    await prisma.policy.updateMany({
      where: { title: data.title, isActive: true },
      data: { isActive: false },
    });

    const policy = await prisma.policy.create({
      data: {
        title: data.title,
        content: data.content,
        version: data.version,
        isActive: true,
        publishedBy: publisherId,
      },
      include: {
        publisher: true,
      },
    });

    revalidatePath("/policies");
    revalidatePath("/dashboard/admin/policies");
    return { success: true, policy };
  } catch (error) {
    console.error("Create policy error:", error);
    return { error: "Failed to create policy" };
  }
}

export async function updatePolicy(policyId: string, formData: FormData) {
  try {
    const validatedFields = policySchema.safeParse({
      title: formData.get("title"),
      content: formData.get("content"),
      version: formData.get("version"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid policy data" };
    }

    const data = validatedFields.data;

    const policy = await prisma.policy.update({
      where: { id: policyId },
      data: {
        title: data.title,
        content: data.content,
        version: data.version,
        updatedAt: new Date(),
      },
      include: {
        publisher: true,
      },
    });

    revalidatePath("/policies");
    revalidatePath("/dashboard/admin/policies");
    return { success: true, policy };
  } catch (error) {
    console.error("Update policy error:", error);
    return { error: "Failed to update policy" };
  }
}

export async function createProgramFund(creatorId: string, formData: FormData) {
  try {
    const validatedFields = programFundSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
      category: formData.get("category"),
      budget: parseFloat(formData.get("budget") as string),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid program fund data" };
    }

    const data = validatedFields.data;

    const programFund = await prisma.programFund.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        budget: data.budget,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        createdBy: creatorId,
      },
      include: {
        creator: true,
      },
    });

    revalidatePath("/dashboard/admin/programs");
    return { success: true, programFund };
  } catch (error) {
    console.error("Create program fund error:", error);
    return { error: "Failed to create program fund" };
  }
}

export async function updateProgramFund(programFundId: string, formData: FormData) {
  try {
    const validatedFields = programFundSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
      category: formData.get("category"),
      budget: parseFloat(formData.get("budget") as string),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid program fund data" };
    }

    const data = validatedFields.data;

    const programFund = await prisma.programFund.update({
      where: { id: programFundId },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        budget: data.budget,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        updatedAt: new Date(),
      },
      include: {
        creator: true,
      },
    });

    revalidatePath("/dashboard/admin/programs");
    return { success: true, programFund };
  } catch (error) {
    console.error("Update program fund error:", error);
    return { error: "Failed to update program fund" };
  }
}

export async function addExpense(formData: FormData) {
  try {
    const validatedFields = expenseSchema.safeParse({
      programFundId: formData.get("programFundId"),
      description: formData.get("description"),
      amount: parseFloat(formData.get("amount") as string),
      receiptUrl: formData.get("receiptUrl"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid expense data" };
    }

    const data = validatedFields.data;

    // Check if program fund has sufficient budget
    const programFund = await prisma.programFund.findUnique({
      where: { id: data.programFundId },
    });

    if (!programFund) {
      return { error: "Program fund not found" };
    }

    if (programFund.spent + data.amount > programFund.budget) {
      return { error: "Insufficient budget for this expense" };
    }

    const expense = await prisma.programExpense.create({
      data: {
        programFundId: data.programFundId,
        description: data.description,
        amount: data.amount,
        receiptUrl: data.receiptUrl,
      },
      include: {
        programFund: true,
      },
    });

    // Update program fund spent amount
    await prisma.programFund.update({
      where: { id: data.programFundId },
      data: {
        spent: {
          increment: data.amount,
        },
      },
    });

    revalidatePath("/dashboard/admin/programs");
    return { success: true, expense };
  } catch (error) {
    console.error("Add expense error:", error);
    return { error: "Failed to add expense" };
  }
}

export async function getActiveGuidelines() {
  try {
    const guidelines = await prisma.guideline.findMany({
      where: { isActive: true },
      include: {
        publisher: true,
      },
      orderBy: { publishedAt: "desc" },
    });

    return { guidelines };
  } catch (error) {
    console.error("Get active guidelines error:", error);
    return { error: "Failed to get guidelines" };
  }
}

export async function getActivePolicies() {
  try {
    const policies = await prisma.policy.findMany({
      where: { isActive: true },
      include: {
        publisher: true,
      },
      orderBy: { publishedAt: "desc" },
    });

    return { policies };
  } catch (error) {
    console.error("Get active policies error:", error);
    return { error: "Failed to get policies" };
  }
}

export async function getAllGuidelines() {
  try {
    const guidelines = await prisma.guideline.findMany({
      include: {
        publisher: true,
      },
      orderBy: { publishedAt: "desc" },
    });

    return { guidelines };
  } catch (error) {
    console.error("Get all guidelines error:", error);
    return { error: "Failed to get guidelines" };
  }
}

export async function getAllPolicies() {
  try {
    const policies = await prisma.policy.findMany({
      include: {
        publisher: true,
      },
      orderBy: { publishedAt: "desc" },
    });

    return { policies };
  } catch (error) {
    console.error("Get all policies error:", error);
    return { error: "Failed to get policies" };
  }
}

export async function getProgramFunds() {
  try {
    const programFunds = await prisma.programFund.findMany({
      include: {
        creator: true,
        expenses: {
          include: {
            approver: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { programFunds };
  } catch (error) {
    console.error("Get program funds error:", error);
    return { error: "Failed to get program funds" };
  }
}

export async function getGuidelineById(guidelineId: string) {
  try {
    const guideline = await prisma.guideline.findUnique({
      where: { id: guidelineId },
      include: {
        publisher: true,
      },
    });

    return { guideline };
  } catch (error) {
    console.error("Get guideline error:", error);
    return { error: "Failed to get guideline" };
  }
}

export async function getPolicyById(policyId: string) {
  try {
    const policy = await prisma.policy.findUnique({
      where: { id: policyId },
      include: {
        publisher: true,
      },
    });

    return { policy };
  } catch (error) {
    console.error("Get policy error:", error);
    return { error: "Failed to get policy" };
  }
}

export async function getProgramFundById(programFundId: string) {
  try {
    const programFund = await prisma.programFund.findUnique({
      where: { id: programFundId },
      include: {
        creator: true,
        expenses: {
          include: {
            approver: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return { programFund };
  } catch (error) {
    console.error("Get program fund error:", error);
    return { error: "Failed to get program fund" };
  }
}


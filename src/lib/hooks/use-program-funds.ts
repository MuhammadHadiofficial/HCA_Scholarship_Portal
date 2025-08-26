import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllProgramFunds,
  getAllExpenses,
  getAllEvents,
  getPublicDashboardData,
  getProgramFundStats,
  createProgramFund,
  updateProgramFund,
  deleteProgramFund,
  createExpense,
  createEvent
} from "@/lib/program-funds-actions";

// Hook for all program funds
export function useAllProgramFunds() {
  return useQuery({
    queryKey: ["all-program-funds"],
    queryFn: () => getAllProgramFunds(),
  });
}

// Hook for all expenses
export function useAllExpenses() {
  return useQuery({
    queryKey: ["all-expenses"],
    queryFn: () => getAllExpenses(),
  });
}

// Hook for all events
export function useAllEvents() {
  return useQuery({
    queryKey: ["all-events"],
    queryFn: () => getAllEvents(),
  });
}

// Hook for public dashboard data with filters
export function usePublicDashboardData(filters?: {
  startDate?: string;
  endDate?: string;
  category?: string;
  intakeYear?: string;
}) {
  return useQuery({
    queryKey: ["public-dashboard", filters],
    queryFn: () => getPublicDashboardData(filters),
  });
}

// Hook for program fund statistics
export function useProgramFundStats() {
  return useQuery({
    queryKey: ["program-fund-stats"],
    queryFn: () => getProgramFundStats(),
  });
}

// Mutation hook for creating program funds
export function useCreateProgramFund() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ formData, userId }: { formData: FormData; userId?: string }) => 
      createProgramFund(formData, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-program-funds"] });
      queryClient.invalidateQueries({ queryKey: ["program-fund-stats"] });
      queryClient.invalidateQueries({ queryKey: ["public-dashboard"] });
    },
  });
}

// Mutation hook for updating program funds
export function useUpdateProgramFund() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) => updateProgramFund(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-program-funds"] });
      queryClient.invalidateQueries({ queryKey: ["program-fund-stats"] });
      queryClient.invalidateQueries({ queryKey: ["public-dashboard"] });
    },
  });
}

// Mutation hook for deleting program funds
export function useDeleteProgramFund() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) => deleteProgramFund(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-program-funds"] });
      queryClient.invalidateQueries({ queryKey: ["program-fund-stats"] });
      queryClient.invalidateQueries({ queryKey: ["public-dashboard"] });
    },
  });
}

// Mutation hook for creating expenses
export function useCreateExpense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ formData, userId }: { formData: FormData; userId?: string }) => 
      createExpense(formData, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["all-program-funds"] });
      queryClient.invalidateQueries({ queryKey: ["program-fund-stats"] });
      queryClient.invalidateQueries({ queryKey: ["public-dashboard"] });
    },
  });
}

// Mutation hook for creating events
export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ formData, userId }: { formData: FormData; userId?: string }) => 
      createEvent(formData, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-events"] });
      queryClient.invalidateQueries({ queryKey: ["all-program-funds"] });
      queryClient.invalidateQueries({ queryKey: ["program-fund-stats"] });
      queryClient.invalidateQueries({ queryKey: ["public-dashboard"] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAlumniPledges,
  getAlumniPayments,
  getAllPledges,
  getAllPayments,
  getPledgeStats,
  createStripePaymentIntent,
  createManualPayment,
  updatePaymentStatus,
  updatePledgeStatus
} from "@/lib/pledge-payment-actions";

// Hook for alumni pledges
export function useAlumniPledges(alumniId: string) {
  return useQuery({
    queryKey: ["alumni-pledges", alumniId],
    queryFn: () => getAlumniPledges(alumniId),
    enabled: !!alumniId,
  });
}

// Hook for alumni payments
export function useAlumniPayments(alumniId: string) {
  return useQuery({
    queryKey: ["alumni-payments", alumniId],
    queryFn: () => getAlumniPayments(alumniId),
    enabled: !!alumniId,
  });
}

// Hook for all pledges (admin/staff view)
export function useAllPledges() {
  return useQuery({
    queryKey: ["all-pledges"],
    queryFn: () => getAllPledges(),
  });
}

// Hook for all payments (admin/staff view)
export function useAllPayments() {
  return useQuery({
    queryKey: ["all-payments"],
    queryFn: () => getAllPayments(),
  });
}

// Hook for pledge statistics
export function usePledgeStats() {
  return useQuery({
    queryKey: ["pledge-stats"],
    queryFn: () => getPledgeStats(),
  });
}

// Mutation hook for creating pledges
export function useCreatePledge() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      // Call the secure API route instead of insecure server action
      const response = await fetch("/api/alumni/pledges", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create pledge");
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Extract alumniId from formData for specific invalidation
      const alumniId = variables.get("alumniId") as string;
      if (alumniId) {
        queryClient.invalidateQueries({ queryKey: ["alumni-pledges", alumniId] });
      }
      
      // Invalidate and refetch pledge data
      queryClient.invalidateQueries({ queryKey: ["all-pledges"] });
      queryClient.invalidateQueries({ queryKey: ["pledge-stats"] });
    },
  });
}

// Mutation hook for creating Stripe payment intents
export function useCreateStripePaymentIntent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) => createStripePaymentIntent(formData),
    onSuccess: (data, variables) => {
      // Extract alumniId from formData for specific invalidation
      const alumniId = variables.get("alumniId") as string;
      if (alumniId) {
        queryClient.invalidateQueries({ queryKey: ["alumni-payments", alumniId] });
      }
      
      // Invalidate and refetch payment data
      queryClient.invalidateQueries({ queryKey: ["all-payments"] });
      queryClient.invalidateQueries({ queryKey: ["pledge-stats"] });
    },
  });
}

// Mutation hook for creating manual payments
export function useCreateManualPayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) => createManualPayment(formData),
    onSuccess: (data, variables) => {
      // Extract alumniId from formData for specific invalidation
      const alumniId = variables.get("alumniId") as string;
      if (alumniId) {
        queryClient.invalidateQueries({ queryKey: ["alumni-payments", alumniId] });
      }
      
      // Invalidate and refetch payment data
      queryClient.invalidateQueries({ queryKey: ["all-payments"] });
      queryClient.invalidateQueries({ queryKey: ["pledge-stats"] });
    },
  });
}

// Mutation hook for updating payment status
export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) => updatePaymentStatus(formData),
    onSuccess: (data, variables) => {
      // Extract paymentId from formData for specific invalidation
      const paymentId = variables.get("paymentId") as string;
      if (paymentId) {
        // Invalidate specific payment queries
        queryClient.invalidateQueries({ queryKey: ["alumni-payments"] });
        queryClient.invalidateQueries({ queryKey: ["all-payments"] });
      }
      
      // Invalidate and refetch statistics
      queryClient.invalidateQueries({ queryKey: ["pledge-stats"] });
    },
  });
}

// Mutation hook for updating pledge status
export function useUpdatePledgeStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) => updatePledgeStatus(formData),
    onSuccess: (data, variables) => {
      // Extract pledgeId from formData for specific invalidation
      const pledgeId = variables.get("pledgeId") as string;
      if (pledgeId) {
        // Invalidate specific pledge queries
        queryClient.invalidateQueries({ queryKey: ["alumni-pledges"] });
        queryClient.invalidateQueries({ queryKey: ["all-pledges"] });
      }
      
      // Invalidate and refetch statistics
      queryClient.invalidateQueries({ queryKey: ["pledge-stats"] });
    },
  });
}

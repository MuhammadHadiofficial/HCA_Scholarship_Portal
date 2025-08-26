import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAlumniPledges, 
  getAlumniPayments, 
  createPledge, 
  updatePledge,
  addPayment,
  verifyPayment,
  getAlumniStats,
  getAlumniById
} from "@/lib/alumni-actions";

// Custom hook for alumni pledges
export function useAlumniPledges(alumniId: string) {
  return useQuery({
    queryKey: ["alumni-pledges", alumniId],
    queryFn: () => getAlumniPledges(alumniId),
    enabled: !!alumniId,
  });
}

// Custom hook for alumni payments
export function useAlumniPayments(alumniId: string) {
  return useQuery({
    queryKey: ["alumni-payments", alumniId],
    queryFn: () => getAlumniPayments(alumniId),
    enabled: !!alumniId,
  });
}

// Custom hook for alumni stats
export function useAlumniStats() {
  return useQuery({
    queryKey: ["alumni-stats"],
    queryFn: () => getAlumniStats(),
  });
}

// Custom hook for specific alumni
export function useAlumniById(alumniId: string) {
  return useQuery({
    queryKey: ["alumni", alumniId],
    queryFn: () => getAlumniById(alumniId),
    enabled: !!alumniId,
  });
}

// Mutation hook for creating pledges
export function useCreatePledge() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ alumniId, formData }: { alumniId: string; formData: FormData }) =>
      createPledge(alumniId, formData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch pledges
      queryClient.invalidateQueries({ queryKey: ["alumni-pledges", variables.alumniId] });
      queryClient.invalidateQueries({ queryKey: ["alumni-stats"] });
    },
  });
}

// Mutation hook for updating pledges
export function useUpdatePledge() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ pledgeId, formData }: { pledgeId: string; formData: FormData }) =>
      updatePledge(pledgeId, formData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch pledges
      queryClient.invalidateQueries({ queryKey: ["alumni-pledges"] });
      queryClient.invalidateQueries({ queryKey: ["alumni-stats"] });
    },
  });
}

// Mutation hook for adding payments
export function useAddPayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ alumniId, formData }: { alumniId: string; formData: FormData }) =>
      addPayment(alumniId, formData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch payments
      queryClient.invalidateQueries({ queryKey: ["alumni-payments", variables.alumniId] });
      queryClient.invalidateQueries({ queryKey: ["alumni-stats"] });
    },
  });
}

// Mutation hook for verifying payments
export function useVerifyPayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ paymentId, verifierId, formData }: { paymentId: string; verifierId: string; formData: FormData }) =>
      verifyPayment(paymentId, verifierId, formData),
    onSuccess: () => {
      // Invalidate and refetch payments and stats
      queryClient.invalidateQueries({ queryKey: ["alumni-payments"] });
      queryClient.invalidateQueries({ queryKey: ["alumni-stats"] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllScholarships,
  getStudentScholarships,
  getScholarshipById,
  getScholarshipStats,
  createScholarship,
  updateScholarship,
  addDisbursement,
  generateScholarshipCertificate
} from "@/lib/scholarship-actions";

// Hook for all scholarships (admin/staff view)
export function useAllScholarships() {
  return useQuery({
    queryKey: ["all-scholarships"],
    queryFn: () => getAllScholarships(),
  });
}

// Hook for student scholarships
export function useStudentScholarships(studentId: string) {
  return useQuery({
    queryKey: ["student-scholarships", studentId],
    queryFn: () => getStudentScholarships(studentId),
    enabled: !!studentId,
  });
}

// Hook for specific scholarship details
export function useScholarshipById(scholarshipId: string) {
  return useQuery({
    queryKey: ["scholarship", scholarshipId],
    queryFn: () => getScholarshipById(scholarshipId),
    enabled: !!scholarshipId,
  });
}

// Hook for scholarship statistics
export function useScholarshipStats() {
  return useQuery({
    queryKey: ["scholarship-stats"],
    queryFn: () => getScholarshipStats(),
  });
}

// Mutation hook for creating scholarships
export function useCreateScholarship() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) => createScholarship(formData),
    onSuccess: () => {
      // Invalidate and refetch scholarships
      queryClient.invalidateQueries({ queryKey: ["all-scholarships"] });
      queryClient.invalidateQueries({ queryKey: ["student-scholarships"] });
      queryClient.invalidateQueries({ queryKey: ["scholarship-stats"] });
    },
  });
}

// Mutation hook for updating scholarships
export function useUpdateScholarship() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ scholarshipId, formData }: { scholarshipId: string; formData: FormData }) =>
      updateScholarship(scholarshipId, formData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch scholarships
      queryClient.invalidateQueries({ queryKey: ["all-scholarships"] });
      queryClient.invalidateQueries({ queryKey: ["student-scholarships"] });
      queryClient.invalidateQueries({ queryKey: ["scholarship", variables.scholarshipId] });
      queryClient.invalidateQueries({ queryKey: ["scholarship-stats"] });
    },
  });
}

// Mutation hook for adding disbursements
export function useAddDisbursement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) => addDisbursement(formData),
    onSuccess: (data, variables) => {
      // Extract scholarshipId from formData for specific invalidation
      const scholarshipId = variables.get("scholarshipId") as string;
      if (scholarshipId) {
        queryClient.invalidateQueries({ queryKey: ["scholarship", scholarshipId] });
      }
      
      // Invalidate and refetch scholarships
      queryClient.invalidateQueries({ queryKey: ["all-scholarships"] });
      queryClient.invalidateQueries({ queryKey: ["student-scholarships"] });
      queryClient.invalidateQueries({ queryKey: ["scholarship-stats"] });
    },
  });
}

// Mutation hook for generating certificates
export function useGenerateCertificate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (scholarshipId: string) => generateScholarshipCertificate(scholarshipId),
    onSuccess: (data, scholarshipId) => {
      // Invalidate and refetch specific scholarship
      queryClient.invalidateQueries({ queryKey: ["scholarship", scholarshipId] });
      queryClient.invalidateQueries({ queryKey: ["student-scholarships"] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getStudentApplications, 
  createApplication,
  updateApplication,
  submitApplication,
  getActiveIntakes,
  getApplicationById
} from "@/lib/application-actions";

import { getStudentScholarships } from "@/lib/scholarship-actions";

// Custom hook for student applications
export function useStudentApplications(studentId: string) {
  return useQuery({
    queryKey: ["student-applications", studentId],
    queryFn: () => getStudentApplications(studentId),
    enabled: !!studentId,
  });
}

// Custom hook for student scholarships
export function useStudentScholarships(studentId: string) {
  return useQuery({
    queryKey: ["student-scholarships", studentId],
    queryFn: () => getStudentScholarships(studentId),
    enabled: !!studentId,
  });
}

// Custom hook for active intakes
export function useActiveIntakes() {
  return useQuery({
    queryKey: ["active-intakes"],
    queryFn: () => getActiveIntakes(),
  });
}

// Custom hook for specific application
export function useApplicationById(applicationId: string) {
  return useQuery({
    queryKey: ["application", applicationId],
    queryFn: () => getApplicationById(applicationId),
    enabled: !!applicationId,
  });
}

// Mutation hook for creating applications
export function useCreateApplication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ studentId, formData }: { studentId: string; formData: FormData }) =>
      createApplication(studentId, formData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch applications
      queryClient.invalidateQueries({ queryKey: ["student-applications", variables.studentId] });
    },
  });
}

// Mutation hook for updating applications
export function useUpdateApplication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ applicationId, formData }: { applicationId: string; formData: FormData }) =>
      updateApplication(applicationId, formData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch applications
      queryClient.invalidateQueries({ queryKey: ["student-applications"] });
      queryClient.invalidateQueries({ queryKey: ["application", variables.applicationId] });
    },
  });
}

// Mutation hook for submitting applications
export function useSubmitApplication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (applicationId: string) => submitApplication(applicationId),
    onSuccess: () => {
      // Invalidate and refetch applications
      queryClient.invalidateQueries({ queryKey: ["student-applications"] });
    },
  });
}

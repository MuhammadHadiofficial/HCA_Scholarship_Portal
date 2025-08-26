import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAllApplications,
  getApplicationById,
  addApplicationReview,
  addApplicationNote
} from "@/lib/application-actions";

// Custom hook for all applications (staff/admin view)
export function useAllApplications() {
  return useQuery({
    queryKey: ["all-applications"],
    queryFn: () => getAllApplications(),
  });
}

// Custom hook for specific application details
export function useApplicationById(applicationId: string) {
  return useQuery({
    queryKey: ["application", applicationId],
    queryFn: () => getApplicationById(applicationId),
    enabled: !!applicationId,
  });
}

// Mutation hook for adding/updating application reviews
export function useAddApplicationReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ reviewerId, formData }: { reviewerId: string; formData: FormData }) =>
      addApplicationReview(reviewerId, formData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch applications
      queryClient.invalidateQueries({ queryKey: ["all-applications"] });
      queryClient.invalidateQueries({ queryKey: ["student-applications"] });
      
      // Extract applicationId from formData for specific invalidation
      const applicationId = variables.formData.get("applicationId") as string;
      if (applicationId) {
        queryClient.invalidateQueries({ queryKey: ["application", applicationId] });
      }
    },
  });
}

// Mutation hook for adding application notes
export function useAddApplicationNote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ authorId, formData }: { authorId: string; formData: FormData }) =>
      addApplicationNote(authorId, formData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch applications
      queryClient.invalidateQueries({ queryKey: ["all-applications"] });
      queryClient.invalidateQueries({ queryKey: ["student-applications"] });
      
      // Extract applicationId from formData for specific invalidation
      const applicationId = variables.formData.get("applicationId") as string;
      if (applicationId) {
        queryClient.invalidateQueries({ queryKey: ["application", applicationId] });
      }
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllAlumniProfiles,
  getAlumniProfileById,
  getAlumniStats,
  searchAlumniProfiles,
  createAlumniProfile,
  verifyAlumniProfile,
  updateAlumniCategory
} from "@/lib/alumni-onboarding-actions";

// Hook for all alumni profiles (admin/staff view)
export function useAllAlumniProfiles() {
  return useQuery({
    queryKey: ["all-alumni-profiles"],
    queryFn: () => getAllAlumniProfiles(),
  });
}

// Hook for specific alumni profile
export function useAlumniProfileById(alumniId: string) {
  return useQuery({
    queryKey: ["alumni-profile", alumniId],
    queryFn: () => getAlumniProfileById(alumniId),
    enabled: !!alumniId,
  });
}

// Hook for alumni statistics
export function useAlumniStats() {
  return useQuery({
    queryKey: ["alumni-stats"],
    queryFn: () => getAlumniStats(),
  });
}

// Hook for searching alumni profiles
export function useSearchAlumniProfiles(query: string) {
  return useQuery({
    queryKey: ["search-alumni", query],
    queryFn: () => searchAlumniProfiles(query),
    enabled: !!query && query.length >= 2,
  });
}

// Mutation hook for creating alumni profiles
export function useCreateAlumniProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) => createAlumniProfile(formData),
    onSuccess: () => {
      // Invalidate and refetch alumni data
      queryClient.invalidateQueries({ queryKey: ["all-alumni-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["alumni-stats"] });
    },
  });
}

// Mutation hook for verifying alumni profiles
export function useVerifyAlumniProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) => verifyAlumniProfile(formData),
    onSuccess: (data, variables) => {
      // Extract alumniId from formData for specific invalidation
      const alumniId = variables.get("alumniId") as string;
      if (alumniId) {
        queryClient.invalidateQueries({ queryKey: ["alumni-profile", alumniId] });
      }
      
      // Invalidate and refetch alumni data
      queryClient.invalidateQueries({ queryKey: ["all-alumni-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["alumni-stats"] });
    },
  });
}

// Mutation hook for updating alumni categories
export function useUpdateAlumniCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) => updateAlumniCategory(formData),
    onSuccess: (data, variables) => {
      // Extract alumniId from formData for specific invalidation
      const alumniId = variables.get("alumniId") as string;
      if (alumniId) {
        queryClient.invalidateQueries({ queryKey: ["alumni-profile", alumniId] });
      }
      
      // Invalidate and refetch alumni data
      queryClient.invalidateQueries({ queryKey: ["all-alumni-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["alumni-stats"] });
    },
  });
}

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  CheckCircle, 
  Clock,
  AlertCircle,
  User,
  Building2,
  MapPin,
  Calendar
} from "lucide-react";
import AlumniOnboardingForm from "@/components/alumni/alumni-onboarding-form";
import { useAuth } from "@/contexts/auth-context";

export default function AlumniOnboardingPage() {
  const [userId, setUserId] = useState<string>("");
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
      checkExistingProfile(user.id);
    }
  }, [user]);

  const checkExistingProfile = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/alumni/profile/${id}`);
      // const data = await response.json();
      // setHasProfile(!!data.profile);
      
      // For now, simulate no existing profile
      setHasProfile(false);
    } catch (error) {
      console.error("Error checking profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "ALUMNI") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">Access Denied</div>
            <p className="text-gray-600">You must be logged in as an alumni to view this page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Profile Already Exists
                </h3>
                <p className="text-gray-600 mb-4">
                  You already have an alumni profile. You can view and edit it from your dashboard.
                </p>
                <Button asChild>
                  <a href="/dashboard/alumni">Go to Dashboard</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to the Alumni Network
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Complete your alumni profile to join our network and start contributing to student success. 
            Your profile will be reviewed and verified by our team.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Why Join Our Alumni Network?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Support Students</h3>
                <p className="text-sm text-gray-600">
                  Help current students succeed through mentoring, funding, and networking opportunities
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Professional Network</h3>
                <p className="text-sm text-gray-600">
                  Connect with fellow alumni and expand your professional network
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Stay Connected</h3>
                <p className="text-sm text-gray-600">
                  Stay updated with university news, events, and opportunities
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Process Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Complete Profile</h3>
              <p className="text-sm text-gray-600">
                Fill out your alumni profile with personal and professional information
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Review Process</h3>
              <p className="text-sm text-gray-600">
                Our team reviews your profile for verification
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Get Verified</h3>
              <p className="text-sm text-gray-600">
                Receive verification and category/rank assignment
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">4</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Start Contributing</h3>
              <p className="text-sm text-gray-600">
                Access alumni features and start making an impact
              </p>
            </div>
          </div>
        </div>

        {/* Onboarding Form */}
        <AlumniOnboardingForm 
          userId={userId}
          onSuccess={() => {
            setHasProfile(true);
          }}
        />

        {/* Additional Information */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
              <CardDescription>
                Contact our alumni relations team for assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Email: alumni@hca.edu</p>
                    <p>Phone: +1 (555) 123-4567</p>
                    <p>Office: Alumni Relations, Main Campus</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Office Hours</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p>Saturday: 10:00 AM - 2:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

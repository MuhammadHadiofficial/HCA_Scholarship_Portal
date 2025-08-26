"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  GraduationCap, 
  Building2, 
  MapPin, 
  Phone, 
  Linkedin, 
  Award,
  User,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useCreateAlumniProfile } from "@/lib/hooks/use-alumni-onboarding";

interface AlumniOnboardingFormProps {
  userId: string;
  onSuccess?: () => void;
}

export default function AlumniOnboardingForm({ userId, onSuccess }: AlumniOnboardingFormProps) {
  const [formData, setFormData] = useState({
    graduationYear: new Date().getFullYear().toString(),
    department: "",
    digitalSignature: "",
    currentEmployer: "",
    jobTitle: "",
    industry: "",
    location: "",
    phoneNumber: "",
    linkedinProfile: "",
    achievements: "",
    interests: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createAlumniProfileMutation = useCreateAlumniProfile();

  const departments = [
    "Computer Science",
    "Engineering",
    "Business Administration",
    "Arts & Humanities",
    "Social Sciences",
    "Natural Sciences",
    "Medicine",
    "Law",
    "Education",
    "Other"
  ];

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Consulting",
    "Government",
    "Non-profit",
    "Retail",
    "Other"
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.graduationYear) newErrors.graduationYear = "Graduation year is required";
      if (!formData.department) newErrors.department = "Department is required";
      if (!formData.digitalSignature) newErrors.digitalSignature = "Digital signature is required";
      
      const year = parseInt(formData.graduationYear);
      if (year < 1950 || year > new Date().getFullYear()) {
        newErrors.graduationYear = "Invalid graduation year";
      }
    }

    if (step === 2) {
      if (!formData.currentEmployer) newErrors.currentEmployer = "Current employer is required";
      if (!formData.jobTitle) newErrors.jobTitle = "Job title is required";
      if (!formData.industry) newErrors.industry = "Industry is required";
      if (!formData.location) newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("userId", userId);
    formDataToSubmit.append("graduationYear", formData.graduationYear);
    formDataToSubmit.append("department", formData.department);
    formDataToSubmit.append("digitalSignature", formData.digitalSignature);
    formDataToSubmit.append("currentEmployer", formData.currentEmployer);
    formDataToSubmit.append("jobTitle", formData.jobTitle);
    formDataToSubmit.append("industry", formData.industry);
    formDataToSubmit.append("location", formData.location);
    formDataToSubmit.append("phoneNumber", formData.phoneNumber);
    formDataToSubmit.append("linkedinProfile", formData.linkedinProfile);
    formDataToSubmit.append("achievements", formData.achievements);
    formDataToSubmit.append("interests", formData.interests);

    try {
      const result = await createAlumniProfileMutation.mutateAsync(formDataToSubmit);
      if (result.success) {
        onSuccess?.();
      }
    } catch (error) {
      console.error("Failed to create alumni profile:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (createAlumniProfileMutation.isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to the Alumni Network!
            </h3>
            <p className="text-gray-600 mb-4">
              Your alumni profile has been created successfully. You'll receive a welcome email shortly.
            </p>
            <p className="text-sm text-gray-500">
              Your profile is currently under verification. You'll be notified once it's approved.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <GraduationCap className="w-6 h-6" />
          <span>Alumni Onboarding</span>
        </CardTitle>
        <CardDescription>
          Complete your alumni profile to join our network and start contributing to student success
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-600"
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? "bg-blue-600" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="graduationYear">Graduation Year *</Label>
                  <Input
                    id="graduationYear"
                    type="number"
                    min="1950"
                    max={new Date().getFullYear()}
                    value={formData.graduationYear}
                    onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                    className={errors.graduationYear ? "border-red-500" : ""}
                  />
                  {errors.graduationYear && (
                    <p className="text-sm text-red-500 mt-1">{errors.graduationYear}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={(value) => handleInputChange("department", value)}
                  >
                    <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <p className="text-sm text-red-500 mt-1">{errors.department}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="digitalSignature">Digital Signature *</Label>
                <Textarea
                  id="digitalSignature"
                  placeholder="Enter your digital signature or a unique identifier..."
                  value={formData.digitalSignature}
                  onChange={(e) => handleInputChange("digitalSignature", e.target.value)}
                  className={errors.digitalSignature ? "border-red-500" : ""}
                  rows={3}
                />
                {errors.digitalSignature && (
                  <p className="text-sm text-red-500 mt-1">{errors.digitalSignature}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  This will be used as your unique identifier in the alumni network
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Professional Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Professional Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentEmployer">Current Employer *</Label>
                  <Input
                    id="currentEmployer"
                    placeholder="Company or organization name"
                    value={formData.currentEmployer}
                    onChange={(e) => handleInputChange("currentEmployer", e.target.value)}
                    className={errors.currentEmployer ? "border-red-500" : ""}
                  />
                  {errors.currentEmployer && (
                    <p className="text-sm text-red-500 mt-1">{errors.currentEmployer}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    placeholder="Your current position"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                    className={errors.jobTitle ? "border-red-500" : ""}
                  />
                  {errors.jobTitle && (
                    <p className="text-sm text-red-500 mt-1">{errors.jobTitle}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select 
                    value={formData.industry} 
                    onValueChange={(value) => handleInputChange("industry", value)}
                  >
                    <SelectTrigger className={errors.industry ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.industry && (
                    <p className="text-sm text-red-500 mt-1">{errors.industry}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className={errors.location ? "border-red-500" : ""}
                  />
                  {errors.location && (
                    <p className="text-sm text-red-500 mt-1">{errors.location}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="linkedinProfile">LinkedIn Profile</Label>
                  <Input
                    id="linkedinProfile"
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedinProfile}
                    onChange={(e) => handleInputChange("linkedinProfile", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Additional Information */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              
              <div>
                <Label htmlFor="achievements">Professional Achievements</Label>
                <Textarea
                  id="achievements"
                  placeholder="Share your key achievements, awards, or notable projects..."
                  value={formData.achievements}
                  onChange={(e) => handleInputChange("achievements", e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This helps us understand your expertise and potential contribution areas
                </p>
              </div>

              <div>
                <Label htmlFor="interests">Areas of Interest</Label>
                <Textarea
                  id="interests"
                  placeholder="What areas would you like to contribute to? (e.g., mentoring, funding, events, networking)"
                  value={formData.interests}
                  onChange={(e) => handleInputChange("interests", e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This helps us match you with relevant opportunities
                </p>
              </div>

              <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  Your profile will be reviewed by our team. You'll receive an email once it's verified.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={createAlumniProfileMutation.isPending}
              >
                {createAlumniProfileMutation.isPending ? "Creating Profile..." : "Complete Onboarding"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

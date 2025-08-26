"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCreateApplication, useActiveIntakes } from "@/lib/hooks/use-student-data";
import FileUpload from "@/components/ui/file-upload";

export default function NewApplicationPage() {
  const [error, setError] = useState("");
  const [utilityBills, setUtilityBills] = useState<File[]>([]);
  const [additionalDocuments, setAdditionalDocuments] = useState<File[]>([]);
  const searchParams = useSearchParams();
  const selectedIntakeId = searchParams.get("intake");

  const { data: intakesData } = useActiveIntakes();
  const intakes = intakesData?.intakes || [];
  
  const createApplicationMutation = useCreateApplication();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      
      // Add the files from state to the FormData
      utilityBills.forEach((file) => {
        formData.append(`utilityBills`, file);
      });
      
      additionalDocuments.forEach((file) => {
        formData.append(`additionalDocuments`, file);
      });

      // TODO: Get actual student ID from auth context
      const studentId = "STU001"; // This should come from auth
      
      const result = await createApplicationMutation.mutateAsync({ studentId, formData });

      if (result.error) {
        setError(result.error);
      } else {
        // Redirect to applications list
        window.location.href = "/dashboard/student/applications";
      }
    } catch (error) {
      setError("Failed to create application");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            New Scholarship Application
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Complete your scholarship application for the selected intake
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {/* Intake Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Intake Selection</CardTitle>
                <CardDescription>
                  Choose the intake period for your scholarship application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="intakeId">Intake Period</Label>
                    <Select name="intakeId" defaultValue={selectedIntakeId || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an intake period" />
                      </SelectTrigger>
                      <SelectContent>
                        {intakes.map((intake) => (
                          <SelectItem key={intake.id} value={intake.id}>
                            {intake.name} - {intake.semester} {intake.year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Your basic personal details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      placeholder="Emergency contact number"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Enter your complete address"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
                <CardDescription>
                  Your academic details and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cgpa">CGPA</Label>
                    <Input
                      id="cgpa"
                      name="cgpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      placeholder="Enter your CGPA"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="meritListNumber">Merit List Number</Label>
                    <Input
                      id="meritListNumber"
                      name="meritListNumber"
                      placeholder="Enter merit list number (if applicable)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentSemester">Current Semester</Label>
                    <Select name="currentSemester">
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Semester</SelectItem>
                        <SelectItem value="2">2nd Semester</SelectItem>
                        <SelectItem value="3">3rd Semester</SelectItem>
                        <SelectItem value="4">4th Semester</SelectItem>
                        <SelectItem value="5">5th Semester</SelectItem>
                        <SelectItem value="6">6th Semester</SelectItem>
                        <SelectItem value="7">7th Semester</SelectItem>
                        <SelectItem value="8">8th Semester</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select name="department">
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                        <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                        <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                        <SelectItem value="Business Administration">Business Administration</SelectItem>
                        <SelectItem value="Economics">Economics</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="enrollmentYear">Enrollment Year</Label>
                    <Input
                      id="enrollmentYear"
                      name="enrollmentYear"
                      type="number"
                      min="2020"
                      max="2024"
                      placeholder="Enter enrollment year"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Information</CardTitle>
                <CardDescription>
                  Your family's financial situation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="familyIncome">Annual Family Income</Label>
                    <Input
                      id="familyIncome"
                      name="familyIncome"
                      type="number"
                      placeholder="Enter annual family income"
                      required
                    />
                  </div>
                  <div>
                    <FileUpload
                      onFilesSelected={setUtilityBills}
                      acceptedTypes={[".pdf", ".jpg", ".jpeg", ".png"]}
                      maxFiles={5}
                      maxSize={10}
                      label="Utility Bills"
                      description="Upload electricity, gas, water, and other utility bills"
                    />
                  </div>
                  <div>
                    <FileUpload
                      onFilesSelected={setAdditionalDocuments}
                      acceptedTypes={[".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"]}
                      maxFiles={10}
                      maxSize={20}
                      label="Additional Documents"
                      description="Upload any additional supporting documents"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Goals and Motivation */}
            <Card>
              <CardHeader>
                <CardTitle>Goals and Motivation</CardTitle>
                <CardDescription>
                  Tell us about your goals and why you need this scholarship
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="goals">Academic and Career Goals</Label>
                  <Textarea
                    id="goals"
                    name="goals"
                    placeholder="Describe your academic and career goals, and how this scholarship will help you achieve them..."
                    rows={6}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <p className="text-red-600">{error}</p>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={createApplicationMutation.isPending}
                className="flex-1"
              >
                {createApplicationMutation.isPending ? "Creating Application..." : "Create Application"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

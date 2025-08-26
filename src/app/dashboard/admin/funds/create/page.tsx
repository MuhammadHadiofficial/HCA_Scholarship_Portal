"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft,
  DollarSign,
  Plus,
  Save,
  Calendar,
  Target,
  Users,
  Building2,
  Info
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminCreateFundPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    totalAmount: "",
    allocationType: "",
    maxAllocationPerStudent: "",
    startDate: "",
    endDate: "",
    eligibilityCriteria: "",
    applicationDeadline: "",
    isRecurring: false,
    recurrenceFrequency: "",
    maxRecurrences: "",
    departmentRestrictions: [] as string[],
    yearRestrictions: [] as string[],
    cgpaRequirement: "",
    meritRankRequirement: "",
    financialNeedRequired: false,
    documentsRequired: [] as string[],
    notes: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: "MERIT_SCHOLARSHIP", label: "Merit Scholarship", description: "Based on academic performance" },
    { value: "NEED_BASED", label: "Need-Based", description: "Based on financial need" },
    { value: "STUDENT_WELFARE", label: "Student Welfare", description: "Emergency and welfare support" },
    { value: "LEARNING_PROGRAMS", label: "Learning Programs", description: "Educational programs and events" },
    { value: "RESEARCH", label: "Research", description: "Research and development support" },
    { value: "INTERNATIONAL", label: "International", description: "International student support" },
    { value: "SPECIAL_TALENT", label: "Special Talent", description: "Arts, sports, and special skills" }
  ];

  const allocationTypes = [
    { value: "FULL_SEMESTER", label: "Full Semester Fee", description: "Covers complete semester tuition" },
    { value: "PARTIAL_SEMESTER", label: "Partial Semester Fee", description: "Covers portion of semester tuition" },
    { value: "FIXED_AMOUNT", label: "Fixed Amount", description: "Fixed scholarship amount" },
    { value: "PERCENTAGE", label: "Percentage Based", description: "Percentage of tuition fees" },
    { value: "EMERGENCY", label: "Emergency Support", description: "One-time emergency assistance" }
  ];

  const recurrenceFrequencies = [
    { value: "NONE", label: "One-time only" },
    { value: "SEMESTER", label: "Per semester" },
    { value: "YEARLY", label: "Per year" },
    { value: "MONTHLY", label: "Per month" }
  ];

  const departments = [
    { value: "Computer Science", label: "Computer Science" },
    { value: "Engineering", label: "Engineering" },
    { value: "Business", label: "Business" },
    { value: "Medicine", label: "Medicine" },
    { value: "Arts", label: "Arts" },
    { value: "Law", label: "Law" },
    { value: "Education", label: "Education" },
    { value: "ALL", label: "All Departments" }
  ];

  const years = [
    { value: "1st Year", label: "1st Year" },
    { value: "2nd Year", label: "2nd Year" },
    { value: "3rd Year", label: "3rd Year" },
    { value: "4th Year", label: "4th Year" },
    { value: "5th Year", label: "5th Year" },
    { value: "ALL", label: "All Years" }
  ];

  const documentTypes = [
    { value: "TRANSCRIPT", label: "Academic Transcript" },
    { value: "INCOME_CERTIFICATE", label: "Income Certificate" },
    { value: "UTILITY_BILLS", label: "Utility Bills" },
    { value: "BANK_STATEMENTS", label: "Bank Statements" },
    { value: "FAMILY_DETAILS", label: "Family Details" },
    { value: "RECOMMENDATION_LETTERS", label: "Recommendation Letters" },
    { value: "PORTFOLIO", label: "Portfolio/Work Samples" },
    { value: "MEDICAL_CERTIFICATE", label: "Medical Certificate" }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleArrayChange = (field: string, value: string, action: "add" | "remove") => {
    setFormData(prev => ({
      ...prev,
      [field]: action === "add" 
        ? [...prev[field as keyof typeof prev] as string[], value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = "Fund name is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.totalAmount) newErrors.totalAmount = "Total amount is required";
    if (!formData.allocationType) newErrors.allocationType = "Allocation type is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    
    if (formData.totalAmount && parseFloat(formData.totalAmount) <= 0) {
      newErrors.totalAmount = "Amount must be greater than 0";
    }
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    
    if (formData.isRecurring && !formData.recurrenceFrequency) {
      newErrors.recurrenceFrequency = "Recurrence frequency is required for recurring funds";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // TODO: Implement fund creation logic
      console.log("Fund data:", formData);
    }
  };

  const calculateEstimatedStudents = () => {
    if (!formData.totalAmount || !formData.maxAllocationPerStudent) return 0;
    const total = parseFloat(formData.totalAmount);
    const maxPerStudent = parseFloat(formData.maxAllocationPerStudent);
    return Math.floor(total / maxPerStudent);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/admin/funds">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Funds
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Fund</h1>
            <p className="text-gray-600 mt-2">Set up a new scholarship fund with detailed configuration</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span>Fund Configuration</span>
              </CardTitle>
              <CardDescription>Configure the new scholarship fund with all necessary details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Fund Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="e.g., Merit Excellence Fund"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            <div>
                              <div className="font-medium">{category.label}</div>
                              <div className="text-sm text-gray-500">{category.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                    placeholder="Describe the purpose and goals of this fund..."
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
              </div>

              {/* Financial Configuration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Financial Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="totalAmount">Total Fund Amount ($) *</Label>
                    <Input
                      id="totalAmount"
                      type="number"
                      value={formData.totalAmount}
                      onChange={(e) => handleInputChange("totalAmount", e.target.value)}
                      placeholder="e.g., 50000"
                      min="0"
                      step="0.01"
                      className={errors.totalAmount ? "border-red-500" : ""}
                    />
                    {errors.totalAmount && <p className="text-red-500 text-sm mt-1">{errors.totalAmount}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="allocationType">Allocation Type *</Label>
                    <Select value={formData.allocationType} onValueChange={(value) => handleInputChange("allocationType", value)}>
                      <SelectTrigger className={errors.allocationType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {allocationTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-sm text-gray-500">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.allocationType && <p className="text-red-500 text-sm mt-1">{errors.allocationType}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="maxAllocationPerStudent">Max Per Student ($)</Label>
                    <Input
                      id="maxAllocationPerStudent"
                      type="number"
                      value={formData.maxAllocationPerStudent}
                      onChange={(e) => handleInputChange("maxAllocationPerStudent", e.target.value)}
                      placeholder="e.g., 5000"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                {formData.totalAmount && formData.maxAllocationPerStudent && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-blue-800">
                      <Info className="w-4 h-4" />
                      <span className="text-sm font-medium">Estimated Impact:</span>
                      <span className="text-sm">
                        This fund can support approximately {calculateEstimatedStudents()} students
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline Configuration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Timeline Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                      className={errors.startDate ? "border-red-500" : ""}
                    />
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange("endDate", e.target.value)}
                      className={errors.endDate ? "border-red-500" : ""}
                    />
                    {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="applicationDeadline">Application Deadline</Label>
                    <Input
                      id="applicationDeadline"
                      type="date"
                      value={formData.applicationDeadline}
                      onChange={(e) => handleInputChange("applicationDeadline", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isRecurring"
                      checked={formData.isRecurring}
                      onChange={(e) => handleInputChange("isRecurring", e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="isRecurring">This is a recurring fund</Label>
                  </div>
                  
                  {formData.isRecurring && (
                    <div className="flex items-center space-x-2">
                      <Select value={formData.recurrenceFrequency} onValueChange={(value) => handleInputChange("recurrenceFrequency", value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {recurrenceFrequencies.map(freq => (
                            <SelectItem key={freq.value} value={freq.value}>
                              {freq.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Input
                        type="number"
                        placeholder="Max times"
                        value={formData.maxRecurrences}
                        onChange={(e) => handleInputChange("maxRecurrences", e.target.value)}
                        className="w-24"
                        min="1"
                      />
                    </div>
                  )}
                </div>
                
                {errors.recurrenceFrequency && (
                  <p className="text-red-500 text-sm">{errors.recurrenceFrequency}</p>
                )}
              </div>

              {/* Eligibility Criteria */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Eligibility Criteria</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="cgpaRequirement">Minimum CGPA</Label>
                    <Input
                      id="cgpaRequirement"
                      type="number"
                      value={formData.cgpaRequirement}
                      onChange={(e) => handleInputChange("cgpaRequirement", e.target.value)}
                      placeholder="e.g., 3.0"
                      min="0"
                      max="4"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="meritRankRequirement">Maximum Merit Rank</Label>
                    <Input
                      id="meritRankRequirement"
                      type="number"
                      value={formData.meritRankRequirement}
                      onChange={(e) => handleInputChange("meritRankRequirement", e.target.value)}
                      placeholder="e.g., 100"
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="financialNeedRequired"
                    checked={formData.financialNeedRequired}
                    onChange={(e) => handleInputChange("financialNeedRequired", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="financialNeedRequired">Financial need verification required</Label>
                </div>
                
                <div>
                  <Label htmlFor="eligibilityCriteria">Additional Eligibility Criteria</Label>
                  <Textarea
                    id="eligibilityCriteria"
                    value={formData.eligibilityCriteria}
                    onChange={(e) => handleInputChange("eligibilityCriteria", e.target.value)}
                    rows={3}
                    placeholder="Any additional eligibility requirements..."
                  />
                </div>
              </div>

              {/* Restrictions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Restrictions & Requirements</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Department Restrictions</Label>
                    <div className="space-y-2 mt-2">
                      {departments.map(dept => (
                        <div key={dept.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`dept-${dept.value}`}
                            checked={formData.departmentRestrictions.includes(dept.value)}
                            onChange={(e) => handleArrayChange(
                              "departmentRestrictions", 
                              dept.value, 
                              e.target.checked ? "add" : "remove"
                            )}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`dept-${dept.value}`} className="text-sm">{dept.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Year Restrictions</Label>
                    <div className="space-y-2 mt-2">
                      {years.map(year => (
                        <div key={year.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`year-${year.value}`}
                            checked={formData.yearRestrictions.includes(year.value)}
                            onChange={(e) => handleArrayChange(
                              "yearRestrictions", 
                              year.value, 
                              e.target.checked ? "add" : "remove"
                            )}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`year-${year.value}`} className="text-sm">{year.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Required Documents</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {documentTypes.map(doc => (
                      <div key={doc.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`doc-${doc.value}`}
                          checked={formData.documentsRequired.includes(doc.value)}
                          onChange={(e) => handleArrayChange(
                            "documentsRequired", 
                            doc.value, 
                            e.target.checked ? "add" : "remove"
                          )}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={`doc-${doc.value}`} className="text-sm">{doc.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>
                
                <div>
                  <Label htmlFor="notes">Notes & Instructions</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={3}
                    placeholder="Any additional notes, special instructions, or internal comments..."
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-between pt-6">
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/admin/funds">Cancel</Link>
                </Button>
                
                <div className="space-x-3">
                  <Button type="button" variant="outline">
                    <Target className="w-4 h-4 mr-2" />
                    Preview Fund
                  </Button>
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Create Fund
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

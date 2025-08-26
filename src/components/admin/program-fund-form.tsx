"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  DollarSign, 
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { useCreateProgramFund, useUpdateProgramFund } from "@/lib/hooks/use-program-funds";

interface ProgramFundFormProps {
  fund?: any;
  userId?: string;
  onSuccess?: () => void;
}

export default function ProgramFundForm({ fund, onSuccess }: ProgramFundFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    category: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createProgramFundMutation = useCreateProgramFund();
  const updateProgramFundMutation = useUpdateProgramFund();

  const categories = [
    "Student Welfare",
    "Learning Programs", 
    "Events",
    "Hackathons",
    "Courses",
    "Skills Development",
    "Student Support",
    "Research",
    "Innovation",
    "Emergency Assistance",
    "Travel Grants",
    "Conference Support"
  ];

  useEffect(() => {
    if (fund) {
      setFormData({
        name: fund.name || "",
        description: fund.description || "",
        amount: fund.amount?.toString() || "",
        category: fund.category || "",
        isActive: fund.isActive ?? true,
      });
    }
  }, [fund]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Fund name is required";
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = "Amount must be a positive number";
      }
      if (amount < 100) {
        newErrors.amount = "Minimum fund amount is 100";
      }
      if (amount > 10000000) {
        newErrors.amount = "Maximum fund amount is 10,000,000";
      }
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name.trim());
    formDataToSubmit.append("description", formData.description.trim());
    formDataToSubmit.append("amount", formData.amount);
    formDataToSubmit.append("category", formData.category);
    formDataToSubmit.append("isActive", formData.isActive.toString());

    try {
      let result;
      if (fund) {
        formDataToSubmit.append("id", fund.id);
        result = await updateProgramFundMutation.mutateAsync(formDataToSubmit);
      } else {
        result = await createProgramFundMutation.mutateAsync({ formData: formDataToSubmit, userId });
      }

      if (result.success) {
        onSuccess?.();
      }
    } catch (error) {
      console.error("Failed to save program fund:", error);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const isSubmitting = createProgramFundMutation.isPending || updateProgramFundMutation.isPending;

  if (createProgramFundMutation.isSuccess || updateProgramFundMutation.isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Program Fund {fund ? "Updated" : "Created"} Successfully!
            </h3>
            <p className="text-gray-600 mb-4">
              The program fund has been {fund ? "updated" : "created"} and is now active.
            </p>
            <p className="text-sm text-gray-500">
              You can now allocate funds and track expenses for this program.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="w-6 h-6" />
          <span>{fund ? "Edit Program Fund" : "Create New Program Fund"}</span>
        </CardTitle>
        <CardDescription>
          {fund ? "Update the program fund details" : "Set up a new program fund for student support"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fund Name */}
          <div>
            <Label htmlFor="name">Fund Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Student Welfare Fund, Learning Programs Fund"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Choose a clear, descriptive name for the fund
            </p>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the purpose and scope of this fund..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Provide details about how this fund will be used
            </p>
          </div>

          {/* Amount and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Fund Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  min="100"
                  max="10000000"
                  step="100"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  className={`pl-8 ${errors.amount ? "border-red-500" : ""}`}
                />
              </div>
              {errors.amount && (
                <p className="text-sm text-red-500 mt-1">{errors.amount}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Minimum: $100, Maximum: $10,000,000
              </p>
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500 mt-1">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange("isActive", checked)}
            />
            <Label htmlFor="isActive">Active Fund</Label>
          </div>
          <p className="text-xs text-gray-500">
            Active funds can receive allocations and expenses. Inactive funds are read-only.
          </p>

          {/* Information Alert */}
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              <strong>Fund Management:</strong> Once created, this fund will be available for 
              expense allocation. You can track spending, remaining amounts, and fund utilization 
              in real-time through the admin dashboard.
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting 
                ? (fund ? "Updating..." : "Creating...") 
                : (fund ? "Update Fund" : "Create Fund")
              }
            </Button>
          </div>

          {/* Error Display */}
          {(createProgramFundMutation.error || updateProgramFundMutation.error) && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Failed to {fund ? "update" : "create"} program fund. Please try again.
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, 
  CheckCircle,
  AlertCircle,
  Info,
  DollarSign
} from "lucide-react";
import { useCreateEvent } from "@/lib/hooks/use-program-funds";
import { useAllProgramFunds } from "@/lib/hooks/use-program-funds";

interface EventFormProps {
  event?: any;
  userId?: string;
  onSuccess?: () => void;
}

export default function EventForm({ event, onSuccess }: EventFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    eventDate: new Date().toISOString().split('T')[0],
    requiredFunds: "",
    intakeId: "",
    programFundId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createEventMutation = useCreateEvent();
  const { data: fundsData } = useAllProgramFunds();

  const funds = fundsData?.funds || [];

  // Mock intake data - replace with real data later
  const intakes = [
    { id: "INT001", name: "Fall 2024", year: "2024", semester: "Fall" },
    { id: "INT002", name: "Spring 2024", year: "2024", semester: "Spring" },
    { id: "INT003", name: "Fall 2023", year: "2023", semester: "Fall" },
    { id: "INT004", name: "Spring 2023", year: "2023", semester: "Spring" },
  ];

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || "",
        description: event.description || "",
        eventDate: event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        requiredFunds: event.requiredFunds?.toString() || "",
        intakeId: event.intakeId || "",
        programFundId: event.programFundId || "",
      });
    }
  }, [event]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Event name is required";
    }

    if (!formData.eventDate) {
      newErrors.eventDate = "Event date is required";
    } else {
      const eventDate = new Date(formData.eventDate);
      const today = new Date();
      if (eventDate < today) {
        newErrors.eventDate = "Event date cannot be in the past";
      }
    }

    if (!formData.requiredFunds) {
      newErrors.requiredFunds = "Required funds amount is required";
    } else {
      const amount = parseFloat(formData.requiredFunds);
      if (isNaN(amount) || amount <= 0) {
        newErrors.requiredFunds = "Required funds must be a positive number";
      }
      if (amount < 1) {
        newErrors.requiredFunds = "Minimum required funds is 1";
      }
    }

    // Check if selected fund has sufficient remaining amount
    if (formData.programFundId && formData.requiredFunds) {
      const selectedFund = funds.find(f => f.id === formData.programFundId);
      if (selectedFund) {
        const amount = parseFloat(formData.requiredFunds);
        if (amount > selectedFund.remainingAmount) {
          newErrors.requiredFunds = `Insufficient funds. Available: $${selectedFund.remainingAmount.toLocaleString()}`;
        }
      }
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
    formDataToSubmit.append("eventDate", formData.eventDate);
    formDataToSubmit.append("requiredFunds", formData.requiredFunds);
    if (formData.intakeId) {
      formDataToSubmit.append("intakeId", formData.intakeId);
    }
    if (formData.programFundId) {
      formDataToSubmit.append("programFundId", formData.programFundId);
    }

    try {
      const result = await createEventMutation.mutateAsync({ formData: formDataToSubmit, userId });
      if (result.success) {
        onSuccess?.();
      }
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const selectedFund = funds.find(f => f.id === formData.programFundId);

  if (createEventMutation.isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Event Created Successfully!
            </h3>
            <p className="text-gray-600 mb-4">
              The event has been created and funds have been allocated.
            </p>
            <p className="text-sm text-gray-500">
              The event status has been updated to "FUNDED".
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
          <Calendar className="w-6 h-6" />
          <span>Create New Event</span>
        </CardTitle>
        <CardDescription>
          Plan and fund events for students
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Name */}
          <div>
            <Label htmlFor="name">Event Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Annual Hackathon, Student Conference, Skills Workshop"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Choose a clear, descriptive name for the event
            </p>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Event Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the event, its purpose, and expected outcomes..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Provide details about the event format, participants, and goals
            </p>
          </div>

          {/* Event Date and Required Funds */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="eventDate">Event Date *</Label>
              <Input
                id="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={(e) => handleInputChange("eventDate", e.target.value)}
                className={errors.eventDate ? "border-red-500" : ""}
              />
              {errors.eventDate && (
                <p className="text-sm text-red-500 mt-1">{errors.eventDate}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Event date must be in the future
              </p>
            </div>

            <div>
              <Label htmlFor="requiredFunds">Required Funds *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="requiredFunds"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.requiredFunds}
                  onChange={(e) => handleInputChange("requiredFunds", e.target.value)}
                  className={`pl-8 ${errors.requiredFunds ? "border-red-500" : ""}`}
                />
              </div>
              {errors.requiredFunds && (
                <p className="text-sm text-red-500 mt-1">{errors.requiredFunds}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Minimum: $1
              </p>
            </div>
          </div>

          {/* Intake and Program Fund */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="intakeId">Intake (Optional)</Label>
              <Select 
                value={formData.intakeId} 
                onValueChange={(value) => handleInputChange("intakeId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select intake" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No specific intake</SelectItem>
                  {intakes.map((intake) => (
                    <SelectItem key={intake.id} value={intake.id}>
                      {intake.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Optional: Link event to specific intake year
              </p>
            </div>

            <div>
              <Label htmlFor="programFundId">Program Fund (Optional)</Label>
              <Select 
                value={formData.programFundId} 
                onValueChange={(value) => handleInputChange("programFundId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select program fund" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No specific fund</SelectItem>
                  {funds
                    .filter(fund => fund.isActive && fund.remainingAmount > 0)
                    .map((fund) => (
                      <SelectItem key={fund.id} value={fund.id}>
                        <div>
                          <div className="font-medium">{fund.name}</div>
                          <div className="text-sm text-gray-500">
                            Available: ${fund.remainingAmount.toLocaleString()}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Optional: Allocate funds from specific program fund
              </p>
            </div>
          </div>

          {/* Fund Information */}
          {selectedFund && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Selected Fund Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <span className="font-medium">Category:</span> {selectedFund.category}
                </div>
                <div>
                  <span className="font-medium">Total Amount:</span> ${selectedFund.amount.toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Allocated:</span> ${selectedFund.allocatedAmount.toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Remaining:</span> ${selectedFund.remainingAmount.toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Information Alert */}
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              <strong>Event Funding:</strong> If you select a program fund, the required funds will be 
              automatically allocated and the event status will be set to "FUNDED". If no fund is selected, 
              the event will be created with "PLANNING" status and can be funded later.
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Button
              type="submit"
              disabled={createEventMutation.isPending}
              className="w-full md:w-auto"
            >
              {createEventMutation.isPending ? "Creating Event..." : "Create Event"}
            </Button>
          </div>

          {/* Error Display */}
          {createEventMutation.error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Failed to create event. Please try again.
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

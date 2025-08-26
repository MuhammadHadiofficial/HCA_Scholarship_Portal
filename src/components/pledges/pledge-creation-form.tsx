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
  DollarSign, 
  Calendar, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { useCreatePledge } from "@/lib/hooks/use-pledge-payment";

interface PledgeCreationFormProps {
  alumniId: string;
  onSuccess?: () => void;
}

export default function PledgeCreationForm({ alumniId, onSuccess }: PledgeCreationFormProps) {
  const [formData, setFormData] = useState({
    amount: "",
    currency: "USD",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createPledgeMutation = useCreatePledge();

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
    { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = "Amount must be a positive number";
      }
      if (amount < 1) {
        newErrors.amount = "Minimum pledge amount is 1";
      }
      if (amount > 1000000) {
        newErrors.amount = "Maximum pledge amount is 1,000,000";
      }
    }

    if (!formData.currency) {
      newErrors.currency = "Currency is required";
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
    formDataToSubmit.append("alumniId", alumniId);
    formDataToSubmit.append("amount", formData.amount);
    formDataToSubmit.append("currency", formData.currency);
    formDataToSubmit.append("notes", formData.notes);

    try {
      const result = await createPledgeMutation.mutateAsync(formDataToSubmit);
      if (result.success) {
        // Reset form
        setFormData({
          amount: "",
          currency: "USD",
          notes: "",
        });
        setErrors({});
        onSuccess?.();
      }
    } catch (error) {
      console.error("Failed to create pledge:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (createPledgeMutation.isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Pledge Created Successfully!
            </h3>
            <p className="text-gray-600 mb-4">
              Your pledge has been recorded and will be reviewed by our team.
            </p>
            <p className="text-sm text-gray-500">
              You'll receive a confirmation email shortly with pledge details.
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
          <span>Create New Pledge</span>
        </CardTitle>
        <CardDescription>
          Make a pledge to support student scholarships and programs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount and Currency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Pledge Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {currencies.find(c => c.code === formData.currency)?.symbol || "$"}
                </span>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  max="1000000"
                  step="0.01"
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
                Minimum: 1, Maximum: 1,000,000
              </p>
            </div>

            <div>
              <Label htmlFor="currency">Currency *</Label>
              <Select 
                value={formData.currency} 
                onValueChange={(value) => handleInputChange("currency", value)}
              >
                <SelectTrigger className={errors.currency ? "border-red-500" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.currency && (
                <p className="text-sm text-red-500 mt-1">{errors.currency}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Tell us about your pledge or any specific areas you'd like to support..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Share your motivation or specify programs you'd like to support
            </p>
          </div>

          {/* Information Alert */}
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              <strong>How pledges work:</strong> Your pledge is a commitment to contribute. 
              You can fulfill it through various payment methods including Stripe, bank transfer, 
              or other arrangements. Our team will contact you to discuss payment options.
            </AlertDescription>
          </Alert>

          {/* Benefits */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3">Your Impact</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>Support student scholarships</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>Fund learning programs</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>Enable student welfare</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>Build stronger community</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={createPledgeMutation.isPending}
              className="w-full md:w-auto"
            >
              {createPledgeMutation.isPending ? "Creating Pledge..." : "Create Pledge"}
            </Button>
          </div>

          {/* Error Display */}
          {createPledgeMutation.error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Failed to create pledge. Please try again.
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

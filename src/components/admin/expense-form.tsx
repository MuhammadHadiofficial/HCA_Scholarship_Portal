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
  TrendingDown, 
  CheckCircle,
  AlertCircle,
  Info,
  DollarSign
} from "lucide-react";
import { useCreateExpense } from "@/lib/hooks/use-program-funds";
import { useAllProgramFunds } from "@/lib/hooks/use-program-funds";

interface ExpenseFormProps {
  expense?: any;
  userId?: string;
  onSuccess?: () => void;
}

export default function ExpenseForm({ expense, onSuccess }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    programFundId: "",
    amount: "",
    description: "",
    expenseDate: new Date().toISOString().split('T')[0],
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createExpenseMutation = useCreateExpense();
  const { data: fundsData } = useAllProgramFunds();

  const funds = fundsData?.funds || [];

  useEffect(() => {
    if (expense) {
      setFormData({
        programFundId: expense.programFundId || "",
        amount: expense.amount?.toString() || "",
        description: expense.description || "",
        expenseDate: expense.expenseDate ? new Date(expense.expenseDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: expense.notes || "",
      });
    }
  }, [expense]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.programFundId) {
      newErrors.programFundId = "Program fund is required";
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = "Amount must be a positive number";
      }
      if (amount < 1) {
        newErrors.amount = "Minimum expense amount is 1";
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.expenseDate) {
      newErrors.expenseDate = "Expense date is required";
    }

    // Check if selected fund has sufficient remaining amount
    if (formData.programFundId && formData.amount) {
      const selectedFund = funds.find(f => f.id === formData.programFundId);
      if (selectedFund) {
        const amount = parseFloat(formData.amount);
        if (amount > selectedFund.remainingAmount) {
          newErrors.amount = `Insufficient funds. Available: $${selectedFund.remainingAmount.toLocaleString()}`;
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
    formDataToSubmit.append("programFundId", formData.programFundId);
    formDataToSubmit.append("amount", formData.amount);
    formDataToSubmit.append("description", formData.description.trim());
    formDataToSubmit.append("expenseDate", formData.expenseDate);
    formDataToSubmit.append("notes", formData.notes.trim());

    try {
      const result = await createExpenseMutation.mutateAsync({ formData: formDataToSubmit, userId });
      if (result.success) {
        onSuccess?.();
      }
    } catch (error) {
      console.error("Failed to create expense:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const selectedFund = funds.find(f => f.id === formData.programFundId);

  if (createExpenseMutation.isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Expense Created Successfully!
            </h3>
            <p className="text-gray-600 mb-4">
              The expense has been recorded and funds have been allocated.
            </p>
            <p className="text-sm text-gray-500">
              The program fund balance has been updated accordingly.
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
          <TrendingDown className="w-6 h-6" />
          <span>Create New Expense</span>
        </CardTitle>
        <CardDescription>
          Record an expense against a program fund
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Program Fund Selection */}
          <div>
            <Label htmlFor="programFundId">Program Fund *</Label>
            <Select 
              value={formData.programFundId} 
              onValueChange={(value) => handleInputChange("programFundId", value)}
            >
              <SelectTrigger className={errors.programFundId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a program fund" />
              </SelectTrigger>
              <SelectContent>
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
            {errors.programFundId && (
              <p className="text-sm text-red-500 mt-1">{errors.programFundId}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Only active funds with available balance are shown
            </p>
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

          {/* Amount and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Expense Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  min="1"
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
              {selectedFund && (
                <p className="text-xs text-gray-500 mt-1">
                  Maximum: ${selectedFund.remainingAmount.toLocaleString()}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="expenseDate">Expense Date *</Label>
              <Input
                id="expenseDate"
                type="date"
                value={formData.expenseDate}
                onChange={(e) => handleInputChange("expenseDate", e.target.value)}
                className={errors.expenseDate ? "border-red-500" : ""}
              />
              {errors.expenseDate && (
                <p className="text-sm text-red-500 mt-1">{errors.expenseDate}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Expense Description *</Label>
            <Input
              id="description"
              placeholder="e.g., Student workshop materials, Event catering, Travel expenses"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Provide a clear description of what this expense covers
            </p>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional details, receipts, or context..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Include receipt numbers, vendor details, or other relevant information
            </p>
          </div>

          {/* Information Alert */}
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              <strong>Expense Recording:</strong> This expense will be deducted from the selected 
              program fund's remaining balance. The fund's allocated and remaining amounts will be 
              updated automatically. Ensure all expenses are properly documented and approved.
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Button
              type="submit"
              disabled={createExpenseMutation.isPending}
              className="w-full md:w-auto"
            >
              {createExpenseMutation.isPending ? "Creating Expense..." : "Create Expense"}
            </Button>
          </div>

          {/* Error Display */}
          {createExpenseMutation.error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Failed to create expense. Please try again.
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

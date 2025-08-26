"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  DollarSign, 
  Calendar,
  CreditCard,
  Building2,
  Phone,
  Upload,
  CheckCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreatePledge } from "@/lib/hooks/use-alumni-data";
import { useAuth } from "@/contexts/auth-context";

export default function NewPledgePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    amount: "",
    currency: "PKR",
    paymentMethod: "MANUAL",
    semester: "",
    notes: "",
    phoneNumber: "",
    receiptFile: null as File | null
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  
  const createPledgeMutation = useCreatePledge();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("amount", formData.amount);
      formDataToSend.append("currency", formData.currency);
      formDataToSend.append("paymentMethod", formData.paymentMethod);
      formDataToSend.append("semester", formData.semester);
      formDataToSend.append("notes", formData.notes);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      
      if (formData.receiptFile) {
        formDataToSend.append("receipt", formData.receiptFile);
      }

      const alumniId = user?.alumniProfile?.alumniId || "";
      
      const result = await createPledgeMutation.mutateAsync({ alumniId, formData: formDataToSend });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/alumni/pledges");
        }, 2000);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, receiptFile: e.target.files![0] }));
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "ALUMNI") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-red-600 mb-4">Access Denied</div>
          <p className="text-gray-600">You must be logged in as an alumni to view this page.</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pledge Created!</h2>
            <p className="text-gray-600 mb-4">
              Your pledge has been submitted successfully and is pending verification.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to pledges page...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Pledge</h1>
          <p className="text-gray-600">Make a pledge to support student scholarships</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              <span>Pledge Details</span>
            </CardTitle>
            <CardDescription>
              Fill in the details of your pledge. All pledges require verification before being added to public records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount and Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PKR">PKR (Pakistani Rupees)</SelectItem>
                      <SelectItem value="USD">USD (US Dollars)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CARD">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4" />
                        <span>Card Payment</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="BANK_TRANSFER">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4" />
                        <span>Bank Transfer</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="MANUAL">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>Manual Payment</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Semester */}
              <div className="space-y-2">
                <Label htmlFor="semester">Target Semester</Label>
                <Select value={formData.semester} onValueChange={(value) => setFormData(prev => ({ ...prev, semester: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                    <SelectItem value="Spring 2025">Spring 2025</SelectItem>
                    <SelectItem value="Fall 2025">Fall 2025</SelectItem>
                    <SelectItem value="General">General (No specific semester)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Phone Number for Manual Payment */}
              {formData.paymentMethod === "MANUAL" && (
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    required={formData.paymentMethod === "MANUAL"}
                  />
                  <p className="text-sm text-gray-500">
                    We'll contact you to verify the payment receipt.
                  </p>
                </div>
              )}

              {/* Receipt Upload - Now Optional */}
              {formData.paymentMethod === "MANUAL" && (
                <div className="space-y-2">
                  <Label htmlFor="receipt">Payment Receipt (Optional)</Label>
                  <Input
                    id="receipt"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                  />
                  <p className="text-sm text-gray-500">
                    Upload screenshot or photo of your payment receipt. You can add this later if not available now.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> If you don't have the receipt now, you can submit the pledge and add the receipt later. 
                      HCA staff will contact you to collect the receipt for verification.
                    </p>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about your pledge..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  disabled={createPledgeMutation.isPending}
                >
                  {createPledgeMutation.isPending ? "Creating Pledge..." : "Create Pledge"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-medium text-blue-600">1</span>
              </div>
              <div>
                <p className="font-medium">Submit Pledge</p>
                <p className="text-sm text-gray-600">Fill out the form above with your pledge details</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-medium text-blue-600">2</span>
              </div>
              <div>
                <p className="font-medium">Payment & Receipt</p>
                <p className="text-sm text-gray-600">Make payment and upload receipt (can be added later)</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-medium text-blue-600">3</span>
              </div>
              <div>
                <p className="font-medium">Staff Verification</p>
                <p className="text-sm text-gray-600">HCA staff will verify your payment and update status</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-medium text-blue-600">4</span>
              </div>
              <div>
                <p className="font-medium">Public Record</p>
                <p className="text-sm text-gray-600">Once verified, your pledge appears in public records</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

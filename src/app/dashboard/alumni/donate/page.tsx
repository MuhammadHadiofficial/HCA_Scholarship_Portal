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
  CreditCard,
  Building2,
  Phone,
  Upload,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DonatePage() {
  const [formData, setFormData] = useState({
    amount: "",
    currency: "PKR",
    paymentMethod: "MANUAL",
    semester: "",
    notes: "",
    phoneNumber: "",
    receiptFile: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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

      const response = await fetch("/api/alumni/donations", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/alumni");
        }, 2000);
      } else {
        setError(data.error || "Failed to process donation");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, receiptFile: e.target.files![0] }));
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Donation Submitted!</h2>
            <p className="text-gray-600 mb-4">
              Your donation has been submitted successfully and is pending verification.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to dashboard...
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
          <h1 className="text-3xl font-bold text-gray-900">Make a Donation</h1>
          <p className="text-gray-600">Support student scholarships with your contribution</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              <span>Donation Details</span>
            </CardTitle>
            <CardDescription>
              Fill in the details of your donation. All donations require verification before being added to public records.
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

              {/* Receipt Upload for Manual Payment - Now Optional */}
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
                      <strong>Note:</strong> If you don't have the receipt now, you can submit the donation and add the receipt later. 
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
                  placeholder="Any additional information about your donation..."
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
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Submit Donation"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Payment Methods Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Info className="w-5 h-5 text-blue-600" />
                <span>Payment Methods</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">Card Payment</p>
                  <p className="text-sm text-gray-600">Secure online payment processing</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Bank Transfer</p>
                  <p className="text-sm text-gray-600">Direct transfer to HCA account</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium">Manual Payment</p>
                  <p className="text-sm text-gray-600">Pay directly and upload receipt</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Process */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Verification Process</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-medium text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Submit Donation</p>
                  <p className="text-sm text-gray-600">Fill form and upload receipt if manual</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-medium text-blue-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Staff Verification</p>
                  <p className="text-sm text-gray-600">HCA staff verifies payment</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-medium text-blue-600">3</span>
                </div>
                <div>
                  <p className="font-medium">Public Record</p>
                  <p className="text-sm text-gray-600">Verified donation appears in records</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notice */}
        <Card className="mt-6 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2 text-orange-800">
              <AlertCircle className="w-5 h-5" />
              <span>Important Notice</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-orange-800">
              <p className="text-sm">
                <strong>All donations require verification</strong> before being added to public records and dashboard.
              </p>
              <p className="text-sm">
                For manual payments: Please ensure you upload a clear receipt and provide a valid phone number for verification.
              </p>
              <p className="text-sm">
                <strong>Receipt can be added later:</strong> If you don't have the receipt now, you can submit the donation and add it later. 
                HCA staff will contact you to collect the receipt for verification.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


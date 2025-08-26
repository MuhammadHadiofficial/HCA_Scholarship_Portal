"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload,
  CheckCircle,
  ArrowLeft,
  Receipt,
  AlertCircle
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Pledge {
  id: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  semester: string;
  status: string;
  pledgeDate: string;
  notes?: string;
  phoneNumber?: string;
}

export default function AddReceiptPage() {
  const [pledge, setPledge] = useState<Pledge | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const params = useParams();
  const pledgeId = params.id as string;

  useEffect(() => {
    // Mock data - replace with API call
    setPledge({
      id: pledgeId,
      amount: 2000,
      currency: "PKR",
      paymentMethod: "MANUAL",
      semester: "Fall 2024",
      status: "PENDING_VERIFICATION",
      pledgeDate: "2024-08-15",
      notes: "Supporting computer science students",
      phoneNumber: "+92-300-1234567"
    });
  }, [pledgeId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile) {
      setError("Please select a receipt file");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("receipt", receiptFile);
      formData.append("notes", notes);

      const response = await fetch(`/api/alumni/pledges/${pledgeId}/receipt`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/alumni/pledges");
        }, 2000);
      } else {
        setError(data.error || "Failed to upload receipt");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!pledge) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pledge details...</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Receipt Uploaded!</h2>
            <p className="text-gray-600 mb-4">
              Your receipt has been uploaded successfully and is pending verification.
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
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/dashboard/alumni/pledges">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Pledges
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Add Payment Receipt</h1>
          <p className="text-gray-600">Upload receipt for your pledge to complete verification</p>
        </div>

        {/* Pledge Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="w-6 h-6 text-blue-600" />
              <span>Pledge Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Amount</p>
                <p className="text-lg font-semibold">{pledge.currency} {pledge.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Semester</p>
                <p className="text-lg font-semibold">{pledge.semester}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Payment Method</p>
                <p className="text-lg font-semibold">{pledge.paymentMethod.replace("_", " ")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pledge Date</p>
                <p className="text-lg font-semibold">{new Date(pledge.pledgeDate).toLocaleDateString()}</p>
              </div>
            </div>
            {pledge.notes && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Notes</p>
                <p className="text-sm text-gray-700">{pledge.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Receipt Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-6 h-6 text-green-600" />
              <span>Upload Receipt</span>
            </CardTitle>
            <CardDescription>
              Upload a clear screenshot or photo of your payment receipt to complete verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Receipt Upload */}
              <div className="space-y-2">
                <Label htmlFor="receipt">Payment Receipt *</Label>
                <Input
                  id="receipt"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  required
                />
                <p className="text-sm text-gray-500">
                  Accepted formats: JPG, PNG, PDF. File size should be less than 5MB.
                </p>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about the payment or receipt..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
                <p className="text-sm text-gray-500">
                  Include transaction ID, bank reference, or any other relevant details.
                </p>
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
                  disabled={loading || !receiptFile}
                >
                  {loading ? "Uploading..." : "Upload Receipt"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-medium text-blue-600">1</span>
              </div>
              <div>
                <p className="font-medium">Receipt Uploaded</p>
                <p className="text-sm text-gray-600">Your receipt is now submitted for review</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-medium text-blue-600">2</span>
              </div>
              <div>
                <p className="font-medium">Staff Review</p>
                <p className="text-sm text-gray-600">HCA staff will verify your payment receipt</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-medium text-blue-600">3</span>
              </div>
              <div>
                <p className="font-medium">Verification Complete</p>
                <p className="text-sm text-gray-600">Once verified, your pledge appears in public records</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <strong>Receipt Requirements:</strong>
              </p>
              <ul className="text-sm list-disc list-inside space-y-1">
                <li>Clear, readable image or PDF</li>
                <li>Must show payment amount and date</li>
                <li>Should include transaction reference or ID</li>
                <li>File size under 5MB</li>
              </ul>
              <p className="text-sm mt-3">
                <strong>Note:</strong> HCA staff may contact you at {pledge.phoneNumber} to verify payment details if needed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

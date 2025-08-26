"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Calendar,
  Upload
} from "lucide-react";
import Link from "next/link";
import { useAlumniPledges } from "@/lib/hooks/use-pledge-payment";
import PledgeCreationForm from "@/components/pledges/pledge-creation-form";
import { useAuth } from "@/contexts/auth-context";

interface Pledge {
  id: string;
  amount: number;
  currency: string;
  status: string;
  pledgeDate: Date;
  fulfillmentDate: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  alumniId: string;
}

export default function PledgesPage() {
  const [showPledgeForm, setShowPledgeForm] = useState(false);
  
  const { user, isLoading: authLoading } = useAuth();
  const alumniId = user?.alumniProfile?.alumniId || null;
  
  const { data: pledgesData, isLoading, error } = useAlumniPledges(alumniId || "");
  const pledges = pledgesData?.pledges || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED": return "bg-blue-100 text-blue-800";
      case "FULFILLED": return "bg-green-100 text-green-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return <Clock className="w-4 h-4" />;
      case "CONFIRMED": return <CheckCircle className="w-4 h-4" />;
      case "FULFILLED": return <CheckCircle className="w-4 h-4" />;
      case "CANCELLED": return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "CARD": return <DollarSign className="w-4 h-4" />;
      case "BANK_TRANSFER": return <DollarSign className="w-4 h-4" />;
      case "MANUAL": return <Calendar className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!user || !alumniId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Access Denied</div>
          <p className="text-gray-600">You must be logged in as an alumni to view this page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pledges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Pledges</h1>
            <p className="text-gray-600">Track your scholarship pledges and their status</p>
          </div>
          <Button onClick={() => setShowPledgeForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Pledge
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pledges</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pledges.length}</div>
              <p className="text-xs text-muted-foreground">
                All time pledges
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {pledges.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Combined value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {pledges.filter(p => p.status === "FULFILLED").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Pledges fulfilled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {pledges.filter(p => p.status === "PENDING").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting confirmation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pledges List */}
        <Card>
          <CardHeader>
            <CardTitle>Pledge History</CardTitle>
            <CardDescription>
              All your pledges and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pledges.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pledges yet</h3>
                <p className="text-gray-600 mb-4">Start making a difference by creating your first pledge</p>
                <Button asChild>
                  <Link href="/dashboard/alumni/pledges/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Pledge
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {pledges.map((pledge) => (
                  <div key={pledge.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {pledge.currency} {pledge.amount.toLocaleString()}
                        </h4>
                        <p className="text-sm text-gray-600">Scholarship Pledge</p>
                        <p className="text-xs text-gray-500">
                          Pledged: {new Date(pledge.pledgeDate).toLocaleDateString()}
                        </p>
                        {pledge.fulfillmentDate && (
                          <p className="text-xs text-gray-500">
                            Fulfilled: {new Date(pledge.fulfillmentDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(pledge.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(pledge.status)}
                          <span>{pledge.status.replace("_", " ")}</span>
                        </div>
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        {pledge.status === "PENDING" && (
                          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Link href={`/dashboard/alumni/pledges/${pledge.id}/add-receipt`}>
                              <Upload className="w-4 h-4 mr-2" />
                              Add Receipt
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pledge Status Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Clock className="w-4 h-4 mr-1" />
                    PENDING VERIFICATION
                  </Badge>
                  <span className="text-sm text-gray-600">Awaiting staff verification</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    VERIFIED
                  </Badge>
                  <span className="text-sm text-gray-600">Payment confirmed and verified</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Badge className="bg-blue-100 text-blue-800">
                    <Clock className="w-4 h-4 mr-1" />
                    PENDING PAYMENT
                  </Badge>
                  <span className="text-sm text-gray-600">Awaiting payment completion</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-red-100 text-red-800">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    REJECTED
                  </Badge>
                  <span className="text-sm text-gray-600">Payment verification failed</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pledge Creation Form */}
        {showPledgeForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Create New Pledge</h2>
                  <Button
                    variant="outline"
                    onClick={() => setShowPledgeForm(false)}
                  >
                    Close
                  </Button>
                </div>
                <PledgeCreationForm
                  alumniId={alumniId || ""}
                  onSuccess={() => {
                    setShowPledgeForm(false);
                    // Refresh pledges data
                    window.location.reload();
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


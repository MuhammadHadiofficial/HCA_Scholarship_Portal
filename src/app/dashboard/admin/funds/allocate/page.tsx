"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft,
  DollarSign,
  Users,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminFundAllocationPage() {
  const [allocationData, setAllocationData] = useState({
    fundId: "",
    amount: "",
    recipientType: "",
    recipientId: "",
    purpose: "",
    notes: "",
    disbursementDate: "",
    recurring: false,
    frequency: ""
  });

  // Mock data - replace with real data later
  const availableFunds = [
    {
      id: 1,
      name: "Student Welfare Fund",
      remainingAmount: 15000,
      category: "STUDENT_WELFARE"
    },
    {
      id: 2,
      name: "Learning Programs Fund",
      remainingAmount: 12000,
      category: "LEARNING_PROGRAMS"
    },
    {
      id: 3,
      name: "Merit Scholarship Fund",
      remainingAmount: 13000,
      category: "MERIT_SCHOLARSHIPS"
    },
    {
      id: 4,
      name: "Need-Based Fund",
      remainingAmount: 11000,
      category: "NEED_BASED"
    }
  ];

  const recipientTypes = [
    { value: "SCHOLARSHIP", label: "Scholarship Application", description: "Allocate to specific student scholarship" },
    { value: "PROGRAM", label: "Learning Program", description: "Fund educational programs or events" },
    { value: "EMERGENCY", label: "Emergency Assistance", description: "Urgent financial support for students" },
    { value: "DEVELOPMENT", label: "Student Development", description: "Skills development and workshops" }
  ];

  const pendingScholarships = [
    {
      id: 1,
      studentName: "Ahmed Khan",
      amount: 5000,
      type: "MERIT_SCHOLARSHIP",
      status: "APPROVED",
      department: "Computer Science"
    },
    {
      id: 2,
      studentName: "Fatima Ali",
      amount: 3000,
      type: "NEED_BASED",
      status: "APPROVED",
      department: "Engineering"
    },
    {
      id: 3,
      studentName: "Omar Hassan",
      amount: 4000,
      type: "STUDENT_WELFARE",
      status: "APPROVED",
      department: "Business"
    }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setAllocationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement fund allocation logic
    console.log("Allocation data:", allocationData);
  };

  const selectedFund = availableFunds.find(fund => fund.id.toString() === allocationData.fundId);

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
            <h1 className="text-3xl font-bold text-gray-900">Allocate Funds</h1>
            <p className="text-gray-600 mt-2">Distribute funds to scholarships, programs, or emergency assistance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Allocation Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Fund Allocation Form</CardTitle>
                <CardDescription>Fill in the details to allocate funds from available sources</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Fund Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="fund">Select Fund Source</Label>
                    <Select value={allocationData.fundId} onValueChange={(value) => handleInputChange("fundId", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a fund to allocate from" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFunds.map(fund => (
                          <SelectItem key={fund.id} value={fund.id.toString()}>
                            <div className="flex items-center justify-between w-full">
                              <span>{fund.name}</span>
                              <Badge variant="outline" className="ml-2">
                                ${fund.remainingAmount.toLocaleString()} available
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedFund && (
                      <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
                        <Info className="w-4 h-4" />
                        <span>Available: ${selectedFund.remainingAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Allocation Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount to allocate"
                      value={allocationData.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                      min="0"
                      step="0.01"
                      required
                    />
                    {selectedFund && allocationData.amount && (
                      <div className={`flex items-center space-x-2 text-sm p-2 rounded ${
                        parseFloat(allocationData.amount) > selectedFund.remainingAmount 
                          ? "text-red-600 bg-red-50" 
                          : "text-green-600 bg-green-50"
                      }`}>
                        {parseFloat(allocationData.amount) > selectedFund.remainingAmount ? (
                          <AlertCircle className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        <span>
                          {parseFloat(allocationData.amount) > selectedFund.remainingAmount 
                            ? "Amount exceeds available funds" 
                            : "Amount is within available funds"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Recipient Type */}
                  <div className="space-y-2">
                    <Label htmlFor="recipientType">Allocation Purpose</Label>
                    <Select value={allocationData.recipientType} onValueChange={(value) => handleInputChange("recipientType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select allocation purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        {recipientTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-sm text-gray-500">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Recipient Selection */}
                  {allocationData.recipientType === "SCHOLARSHIP" && (
                    <div className="space-y-2">
                      <Label htmlFor="recipient">Select Scholarship</Label>
                      <Select value={allocationData.recipientId} onValueChange={(value) => handleInputChange("recipientId", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose approved scholarship" />
                        </SelectTrigger>
                        <SelectContent>
                          {pendingScholarships.map(scholarship => (
                            <SelectItem key={scholarship.id} value={scholarship.id.toString()}>
                              <div className="flex items-center justify-between w-full">
                                <span>{scholarship.studentName} - {scholarship.department}</span>
                                <Badge variant="outline" className="ml-2">
                                  ${scholarship.amount}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Purpose */}
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose Description</Label>
                    <Textarea
                      id="purpose"
                      placeholder="Describe the purpose of this allocation"
                      value={allocationData.purpose}
                      onChange={(e) => handleInputChange("purpose", e.target.value)}
                      rows={3}
                      required
                    />
                  </div>

                  {/* Disbursement Date */}
                  <div className="space-y-2">
                    <Label htmlFor="disbursementDate">Disbursement Date</Label>
                    <Input
                      id="disbursementDate"
                      type="date"
                      value={allocationData.disbursementDate}
                      onChange={(e) => handleInputChange("disbursementDate", e.target.value)}
                      required
                    />
                  </div>

                  {/* Recurring Options */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="recurring"
                        checked={allocationData.recurring}
                        onChange={(e) => handleInputChange("recurring", e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="recurring">This is a recurring allocation</Label>
                    </div>
                    
                    {allocationData.recurring && (
                      <div className="space-y-2">
                        <Label htmlFor="frequency">Recurrence Frequency</Label>
                        <Select value={allocationData.frequency} onValueChange={(value) => handleInputChange("frequency", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                            <SelectItem value="SEMESTER">Per Semester</SelectItem>
                            <SelectItem value="YEARLY">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional information or special instructions"
                      value={allocationData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex space-x-3 pt-4">
                    <Button type="submit" className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Allocate Funds
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href="/dashboard/admin/funds">Cancel</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Fund Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span>Fund Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    ${availableFunds.reduce((sum, fund) => sum + fund.remainingAmount, 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Total Available Across All Funds</p>
                </div>
                
                <div className="space-y-2">
                  {availableFunds.map(fund => (
                    <div key={fund.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{fund.name}</span>
                      <Badge variant="outline">${fund.remainingAmount.toLocaleString()}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Allocations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>Recent Allocations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">No recent allocations</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

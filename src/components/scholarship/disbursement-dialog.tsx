"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  Clock,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { useAddDisbursement } from "@/lib/hooks/use-scholarship-data";

interface DisbursementDialogProps {
  scholarship: any;
  trigger?: React.ReactNode;
}

export default function DisbursementDialog({ 
  scholarship, 
  trigger 
}: DisbursementDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [disbursementData, setDisbursementData] = useState({
    amount: "",
    semester: 1,
    notes: ""
  });

  const addDisbursementMutation = useAddDisbursement();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("scholarshipId", scholarship.id);
    formData.append("amount", disbursementData.amount);
    formData.append("semester", disbursementData.semester.toString());
    if (disbursementData.notes) {
      formData.append("notes", disbursementData.notes);
    }

    try {
      const result = await addDisbursementMutation.mutateAsync(formData);
      if (result.success) {
        setDisbursementData({
          amount: "",
          semester: 1,
          notes: ""
        });
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Failed to add disbursement:", error);
    }
  };

  const getScholarshipTypeIcon = (type: string) => {
    switch (type) {
      case "FULL_SEMESTER":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "PARTIAL_SEMESTER":
        return <DollarSign className="w-4 h-4 text-blue-600" />;
      case "ONE_TIME":
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-green-100 text-green-800";
      case "DISBURSED": return "bg-blue-100 text-blue-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      case "EXPIRED": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED": return <Clock className="w-4 h-4" />;
      case "DISBURSED": return <CheckCircle className="w-4 h-4" />;
      case "CANCELLED": return <AlertCircle className="w-4 h-4" />;
      case "EXPIRED": return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const calculateRemainingAmount = () => {
    const totalAwarded = scholarship.amount;
    const totalDisbursed = scholarship.disbursements?.reduce((sum: number, d: any) => sum + d.amount, 0) || 0;
    return Math.max(0, totalAwarded - totalDisbursed);
  };

  const getNextSemester = () => {
    if (!scholarship.disbursements || scholarship.disbursements.length === 0) {
      return 1;
    }
    const maxSemester = Math.max(...scholarship.disbursements.map((d: any) => d.semester));
    return maxSemester + 1;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <DollarSign className="w-4 h-4 mr-2" />
            Manage Disbursements
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Disbursements</DialogTitle>
          <DialogDescription>
            Track and manage scholarship disbursements for {scholarship.application?.student?.user?.name || "this student"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Scholarship Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scholarship Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    {getScholarshipTypeIcon(scholarship.type)}
                    <span className="text-sm text-gray-600">
                      {scholarship.type.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Amount</Label>
                  <p className="text-lg font-bold text-green-600">
                    ${scholarship.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(scholarship.status)}>
                    {getStatusIcon(scholarship.status)}
                    <span className="ml-1">{scholarship.status}</span>
                  </Badge>
                </div>
              </div>
              
              {scholarship.isRecurring && scholarship.recurringSemesters && (
                <div className="mt-4">
                  <Label className="text-sm font-medium">Recurring Semesters</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {scholarship.recurringSemesters.map((semester: number) => (
                      <Badge key={semester} variant="outline">
                        Semester {semester}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {scholarship.reason && (
                <div className="mt-4">
                  <Label className="text-sm font-medium">Reason for Award</Label>
                  <p className="text-sm text-gray-600 mt-1">{scholarship.reason}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Disbursement Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Disbursement Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    ${scholarship.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-600">Total Awarded</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ${(scholarship.disbursements?.reduce((sum: number, d: any) => sum + d.amount, 0) || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600">Total Disbursed</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    ${calculateRemainingAmount().toLocaleString()}
                  </div>
                  <div className="text-sm text-orange-600">Remaining</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add New Disbursement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add New Disbursement</CardTitle>
              <CardDescription>
                Record a new disbursement for this scholarship
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount (USD)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        max={calculateRemainingAmount()}
                        placeholder="0.00"
                        value={disbursementData.amount}
                        onChange={(e) => setDisbursementData(prev => ({ ...prev, amount: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum: ${calculateRemainingAmount().toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Select 
                      value={disbursementData.semester.toString()} 
                      onValueChange={(value) => setDisbursementData(prev => ({ ...prev, semester: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 8 }, (_, i) => i + 1).map((semester) => (
                          <SelectItem key={semester} value={semester.toString()}>
                            Semester {semester}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Next available: Semester {getNextSemester()}
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any notes about this disbursement..."
                    value={disbursementData.notes}
                    onChange={(e) => setDisbursementData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={addDisbursementMutation.isPending || parseFloat(disbursementData.amount) > calculateRemainingAmount()}
                  >
                    {addDisbursementMutation.isPending ? "Adding..." : "Add Disbursement"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Disbursement History */}
          {scholarship.disbursements && scholarship.disbursements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Disbursement History</CardTitle>
                <CardDescription>
                  Complete record of all disbursements made
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Semester</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scholarship.disbursements.map((disbursement: any) => (
                      <TableRow key={disbursement.id}>
                        <TableCell>
                          <Badge variant="outline">
                            Semester {disbursement.semester}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-green-600">
                            ${disbursement.amount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(disbursement.disbursedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {disbursement.notes || "No notes"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

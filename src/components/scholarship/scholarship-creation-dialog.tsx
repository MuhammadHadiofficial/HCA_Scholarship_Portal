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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, 
  DollarSign, 
  Calendar, 
  GraduationCap,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useCreateScholarship } from "@/lib/hooks/use-scholarship-data";

interface ScholarshipCreationDialogProps {
  application: any;
  trigger?: React.ReactNode;
}

export default function ScholarshipCreationDialog({ 
  application, 
  trigger 
}: ScholarshipCreationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scholarshipData, setScholarshipData] = useState({
    type: "PARTIAL_SEMESTER",
    amount: "",
    isRecurring: false,
    recurringSemesters: [] as number[],
    reason: "",
    conditions: "",
    notes: ""
  });

  const createScholarshipMutation = useCreateScholarship();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("applicationId", application.id);
    formData.append("type", scholarshipData.type);
    formData.append("amount", scholarshipData.amount);
    formData.append("isRecurring", scholarshipData.isRecurring.toString());
    formData.append("status", "APPROVED"); // Default to approved when creating
    
    // Add recurring semesters if applicable
    if (scholarshipData.isRecurring && scholarshipData.recurringSemesters.length > 0) {
      scholarshipData.recurringSemesters.forEach(semester => {
        formData.append("recurringSemesters", semester.toString());
      });
    }
    
    // Add additional fields
    if (scholarshipData.reason) formData.append("reason", scholarshipData.reason);
    if (scholarshipData.conditions) formData.append("conditions", scholarshipData.conditions);
    if (scholarshipData.notes) formData.append("notes", scholarshipData.notes);

    try {
      const result = await createScholarshipMutation.mutateAsync(formData);
      if (result.success) {
        setScholarshipData({
          type: "PARTIAL_SEMESTER",
          amount: "",
          isRecurring: false,
          recurringSemesters: [],
          reason: "",
          conditions: "",
          notes: ""
        });
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Failed to create scholarship:", error);
    }
  };

  const handleSemesterToggle = (semester: number) => {
    setScholarshipData(prev => ({
      ...prev,
      recurringSemesters: prev.recurringSemesters.includes(semester)
        ? prev.recurringSemesters.filter(s => s !== semester)
        : [...prev.recurringSemesters, semester].sort()
    }));
  };

  const getScholarshipTypeDescription = (type: string) => {
    switch (type) {
      case "FULL_SEMESTER":
        return "Covers the complete semester fee";
      case "PARTIAL_SEMESTER":
        return "Covers a portion of the semester fee";
      case "ONE_TIME":
        return "One-time financial assistance";
      default:
        return "";
    }
  };

  const calculateTotalAmount = () => {
    const baseAmount = parseFloat(scholarshipData.amount) || 0;
    if (scholarshipData.isRecurring && scholarshipData.recurringSemesters.length > 0) {
      return baseAmount * scholarshipData.recurringSemesters.length;
    }
    return baseAmount;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Scholarship
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Scholarship</DialogTitle>
          <DialogDescription>
            Award a scholarship to {application.student?.user?.name || "this student"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Application Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Application Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Student</Label>
                  <p className="text-sm text-gray-600">
                    {application.student?.user?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Student ID</Label>
                  <p className="text-sm text-gray-600">
                    {application.student?.studentId || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Intake</Label>
                  <p className="text-sm text-gray-600">
                    {application.intake?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">CGPA</Label>
                  <p className="text-sm text-gray-600">
                    {application.academicInfo?.cgpa || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scholarship Type and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Scholarship Type</Label>
              <Select 
                value={scholarshipData.type} 
                onValueChange={(value) => setScholarshipData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL_SEMESTER">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Full Semester</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="PARTIAL_SEMESTER">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <span>Partial Semester</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ONE_TIME">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-4 h-4 text-purple-600" />
                      <span>One Time</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {getScholarshipTypeDescription(scholarshipData.type)}
              </p>
            </div>

            <div>
              <Label htmlFor="amount">Amount (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={scholarshipData.amount}
                  onChange={(e) => setScholarshipData(prev => ({ ...prev, amount: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Recurring Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recurring Options</CardTitle>
              <CardDescription>
                Configure if this scholarship should be awarded for multiple semesters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRecurring"
                  checked={scholarshipData.isRecurring}
                  onCheckedChange={(checked) => 
                    setScholarshipData(prev => ({ 
                      ...prev, 
                      isRecurring: checked as boolean,
                      recurringSemesters: checked ? [1, 2] : [] // Default to first two semesters
                    }))
                  }
                />
                <Label htmlFor="isRecurring">This is a recurring scholarship</Label>
              </div>

              {scholarshipData.isRecurring && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Select Semesters</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
                      <div key={semester} className="flex items-center space-x-2">
                        <Checkbox
                          id={`semester-${semester}`}
                          checked={scholarshipData.recurringSemesters.includes(semester)}
                          onCheckedChange={() => handleSemesterToggle(semester)}
                        />
                        <Label htmlFor={`semester-${semester}`} className="text-sm">
                          Semester {semester}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Selected: {scholarshipData.recurringSemesters.join(", ")}
                  </p>
                </div>
              )}

              {/* Total Amount Calculation */}
              {scholarshipData.isRecurring && scholarshipData.recurringSemesters.length > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Award Amount:</span>
                    <span className="text-lg font-bold text-blue-600">
                      ${calculateTotalAmount().toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    {scholarshipData.recurringSemesters.length} semester(s) × ${parseFloat(scholarshipData.amount) || 0}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason for Award</Label>
              <Textarea
                id="reason"
                placeholder="Explain why this scholarship is being awarded..."
                value={scholarshipData.reason}
                onChange={(e) => setScholarshipData(prev => ({ ...prev, reason: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="conditions">Conditions (Optional)</Label>
              <Textarea
                id="conditions"
                placeholder="Any conditions the student must meet to maintain this scholarship..."
                value={scholarshipData.conditions}
                onChange={(e) => setScholarshipData(prev => ({ ...prev, conditions: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes or comments..."
                value={scholarshipData.notes}
                onChange={(e) => setScholarshipData(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createScholarshipMutation.isPending}
            >
              {createScholarshipMutation.isPending ? "Creating..." : "Create Scholarship"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

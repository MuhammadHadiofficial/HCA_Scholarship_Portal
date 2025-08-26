"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import Link from "next/link";
import { useAllApplications } from "@/lib/hooks/use-review-workflow";
import ApplicationReviewDialog from "@/components/review/application-review-dialog";
import QuickNoteDialog from "@/components/review/quick-note-dialog";
import { useAuth } from "@/contexts/auth-context";
import ScholarshipCreationDialog from "@/components/scholarship/scholarship-creation-dialog";

export default function StaffApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  
  const { data: applicationsData, isLoading } = useAllApplications();
  const applications = applicationsData?.applications || [];
  
  const { user, isLoading: authLoading } = useAuth();
  const staffId = user?.staffProfile?.staffId || null;

  // Filter applications based on search and status
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = !searchTerm || 
      app.student?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.student?.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.intake?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { variant: "secondary", text: "Draft" },
      SUBMITTED: { variant: "default", text: "Submitted" },
      UNDER_REVIEW: { variant: "default", text: "Under Review" },
      APPROVED: { variant: "default", text: "Approved" },
      REJECTED: { variant: "destructive", text: "Rejected" },
      WITHDRAWN: { variant: "secondary", text: "Withdrawn" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    return <Badge variant={config.variant as any}>{config.text}</Badge>;
  };

  const getPriorityColor = (application: any) => {
    if (application.status === "SUBMITTED") return "bg-yellow-50 border-yellow-200";
    if (application.status === "UNDER_REVIEW") return "bg-blue-50 border-blue-200";
    return "";
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading authentication...</div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "STAFF") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">Access Denied</div>
            <p className="text-gray-600">You must be logged in as staff to view this page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading applications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Applications Review
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Review and manage scholarship applications
          </p>
        </div>

        <div className="grid gap-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {applications.filter((app) => app.status === "SUBMITTED").length}
                </div>
                <div className="text-sm text-gray-500">Pending Review</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {applications.filter((app) => app.status === "UNDER_REVIEW").length}
                </div>
                <div className="text-sm text-gray-500">Under Review</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {applications.filter((app) => app.status === "APPROVED").length}
                </div>
                <div className="text-sm text-gray-500">Approved</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {applications.filter((app) => app.status === "REJECTED").length}
                </div>
                <div className="text-sm text-gray-500">Rejected</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name, student ID, or intake..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="SUBMITTED">Submitted</SelectItem>
                    <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Applications Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Applications</CardTitle>
              <CardDescription>
                {filteredApplications.length} applications found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredApplications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No applications found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Intake</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>CGPA</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Reviews</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((application) => (
                      <TableRow
                        key={application.id}
                        className={getPriorityColor(application)}
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{application.student.user.name}</div>
                            <div className="text-sm text-gray-500">
                              {application.student.studentId}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.student.department}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{application.intake.name}</div>
                            <div className="text-sm text-gray-500">
                              {application.intake.semester} {application.intake.year}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(application.status)}</TableCell>
                        <TableCell>
                          {application.academicInfo?.cgpa || "N/A"}
                        </TableCell>
                        <TableCell>
                          {application.submittedAt
                            ? new Date(application.submittedAt).toLocaleDateString()
                            : "Not submitted"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {application.reviews?.length || 0} reviews
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <ApplicationReviewDialog
                              application={application}
                              reviewerId={staffId}
                              trigger={
                                <Button variant="outline" size="sm">
                                  Review
                                </Button>
                              }
                            />
                            <QuickNoteDialog
                              applicationId={application.id}
                              authorId={staffId}
                              trigger={
                                <Button variant="outline" size="sm">
                                  Add Note
                                </Button>
                              }
                            />
                            {!application.scholarship && (
                              <ScholarshipCreationDialog
                                application={application}
                                trigger={
                                  <Button variant="outline" size="sm">
                                    Award Scholarship
                                  </Button>
                                }
                              />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


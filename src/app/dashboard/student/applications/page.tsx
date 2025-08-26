"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { useStudentApplications, useActiveIntakes } from "@/lib/hooks/use-student-data";

export default function StudentApplicationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const studentId = user?.studentProfile?.studentId || null;
  
  const { data: applicationsData, isLoading: applicationsLoading } = useStudentApplications(studentId || "");
  const { data: intakesData, isLoading: intakesLoading } = useActiveIntakes();
  
  const applications = applicationsData?.applications || [];
  const intakes = intakesData?.intakes || [];
  const loading = applicationsLoading || intakesLoading;

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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading authentication...</div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "STUDENT") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">Access Denied</div>
            <p className="text-gray-600">You must be logged in as a student to view this page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
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
            My Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            View and manage your scholarship applications
          </p>
        </div>

        <div className="grid gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Create a new application or view available intakes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Link href="/dashboard/student/applications/new">
                  <Button>New Application</Button>
                </Link>
                <Link href="/guidelines">
                  <Button variant="outline">View Guidelines</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Applications Table */}
          <Card>
            <CardHeader>
              <CardTitle>Application History</CardTitle>
              <CardDescription>
                All your scholarship applications and their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No applications found</p>
                  <Link href="/dashboard/student/applications/new">
                    <Button>Create Your First Application</Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Intake</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Scholarship</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application) => (
                      <TableRow key={application.id}>
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
                          {application.submittedAt
                            ? new Date(application.submittedAt).toLocaleDateString()
                            : "Not submitted"}
                        </TableCell>
                        <TableCell>
                          {application.scholarship ? (
                            <Badge variant="default">
                              ${application.scholarship.amount}
                            </Badge>
                          ) : (
                            <span className="text-gray-500">No scholarship</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/dashboard/student/applications/${application.id}`}>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
                            {application.status === "DRAFT" && (
                              <Link href={`/dashboard/student/applications/${application.id}/edit`}>
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                              </Link>
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

          {/* Available Intakes */}
          <Card>
            <CardHeader>
              <CardTitle>Available Intakes</CardTitle>
              <CardDescription>
                Current intakes accepting applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {intakes.map((intake) => (
                  <div
                    key={intake.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{intake.name}</h3>
                      <p className="text-sm text-gray-500">
                        {intake.semester} {intake.year} • Applications open until{" "}
                        {new Date(intake.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Link href={`/dashboard/student/applications/new?intake=${intake.id}`}>
                      <Button>Apply Now</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


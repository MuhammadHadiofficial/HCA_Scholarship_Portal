"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { useStudentScholarships } from "@/lib/hooks/use-student-data";
import { useAuth } from "@/contexts/auth-context";
import PDFViewer from "@/components/pdf/pdf-viewer";

export default function StudentScholarshipsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const studentId = user?.studentProfile?.studentId || null;
  
  const { data: scholarshipsData, isLoading } = useStudentScholarships(studentId || "");
  const scholarships = scholarshipsData?.scholarships || [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      APPROVED: { variant: "default", text: "Approved" },
      DISBURSED: { variant: "default", text: "Disbursed" },
      CANCELLED: { variant: "destructive", text: "Cancelled" },
      EXPIRED: { variant: "secondary", text: "Expired" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.APPROVED;
    return <Badge variant={config.variant as any}>{config.text}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      FULL_SEMESTER: { variant: "default", text: "Full Semester" },
      PARTIAL_SEMESTER: { variant: "secondary", text: "Partial Semester" },
      ONE_TIME: { variant: "outline", text: "One Time" },
    };

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.ONE_TIME;
    return <Badge variant={config.variant as any}>{config.text}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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
          <div className="text-center">Loading scholarships...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Scholarships
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            View your approved scholarships and disbursement history
          </p>
        </div>

        <div className="grid gap-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {scholarships.length}
                </div>
                <div className="text-sm text-gray-500">Total Scholarships</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    scholarships.reduce((sum, scholarship) => sum + scholarship.amount, 0)
                  )}
                </div>
                <div className="text-sm text-gray-500">Total Awarded</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(
                    scholarships.reduce((sum, scholarship) => {
                      const disbursed = scholarship.disbursements?.reduce(
                        (dSum: number, disbursement: any) => dSum + disbursement.amount,
                        0
                      ) || 0;
                      return sum + disbursed;
                    }, 0)
                  )}
                </div>
                <div className="text-sm text-gray-500">Total Disbursed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {scholarships.filter((s) => s.isRecurring).length}
                </div>
                <div className="text-sm text-gray-500">Recurring Scholarships</div>
              </CardContent>
            </Card>
          </div>

          {/* Scholarships Table */}
          <Card>
            <CardHeader>
              <CardTitle>Scholarship History</CardTitle>
              <CardDescription>
                All your approved scholarships and their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scholarships.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No scholarships found</p>
                  <Link href="/dashboard/student/applications">
                    <Button>Apply for Scholarships</Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Intake</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Disbursements</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scholarships.map((scholarship) => (
                      <TableRow key={scholarship.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{scholarship.application.intake.name}</div>
                            <div className="text-sm text-gray-500">
                              {scholarship.application.intake.semester} {scholarship.application.intake.year}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {getTypeBadge(scholarship.type)}
                            {scholarship.isRecurring && (
                              <Badge variant="outline" className="text-xs">
                                Recurring
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {formatCurrency(scholarship.amount)}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(scholarship.status)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {scholarship.disbursements?.length || 0} disbursements
                            </div>
                            {scholarship.disbursements?.length > 0 && (
                              <div className="text-xs text-gray-500">
                                Latest: {formatCurrency(
                                  scholarship.disbursements[scholarship.disbursements.length - 1].amount
                                )}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/dashboard/student/scholarships/${scholarship.id}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                            {scholarship.certificateUrl && (
                              <PDFViewer
                                title={`Scholarship Certificate - ${scholarship.application.intake.name}`}
                                description={`Certificate for ${scholarship.type.replace("_", " ")} scholarship`}
                                pdfUrl={`/api/pdf/certificate/${scholarship.id}`}
                                trigger={
                                  <Button variant="outline" size="sm">
                                    Certificate
                                  </Button>
                                }
                                metadata={{
                                  type: scholarship.type.replace("_", " "),
                                  date: scholarship.approvedAt 
                                    ? new Date(scholarship.approvedAt).toLocaleDateString()
                                    : "N/A",
                                  author: "HCA Scholarship Committee"
                                }}
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

          {/* Recent Disbursements */}
          {scholarships.some((s) => s.disbursements?.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Disbursements</CardTitle>
                <CardDescription>
                  Latest scholarship disbursements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scholarships
                    .flatMap((s) =>
                      s.disbursements?.map((d: any) => ({
                        ...d,
                        scholarship: s,
                      })) || []
                    )
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map((disbursement: any) => (
                      <div
                        key={disbursement.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">
                            {disbursement.scholarship.application.intake.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Semester {disbursement.semester} • {disbursement.description}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {formatCurrency(disbursement.amount)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(disbursement.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Link href="/dashboard/student/applications">
                  <Button>View Applications</Button>
                </Link>
                <Link href="/guidelines">
                  <Button variant="outline">View Guidelines</Button>
                </Link>
                <Link href="/dashboard/public">
                  <Button variant="outline">Public Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


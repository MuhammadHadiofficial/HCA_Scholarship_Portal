"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  FileText
} from "lucide-react";
import { useAllApplications } from "@/lib/hooks/use-review-workflow";

interface ReviewDashboardProps {
  reviewerId: string;
}

export default function ReviewDashboard({ reviewerId }: ReviewDashboardProps) {
  const { data: applicationsData, isLoading } = useAllApplications();
  const applications = applicationsData?.applications || [];

  // Calculate review statistics
  const totalApplications = applications.length;
  const pendingReview = applications.filter(app => app.status === "SUBMITTED").length;
  const underReview = applications.filter(app => app.status === "UNDER_REVIEW").length;
  const approved = applications.filter(app => app.status === "APPROVED").length;
  const rejected = applications.filter(app => app.status === "REJECTED").length;
  const draft = applications.filter(app => app.status === "DRAFT").length;

  // Calculate review completion rate
  const reviewableApplications = totalApplications - draft;
  const completedReviews = approved + rejected;
  const reviewCompletionRate = reviewableApplications > 0 ? (completedReviews / reviewableApplications) * 100 : 0;

  // Get applications that need immediate attention
  const urgentApplications = applications
    .filter(app => app.status === "SUBMITTED" || app.status === "UNDER_REVIEW")
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-gray-100 text-gray-800";
      case "SUBMITTED": return "bg-yellow-100 text-yellow-800";
      case "UNDER_REVIEW": return "bg-blue-100 text-blue-800";
      case "APPROVED": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DRAFT": return <FileText className="w-4 h-4" />;
      case "SUBMITTED": return <Clock className="w-4 h-4" />;
      case "UNDER_REVIEW": return <AlertTriangle className="w-4 h-4" />;
      case "APPROVED": return <CheckCircle className="w-4 h-4" />;
      case "REJECTED": return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading review dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              {draft} in draft
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingReview}</div>
            <p className="text-xs text-muted-foreground">
              {underReview} under review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Reviews</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedReviews}</div>
            <p className="text-xs text-muted-foreground">
              {approved} approved, {rejected} rejected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Review Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {reviewCompletionRate.toFixed(1)}%
            </div>
            <Progress value={reviewCompletionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {completedReviews} of {reviewableApplications} reviewed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Application Status Breakdown</CardTitle>
          <CardDescription>
            Distribution of applications by current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { status: "DRAFT", count: draft, color: "bg-gray-100 text-gray-800" },
              { status: "SUBMITTED", count: pendingReview, color: "bg-yellow-100 text-yellow-800" },
              { status: "UNDER_REVIEW", count: underReview, color: "bg-blue-100 text-blue-800" },
              { status: "APPROVED", count: approved, color: "bg-green-100 text-green-800" },
              { status: "REJECTED", count: rejected, color: "bg-red-100 text-red-800" },
            ].map((item) => (
              <div key={item.status} className="text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${item.color}`}>
                  {getStatusIcon(item.status)}
                  <span className="ml-2">{item.status.replace("_", " ")}</span>
                </div>
                <div className="text-2xl font-bold mt-2">{item.count}</div>
                <div className="text-xs text-gray-500">
                  {totalApplications > 0 ? ((item.count / totalApplications) * 100).toFixed(1) : 0}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Urgent Applications */}
      {urgentApplications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span>Applications Needing Attention</span>
            </CardTitle>
            <CardDescription>
              Applications that require immediate review or are under review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {urgentApplications.map((application) => (
                <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {application.student?.user?.name || "Unknown Student"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {application.student?.studentId} • {application.intake?.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(application.status)}>
                      {getStatusIcon(application.status)}
                      <span className="ml-1">{application.status.replace("_", " ")}</span>
                    </Badge>
                    <div className="text-sm text-gray-500">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" className="w-full">
                View All Pending Applications
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Review Guidelines</CardTitle>
          <CardDescription>
            Best practices for reviewing scholarship applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-medium text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Review Academic Performance</p>
                  <p className="text-sm text-gray-600">Check CGPA, merit list position, and academic consistency</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-medium text-blue-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Assess Financial Need</p>
                  <p className="text-sm text-gray-600">Verify family income and supporting documents</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-medium text-blue-600">3</span>
                </div>
                <div>
                  <p className="font-medium">Evaluate Goals & Motivation</p>
                  <p className="text-sm text-gray-600">Review academic and career goals statement</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-medium text-blue-600">4</span>
                </div>
                <div>
                  <p className="font-medium">Document Completeness</p>
                  <p className="text-sm text-gray-600">Ensure all required documents are uploaded</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

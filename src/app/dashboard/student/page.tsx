"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  DollarSign,
  Calendar,
  Upload,
  BookOpen,
  Award
} from "lucide-react";
import Link from "next/link";
import { useStudentApplications, useStudentScholarships } from "@/lib/hooks/use-student-data";

export default function StudentDashboardPage() {
  // TODO: Get actual student ID from auth context
  const studentId = "STU001"; // This should come from auth
  
  const { data: applicationsData, isLoading: applicationsLoading } = useStudentApplications(studentId);
  const { data: scholarshipsData, isLoading: scholarshipsLoading } = useStudentScholarships(studentId);
  
  const applications = applicationsData?.applications || [];
  const scholarships = scholarshipsData?.scholarships || [];
  const loading = applicationsLoading || scholarshipsLoading;

  // Mock data - replace with real data later
  const studentInfo = {
    name: "Ahmed Khan",
    studentId: "STU001",
    department: "Computer Science",
    currentSemester: 3,
    cgpa: 3.8,
    meritListNumber: "ML2024001"
  };

  const documents = [
    { name: "Academic Transcript", status: "VERIFIED", uploaded: "2024-08-10" },
    { name: "Income Certificate", status: "PENDING", uploaded: "2024-08-12" },
    { name: "Utility Bills", status: "MISSING", uploaded: null },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "UNDER_REVIEW": return "bg-blue-100 text-blue-800";
      case "APPROVED": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      case "DRAFT": return "bg-gray-100 text-gray-800";
      case "VERIFIED": return "bg-green-100 text-green-800";
      case "MISSING": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDocumentIcon = (status: string) => {
    switch (status) {
      case "VERIFIED": return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "PENDING": return <Clock className="w-5 h-5 text-yellow-600" />;
      case "MISSING": return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600">Welcome back, {studentInfo.name}</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Academic Calendar
            </Button>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Documents
            </Button>
          </div>
        </div>

        {/* Student Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              <span>Student Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Student ID</p>
                <p className="text-xl font-bold">{studentInfo.studentId}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Department</p>
                <p className="text-xl font-bold">{studentInfo.department}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Current Semester</p>
                <p className="text-xl font-bold">{studentInfo.currentSemester}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">CGPA</p>
                <p className="text-xl font-bold text-green-600">{studentInfo.cgpa}</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Merit List Number</p>
              <p className="text-lg font-semibold text-blue-600">{studentInfo.meritListNumber}</p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.filter(a => a.status !== "DRAFT").length}</div>
              <p className="text-xs text-muted-foreground">
                {applications.filter(a => a.status === "UNDER_REVIEW").length} under review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Scholarships</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${scholarships.filter(s => s.status === "APPROVED").reduce((sum, s) => sum + s.amount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {scholarships.filter(s => s.status === "APPROVED").length} scholarships
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents Status</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {documents.filter(d => d.status === "VERIFIED").length}/{documents.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Documents verified
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Deadline</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">3 days</div>
              <p className="text-xs text-muted-foreground">
                Spring 2025 applications
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Applications</span>
              </CardTitle>
              <CardDescription>
                Manage your scholarship applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/dashboard/student/applications">
                  View Applications
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/student/applications/new">
                  New Application
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-green-600" />
                <span>Documents</span>
              </CardTitle>
              <CardDescription>
                Upload and manage required documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/dashboard/student/documents">
                  View Documents
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/student/documents/upload">
                  Upload New
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-purple-600" />
                <span>Scholarships</span>
              </CardTitle>
              <CardDescription>
                Track your scholarship status and funds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/dashboard/student/scholarships">
                  View Scholarships
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/student/scholarships/guidelines">
                  Guidelines
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Applications Status */}
        <Card>
          <CardHeader>
            <CardTitle>Applications Status</CardTitle>
            <CardDescription>
              Track the progress of your scholarship applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{app.intake}</h4>
                      <p className="text-sm text-gray-600">Amount: ${app.amount.toLocaleString()}</p>
                      {app.submitted && (
                        <p className="text-xs text-gray-500">Submitted: {app.submitted}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(app.status)}>
                      {app.status.replace("_", " ")}
                    </Badge>
                    {app.status === "DRAFT" ? (
                      <Button variant="outline" size="sm">
                        Continue
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documents Status */}
        <Card>
          <CardHeader>
            <CardTitle>Required Documents</CardTitle>
            <CardDescription>
              Status of your uploaded documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getDocumentIcon(doc.status)}
                    <div>
                      <h4 className="font-medium">{doc.name}</h4>
                      {doc.uploaded && (
                        <p className="text-sm text-gray-600">Uploaded: {doc.uploaded}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                    {doc.status === "MISSING" && (
                      <Button size="sm">
                        Upload Now
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Progress value={75} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">75% of documents completed</p>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <span>Important Deadlines</span>
            </CardTitle>
            <CardDescription>
              Don't miss these important dates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium">Spring 2025 Application Deadline</p>
                  <p className="text-sm text-gray-600">Submit your scholarship application</p>
                </div>
                <Badge variant="destructive">3 days left</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">Document Verification Deadline</p>
                  <p className="text-sm text-gray-600">All documents must be verified</p>
                </div>
                <Badge variant="secondary">1 week left</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

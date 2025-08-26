"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Filter,
  Search,
  Users,
  GraduationCap,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminPendingApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");

  // Mock data - replace with real data later
  const pendingApplications = [
    {
      id: 1,
      studentName: "Ahmed Khan",
      studentId: "STU001",
      email: "ahmed.khan@student.edu",
      department: "Computer Science",
      semester: "Fall 2024",
      scholarshipType: "MERIT_SCHOLARSHIP",
      requestedAmount: 5000,
      cgpa: 3.8,
      meritRank: 15,
      status: "PENDING_REVIEW",
      submittedDate: "2024-08-20",
      priority: "HIGH",
      documents: ["Transcript", "Income Certificate", "Utility Bills"],
      notes: "High academic performance, demonstrated financial need"
    },
    {
      id: 2,
      studentName: "Fatima Ali",
      studentId: "STU002",
      email: "fatima.ali@student.edu",
      department: "Engineering",
      semester: "Fall 2024",
      scholarshipType: "NEED_BASED",
      requestedAmount: 3000,
      cgpa: 3.2,
      meritRank: 45,
      status: "UNDER_REVIEW",
      submittedDate: "2024-08-18",
      priority: "MEDIUM",
      documents: ["Transcript", "Income Certificate", "Family Details"],
      notes: "Strong financial need case, good academic standing"
    },
    {
      id: 3,
      studentName: "Omar Hassan",
      studentId: "STU003",
      email: "omar.hassan@student.edu",
      department: "Business",
      semester: "Fall 2024",
      scholarshipType: "STUDENT_WELFARE",
      requestedAmount: 4000,
      cgpa: 3.5,
      meritRank: 28,
      status: "PENDING_REVIEW",
      submittedDate: "2024-08-19",
      priority: "HIGH",
      documents: ["Transcript", "Emergency Request", "Medical Certificate"],
      notes: "Emergency situation, requires immediate assistance"
    },
    {
      id: 4,
      studentName: "Aisha Rahman",
      studentId: "STU004",
      email: "aisha.rahman@student.edu",
      department: "Medicine",
      semester: "Fall 2024",
      scholarshipType: "MERIT_SCHOLARSHIP",
      requestedAmount: 6000,
      cgpa: 3.9,
      meritRank: 8,
      status: "UNDER_REVIEW",
      submittedDate: "2024-08-17",
      priority: "HIGH",
      documents: ["Transcript", "Research Papers", "Recommendation Letters"],
      notes: "Exceptional academic record, research contributions"
    },
    {
      id: 5,
      studentName: "Hassan Malik",
      studentId: "STU005",
      email: "hassan.malik@student.edu",
      department: "Arts",
      semester: "Fall 2024",
      scholarshipType: "NEED_BASED",
      requestedAmount: 2500,
      cgpa: 3.1,
      meritRank: 52,
      status: "PENDING_REVIEW",
      submittedDate: "2024-08-21",
      priority: "LOW",
      documents: ["Transcript", "Income Certificate", "Portfolio"],
      notes: "Creative portfolio, moderate financial need"
    }
  ];

  const departments = [
    { value: "ALL", label: "All Departments" },
    { value: "Computer Science", label: "Computer Science" },
    { value: "Engineering", label: "Engineering" },
    { value: "Business", label: "Business" },
    { value: "Medicine", label: "Medicine" },
    { value: "Arts", label: "Arts" }
  ];

  const scholarshipTypes = [
    { value: "ALL", label: "All Types" },
    { value: "MERIT_SCHOLARSHIP", label: "Merit Scholarship" },
    { value: "NEED_BASED", label: "Need-Based" },
    { value: "STUDENT_WELFARE", label: "Student Welfare" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW": return "bg-yellow-100 text-yellow-800";
      case "UNDER_REVIEW": return "bg-blue-100 text-blue-800";
      case "APPROVED": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-red-100 text-red-800";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800";
      case "LOW": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "MERIT_SCHOLARSHIP": return "bg-purple-100 text-purple-800";
      case "NEED_BASED": return "bg-orange-100 text-orange-800";
      case "STUDENT_WELFARE": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredApplications = pendingApplications.filter(app => {
    const matchesSearch = app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "ALL" || app.department === filterDepartment;
    const matchesType = filterType === "ALL" || app.scholarshipType === filterType;
    return matchesSearch && matchesDepartment && matchesType;
  });

  const stats = {
    total: pendingApplications.length,
    pendingReview: pendingApplications.filter(app => app.status === "PENDING_REVIEW").length,
    underReview: pendingApplications.filter(app => app.status === "UNDER_REVIEW").length,
    highPriority: pendingApplications.filter(app => app.priority === "HIGH").length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/admin/applications">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Applications
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pending Applications</h1>
            <p className="text-gray-600 mt-2">Review and process scholarship applications awaiting approval</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Applications waiting</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReview}</div>
              <p className="text-xs text-muted-foreground">Need initial review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.underReview}</div>
              <p className="text-xs text-muted-foreground">Being evaluated</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <Clock className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Application Overview</CardTitle>
            <CardDescription>Search and filter applications by various criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name, ID, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:w-48">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {scholarshipTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map(application => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">{application.studentName}</h3>
                      <Badge variant="outline">{application.studentId}</Badge>
                      <Badge className={getPriorityColor(application.priority)}>
                        {application.priority} Priority
                      </Badge>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {application.department}
                      </span>
                      <span className="flex items-center">
                        <GraduationCap className="w-4 h-4 mr-1" />
                        {application.semester}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        ${application.requestedAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/admin/applications/${application.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Academic Performance</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold">CGPA: {application.cgpa}</span>
                      <span className="text-sm text-gray-500">Rank: #{application.meritRank}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Scholarship Type</p>
                    <Badge className={getTypeColor(application.scholarshipType)}>
                      {application.scholarshipType.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Submitted</p>
                    <p className="text-sm">{application.submittedDate}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Documents Submitted</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {application.documents.map((doc, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {application.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Notes</p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        {application.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Contact: {application.email}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline">
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Add Note
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No applications found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

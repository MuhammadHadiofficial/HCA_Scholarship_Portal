"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Calendar,
  DollarSign,
  Award,
  Settings,
  BarChart3
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  // Mock data - replace with real data later
  const stats = {
    totalUsers: 245,
    totalApplications: 67,
    pendingReviews: 23,
    approvedToday: 8,
    totalFunds: 125000,
    allocatedFunds: 89000,
    activeScholarships: 34,
    totalAlumni: 89
  };

  const recentApplications = [
    { id: 1, studentName: "Ahmed Khan", status: "PENDING", department: "Computer Science", submitted: "2 hours ago" },
    { id: 2, studentName: "Fatima Ali", status: "UNDER_REVIEW", department: "Engineering", submitted: "4 hours ago" },
    { id: 3, studentName: "Omar Hassan", status: "APPROVED", department: "Business", submitted: "1 day ago" },
  ];

  const systemAlerts = [
    { type: "WARNING", message: "Low funds in Student Welfare Fund", action: "Review budget allocation" },
    { type: "INFO", message: "New alumni registrations pending verification", action: "Verify 5 alumni accounts" },
    { type: "SUCCESS", message: "Fall 2024 applications closed successfully", action: "Begin review process" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "UNDER_REVIEW": return "bg-blue-100 text-blue-800";
      case "APPROVED": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "WARNING": return "bg-orange-50 border-orange-200";
      case "INFO": return "bg-blue-50 border-blue-200";
      case "SUCCESS": return "bg-green-50 border-green-200";
      case "ERROR": return "bg-red-50 border-red-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "WARNING": return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case "INFO": return <Clock className="w-5 h-5 text-blue-600" />;
      case "SUCCESS": return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "ERROR": return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">System overview and administration</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              System Reports
            </Button>
            <Button>
              <Settings className="w-4 h-4 mr-2" />
              System Settings
            </Button>
          </div>
        </div>

        {/* System Alerts */}
        {systemAlerts.length > 0 && (
          <div className="space-y-3">
            {systemAlerts.map((alert, index) => (
              <div key={index} className={`p-4 border rounded-lg ${getAlertColor(alert.type)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-gray-600">Action: {alert.action}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Take Action
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +12 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingReviews}</div>
              <p className="text-xs text-muted-foreground">
                Need attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funds</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${stats.totalFunds.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                ${stats.allocatedFunds.toLocaleString()} allocated
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Scholarships</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.activeScholarships}</div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>User Management</span>
              </CardTitle>
              <CardDescription>
                Manage all users and their roles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/dashboard/admin/users">
                  View All Users
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/admin/users/add">
                  Add New User
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-green-600" />
                <span>Applications</span>
              </CardTitle>
              <CardDescription>
                Review and manage scholarship applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/dashboard/admin/applications">
                  View Applications
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/admin/applications/pending">
                  Pending Reviews
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <span>Fund Management</span>
              </CardTitle>
              <CardDescription>
                Manage scholarship funds and allocations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/dashboard/admin/funds">
                  View Funds
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/admin/funds/allocate">
                  Allocate Funds
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Fund Allocation Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Fund Allocation Status</span>
            </CardTitle>
            <CardDescription>
              Current status of scholarship fund allocation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Available Funds</span>
                <span className="text-lg font-bold text-green-600">
                  ${stats.totalFunds.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Allocated Funds</span>
                <span className="text-lg font-bold text-blue-600">
                  ${stats.allocatedFunds.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Remaining Funds</span>
                <span className="text-lg font-bold text-orange-600">
                  ${(stats.totalFunds - stats.allocatedFunds).toLocaleString()}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Allocation Progress</span>
                  <span>{Math.round((stats.allocatedFunds / stats.totalFunds) * 100)}%</span>
                </div>
                <Progress value={(stats.allocatedFunds / stats.totalFunds) * 100} className="w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              Latest scholarship applications that need attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{app.studentName}</h4>
                      <p className="text-sm text-gray-600">{app.department}</p>
                      <p className="text-xs text-gray-500">Submitted {app.submitted}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(app.status)}>
                      {app.status.replace("_", " ")}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link href="/dashboard/admin/applications">
                  View All Applications
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>System Status</span>
              </CardTitle>
              <CardDescription>
                Current system health and performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">File Storage</span>
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Service</span>
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Payment Gateway</span>
                <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Upcoming Tasks</span>
              </CardTitle>
              <CardDescription>
                Important administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">Review Pending Applications</p>
                  <p className="text-sm text-gray-600">23 applications need review</p>
                </div>
                <Badge variant="destructive">Today</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium">Fund Allocation Review</p>
                  <p className="text-sm text-gray-600">Monthly budget review</p>
                </div>
                <Badge variant="secondary">This week</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">System Maintenance</p>
                  <p className="text-sm text-gray-600">Database optimization</p>
                </div>
                <Badge variant="outline">Next week</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Statistics</CardTitle>
            <CardDescription>
              Key metrics at a glance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.totalAlumni}</p>
                <p className="text-sm text-gray-600">Total Alumni</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.approvedToday}</p>
                <p className="text-sm text-gray-600">Approved Today</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  ${(stats.totalFunds - stats.allocatedFunds).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Available Funds</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round((stats.allocatedFunds / stats.totalFunds) * 100)}%
                </p>
                <p className="text-sm text-gray-600">Funds Utilized</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

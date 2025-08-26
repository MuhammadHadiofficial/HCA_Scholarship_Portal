"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Filter,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  PieChart,
  LineChart
} from "lucide-react";
import { useState } from "react";

export default function StaffReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("CURRENT_SEMESTER");
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");

  // Mock data - replace with real data later
  const periods = [
    { value: "CURRENT_SEMESTER", label: "Current Semester (Fall 2024)" },
    { value: "PREVIOUS_SEMESTER", label: "Previous Semester (Spring 2024)" },
    { value: "CURRENT_YEAR", label: "Current Year (2024)" },
    { value: "LAST_30_DAYS", label: "Last 30 Days" },
    { value: "CUSTOM", label: "Custom Range" }
  ];

  const departments = [
    { value: "ALL", label: "All Departments" },
    { value: "Computer Science", label: "Computer Science" },
    { value: "Engineering", label: "Engineering" },
    { value: "Business", label: "Business" },
    { value: "Medicine", label: "Medicine" },
    { value: "Arts", label: "Arts" }
  ];

  // Mock analytics data
  const analytics = {
    applications: {
      total: 156,
      pending: 23,
      underReview: 45,
      approved: 67,
      rejected: 21,
      trend: "+12%",
      trendDirection: "up"
    },
    scholarships: {
      total: 89,
      meritBased: 34,
      needBased: 28,
      welfare: 18,
      emergency: 9,
      totalAmount: 450000,
      averageAmount: 5056,
      trend: "+8%",
      trendDirection: "up"
    },
    students: {
      total: 234,
      active: 198,
      graduated: 28,
      suspended: 8,
      newThisSemester: 45,
      trend: "+15%",
      trendDirection: "up"
    },
    funds: {
      totalAvailable: 1250000,
      allocated: 890000,
      remaining: 360000,
      utilization: 71.2,
      trend: "+5%",
      trendDirection: "up"
    }
  };

  const departmentStats = [
    {
      name: "Computer Science",
      applications: 45,
      approved: 23,
      totalAwarded: 125000,
      avgCGPA: 3.6
    },
    {
      name: "Engineering",
      applications: 38,
      approved: 19,
      totalAwarded: 98000,
      avgCGPA: 3.4
    },
    {
      name: "Business",
      applications: 32,
      approved: 16,
      totalAwarded: 85000,
      avgCGPA: 3.3
    },
    {
      name: "Medicine",
      applications: 28,
      approved: 15,
      totalAwarded: 120000,
      avgCGPA: 3.8
    },
    {
      name: "Arts",
      applications: 13,
      approved: 6,
      totalAwarded: 32000,
      avgCGPA: 3.2
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "APPLICATION_APPROVED",
      description: "Ahmed Khan's scholarship application approved",
      amount: 5000,
      timestamp: "2024-08-22T10:30:00Z",
      status: "COMPLETED"
    },
    {
      id: 2,
      type: "DOCUMENT_VERIFIED",
      description: "Fatima Ali's documents verified",
      timestamp: "2024-08-22T09:15:00Z",
      status: "COMPLETED"
    },
    {
      id: 3,
      type: "FUND_ALLOCATED",
      description: "Emergency fund allocated for Omar Hassan",
      amount: 3000,
      timestamp: "2024-08-22T08:45:00Z",
      status: "COMPLETED"
    },
    {
      id: 4,
      type: "APPLICATION_SUBMITTED",
      description: "New application from Aisha Rahman",
      timestamp: "2024-08-22T08:00:00Z",
      status: "PENDING"
    }
  ];

  const getTrendColor = (direction: string) => {
    return direction === "up" ? "text-green-600" : "text-red-600";
  };

  const getTrendIcon = (direction: string) => {
    return direction === "up" ? TrendingUp : TrendingDown;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "APPLICATION_APPROVED": return CheckCircle;
      case "DOCUMENT_VERIFIED": return FileText;
      case "FUND_ALLOCATED": return DollarSign;
      case "APPLICATION_SUBMITTED": return Clock;
      default: return FileText;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "APPLICATION_APPROVED": return "text-green-600";
      case "DOCUMENT_VERIFIED": return "text-blue-600";
      case "FUND_ALLOCATED": return "text-purple-600";
      case "APPLICATION_SUBMITTED": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const generateReport = (type: string) => {
    // TODO: Implement report generation
    console.log(`Generating ${type} report for ${selectedPeriod}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">Comprehensive insights into scholarship applications, approvals, and fund utilization</p>
          </div>
          <div className="mt-4 sm:mt-0 space-x-3">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
            <CardDescription>Select time period and department for your analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {periods.map(period => (
                    <option key={period.value} value={period.value}>
                      {period.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.applications.total}</div>
              <div className="flex items-center space-x-2">
                {(() => {
                  const TrendIcon = getTrendIcon(analytics.applications.trendDirection);
                  return <TrendIcon className={`w-4 h-4 ${getTrendColor(analytics.applications.trendDirection)}`} />;
                })()}
                <span className={`text-sm ${getTrendColor(analytics.applications.trendDirection)}`}>
                  {analytics.applications.trend}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.applications.pending} pending review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Scholarships</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.scholarships.total}</div>
              <div className="flex items-center space-x-2">
                {(() => {
                  const TrendIcon = getTrendIcon(analytics.scholarships.trendDirection);
                  return <TrendIcon className={`w-4 h-4 ${getTrendColor(analytics.scholarships.trendDirection)}`} />;
                })()}
                <span className={`text-sm ${getTrendColor(analytics.scholarships.trendDirection)}`}>
                  {analytics.scholarships.trend}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ${analytics.scholarships.totalAmount.toLocaleString()} total awarded
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.students.active}</div>
              <div className="flex items-center space-x-2">
                {(() => {
                  const TrendIcon = getTrendIcon(analytics.students.trendDirection);
                  return <TrendIcon className={`w-4 h-4 ${getTrendColor(analytics.students.trendDirection)}`} />;
                })()}
                <span className={`text-sm ${getTrendColor(analytics.students.trendDirection)}`}>
                  {analytics.students.trend}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.students.newThisSemester} new this semester
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fund Utilization</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.funds.utilization}%</div>
              <div className="flex items-center space-x-2">
                {(() => {
                  const TrendIcon = getTrendIcon(analytics.funds.trendDirection);
                  return <TrendIcon className={`w-4 h-4 ${getTrendColor(analytics.funds.trendDirection)}`} />;
                })()}
                <span className={`text-sm ${getTrendColor(analytics.funds.trendDirection)}`}>
                  {analytics.funds.trend}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ${analytics.funds.remaining.toLocaleString()} remaining
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Scholarship statistics by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Department</th>
                    <th className="text-center py-3 px-4 font-medium">Applications</th>
                    <th className="text-center py-3 px-4 font-medium">Approved</th>
                    <th className="text-center py-3 px-4 font-medium">Total Awarded</th>
                    <th className="text-center py-3 px-4 font-medium">Avg CGPA</th>
                    <th className="text-center py-3 px-4 font-medium">Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentStats.map((dept, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{dept.name}</td>
                      <td className="text-center py-3 px-4">{dept.applications}</td>
                      <td className="text-center py-3 px-4">{dept.approved}</td>
                      <td className="text-center py-3 px-4">${dept.totalAwarded.toLocaleString()}</td>
                      <td className="text-center py-3 px-4">{dept.avgCGPA}</td>
                      <td className="text-center py-3 px-4">
                        <Badge variant="outline" className={
                          (dept.approved / dept.applications * 100) >= 70 ? "bg-green-100 text-green-800" :
                          (dept.approved / dept.applications * 100) >= 50 ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }>
                          {((dept.approved / dept.applications) * 100).toFixed(1)}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest scholarship-related activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map(activity => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full bg-gray-100 ${getActivityColor(activity.type)}`}>
                        <ActivityIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</span>
                          {activity.amount && (
                            <Badge variant="outline" className="text-xs">
                              ${activity.amount.toLocaleString()}
                            </Badge>
                          )}
                          <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Generate reports and export data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => generateReport("applications")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Applications Report
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => generateReport("scholarships")}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Scholarships Report
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => generateReport("funds")}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Fund Utilization Report
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => generateReport("department")}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Department Performance
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => generateReport("comprehensive")}
                >
                  <PieChart className="w-4 h-4 mr-2" />
                  Comprehensive Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Analytics</CardTitle>
            <CardDescription>Detailed insights and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{analytics.scholarships.averageAmount}</div>
                <p className="text-sm text-gray-600">Average Scholarship Amount</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {((analytics.applications.approved / analytics.applications.total) * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600">Overall Approval Rate</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {analytics.scholarships.meritBased + analytics.scholarships.needBased}
                </div>
                <p className="text-sm text-gray-600">Academic Scholarships</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

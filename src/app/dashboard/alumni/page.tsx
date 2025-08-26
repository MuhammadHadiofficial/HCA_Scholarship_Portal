"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Calendar,
  Upload,
  Award,
  Users,
  FileText
} from "lucide-react";
import Link from "next/link";

export default function AlumniDashboardPage() {
  // Mock data - replace with real data later
  const alumniInfo = {
    name: "Ahmed Khan",
    alumniId: "ALUM001",
    graduationYear: 2020,
    department: "Computer Science",
    category: "GOLD",
    rank: "GOLD",
    totalContributed: 5000,
    totalPledged: 10000
  };

  const pledges = [
    { id: 1, amount: 2000, status: "ACTIVE", semester: "Fall 2024", date: "2024-08-01" },
    { id: 2, amount: 3000, status: "PENDING", semester: "Spring 2025", date: "2024-08-15" },
  ];

  const payments = [
    { id: 1, amount: 1000, status: "VERIFIED", date: "2024-08-10", receipt: "receipt1.pdf" },
    { id: 2, amount: 500, status: "PENDING_VERIFICATION", date: "2024-08-12", receipt: "receipt2.pdf" },
  ];

  const impact = {
    studentsSupported: 15,
    totalFunds: 25000,
    scholarshipsFunded: 8,
    currentSemester: "Fall 2024"
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "VERIFIED": return "bg-green-100 text-green-800";
      case "PENDING_VERIFICATION": return "bg-blue-100 text-blue-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "DIAMOND": return "bg-purple-100 text-purple-800";
      case "PLATINUM": return "bg-blue-100 text-blue-800";
      case "GOLD": return "bg-yellow-100 text-yellow-800";
      case "SILVER": return "bg-gray-100 text-gray-800";
      case "BRONZE": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alumni Dashboard</h1>
            <p className="text-gray-600">Welcome back, {alumniInfo.name}</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Events Calendar
            </Button>
            <Button>
              <DollarSign className="w-4 h-4 mr-2" />
              Make Pledge
            </Button>
          </div>
        </div>

        {/* Alumni Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-red-600" />
              <span>Alumni Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Alumni ID</p>
                <p className="text-xl font-bold">{alumniInfo.alumniId}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Graduation Year</p>
                <p className="text-xl font-bold">{alumniInfo.graduationYear}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Department</p>
                <p className="text-xl font-bold">{alumniInfo.department}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Category</p>
                <Badge className={getCategoryColor(alumniInfo.category)}>
                  {alumniInfo.category}
                </Badge>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Digital Signature</p>
              <p className="text-lg font-semibold text-blue-600">{alumniInfo.alumniId}_SIG_2024</p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contributed</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${alumniInfo.totalContributed.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Lifetime contributions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Pledges</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ${alumniInfo.totalPledged.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {pledges.filter(p => p.status === "ACTIVE").length} active pledges
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students Supported</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {impact.studentsSupported}
              </div>
              <p className="text-xs text-muted-foreground">
                Through your contributions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scholarships Funded</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {impact.scholarshipsFunded}
              </div>
              <p className="text-xs text-muted-foreground">
                Directly funded
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span>Make Pledge</span>
              </CardTitle>
              <CardDescription>
                Pledge funds for student scholarships
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/dashboard/alumni/pledges/new">
                  New Pledge
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/alumni/pledges">
                  View Pledges
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-blue-600" />
                <span>Payment Records</span>
              </CardTitle>
              <CardDescription>
                Upload payment receipts and track contributions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/dashboard/alumni/payments">
                  View Payments
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/alumni/payments/upload">
                  Upload Receipt
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Impact Tracking</span>
              </CardTitle>
              <CardDescription>
                See how your contributions make a difference
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/dashboard/alumni/impact">
                  View Impact
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/alumni/students">
                  Meet Students
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Active Pledges */}
        <Card>
          <CardHeader>
            <CardTitle>Active Pledges</CardTitle>
            <CardDescription>
              Your current scholarship pledges and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pledges.map((pledge) => (
                <div key={pledge.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">${pledge.amount.toLocaleString()} Pledge</h4>
                      <p className="text-sm text-gray-600">{pledge.semester}</p>
                      <p className="text-xs text-gray-500">Pledged: {pledge.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(pledge.status)}>
                      {pledge.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link href="/dashboard/alumni/pledges">
                  View All Pledges
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>
              Track your payment history and verification status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">${payment.amount.toLocaleString()} Payment</h4>
                      <p className="text-sm text-gray-600">Receipt: {payment.receipt}</p>
                      <p className="text-xs text-gray-500">Date: {payment.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status.replace("_", " ")}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Receipt
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Impact Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Your Impact</span>
            </CardTitle>
            <CardDescription>
              See how your contributions are making a difference
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Funds Contributed</span>
                  <span className="text-lg font-bold text-green-600">
                    ${impact.totalFunds.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Students Supported</span>
                  <span className="text-lg font-bold text-blue-600">
                    {impact.studentsSupported}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Scholarships Funded</span>
                  <span className="text-lg font-bold text-purple-600">
                    {impact.scholarshipsFunded}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Contribution Progress</p>
                  <Progress value={75} className="w-full" />
                  <p className="text-xs text-gray-600 mt-2">75% of annual goal reached</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Current Semester</p>
                  <p className="text-lg font-bold text-blue-700">{impact.currentSemester}</p>
                  <p className="text-xs text-blue-600">Active contribution period</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span>Upcoming Alumni Events</span>
            </CardTitle>
            <CardDescription>
              Connect with fellow alumni and stay updated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium">Alumni Meet & Greet</p>
                  <p className="text-sm text-gray-600">Network with current students and faculty</p>
                </div>
                <Badge variant="secondary">Next week</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Scholarship Award Ceremony</p>
                  <p className="text-sm text-gray-600">Celebrate scholarship recipients</p>
                </div>
                <Badge variant="outline">2 weeks</Badge>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link href="/dashboard/alumni/events">
                  View All Events
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

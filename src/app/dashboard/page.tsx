"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  GraduationCap,
  Building2,
  Heart,
  Shield,
  Users,
  FileText,
  Award,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  BookOpen,
  Settings,
  UserPlus,
  FileSpreadsheet,
  PieChart,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/signin">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const roleConfig = {
    ADMIN: {
      icon: Shield,
      color: "from-red-500 to-orange-600",
      bgColor: "bg-red-50",
      title: "Admin Dashboard",
      description: "System administration and comprehensive oversight",
      stats: [
        { label: "Total Users", value: "1,247", icon: Users, color: "text-blue-600" },
        { label: "Applications", value: "892", icon: FileText, color: "text-green-600" },
        { label: "Scholarships", value: "156", icon: Award, color: "text-purple-600" },
        { label: "Total Funding", value: "$2.4M", icon: DollarSign, color: "text-emerald-600" },
      ],
      quickActions: [
        { href: "/dashboard/admin/users", label: "User Management", icon: Users, color: "bg-blue-100 text-blue-700" },
        { href: "/dashboard/admin/applications", label: "Applications", icon: FileText, color: "bg-green-100 text-green-700" },
        { href: "/dashboard/admin/reports", label: "Reports", icon: BarChart3, color: "bg-purple-100 text-purple-700" },
        { href: "/dashboard/admin/settings", label: "Settings", icon: Settings, color: "bg-gray-100 text-gray-700" },
      ],
    },
    STAFF: {
      icon: Building2,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      title: "Staff Dashboard",
      description: "Review applications and manage scholarship processes",
      stats: [
        { label: "Pending Reviews", value: "23", icon: Clock, color: "text-orange-600" },
        { label: "Reviewed Today", value: "12", icon: CheckCircle, color: "text-green-600" },
        { label: "Total Students", value: "456", icon: Users, color: "text-blue-600" },
        { label: "Approved Apps", value: "89", icon: Award, color: "text-purple-600" },
      ],
      quickActions: [
        { href: "/dashboard/staff/applications", label: "Review Applications", icon: FileText, color: "bg-blue-100 text-blue-700" },
        { href: "/dashboard/staff/students", label: "Student Management", icon: Users, color: "bg-green-100 text-green-700" },
        { href: "/dashboard/staff/reports", label: "Reports", icon: BarChart3, color: "bg-purple-100 text-purple-700" },
      ],
    },
    STUDENT: {
      icon: GraduationCap,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      title: "Student Dashboard",
      description: "Track your scholarship applications and academic progress",
      stats: [
        { label: "Active Applications", value: "3", icon: FileText, color: "text-blue-600" },
        { label: "Approved Scholarships", value: "1", icon: Award, color: "text-green-600" },
        { label: "Total Received", value: "$5,000", icon: DollarSign, color: "text-emerald-600" },
        { label: "CGPA", value: "3.8", icon: TrendingUp, color: "text-purple-600" },
      ],
      quickActions: [
        { href: "/dashboard/student/applications", label: "My Applications", icon: FileText, color: "bg-blue-100 text-blue-700" },
        { href: "/dashboard/student/scholarships", label: "Scholarships", icon: Award, color: "bg-green-100 text-green-700" },
        { href: "/dashboard/student/profile", label: "Profile", icon: Users, color: "bg-purple-100 text-purple-700" },
        { href: "/guidelines", label: "Guidelines", icon: BookOpen, color: "bg-orange-100 text-orange-700" },
      ],
    },
    ALUMNI: {
      icon: Heart,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      title: "Alumni Dashboard",
      description: "Contribute to student success and stay connected",
      stats: [
        { label: "Total Pledged", value: "$15,000", icon: DollarSign, color: "text-green-600" },
        { label: "Total Contributed", value: "$8,500", icon: TrendingUp, color: "text-blue-600" },
        { label: "Students Helped", value: "12", icon: Users, color: "text-purple-600" },
        { label: "Active Pledges", value: "3", icon: Award, color: "text-orange-600" },
      ],
      quickActions: [
        { href: "/dashboard/alumni/pledges", label: "My Pledges", icon: Award, color: "bg-purple-100 text-purple-700" },
        { href: "/dashboard/alumni/donate", label: "Donate", icon: Heart, color: "bg-pink-100 text-pink-700" },
        { href: "/dashboard/alumni/profile", label: "Profile", icon: Users, color: "bg-blue-100 text-blue-700" },
      ],
    },
  };

  const config = roleConfig[user.role as keyof typeof roleConfig];
  const IconComponent = config?.icon || Users;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className={`${config.bgColor} border-b`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className={`w-16 h-16 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center`}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{config.title}</h1>
              <p className="text-lg text-gray-600">{config.description}</p>
            </div>
            <Badge variant="secondary" className={`${config.color.replace('from-', 'bg-').replace('to-', '')} text-white ml-auto`}>
              {user.role}
            </Badge>
          </div>

          {/* Welcome Message */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome back, {user.name}!
            </h2>
            <p className="text-gray-600">
              Here's what's happening with your {user.role.toLowerCase()} account today.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {config.stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color.replace('text-', 'bg-').replace('-600', '-100')} rounded-full flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {config.quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.label}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity & Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Application submitted</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Profile updated</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Guidelines reviewed</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                System Status
              </CardTitle>
              <CardDescription>Current platform status and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">Platform Online</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-800">Applications Open</span>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
                    <span className="text-sm font-medium text-orange-800">Maintenance</span>
                  </div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">Scheduled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Resources */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Resources & Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Guidelines
                </CardTitle>
                <CardDescription>Current scholarship guidelines and policies</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/guidelines">
                  <Button variant="outline" className="w-full">View Guidelines</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Public Dashboard
                </CardTitle>
                <CardDescription>View overall platform statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/public">
                  <Button variant="outline" className="w-full">View Dashboard</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Help & Support
                </CardTitle>
                <CardDescription>Get help and contact support</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Contact Support</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


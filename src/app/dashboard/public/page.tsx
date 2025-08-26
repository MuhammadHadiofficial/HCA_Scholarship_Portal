"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar,
  Filter,
  Download,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { usePublicDashboardData } from "@/lib/hooks/use-program-funds";

export default function PublicDashboardPage() {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "",
    intakeYear: "",
  });

  const { data: dashboardData, isLoading, error } = usePublicDashboardData(filters);
  const { funds = [], pledges = [], payments = [], statistics, categoryBreakdown } = dashboardData || {};

  const categories = [
    "Student Welfare",
    "Learning Programs", 
    "Events",
    "Hackathons",
    "Courses",
    "Skills Development",
    "Student Support",
    "Research",
    "Innovation"
  ];

  const intakeYears = ["2024", "2023", "2022", "2021", "2020"];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      category: "",
      intakeYear: "",
    });
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number, total: number) => {
    if (total === 0) return "0%";
    return `${((value / total) * 100).toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error loading dashboard data</div>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            HCA Scholarship Portal
          </h1>
          <p className="text-xl text-gray-600">
            Transparency in Action - Track Our Impact
          </p>
          <p className="text-gray-500 mt-2">
            See how alumni contributions are making a difference in student lives
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filter Dashboard Data</span>
            </CardTitle>
            <CardDescription>
              Filter funds and spending by date, category, and intake year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={filters.category} 
                  onValueChange={(value) => handleFilterChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="intakeYear">Intake Year</Label>
                <Select 
                  value={filters.intakeYear} 
                  onValueChange={(value) => handleFilterChange("intakeYear", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Years</SelectItem>
                    {intakeYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funds Available</CardTitle>
              <DollarSign className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(statistics?.totalFunds || 0)}
              </div>
              <p className="text-xs text-gray-500">
                Across all program categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Allocated</CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(statistics?.totalAllocated || 0)}
              </div>
              <p className="text-xs text-gray-500">
                {formatPercentage(statistics?.totalAllocated || 0, statistics?.totalFunds || 0)} of total funds
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alumni Pledged</CardTitle>
              <Users className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(statistics?.totalPledged || 0)}
              </div>
              <p className="text-xs text-gray-500">
                From {pledges.length} alumni pledges
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alumni Paid</CardTitle>
              <TrendingDown className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(statistics?.totalPaid || 0)}
              </div>
              <p className="text-xs text-gray-500">
                From {payments.filter(p => p.status === "CONFIRMED").length} confirmed payments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>Funds by Category</span>
            </CardTitle>
            <CardDescription>
              Distribution of funds across different program categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(categoryBreakdown || {}).map(([category, data]) => (
                <div key={category} className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total:</span>
                      <span className="font-medium">{formatCurrency(data.total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Allocated:</span>
                      <span className="font-medium text-blue-600">{formatCurrency(data.allocated)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Remaining:</span>
                      <span className="font-medium text-green-600">{formatCurrency(data.remaining)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${formatPercentage(data.allocated, data.total)}` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Funds */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Recent Program Funds</span>
              </CardTitle>
              <CardDescription>
                Latest program funds created
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {funds.slice(0, 5).map((fund) => (
                  <div key={fund.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{fund.name}</h4>
                      <p className="text-sm text-gray-600">{fund.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(fund.amount)}</div>
                      <Badge variant={fund.isActive ? "default" : "secondary"}>
                        {fund.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Pledges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Recent Alumni Pledges</span>
              </CardTitle>
              <CardDescription>
                Latest pledges from alumni
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pledges.slice(0, 5).map((pledge) => (
                  <div key={pledge.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{pledge.alumni.user.name}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(pledge.pledgeDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(pledge.amount, pledge.currency)}</div>
                      <Badge variant={
                        pledge.status === "FULFILLED" ? "default" :
                        pledge.status === "CONFIRMED" ? "secondary" :
                        "outline"
                      }>
                        {pledge.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export and Additional Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-medium">Need More Details?</h3>
                <p className="text-gray-600">
                  Contact our team for detailed reports and specific information
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


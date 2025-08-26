"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  Plus, 
  DollarSign, 
  Calendar, 
  GraduationCap,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { useAllScholarships, useScholarshipStats } from "@/lib/hooks/use-scholarship-data";
import ScholarshipCreationDialog from "@/components/scholarship/scholarship-creation-dialog";
import DisbursementDialog from "@/components/scholarship/disbursement-dialog";

export default function StaffScholarshipsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const { data: scholarshipsData, isLoading } = useAllScholarships();
  const { data: statsData } = useScholarshipStats();
  
  const scholarships = scholarshipsData?.scholarships || [];
  const stats = statsData || {};

  // Filter scholarships based on search and filters
  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch = !searchTerm || 
      scholarship.application?.student?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.application?.student?.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.application?.intake?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "ALL" || scholarship.type === typeFilter;
    const matchesStatus = statusFilter === "ALL" || scholarship.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getScholarshipTypeIcon = (type: string) => {
    switch (type) {
      case "FULL_SEMESTER":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "PARTIAL_SEMESTER":
        return <DollarSign className="w-4 h-4 text-blue-600" />;
      case "ONE_TIME":
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-green-100 text-green-800";
      case "DISBURSED": return "bg-blue-100 text-blue-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      case "EXPIRED": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED": return <Clock className="w-4 h-4" />;
      case "DISBURSED": return <CheckCircle className="w-4 h-4" />;
      case "CANCELLED": return <AlertCircle className="w-4 h-4" />;
      case "EXPIRED": return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const calculateDisbursedAmount = (scholarship: any) => {
    return scholarship.disbursements?.reduce((sum: number, d: any) => sum + d.amount, 0) || 0;
  };

  if (isLoading) {
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
            Scholarship Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and track all scholarship awards and disbursements
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scholarships</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalScholarships || 0}</div>
              <p className="text-xs text-muted-foreground">
                All time awards
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Awarded</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${(stats.totalAwarded || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Total scholarship value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ${(stats.totalDisbursed || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Amount paid out
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Disbursements</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                ${((stats.totalAwarded || 0) - (stats.totalDisbursed || 0)).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Remaining to disburse
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by student name, ID, or intake..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="FULL_SEMESTER">Full Semester</SelectItem>
                    <SelectItem value="PARTIAL_SEMESTER">Partial Semester</SelectItem>
                    <SelectItem value="ONE_TIME">One Time</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="DISBURSED">Disbursed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="EXPIRED">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scholarships Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Scholarships</CardTitle>
                <CardDescription>
                  {filteredScholarships.length} scholarships found
                </CardDescription>
              </div>
              <ScholarshipCreationDialog
                application={selectedApplication}
                trigger={
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Scholarship
                  </Button>
                }
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredScholarships.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No scholarships found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Disbursed</TableHead>
                    <TableHead>Intake</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredScholarships.map((scholarship) => (
                    <TableRow key={scholarship.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {scholarship.application?.student?.user?.name || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {scholarship.application?.student?.studentId || "N/A"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getScholarshipTypeIcon(scholarship.type)}
                          <span className="text-sm">
                            {scholarship.type.replace("_", " ")}
                          </span>
                        </div>
                        {scholarship.isRecurring && (
                          <Badge variant="outline" className="mt-1">
                            Recurring
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-lg font-bold text-green-600">
                          ${scholarship.amount.toLocaleString()}
                        </div>
                        {scholarship.isRecurring && scholarship.recurringSemesters && (
                          <div className="text-xs text-gray-500">
                            {scholarship.recurringSemesters.length} semester(s)
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(scholarship.status)}>
                          {getStatusIcon(scholarship.status)}
                          <span className="ml-1">{scholarship.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-blue-600">
                            ${calculateDisbursedAmount(scholarship).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            of ${scholarship.amount.toLocaleString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {scholarship.application?.intake?.name || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {scholarship.application?.intake?.semester} {scholarship.application?.intake?.year}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <DisbursementDialog
                            scholarship={scholarship}
                            trigger={
                              <Button variant="outline" size="sm">
                                <DollarSign className="w-4 h-4 mr-1" />
                                Disburse
                              </Button>
                            }
                          />
                          <Button variant="outline" size="sm">
                            <Calendar className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

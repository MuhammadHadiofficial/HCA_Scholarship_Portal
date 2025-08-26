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
  Users, 
  CheckCircle, 
  Clock, 
  Crown,
  Star,
  User,
  Building2,
  MapPin,
  Calendar
} from "lucide-react";
import { useAllAlumniProfiles, useAlumniStats } from "@/lib/hooks/use-alumni-onboarding";
import AlumniVerificationDialog from "@/components/alumni/alumni-verification-dialog";
import { useAuth } from "@/contexts/auth-context";

export default function AdminAlumniPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: alumniData, isLoading } = useAllAlumniProfiles();
  const { data: statsData } = useAlumniStats();

  const alumniProfiles = alumniData?.alumniProfiles || [];
  const stats = statsData || {};

  // Filter alumni profiles
  const filteredAlumni = alumniProfiles.filter((alumni) => {
    const matchesSearch = 
      alumni.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.alumniId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.department?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "verified" && alumni.isVerified) ||
      (statusFilter === "pending" && !alumni.isVerified);

    const matchesCategory = categoryFilter === "all" || alumni.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (isVerified: boolean) => {
    if (isVerified) {
      return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "BASIC": return <User className="w-4 h-4" />;
      case "SILVER": return <Star className="w-4 h-4" />;
      case "GOLD": return <Crown className="w-4 h-4" />;
      case "PLATINUM": return <Crown className="w-4 h-4" />;
      case "DIAMOND": return <Crown className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "BASIC": return "bg-gray-100 text-gray-800";
      case "SILVER": return "bg-gray-200 text-gray-800";
      case "GOLD": return "bg-yellow-100 text-yellow-800";
      case "PLATINUM": return "bg-blue-100 text-blue-800";
      case "DIAMOND": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "BRONZE": return "bg-orange-100 text-orange-800";
      case "SILVER": return "bg-gray-200 text-gray-800";
      case "GOLD": return "bg-yellow-100 text-yellow-800";
      case "PLATINUM": return "bg-blue-100 text-blue-800";
      case "DIAMOND": return "bg-purple-100 text-purple-800";
      default: return "bg-orange-100 text-orange-800";
    }
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

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">Access Denied</div>
            <p className="text-gray-600">You must be logged in as an administrator to view this page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading alumni data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Alumni Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage alumni profiles, verification, and category assignments
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.totalAlumni || 0}
                  </div>
                  <div className="text-sm text-gray-500">Total Alumni</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.verifiedAlumni || 0}
                  </div>
                  <div className="text-sm text-gray-500">Verified</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.pendingVerification || 0}
                  </div>
                  <div className="text-sm text-gray-500">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    ${(stats.totalContributed || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Total Contributed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Search alumni..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="BASIC">Basic</SelectItem>
                    <SelectItem value="SILVER">Silver</SelectItem>
                    <SelectItem value="GOLD">Gold</SelectItem>
                    <SelectItem value="PLATINUM">Platinum</SelectItem>
                    <SelectItem value="DIAMOND">Diamond</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-gray-500 flex items-center">
                {filteredAlumni.length} of {alumniProfiles.length} alumni
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alumni Table */}
        <Card>
          <CardHeader>
            <CardTitle>Alumni Profiles</CardTitle>
            <CardDescription>
              Manage and verify alumni profiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAlumni.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No alumni profiles found matching your criteria.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alumni</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead>Graduation</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlumni.map((alumni) => (
                    <TableRow key={alumni.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{alumni.user?.name || "N/A"}</div>
                          <div className="text-sm text-gray-500">{alumni.user?.email}</div>
                          <div className="text-xs text-gray-400 font-mono">{alumni.alumniId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span>{alumni.department}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(alumni.isVerified)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(alumni.category)}>
                          {getCategoryIcon(alumni.category)}
                          <span className="ml-1">{alumni.category}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRankColor(alumni.rank)}>
                          {alumni.rank}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{alumni.graduationYear}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <AlumniVerificationDialog
                            alumni={alumni}
                            verifierId={user?.adminProfile?.adminId || ""} // Get from auth context
                            trigger={
                              <Button variant="outline" size="sm">
                                {alumni.isVerified ? "Update" : "Verify"}
                              </Button>
                            }
                          />
                          <Button variant="outline" size="sm">
                            View Details
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

        {/* Category Distribution */}
        {stats.categoryDistribution && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>
                Breakdown of alumni by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {stats.categoryDistribution.map((cat: any) => (
                  <div key={cat.category} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {cat._count.category}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                      {cat.category}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

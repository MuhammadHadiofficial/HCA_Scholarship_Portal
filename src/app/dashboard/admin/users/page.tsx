"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

export default function AdminUsersPage() {
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  useEffect(() => {
    const loadData = async () => {
      try {
        // TODO: Implement getUsers server action
        // For now, using mock data
        const mockUsers = [
          {
            id: "1",
            name: "Alice Student",
            email: "student@hca.edu",
            role: "STUDENT",
            createdAt: new Date("2024-01-15"),
            studentProfile: { studentId: "STU001", department: "Computer Science" },
          },
          {
            id: "2",
            name: "John Staff",
            email: "staff@hca.edu",
            role: "STAFF",
            createdAt: new Date("2024-01-10"),
            staffProfile: { staffId: "STAFF001", department: "Student Affairs" },
          },
          {
            id: "3",
            name: "Bob Alumni",
            email: "alumni@hca.edu",
            role: "ALUMNI",
            createdAt: new Date("2024-01-05"),
            alumniProfile: { alumniId: "ALUM001", isVerified: true },
          },
          {
            id: "4",
            name: "Admin User",
            email: "admin@hca.edu",
            role: "ADMIN",
            createdAt: new Date("2024-01-01"),
            adminProfile: { adminId: currentUser?.adminProfile?.adminId || "ADMIN001" },
          },
        ];

        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (roleFilter !== "ALL") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      STUDENT: { variant: "default", text: "Student" },
      STAFF: { variant: "secondary", text: "Staff" },
      ALUMNI: { variant: "outline", text: "Alumni" },
      ADMIN: { variant: "destructive", text: "Admin" },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.STUDENT;
    return <Badge variant={config.variant as any}>{config.text}</Badge>;
  };

  const getProfileInfo = (user: any) => {
    switch (user.role) {
      case "STUDENT":
        return user.studentProfile ? `ID: ${user.studentProfile.studentId}` : "No profile";
      case "STAFF":
        return user.staffProfile ? `ID: ${user.staffProfile.staffId}` : "No profile";
      case "ALUMNI":
        return user.alumniProfile ? `ID: ${user.alumniProfile.alumniId}` : "No profile";
      case "ADMIN":
        return user.adminProfile ? `ID: ${user.adminProfile.adminId}` : "No profile";
      default:
        return "No profile";
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

  if (!currentUser || currentUser.role !== "ADMIN") {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage all users in the scholarship portal
          </p>
        </div>

        <div className="grid gap-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {users.filter((user) => user.role === "STUDENT").length}
                </div>
                <div className="text-sm text-gray-500">Students</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {users.filter((user) => user.role === "STAFF").length}
                </div>
                <div className="text-sm text-gray-500">Staff</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {users.filter((user) => user.role === "ALUMNI").length}
                </div>
                <div className="text-sm text-gray-500">Alumni</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {users.filter((user) => user.role === "ADMIN").length}
                </div>
                <div className="text-sm text-gray-500">Admins</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Roles</SelectItem>
                    <SelectItem value="STUDENT">Students</SelectItem>
                    <SelectItem value="STAFF">Staff</SelectItem>
                    <SelectItem value="ALUMNI">Alumni</SelectItem>
                    <SelectItem value="ADMIN">Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                {filteredUsers.length} users found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No users found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Profile Info</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="font-medium">{user.name}</div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500">
                            {getProfileInfo(user)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/dashboard/admin/users/${user.id}`}>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
                            <Link href={`/dashboard/admin/users/${user.id}/edit`}>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Link href="/dashboard/admin/users/new">
                  <Button>Add New User</Button>
                </Link>
                <Link href="/dashboard/admin/users/import">
                  <Button variant="outline">Import Users</Button>
                </Link>
                <Link href="/dashboard/admin/users/export">
                  <Button variant="outline">Export Users</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  FileText,
  GraduationCap,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building2
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function StaffStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("ALL");
  const [filterYear, setFilterYear] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Mock data - replace with real data later
  const students = [
    {
      id: 1,
      studentId: "STU001",
      name: "Ahmed Khan",
      email: "ahmed.khan@student.edu",
      phone: "+92-300-1234567",
      department: "Computer Science",
      year: "3rd Year",
      semester: "Fall 2024",
      cgpa: 3.8,
      meritRank: 15,
      status: "ACTIVE",
      applications: 2,
      scholarships: 1,
      totalAwarded: 8000,
      address: "House 123, Street 45, Islamabad",
      emergencyContact: "Father: +92-300-9876543",
      lastUpdated: "2024-08-20"
    },
    {
      id: 2,
      studentId: "STU002",
      name: "Fatima Ali",
      email: "fatima.ali@student.edu",
      phone: "+92-300-2345678",
      department: "Engineering",
      year: "2nd Year",
      semester: "Fall 2024",
      cgpa: 3.2,
      meritRank: 45,
      status: "ACTIVE",
      applications: 1,
      scholarships: 0,
      totalAwarded: 0,
      address: "Apartment 7B, Block C, Lahore",
      emergencyContact: "Mother: +92-300-8765432",
      lastUpdated: "2024-08-18"
    },
    {
      id: 3,
      studentId: "STU003",
      name: "Omar Hassan",
      email: "omar.hassan@student.edu",
      phone: "+92-300-3456789",
      department: "Business",
      year: "4th Year",
      semester: "Fall 2024",
      cgpa: 3.5,
      meritRank: 28,
      status: "ACTIVE",
      applications: 3,
      scholarships: 2,
      totalAwarded: 12000,
      address: "Villa 25, Garden Town, Karachi",
      emergencyContact: "Guardian: +92-300-7654321",
      lastUpdated: "2024-08-19"
    },
    {
      id: 4,
      studentId: "STU004",
      name: "Aisha Rahman",
      email: "aisha.rahman@student.edu",
      phone: "+92-300-4567890",
      department: "Medicine",
      year: "5th Year",
      semester: "Fall 2024",
      cgpa: 3.9,
      meritRank: 8,
      status: "ACTIVE",
      applications: 1,
      scholarships: 1,
      totalAwarded: 15000,
      address: "House 78, Medical Colony, Rawalpindi",
      emergencyContact: "Father: +92-300-6543210",
      lastUpdated: "2024-08-17"
    },
    {
      id: 5,
      studentId: "STU005",
      name: "Hassan Malik",
      email: "hassan.malik@student.edu",
      phone: "+92-300-5678901",
      department: "Arts",
      year: "1st Year",
      semester: "Fall 2024",
      cgpa: 3.1,
      meritRank: 52,
      status: "ACTIVE",
      applications: 1,
      scholarships: 0,
      totalAwarded: 0,
      address: "Studio 12, Artists Quarter, Faisalabad",
      emergencyContact: "Sister: +92-300-5432109",
      lastUpdated: "2024-08-21"
    },
    {
      id: 6,
      studentId: "STU006",
      name: "Zara Ahmed",
      email: "zara.ahmed@student.edu",
      phone: "+92-300-6789012",
      department: "Computer Science",
      year: "2nd Year",
      semester: "Fall 2024",
      cgpa: 3.6,
      meritRank: 22,
      status: "INACTIVE",
      applications: 0,
      scholarships: 0,
      totalAwarded: 0,
      address: "Flat 15, Tech Hub, Islamabad",
      emergencyContact: "Father: +92-300-4321098",
      lastUpdated: "2024-08-15"
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

  const years = [
    { value: "ALL", label: "All Years" },
    { value: "1st Year", label: "1st Year" },
    { value: "2nd Year", label: "2nd Year" },
    { value: "3rd Year", label: "3rd Year" },
    { value: "4th Year", label: "4th Year" },
    { value: "5th Year", label: "5th Year" }
  ];

  const statuses = [
    { value: "ALL", label: "All Statuses" },
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "GRADUATED", label: "Graduated" },
    { value: "SUSPENDED", label: "Suspended" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800";
      case "INACTIVE": return "bg-gray-100 text-gray-800";
      case "GRADUATED": return "bg-blue-100 text-blue-800";
      case "SUSPENDED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCGPAColor = (cgpa: number) => {
    if (cgpa >= 3.8) return "text-green-600";
    if (cgpa >= 3.5) return "text-blue-600";
    if (cgpa >= 3.0) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "ALL" || student.department === filterDepartment;
    const matchesYear = filterYear === "ALL" || student.year === filterYear;
    const matchesStatus = filterStatus === "ALL" || student.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesYear && matchesStatus;
  });

  const stats = {
    total: students.length,
    active: students.filter(student => student.status === "ACTIVE").length,
    applications: students.reduce((sum, student) => sum + student.applications, 0),
    totalAwarded: students.reduce((sum, student) => sum + student.totalAwarded, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
            <p className="text-gray-600 mt-2">Manage student records, profiles, and academic information</p>
          </div>
          <div className="mt-4 sm:mt-0 space-x-3">
            <Button asChild>
              <Link href="/dashboard/staff/students/add">
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Link>
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Registered students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground">Currently enrolled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.applications}</div>
              <p className="text-xs text-muted-foreground">Scholarship applications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Awarded</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">${stats.totalAwarded.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Scholarship funds distributed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Student Directory</CardTitle>
            <CardDescription>Search and filter students by various criteria</CardDescription>
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
              <div className="sm:w-40">
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
              <div className="sm:w-32">
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {years.map(year => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:w-32">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <div className="space-y-4">
          {filteredStudents.map(student => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">{student.name}</h3>
                      <Badge variant="outline">{student.studentId}</Badge>
                      <Badge className={getStatusColor(student.status)}>
                        {student.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Building2 className="w-4 h-4 mr-1" />
                        {student.department}
                      </span>
                      <span className="flex items-center">
                        <GraduationCap className="w-4 h-4 mr-1" />
                        {student.year} - {student.semester}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        ${student.totalAwarded.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/staff/students/${student.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/staff/students/${student.id}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Academic Performance</p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-semibold ${getCGPAColor(student.cgpa)}`}>
                        CGPA: {student.cgpa}
                      </span>
                      <span className="text-sm text-gray-500">Rank: #{student.meritRank}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Applications</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold">{student.applications}</span>
                      <span className="text-sm text-gray-500">submitted</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Scholarships</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold">{student.scholarships}</span>
                      <span className="text-sm text-gray-500">awarded</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Updated</p>
                    <p className="text-sm">{student.lastUpdated}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Contact Information</p>
                      <div className="space-y-1 mt-1">
                        <div className="flex items-center text-sm">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {student.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {student.phone}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Address</p>
                      <div className="flex items-start text-sm mt-1">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                        <span className="text-gray-700">{student.address}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">Emergency Contact</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      {student.emergencyContact}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Student ID: {student.studentId}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/staff/students/${student.id}/applications`}>
                        <FileText className="w-4 h-4 mr-1" />
                        View Applications
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/staff/students/${student.id}/scholarships`}>
                        <DollarSign className="w-4 h-4 mr-1" />
                        View Scholarships
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No students found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Save, 
  User, 
  Shield, 
  Building2, 
  Heart, 
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Role-specific fields
  studentId?: string;
  alumniId?: string;
  staffId?: string;
  department?: string;
  designation?: string;
  enrollmentYear?: number;
  graduationYear?: number;
  cgpa?: number;
  category?: string;
  rank?: string;
  isVerified?: boolean;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Mock user data for demonstration
  useEffect(() => {
    const mockUser: UserProfile = {
      id: userId,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "STUDENT",
      phone: "+1-555-0123",
      address: "123 Main St, City, State 12345",
      dateOfBirth: new Date("1995-05-15"),
      isActive: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-20"),
      studentId: "STU001",
      enrollmentYear: 2023,
      cgpa: 3.8
    };
    
    setUser(mockUser);
    setLoading(false);
  }, [userId]);

  const handleInputChange = (field: string, value: string | boolean | Date) => {
    if (!user) return;
    
    setUser({
      ...user,
      [field]: value
    });
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    setError("");
    setSuccess("");
    
    try {
      // TODO: Implement actual save logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setSuccess("User updated successfully!");
      setTimeout(() => {
        router.push("/dashboard/admin/users");
      }, 1500);
    } catch (err) {
      setError("Failed to update user. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getRoleIcon = (role: string) => {
    const roleIcons = {
      STUDENT: GraduationCap,
      STAFF: Building2,
      ALUMNI: Heart,
      ADMIN: Shield
    };
    
    const IconComponent = roleIcons[role as keyof typeof roleIcons] || User;
    return <IconComponent className="w-5 h-5" />;
  };

  const getRoleColor = (role: string) => {
    const roleColors = {
      STUDENT: "bg-green-100 text-green-800",
      STAFF: "bg-blue-100 text-blue-800",
      ALUMNI: "bg-purple-100 text-purple-800",
      ADMIN: "bg-red-100 text-red-800"
    };
    
    return roleColors[role as keyof typeof roleColors] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
        <div className="container mx-auto">
          <div className="text-center">Loading user...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
        <div className="container mx-auto">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>User not found</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/admin/users")}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
              <p className="text-gray-600">Update user information and settings</p>
            </div>
          </div>
          
          {/* User Summary Card */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  {getRoleIcon(user.role)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                    <Badge className={getRoleColor(user.role)}>
                      {getRoleIcon(user.role)}
                      <span className="ml-1">{user.role}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {user.phone}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Member since {user.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Switch
                    checked={user.isActive}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Edit Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Update user's personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={user.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={user.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={user.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter address"
                />
              </div>
              
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : ""}
                  onChange={(e) => handleInputChange("dateOfBirth", new Date(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Role & Permissions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Role & Permissions
              </CardTitle>
              <CardDescription>
                Manage user role and access permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="role">User Role</Label>
                <Select value={user.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="STAFF">Staff</SelectItem>
                    <SelectItem value="ALUMNI">Alumni</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Role-specific fields */}
              {user.role === "STUDENT" && (
                <>
                  <div>
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      value={user.studentId || ""}
                      onChange={(e) => handleInputChange("studentId", e.target.value)}
                      placeholder="Enter student ID"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="enrollmentYear">Enrollment Year</Label>
                    <Input
                      id="enrollmentYear"
                      type="number"
                      value={user.enrollmentYear || ""}
                      onChange={(e) => handleInputChange("enrollmentYear", parseInt(e.target.value))}
                      placeholder="Enter enrollment year"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cgpa">CGPA</Label>
                    <Input
                      id="cgpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      value={user.cgpa || ""}
                      onChange={(e) => handleInputChange("cgpa", parseFloat(e.target.value))}
                      placeholder="Enter CGPA"
                    />
                  </div>
                </>
              )}
              
              {user.role === "STAFF" && (
                <>
                  <div>
                    <Label htmlFor="staffId">Staff ID</Label>
                    <Input
                      id="staffId"
                      value={user.staffId || ""}
                      onChange={(e) => handleInputChange("staffId", e.target.value)}
                      placeholder="Enter staff ID"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={user.department || ""}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                      placeholder="Enter department"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      value={user.designation || ""}
                      onChange={(e) => handleInputChange("designation", e.target.value)}
                      placeholder="Enter designation"
                    />
                  </div>
                </>
              )}
              
              {user.role === "ALUMNI" && (
                <>
                  <div>
                    <Label htmlFor="alumniId">Alumni ID</Label>
                    <Input
                      id="alumniId"
                      value={user.alumniId || ""}
                      onChange={(e) => handleInputChange("alumniId", e.target.value)}
                      placeholder="Enter alumni ID"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="graduationYear">Graduation Year</Label>
                    <Input
                      id="graduationYear"
                      type="number"
                      value={user.graduationYear || ""}
                      onChange={(e) => handleInputChange("graduationYear", parseInt(e.target.value))}
                      placeholder="Enter graduation year"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={user.category || ""} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BASIC">Basic</SelectItem>
                        <SelectItem value="SILVER">Silver</SelectItem>
                        <SelectItem value="GOLD">Gold</SelectItem>
                        <SelectItem value="PLATINUM">Platinum</SelectItem>
                        <SelectItem value="DIAMOND">Diamond</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isVerified"
                      checked={user.isVerified || false}
                      onCheckedChange={(checked) => handleInputChange("isVerified", checked)}
                    />
                    <Label htmlFor="isVerified">Verified Alumni</Label>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/admin/users")}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

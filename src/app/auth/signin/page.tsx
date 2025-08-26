"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  Building2, 
  Heart, 
  Shield,
  Info,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function SignInPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await login(email, password, role);
      
      if (success) {
        // Redirect based on role
        router.push(`/dashboard/${role.toLowerCase()}`);
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    const roleIcons = {
      STUDENT: GraduationCap,
      STAFF: Building2,
      ALUMNI: Heart,
      ADMIN: Shield
    };
    
    const IconComponent = roleIcons[role as keyof typeof roleIcons] || GraduationCap;
    return <IconComponent className="w-5 h-5" />;
  };

  const getRoleDescription = (role: string) => {
    const descriptions = {
      STUDENT: "Access scholarship applications, track status, and manage your profile",
      STAFF: "Review applications, add notes, and manage student records",
      ALUMNI: "Make pledges, donations, and track your contributions",
      ADMIN: "Full system access, manage users, funds, and system settings"
    };
    
    return descriptions[role as keyof typeof descriptions] || "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Information */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">HCA Scholarship Portal</h1>
                <p className="text-gray-600">Empowering education through community support</p>
              </div>
            </div>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Welcome to the comprehensive scholarship management platform. Whether you're a student seeking support, 
              staff managing applications, alumni giving back, or admin overseeing the system - we've got you covered.
            </p>
          </div>

          {/* Role Information Cards */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Platform Roles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span>Student</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-600">Apply for scholarships, track applications, upload documents</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <Building2 className="w-4 h-4 text-green-600" />
                    <span>Staff</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-600">Review applications, add notes, manage student records</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <Heart className="w-4 h-4 text-purple-600" />
                    <span>Alumni</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-600">Make pledges, donations, track contributions</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <Shield className="w-4 h-4 text-red-600" />
                    <span>Admin</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-600">Full system access, manage users, funds, settings</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Demo Accounts Info */}
          <Card className="border-0 shadow-lg bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-900">
                <Info className="w-5 h-5" />
                <span>Demo Accounts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-blue-800">
                Use these accounts to test different roles. You can login with the same email using different roles!
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800"><strong>Email:</strong> admin@hca.edu</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800"><strong>Password:</strong> password</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800"><strong>Available Roles:</strong> Admin, Staff, Student, Alumni</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md border-0 shadow-xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
              <CardDescription className="text-gray-600">
                Sign in to access your dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Role Selection */}
                <div className="space-y-2">
                  <Label htmlFor="role">Select Your Role</Label>
                  <Select value={role} onValueChange={setRole} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your role for this session" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STUDENT">
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="w-4 h-4 text-blue-600" />
                          <span>Student</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="STAFF">
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-green-600" />
                          <span>Staff</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="ALUMNI">
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4 text-purple-600" />
                          <span>Alumni</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="ADMIN">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-red-600" />
                          <span>Admin</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {role && (
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      {getRoleIcon(role)}
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{role}</p>
                        <p className="text-gray-600">{getRoleDescription(role)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={loading || !role}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <Separator />

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign up here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

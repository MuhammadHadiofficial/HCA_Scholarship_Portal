"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Eye, EyeOff, GraduationCap, Building2, Heart, Shield, CheckCircle } from "lucide-react";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
    studentId: "",
    alumniId: "",
    staffId: "",
    department: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") || "STUDENT";

  // Set default role from URL params
  useState(() => {
    if (defaultRole) {
      setFormData(prev => ({ ...prev, role: defaultRole.toUpperCase() }));
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    // Role-specific validation
    if (formData.role === "STUDENT" && !formData.studentId) {
      setError("Student ID is required");
      setIsLoading(false);
      return;
    }

    if (formData.role === "ALUMNI" && !formData.alumniId) {
      setError("Alumni ID is required");
      setIsLoading(false);
      return;
    }

    if (formData.role === "STAFF" && (!formData.staffId || !formData.department)) {
      setError("Staff ID and department are required");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp(formData);
      if (result.success) {
        router.push("/auth/signin?message=Account created successfully! Please sign in.");
      } else {
        setError(result.error || "Sign up failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const roleConfig = {
    STUDENT: {
      icon: GraduationCap,
      color: "from-green-500 to-emerald-600",
      description: "Apply for scholarships and track your applications",
      fields: ["studentId"],
    },
    STAFF: {
      icon: Building2,
      color: "from-blue-500 to-cyan-600",
      description: "Review applications and manage scholarship processes",
      fields: ["staffId", "department"],
    },
    ALUMNI: {
      icon: Heart,
      color: "from-purple-500 to-pink-600",
      description: "Contribute to student success and stay connected",
      fields: ["alumniId"],
    },
    ADMIN: {
      icon: Shield,
      color: "from-red-500 to-orange-600",
      description: "System administration and comprehensive oversight",
      fields: [],
    },
  };

  const currentRoleConfig = roleConfig[formData.role as keyof typeof roleConfig];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8">
        {/* Left Side - Sign Up Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md border-0 shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                <CardDescription className="text-gray-600">
                  Join the HCA Scholarship Portal community
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Information */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                {/* Role Selection */}
                <div className="space-y-3">
                  <Label>Select Your Role</Label>
                  <RadioGroup
                    value={formData.role}
                    onValueChange={(value) => handleInputChange("role", value)}
                    className="grid grid-cols-2 gap-3"
                  >
                    {Object.entries(roleConfig).map(([role, config]) => (
                      <div key={role}>
                        <RadioGroupItem
                          value={role}
                          id={role}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={role}
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          <div className={`w-8 h-8 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center mb-2`}>
                            <config.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{role.charAt(0) + role.slice(1).toLowerCase()}</div>
                            <div className="text-xs text-muted-foreground">{config.description}</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Role-specific fields */}
                {formData.role === "STUDENT" && (
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      type="text"
                      placeholder="Enter your student ID"
                      value={formData.studentId}
                      onChange={(e) => handleInputChange("studentId", e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                )}

                {formData.role === "STAFF" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="staffId">Staff ID</Label>
                      <Input
                        id="staffId"
                        type="text"
                        placeholder="Enter your staff ID"
                        value={formData.staffId}
                        onChange={(e) => handleInputChange("staffId", e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        type="text"
                        placeholder="Enter your department"
                        value={formData.department}
                        onChange={(e) => handleInputChange("department", e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                  </>
                )}

                {formData.role === "ALUMNI" && (
                  <div className="space-y-2">
                    <Label htmlFor="alumniId">Alumni ID</Label>
                    <Input
                      id="alumniId"
                      type="text"
                      placeholder="Enter your alumni ID"
                      value={formData.alumniId}
                      onChange={(e) => handleInputChange("alumniId", e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                )}

                {/* Password Fields */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/auth/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Information */}
        <div className="flex items-center justify-center">
          <div className="max-w-md space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Join Our Community
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Become part of a network that's transforming education through technology and community support.
              </p>
            </div>

            {/* Selected Role Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${currentRoleConfig.color} rounded-full flex items-center justify-center`}>
                  <currentRoleConfig.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {formData.role.charAt(0) + formData.role.slice(1).toLowerCase()}
                  </h3>
                  <p className="text-sm text-gray-600">{currentRoleConfig.description}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">What you'll get:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {formData.role === "STUDENT" && (
                    <>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Access to scholarship applications
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Document upload and management
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Real-time application tracking
                      </li>
                    </>
                  )}
                  {formData.role === "STAFF" && (
                    <>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Application review dashboard
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Student management tools
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Reporting and analytics
                      </li>
                    </>
                  )}
                  {formData.role === "ALUMNI" && (
                    <>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Pledge management system
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Payment tracking
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Student mentorship opportunities
                      </li>
                    </>
                  )}
                  {formData.role === "ADMIN" && (
                    <>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Full system administration
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        User management
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        System configuration
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Why Choose HCA Portal?</h3>
              <ul className="space-y-2 text-sm text-blue-100">
                <li>• Secure and reliable platform</li>
                <li>• Real-time updates and notifications</li>
                <li>• Comprehensive reporting and analytics</li>
                <li>• Mobile-responsive design</li>
              </ul>
            </div>

            <div className="text-center lg:text-left">
              <Badge variant="outline" className="mb-2">
                <Shield className="w-3 h-3 mr-1" />
                Enterprise Security
              </Badge>
              <p className="text-sm text-gray-500">
                Your data is protected with industry-standard encryption and security measures
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

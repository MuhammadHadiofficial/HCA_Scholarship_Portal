"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GraduationCap,
  Building2,
  Heart,
  Shield,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  FileText,
  DollarSign,
  Users,
  BarChart3,
  Home,
  Info
} from "lucide-react";



export default function Navigation() {
  const { user, logout, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "STUDENT":
        return <GraduationCap className="w-4 h-4" />;
      case "STAFF":
        return <Building2 className="w-4 h-4" />;
      case "ALUMNI":
        return <Heart className="w-4 h-4" />;
      case "ADMIN":
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "STUDENT":
        return "bg-blue-100 text-blue-800";
      case "STAFF":
        return "bg-green-100 text-green-800";
      case "ALUMNI":
        return "bg-purple-100 text-purple-800";
      case "ADMIN":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDashboardLink = (role: string) => {
    switch (role) {
      case "STUDENT":
        return "/dashboard/student";
      case "STAFF":
        return "/dashboard/staff";
      case "ALUMNI":
        return "/dashboard/alumni";
      case "ADMIN":
        return "/dashboard/admin";
      default:
        return "/dashboard";
    }
  };

  const getRoleSpecificLinks = (role: string) => {
    switch (role) {
      case "STUDENT":
        return [
          { href: "/dashboard/student/applications", label: "Applications", icon: FileText },
          { href: "/dashboard/student/scholarships", label: "Scholarships", icon: GraduationCap },
          { href: "/dashboard/student/guidelines", label: "Guidelines", icon: FileText },
        ];
      case "STAFF":
        return [
          { href: "/dashboard/staff/applications", label: "Review Applications", icon: FileText },
          { href: "/dashboard/staff/scholarships", label: "Scholarships", icon: GraduationCap },
          { href: "/dashboard/staff/students", label: "Student Management", icon: Users },
          { href: "/dashboard/staff/notifications", label: "Notifications", icon: Info },
        ];
      case "ALUMNI":
        return [
          { href: "/dashboard/alumni/onboarding", label: "Complete Profile", icon: User },
          { href: "/dashboard/alumni/pledges", label: "My Pledges", icon: DollarSign },
          { href: "/dashboard/alumni/payments", label: "Payment Records", icon: DollarSign },
          { href: "/dashboard/alumni/impact", label: "My Impact", icon: BarChart3 },
        ];
      case "ADMIN":
        return [
          { href: "/dashboard/admin/users", label: "User Management", icon: Users },
          { href: "/dashboard/admin/applications", label: "Applications", icon: FileText },
          { href: "/dashboard/admin/alumni", label: "Alumni Management", icon: GraduationCap },
          { href: "/dashboard/admin/funds", label: "Fund Management", icon: DollarSign },
          { href: "/dashboard/admin/settings", label: "System Settings", icon: Settings },
        ];
      default:
        return [];
    }
  };

  const isActive = (path: string) => pathname === path;

  if (!user) {
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">HCA Scholarship Portal</span>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <Link href="/about">
                <Button variant="ghost">About</Button>
              </Link>
              <Link href="/auth/signin">
                <Button>Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline">Sign Up</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate through the portal
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <Link href="/about" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <Info className="w-4 h-4 mr-2" />
                      About
                    </Button>
                  </Link>
                  <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={getDashboardLink(user.role)} className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">HCA Scholarship Portal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Role-specific navigation links */}
            {getRoleSpecificLinks(user.role).map((link) => {
              const IconComponent = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <Button 
                    variant={isActive(link.href) ? "default" : "ghost"}
                    className="flex items-center space-x-2"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Button>
                </Link>
              );
            })}

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    {getRoleIcon(user.role)}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{user.name}</p>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getDashboardLink(user.role)} className="flex items-center">
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Welcome, {user.name}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {/* Role-specific mobile links */}
                {getRoleSpecificLinks(user.role).map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}>
                      <Button 
                        variant={isActive(link.href) ? "default" : "ghost"}
                        className="w-full justify-start"
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                        {link.label}
                      </Button>
                    </Link>
                  );
                })}
                
                <div className="border-t border-gray-200 my-2" />
                
                <Link href="/dashboard/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                
                <Link href="/dashboard/settings" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

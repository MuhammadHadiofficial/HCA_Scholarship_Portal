"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Clock, 
  Filter,
  Search,
  Trash2,
  Archive,
  Mail,
  FileText,
  DollarSign,
  Users,
  GraduationCap
} from "lucide-react";
import { useState } from "react";

export default function StaffNotificationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Mock data - replace with real data later
  const notifications = [
    {
      id: 1,
      type: "APPLICATION",
      title: "New Scholarship Application",
      message: "Ahmed Khan has submitted a new scholarship application for Fall 2024 semester.",
      priority: "HIGH",
      status: "UNREAD",
      timestamp: "2024-08-22T10:30:00Z",
      relatedId: "APP001",
      category: "APPLICATION_REVIEW",
      actions: ["Review", "Assign", "Archive"]
    },
    {
      id: 2,
      type: "SCHOLARSHIP",
      title: "Scholarship Approval Required",
      message: "Fatima Ali's scholarship application is ready for final approval. All documents verified.",
      priority: "MEDIUM",
      status: "UNREAD",
      timestamp: "2024-08-22T09:15:00Z",
      relatedId: "APP002",
      category: "APPROVAL_REQUIRED",
      actions: ["Approve", "Reject", "Request Changes"]
    },
    {
      id: 3,
      type: "SYSTEM",
      title: "System Maintenance",
      message: "Scheduled maintenance will occur on August 25th from 2:00 AM to 4:00 AM. System may be unavailable.",
      priority: "LOW",
      status: "READ",
      timestamp: "2024-08-21T16:00:00Z",
      relatedId: null,
      category: "SYSTEM_ALERT",
      actions: ["Dismiss", "Archive"]
    },
    {
      id: 4,
      type: "DEADLINE",
      title: "Application Deadline Approaching",
      message: "Fall 2024 scholarship applications close in 3 days. 15 applications still pending review.",
      priority: "HIGH",
      status: "UNREAD",
      timestamp: "2024-08-21T14:45:00Z",
      relatedId: "DEADLINE001",
      category: "DEADLINE_REMINDER",
      actions: ["View Pending", "Send Reminders", "Archive"]
    },
    {
      id: 5,
      type: "DOCUMENT",
      title: "Document Verification Complete",
      message: "Omar Hassan's utility bills and income certificates have been verified and approved.",
      priority: "MEDIUM",
      status: "READ",
      timestamp: "2024-08-21T11:20:00Z",
      relatedId: "DOC001",
      category: "DOCUMENT_VERIFICATION",
      actions: ["View Details", "Archive"]
    },
    {
      id: 6,
      type: "FUND",
      title: "Fund Allocation Update",
      message: "Student Welfare Fund has been allocated $5,000 for emergency assistance cases.",
      priority: "MEDIUM",
      status: "UNREAD",
      timestamp: "2024-08-21T08:30:00Z",
      relatedId: "FUND001",
      category: "FUND_MANAGEMENT",
      actions: ["View Details", "Archive"]
    },
    {
      id: 7,
      type: "ALUMNI",
      title: "New Alumni Donation",
      message: "Dr. Sarah Johnson has pledged $2,000 for merit-based scholarships. Verification required.",
      priority: "MEDIUM",
      status: "UNREAD",
      timestamp: "2024-08-20T15:15:00Z",
      relatedId: "ALUMNI001",
      category: "ALUMNI_DONATION",
      actions: ["Verify", "Contact", "Archive"]
    },
    {
      id: 8,
      type: "STUDENT",
      title: "Student Status Update",
      message: "Zara Ahmed's status has been changed to INACTIVE due to incomplete documentation.",
      priority: "LOW",
      status: "READ",
      timestamp: "2024-08-20T12:00:00Z",
      relatedId: "STU006",
      category: "STUDENT_STATUS",
      actions: ["View Student", "Contact", "Archive"]
    }
  ];

  const notificationTypes = [
    { value: "ALL", label: "All Types", icon: Bell },
    { value: "APPLICATION", label: "Applications", icon: FileText },
    { value: "SCHOLARSHIP", label: "Scholarships", icon: DollarSign },
    { value: "SYSTEM", label: "System", icon: Info },
    { value: "DEADLINE", label: "Deadlines", icon: Clock },
    { value: "DOCUMENT", label: "Documents", icon: FileText },
    { value: "FUND", label: "Funds", icon: DollarSign },
    { value: "ALUMNI", label: "Alumni", icon: Users },
    { value: "STUDENT", label: "Students", icon: GraduationCap }
  ];

  const statuses = [
    { value: "ALL", label: "All Statuses" },
    { value: "UNREAD", label: "Unread" },
    { value: "READ", label: "Read" },
    { value: "ARCHIVED", label: "Archived" }
  ];

  const getTypeIcon = (type: string) => {
    const typeConfig = notificationTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.icon : Bell;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "APPLICATION": return "bg-blue-100 text-blue-800";
      case "SCHOLARSHIP": return "bg-green-100 text-green-800";
      case "SYSTEM": return "bg-gray-100 text-gray-800";
      case "DEADLINE": return "bg-red-100 text-red-800";
      case "DOCUMENT": return "bg-purple-100 text-purple-800";
      case "FUND": return "bg-yellow-100 text-yellow-800";
      case "ALUMNI": return "bg-indigo-100 text-indigo-800";
      case "STUDENT": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-red-100 text-red-800";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800";
      case "LOW": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UNREAD": return "bg-blue-100 text-blue-800";
      case "READ": return "bg-gray-100 text-gray-800";
      case "ARCHIVED": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "ALL" || notification.type === filterType;
    const matchesStatus = filterStatus === "ALL" || notification.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => n.status === "UNREAD").length,
    highPriority: notifications.filter(n => n.priority === "HIGH").length,
    today: notifications.filter(n => {
      const today = new Date().toDateString();
      const notificationDate = new Date(n.timestamp).toDateString();
      return today === notificationDate;
    }).length
  };

  const handleAction = (notificationId: number, action: string) => {
    // TODO: Implement notification actions
    console.log(`Action ${action} for notification ${notificationId}`);
  };

  const markAsRead = (notificationId: number) => {
    // TODO: Implement mark as read
    console.log(`Mark as read: ${notificationId}`);
  };

  const archiveNotification = (notificationId: number) => {
    // TODO: Implement archive
    console.log(`Archive: ${notificationId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-2">Stay updated with system alerts, application updates, and important deadlines</p>
          </div>
          <div className="mt-4 sm:mt-0 space-x-3">
            <Button variant="outline">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline">
              <Archive className="w-4 h-4 mr-2" />
              Archive All
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All notifications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread</CardTitle>
              <Bell className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.unread}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
              <p className="text-xs text-muted-foreground">Urgent matters</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.today}</div>
              <p className="text-xs text-muted-foreground">New today</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Center</CardTitle>
            <CardDescription>Search and filter notifications by type and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {notificationTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:w-40">
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

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map(notification => {
            const TypeIcon = getTypeIcon(notification.type);
            return (
              <Card key={notification.id} className={`hover:shadow-md transition-shadow ${
                notification.status === "UNREAD" ? "border-l-4 border-l-blue-500" : ""
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                          <TypeIcon className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-semibold">{notification.title}</h3>
                        <Badge className={getPriorityColor(notification.priority)}>
                          {notification.priority}
                        </Badge>
                        <Badge className={getStatusColor(notification.status)}>
                          {notification.status}
                        </Badge>
                      </div>
                      <p className="text-gray-700">{notification.message}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {notification.relatedId && (
                          <span className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            ID: {notification.relatedId}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Info className="w-4 h-4 mr-1" />
                          {notification.category.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {notification.status === "UNREAD" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => archiveNotification(notification.id)}
                      >
                        <Archive className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      Category: {notification.category.replace(/_/g, " ")}
                    </div>
                    <div className="flex space-x-2">
                      {notification.actions.map((action, index) => (
                        <Button 
                          key={index}
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAction(notification.id, action)}
                        >
                          {action}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredNotifications.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No notifications found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

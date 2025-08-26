"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Activity,
  BarChart3
} from "lucide-react";
import { useAllProgramFunds, useAllExpenses, useAllEvents, useProgramFundStats } from "@/lib/hooks/use-program-funds";
import ProgramFundForm from "@/components/admin/program-fund-form";
import ExpenseForm from "@/components/admin/expense-form";
import EventForm from "@/components/admin/event-form";
import { useAuth } from "@/contexts/auth-context";

export default function AdminFundsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("funds");
  const [showFundForm, setShowFundForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingFund, setEditingFund] = useState<any>(null);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const { data: fundsData, isLoading: fundsLoading } = useAllProgramFunds();
  const { data: expensesData, isLoading: expensesLoading } = useAllExpenses();
  const { data: eventsData, isLoading: eventsLoading } = useAllEvents();
  const { data: statsData, isLoading: statsLoading } = useProgramFundStats();

  const funds = fundsData?.funds || [];
  const expenses = expensesData?.expenses || [];
  const events = eventsData?.events || [];
  const stats = statsData || {};

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number, total: number) => {
    if (total === 0) return "0%";
    return `${((value / total) * 100).toFixed(1)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANNING": return "bg-yellow-100 text-yellow-800";
      case "FUNDED": return "bg-green-100 text-green-800";
      case "COMPLETED": return "bg-blue-100 text-blue-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleEditFund = (fund: any) => {
    setEditingFund(fund);
    setShowFundForm(true);
  };

  const handleEditExpense = (expense: any) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleFormClose = () => {
    setShowFundForm(false);
    setShowExpenseForm(false);
    setShowEventForm(false);
    setEditingFund(null);
    setEditingExpense(null);
    setEditingEvent(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Access Denied</div>
          <p className="text-gray-600">You must be logged in as an administrator to view this page.</p>
        </div>
      </div>
    );
  }

  if (fundsLoading || expensesLoading || eventsLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading funds management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Program Funds Management</h1>
            <p className="text-gray-600">Manage scholarship funds, expenses, and events</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funds</CardTitle>
              <DollarSign className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalAmount || 0)}
              </div>
              <p className="text-xs text-gray-500">
                {stats.totalFunds || 0} active funds
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Allocated</CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(stats.totalAllocated || 0)}
              </div>
              <p className="text-xs text-gray-500">
                {formatPercentage(stats.totalAllocated || 0, stats.totalAmount || 0)} of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(stats.totalExpenseAmount || 0)}
              </div>
              <p className="text-xs text-gray-500">
                {stats.totalExpenses || 0} expense records
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <Calendar className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.totalEvents || 0}
              </div>
              <p className="text-xs text-gray-500">
                {stats.fundedEvents || 0} funded events
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="funds">Program Funds</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          {/* Program Funds Tab */}
          <TabsContent value="funds" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Program Funds</h2>
              <Button onClick={() => setShowFundForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Fund
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {funds.map((fund) => (
                <Card key={fund.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{fund.name}</CardTitle>
                        <CardDescription>{fund.description}</CardDescription>
                      </div>
                      <Badge variant={fund.isActive ? "default" : "secondary"}>
                        {fund.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Amount:</span>
                        <span className="font-medium">{formatCurrency(fund.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Allocated:</span>
                        <span className="font-medium text-blue-600">{formatCurrency(fund.allocatedAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Remaining:</span>
                        <span className="font-medium text-green-600">{formatCurrency(fund.remainingAmount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${formatPercentage(fund.allocatedAmount, fund.amount)}` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Category: {fund.category}</span>
                        <span>{formatPercentage(fund.allocatedAmount, fund.amount)} used</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => handleEditFund(fund)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Expenses</h2>
              <Button onClick={() => setShowExpenseForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Expense
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <TrendingDown className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{expense.description}</h4>
                          <p className="text-sm text-gray-600">{expense.programFund.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(expense.expenseDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-lg">{formatCurrency(expense.amount)}</div>
                        <p className="text-sm text-gray-600">Approved by {expense.user.name}</p>
                        <div className="flex space-x-2 mt-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditExpense(expense)}>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Events</h2>
              <Button onClick={() => setShowEventForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Event
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{event.name}</CardTitle>
                        <CardDescription>{event.description}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Event Date:</span>
                        <span className="font-medium">
                          {new Date(event.eventDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Required Funds:</span>
                        <span className="font-medium">{formatCurrency(event.requiredFunds)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Allocated:</span>
                        <span className="font-medium text-blue-600">{formatCurrency(event.allocatedFunds)}</span>
                      </div>
                      {event.programFund && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Fund Source:</span>
                          <span className="font-medium text-green-600">{event.programFund.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Forms */}
        {showFundForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingFund ? "Edit Program Fund" : "Create New Program Fund"}
                  </h2>
                  <Button variant="outline" onClick={handleFormClose}>
                    Close
                  </Button>
                </div>
                <ProgramFundForm
                  fund={editingFund}
                  userId={user?.id}
                  onSuccess={handleFormClose}
                />
              </div>
            </div>
          </div>
        )}

        {showExpenseForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingExpense ? "Edit Expense" : "Create New Expense"}
                  </h2>
                  <Button variant="outline" onClick={handleFormClose}>
                    Close
                  </Button>
                </div>
                <ExpenseForm
                  expense={editingExpense}
                  userId={user?.id}
                  onSuccess={handleFormClose}
                />
              </div>
            </div>
          </div>
        )}

        {showEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingEvent ? "Edit Event" : "Create New Event"}
                  </h2>
                  <Button variant="outline" onClick={handleFormClose}>
                    Close
                  </Button>
                </div>
                <EventForm
                  event={editingEvent}
                  userId={user?.id}
                  onSuccess={handleFormClose}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

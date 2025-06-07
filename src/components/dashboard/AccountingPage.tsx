import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { Calculator, Receipt, TrendingUp, DollarSign, Calendar, FileText, Plus, Search, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const AccountingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const isMobile = useIsMobile();

  // Mock financial data
  const invoices = [
    {
      id: 1,
      invoiceNumber: "INV-001",
      customerName: "John Smith",
      amount: 450.00,
      status: "Paid",
      dueDate: "2024-01-15",
      issueDate: "2024-01-01",
      serviceType: "Appliance Repair"
    },
    {
      id: 2,
      invoiceNumber: "INV-002",
      customerName: "Sarah Johnson",
      amount: 320.00,
      status: "Pending",
      dueDate: "2024-01-20",
      issueDate: "2024-01-05",
      serviceType: "Maintenance"
    },
    {
      id: 3,
      invoiceNumber: "INV-003",
      customerName: "Mike Davis",
      amount: 675.00,
      status: "Overdue",
      dueDate: "2024-01-10",
      issueDate: "2023-12-25",
      serviceType: "Emergency Repair"
    },
    {
      id: 4,
      invoiceNumber: "INV-004",
      customerName: "Emma Wilson",
      amount: 280.00,
      status: "Draft",
      dueDate: "2024-01-25",
      issueDate: "2024-01-12",
      serviceType: "Inspection"
    }
  ];

  const expenses = [
    {
      id: 1,
      description: "Parts - Washing Machine Motor",
      category: "Parts",
      amount: 185.00,
      date: "2024-01-10",
      vendor: "Appliance Parts Co."
    },
    {
      id: 2,
      description: "Vehicle Fuel",
      category: "Transportation",
      amount: 65.00,
      date: "2024-01-08",
      vendor: "Gas Station"
    },
    {
      id: 3,
      description: "Office Supplies",
      category: "Supplies",
      amount: 45.00,
      date: "2024-01-05",
      vendor: "Office Depot"
    }
  ];

  // Financial analytics data
  const monthlyRevenue = [
    { month: 'Aug', revenue: 8400, expenses: 3200, profit: 5200 },
    { month: 'Sep', revenue: 9600, expenses: 3800, profit: 5800 },
    { month: 'Oct', revenue: 11200, expenses: 4200, profit: 7000 },
    { month: 'Nov', revenue: 10800, expenses: 4000, profit: 6800 },
    { month: 'Dec', revenue: 12400, expenses: 4600, profit: 7800 },
    { month: 'Jan', revenue: 13800, expenses: 5200, profit: 8600 }
  ];

  const expenseCategories = [
    { name: 'Parts', value: 45, amount: 2250, color: '#8B5CF6' },
    { name: 'Transportation', value: 25, amount: 1250, color: '#06B6D4' },
    { name: 'Supplies', value: 15, amount: 750, color: '#10B981' },
    { name: 'Marketing', value: 10, amount: 500, color: '#F59E0B' },
    { name: 'Other', value: 5, amount: 250, color: '#EF4444' }
  ];

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
    expenses: {
      label: "Expenses", 
      color: "hsl(var(--chart-2))",
    },
    profit: {
      label: "Profit",
      color: "hsl(var(--chart-3))",
    },
  };

  // Mobile-first chart configuration
  const getChartHeight = () => isMobile ? '200px' : '300px';
  const getPieChartHeight = () => isMobile ? '180px' : '250px';

  const getChartMargins = () => ({
    top: isMobile ? 10 : 20,
    right: isMobile ? 5 : 30,
    left: isMobile ? 0 : 20,
    bottom: isMobile ? 30 : 20
  });

  const getTickFontSize = () => isMobile ? 8 : 12;
  const getLegendFontSize = () => isMobile ? 8 : 12;
  const getAxisWidth = () => isMobile ? 20 : 60;

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidInvoices = invoices.filter(inv => inv.status === 'Paid');
  const pendingInvoices = invoices.filter(inv => inv.status === 'Pending' || inv.status === 'Overdue');
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
            Accounting & Finance
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Comprehensive financial management and reporting
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="invoices" className="text-xs sm:text-sm">Invoices</TabsTrigger>
          <TabsTrigger value="expenses" className="text-xs sm:text-sm">Expenses</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs sm:text-sm">Reports</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          {/* Key Financial Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+18.2%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Outstanding</CardTitle>
                <Receipt className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                  ${pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {pendingInvoices.length} pending invoices
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Expenses</CardTitle>
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-600">+5.1%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Net Profit</CardTitle>
                <Calculator className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">${(totalRevenue - totalExpenses).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+22.4%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue vs Expenses Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Revenue & Expenses Trend</CardTitle>
              <CardDescription className="text-sm">Monthly financial performance overview</CardDescription>
            </CardHeader>
            <CardContent className="p-2 sm:p-6">
              <div className="w-full overflow-hidden">
                <ChartContainer 
                  config={chartConfig} 
                  className="w-full"
                  style={{ height: getChartHeight() }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={monthlyRevenue}
                      margin={getChartMargins()}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: getTickFontSize() }}
                        interval={0}
                        angle={isMobile ? -45 : 0}
                        textAnchor={isMobile ? 'end' : 'middle'}
                        height={isMobile ? 40 : 30}
                      />
                      <YAxis 
                        tick={{ fontSize: getTickFontSize() }}
                        width={getAxisWidth()}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      {!isMobile && (
                        <Legend 
                          wrapperStyle={{ fontSize: getLegendFontSize() }}
                          iconSize={12}
                        />
                      )}
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#8B5CF6" 
                        strokeWidth={isMobile ? 2 : 3} 
                        name="Revenue"
                        dot={{ fill: '#8B5CF6', strokeWidth: 1, r: isMobile ? 2 : 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke="#EF4444" 
                        strokeWidth={isMobile ? 2 : 3} 
                        name="Expenses"
                        dot={{ fill: '#EF4444', strokeWidth: 1, r: isMobile ? 2 : 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="profit" 
                        stroke="#10B981" 
                        strokeWidth={isMobile ? 2 : 3} 
                        name="Profit"
                        dot={{ fill: '#10B981', strokeWidth: 1, r: isMobile ? 2 : 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Expense Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Expense Categories</CardTitle>
              <CardDescription className="text-sm">Breakdown of monthly expenses by category</CardDescription>
            </CardHeader>
            <CardContent className="p-2 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="w-full overflow-hidden">
                  <div style={{ height: getPieChartHeight() }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseCategories}
                          cx="50%"
                          cy="50%"
                          outerRadius={isMobile ? "45%" : "60%"}
                          fill="#8884d8"
                          dataKey="value"
                          labelLine={false}
                        >
                          {expenseCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          formatter={(value, name) => [`${value}%`, name]}
                        />
                        <Legend 
                          verticalAlign="bottom"
                          height={isMobile ? 20 : 36}
                          wrapperStyle={{ fontSize: getLegendFontSize() }}
                          iconSize={isMobile ? 8 : 18}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="space-y-4">
                  {expenseCategories.map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${category.amount.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{category.value}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
              <CardDescription>Create, track, and manage customer invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search invoices by customer or invoice number..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Invoices List */}
          <div className="grid gap-4">
            {filteredInvoices.map((invoice) => (
              <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          {invoice.invoiceNumber}
                        </h3>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                        <div>
                          <span className="font-medium">Customer:</span> {invoice.customerName}
                        </div>
                        <div>
                          <span className="font-medium">Service:</span> {invoice.serviceType}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span> ${invoice.amount.toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 dark:text-slate-500">
                        <span>Issue Date: {invoice.issueDate}</span>
                        <span>Due Date: {invoice.dueDate}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Tracking</CardTitle>
              <CardDescription>Monitor and categorize business expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{expense.description}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                        <span>Category: {expense.category}</span>
                        <span>Vendor: {expense.vendor}</span>
                        <span>Date: {expense.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${expense.amount.toFixed(2)}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>Generate comprehensive financial reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Profit & Loss Statement
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Cash Flow Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Tax Summary Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Aging Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Key financial metrics at a glance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Invoices This Month</span>
                  <span className="font-semibold">{invoices.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Collection Rate</span>
                  <span className="font-semibold text-green-600">92%</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Invoice</span>
                  <span className="font-semibold">${(totalRevenue / invoices.length).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expense Ratio</span>
                  <span className="font-semibold">{((totalExpenses / totalRevenue) * 100).toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Monthly Revenue Trend</CardTitle>
                <CardDescription className="text-sm">Revenue growth over time</CardDescription>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <div className="w-full overflow-hidden">
                  <ChartContainer 
                    config={chartConfig} 
                    className="w-full"
                    style={{ height: getChartHeight() }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={monthlyRevenue}
                        margin={getChartMargins()}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fontSize: getTickFontSize() }}
                          angle={isMobile ? -45 : 0}
                          textAnchor={isMobile ? 'end' : 'middle'}
                          height={isMobile ? 40 : 30}
                        />
                        <YAxis 
                          tick={{ fontSize: getTickFontSize() }}
                          width={getAxisWidth()}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="revenue" fill="#8B5CF6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Profit Margin Analysis</CardTitle>
                <CardDescription className="text-sm">Monthly profit margins</CardDescription>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <div className="w-full overflow-hidden">
                  <ChartContainer 
                    config={chartConfig} 
                    className="w-full"
                    style={{ height: getChartHeight() }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={monthlyRevenue}
                        margin={getChartMargins()}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fontSize: getTickFontSize() }}
                          angle={isMobile ? -45 : 0}
                          textAnchor={isMobile ? 'end' : 'middle'}
                          height={isMobile ? 40 : 30}
                        />
                        <YAxis 
                          tick={{ fontSize: getTickFontSize() }}
                          width={getAxisWidth()}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="profit" 
                          stroke="#10B981" 
                          strokeWidth={isMobile ? 2 : 3}
                          name="Profit"
                          dot={{ fill: '#10B981', strokeWidth: 1, r: isMobile ? 2 : 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountingPage;


import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, ComposedChart } from 'recharts';
import { Users, UserPlus, Search, Phone, Mail, MapPin, TrendingUp, DollarSign, Calendar, Activity, Filter, Download, Edit, Trash2, Eye } from 'lucide-react';

const CRMPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [segmentFilter, setSegmentFilter] = useState('all');

  // Enhanced mock customer data with more analytics
  const customers = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "(555) 123-4567",
      address: "123 Main St, Anytown, ST 12345",
      status: "Active",
      segment: "Premium",
      totalOrders: 12,
      totalSpent: 2850,
      lastContact: "2024-01-15",
      acquisitionDate: "2023-08-15",
      lifetime_value: 3200,
      avgOrderValue: 237.5
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "(555) 987-6543",
      address: "456 Oak Ave, Somewhere, ST 67890",
      status: "At Risk",
      segment: "Standard",
      totalOrders: 5,
      totalSpent: 890,
      lastContact: "2023-11-22",
      acquisitionDate: "2023-03-10",
      lifetime_value: 1200,
      avgOrderValue: 178
    },
    {
      id: 3,
      name: "Mike Davis",
      email: "mike.davis@email.com",
      phone: "(555) 456-7890",
      address: "789 Pine Rd, Elsewhere, ST 54321",
      status: "Active",
      segment: "VIP",
      totalOrders: 18,
      totalSpent: 4320,
      lastContact: "2024-01-10",
      acquisitionDate: "2022-12-05",
      lifetime_value: 5500,
      avgOrderValue: 240
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma.w@email.com",
      phone: "(555) 321-0987",
      address: "321 Elm St, Newtown, ST 98765",
      status: "New",
      segment: "Standard",
      totalOrders: 2,
      totalSpent: 340,
      lastContact: "2024-01-12",
      acquisitionDate: "2024-01-01",
      lifetime_value: 450,
      avgOrderValue: 170
    }
  ];

  // Analytics data
  const monthlyRevenue = [
    { month: 'Jan', revenue: 12400, customers: 85 },
    { month: 'Feb', revenue: 15600, customers: 92 },
    { month: 'Mar', revenue: 18900, customers: 108 },
    { month: 'Apr', revenue: 16200, customers: 95 },
    { month: 'May', revenue: 21300, customers: 115 },
    { month: 'Jun', revenue: 24800, customers: 128 }
  ];

  const customerSegmentation = [
    { name: 'VIP', value: 25, color: '#8B5CF6' },
    { name: 'Premium', value: 35, color: '#06B6D4' },
    { name: 'Standard', value: 40, color: '#10B981' }
  ];

  const chartConfig = {
    revenue: {
      label: "Revenue ($)",
      color: "#8B5CF6",
    },
    customers: {
      label: "New Customers",
      color: "#06B6D4",
    },
  };

  // Filter customers based on search and filters
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSegment = segmentFilter === 'all' || customer.segment.toLowerCase() === segmentFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesSegment;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'at risk': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment.toLowerCase()) {
      case 'vip': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'premium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'standard': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Customer Relationship Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive customer analytics and relationship management
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="customers" className="text-xs sm:text-sm">Customers</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          <TabsTrigger value="segments" className="text-xs sm:text-sm">Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12.5%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">$24,800</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+16.5%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Avg. Order Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">$194</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8.2%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Customer Retention</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">85.4%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+2.1%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Revenue & Customer Growth Chart - Fixed for responsiveness */}
            <Card className="col-span-1 xl:col-span-2">
              <CardHeader>
                <CardTitle>Revenue & Customer Growth</CardTitle>
                <CardDescription>Monthly revenue and customer acquisition trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] sm:h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }}
                        interval={0}
                      />
                      <YAxis 
                        yAxisId="revenue"
                        orientation="left"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <YAxis 
                        yAxisId="customers"
                        orientation="right"
                        tick={{ fontSize: 12 }}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value, name) => [
                          name === 'revenue' ? `$${value.toLocaleString()}` : value,
                          name === 'revenue' ? 'Revenue' : 'New Customers'
                        ]}
                      />
                      <Legend />
                      <Bar 
                        yAxisId="revenue"
                        dataKey="revenue" 
                        fill="#8B5CF6" 
                        name="Revenue ($)"
                        radius={[4, 4, 0, 0]}
                      />
                      <Line 
                        yAxisId="customers"
                        type="monotone" 
                        dataKey="customers" 
                        stroke="#06B6D4" 
                        strokeWidth={3}
                        name="New Customers"
                        dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Customer Segmentation */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Segmentation</CardTitle>
                <CardDescription>Distribution of customers by value segment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerSegmentation}
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {customerSegmentation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Directory</CardTitle>
              <CardDescription>Search and manage your customer database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search customers by name, email, or phone..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="at risk">At Risk</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by segment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Segments</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer List */}
          <div className="grid gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <h3 className="text-lg font-semibold text-foreground">
                        {customer.name}
                      </h3>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(customer.status)}>
                          {customer.status}
                        </Badge>
                        <Badge className={getSegmentColor(customer.segment)}>
                          {customer.segment}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{customer.address}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-muted-foreground">
                      <span>Orders: {customer.totalOrders}</span>
                      <span>Spent: ${customer.totalSpent.toLocaleString()}</span>
                      <span>LTV: ${customer.lifetime_value.toLocaleString()}</span>
                      <span>AOV: ${customer.avgOrderValue}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive w-full sm:w-auto">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredCustomers.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No customers found matching your search criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Acquisition */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Acquisition</CardTitle>
                <CardDescription>New customers over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="customers" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Revenue by Segment */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Segment</CardTitle>
                <CardDescription>Revenue contribution by customer segment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerSegmentation.map((segment) => (
                    <div key={segment.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: segment.color }}
                        />
                        <span className="font-medium">{segment.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${(24800 * segment.value / 100).toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{segment.value}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customerSegmentation.map((segment) => (
              <Card key={segment.name}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: segment.color }}
                    />
                    {segment.name} Customers
                  </CardTitle>
                  <CardDescription>
                    {segment.value}% of total customer base
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Count</span>
                      <span className="font-semibold">{Math.round(1234 * segment.value / 100)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Revenue</span>
                      <span className="font-semibold">${(24800 * segment.value / 100).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg. LTV</span>
                      <span className="font-semibold">
                        ${segment.name === 'VIP' ? '5,500' : segment.name === 'Premium' ? '3,200' : '1,200'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMPage;

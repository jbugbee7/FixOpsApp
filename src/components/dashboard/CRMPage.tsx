
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { UserPlus, Download } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCRMData } from '@/hooks/useCRMData';
import CRMMetrics from './crm/CRMMetrics';
import CustomerFilters from './crm/CustomerFilters';
import CustomerList from './crm/CustomerList';
import CRMCharts from './crm/CRMCharts';

const CRMPage = () => {
  const isMobile = useIsMobile();
  const {
    customers,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    segmentFilter,
    setSegmentFilter
  } = useCRMData();

  // Analytics data for other tabs
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

  const getChartHeight = () => isMobile ? '200px' : '300px';
  const getChartMargins = () => ({
    top: isMobile ? 10 : 20,
    right: isMobile ? 5 : 30,
    left: isMobile ? 0 : 20,
    bottom: isMobile ? 30 : 20
  });
  const getTickFontSize = () => isMobile ? 8 : 12;
  const getLegendFontSize = () => isMobile ? 8 : 12;
  const getAxisWidth = () => isMobile ? 20 : 60;

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
            Customer Relationship Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
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

      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="customers" className="text-xs sm:text-sm">Customers</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          <TabsTrigger value="segments" className="text-xs sm:text-sm">Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <CRMMetrics />
          <CRMCharts />
        </TabsContent>

        <TabsContent value="customers" className="space-y-4 sm:space-y-6">
          <CustomerFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            segmentFilter={segmentFilter}
            setSegmentFilter={setSegmentFilter}
          />
          <CustomerList customers={customers} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Customer Acquisition */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Customer Acquisition</CardTitle>
                <CardDescription className="text-sm">New customers over time</CardDescription>
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
                        <Bar dataKey="customers" fill="#06B6D4" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue by Segment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Revenue by Segment</CardTitle>
                <CardDescription className="text-sm">Revenue contribution by customer segment</CardDescription>
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

        <TabsContent value="segments" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {customerSegmentation.map((segment) => (
              <Card key={segment.name}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: segment.color }}
                    />
                    {segment.name} Customers
                  </CardTitle>
                  <CardDescription className="text-sm">
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


import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Calendar, MessageCircle, PhoneCall } from 'lucide-react';

interface CRMAnalyticsMetricsProps {
  casesData: any[];
  communicationData: any[];
  interactionsData: any[];
}

const CRMAnalyticsMetrics = ({ casesData, communicationData, interactionsData }: CRMAnalyticsMetricsProps) => {
  const metrics = useMemo(() => {
    // Calculate total customers from unique customer names in cases
    const uniqueCustomers = new Set(casesData.map(c => c.customer_name)).size;
    
    // Calculate total revenue from cases
    const totalRevenue = casesData.reduce((sum, c) => {
      const diagnostic = parseFloat(c.diagnostic_fee_amount || 0);
      const labor = parseFloat(c.labor_cost_calculated || 0);
      return sum + diagnostic + labor;
    }, 0);

    // Calculate completed cases
    const completedCases = casesData.filter(c => c.status === 'Completed').length;
    
    // Calculate this month's data
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const thisMonthCases = casesData.filter(c => new Date(c.created_at) >= thisMonth);
    const thisMonthRevenue = thisMonthCases.reduce((sum, c) => {
      const diagnostic = parseFloat(c.diagnostic_fee_amount || 0);
      const labor = parseFloat(c.labor_cost_calculated || 0);
      return sum + diagnostic + labor;
    }, 0);

    // Calculate communication metrics
    const totalCommunications = communicationData.length;
    const totalInteractions = interactionsData.length;

    return {
      totalCustomers: uniqueCustomers,
      totalRevenue: totalRevenue,
      completedCases: completedCases,
      thisMonthRevenue: thisMonthRevenue,
      totalCommunications: totalCommunications,
      totalInteractions: totalInteractions
    };
  }, [casesData, communicationData, interactionsData]);

  const metricCards = [
    {
      title: "Total Customers",
      value: metrics.totalCustomers.toString(),
      icon: <Users className="h-4 w-4" />,
      description: "Unique customers served"
    },
    {
      title: "Total Revenue",
      value: `$${metrics.totalRevenue.toFixed(2)}`,
      icon: <DollarSign className="h-4 w-4" />,
      description: "All-time revenue"
    },
    {
      title: "Completed Cases",
      value: metrics.completedCases.toString(),
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Successfully completed work orders"
    },
    {
      title: "This Month Revenue",
      value: `$${metrics.thisMonthRevenue.toFixed(2)}`,
      icon: <Calendar className="h-4 w-4" />,
      description: "Current month earnings"
    },
    {
      title: "Communications",
      value: metrics.totalCommunications.toString(),
      icon: <MessageCircle className="h-4 w-4" />,
      description: "Total communications sent"
    },
    {
      title: "Interactions",
      value: metrics.totalInteractions.toString(),
      icon: <PhoneCall className="h-4 w-4" />,
      description: "Customer interactions logged"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metricCards.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CRMAnalyticsMetrics;

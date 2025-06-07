
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, Activity } from 'lucide-react';

const CRMMetrics = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Customers</CardTitle>
          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold">1,234</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">+12.5%</span> from last month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Monthly Revenue</CardTitle>
          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold">$24,800</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">+16.5%</span> from last month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Avg. Order Value</CardTitle>
          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold">$194</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">+8.2%</span> from last month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Customer Retention</CardTitle>
          <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold">85.4%</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">+2.1%</span> from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMMetrics;

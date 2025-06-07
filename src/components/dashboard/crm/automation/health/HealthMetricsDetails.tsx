
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, TrendingUp, TrendingDown } from 'lucide-react';

interface CustomerHealthMetric {
  id: string;
  customer_id: number;
  health_score: number;
  risk_factors: string[];
  opportunities: string[];
  last_interaction_date: string | null;
  next_recommended_action: string | null;
  calculated_at: string;
}

interface HealthMetricsDetailsProps {
  metrics: CustomerHealthMetric[];
}

const HealthMetricsDetails = ({ metrics }: HealthMetricsDetailsProps) => {
  const getHealthStatus = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'bg-green-500' };
    if (score >= 60) return { label: 'Good', color: 'bg-blue-500' };
    if (score >= 40) return { label: 'Fair', color: 'bg-yellow-500' };
    return { label: 'Poor', color: 'bg-red-500' };
  };

  const getHealthIcon = (score: number) => {
    if (score >= 60) return <Heart className="h-4 w-4 text-green-500" />;
    if (score >= 40) return <TrendingUp className="h-4 w-4 text-yellow-500" />;
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Health Details</CardTitle>
      </CardHeader>
      <CardContent>
        {metrics.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No customer health metrics available
          </div>
        ) : (
          <div className="space-y-4">
            {metrics.map((metric) => {
              const status = getHealthStatus(metric.health_score);
              return (
                <div key={metric.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {getHealthIcon(metric.health_score)}
                    <div>
                      <p className="font-medium">Customer #{metric.customer_id}</p>
                      <p className="text-sm text-muted-foreground">
                        Score: {metric.health_score}/100
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge className={status.color}>
                      {status.label}
                    </Badge>
                    
                    {metric.risk_factors.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {metric.risk_factors.slice(0, 2).map((factor, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                        {metric.risk_factors.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{metric.risk_factors.length - 2} more
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {metric.opportunities.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {metric.opportunities.slice(0, 1).map((opportunity, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {opportunity}
                          </Badge>
                        ))}
                        {metric.opportunities.length > 1 && (
                          <Badge variant="outline" className="text-xs">
                            +{metric.opportunities.length - 1} opportunities
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthMetricsDetails;

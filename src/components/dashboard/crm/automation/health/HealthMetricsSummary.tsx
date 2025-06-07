
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Heart, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

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

interface HealthMetricsSummaryProps {
  metrics: CustomerHealthMetric[];
}

const HealthMetricsSummary = ({ metrics }: HealthMetricsSummaryProps) => {
  const excellentCount = metrics.filter(m => m.health_score >= 80).length;
  const atRiskCount = metrics.filter(m => m.health_score < 60 && m.health_score >= 40).length;
  const criticalCount = metrics.filter(m => m.health_score < 40).length;
  const avgScore = metrics.length > 0 ? Math.round(metrics.reduce((acc, m) => acc + m.health_score, 0) / metrics.length) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Excellent Health</p>
              <p className="text-2xl font-bold text-green-600">{excellentCount}</p>
            </div>
            <Heart className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">At Risk</p>
              <p className="text-2xl font-bold text-yellow-600">{atRiskCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Score</p>
              <p className="text-2xl font-bold">{avgScore}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthMetricsSummary;


import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from 'lucide-react';

interface CustomerScore {
  id: string;
  customer_id: number;
  total_score: number;
  priority_level: string;
  last_calculated: string;
}

interface CustomerScoresListProps {
  scores: CustomerScore[];
}

const CustomerScoresList = ({ scores }: CustomerScoresListProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'vip': return 'bg-purple-500';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Customer Scores</h3>
      
      {scores.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No customer scores calculated yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {scores.slice(0, 10).map((score) => (
            <Card key={score.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Customer #{score.customer_id}</p>
                      <p className="text-sm text-muted-foreground">
                        Last calculated: {new Date(score.last_calculated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold">{score.total_score}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                    <Badge className={getPriorityColor(score.priority_level)}>
                      {score.priority_level.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerScoresList;

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, TrendingUp, DollarSign, Calendar, Mail } from 'lucide-react';

interface Lead {
  id: number;
  name: string;
  email: string;
  score: number;
  maxScore: number;
  rating: 'hot' | 'warm' | 'cold';
  lastContact: string;
  estimatedValue: number;
  factors: {
    engagement: number;
    budget: number;
    timeline: number;
    authority: number;
  };
}

const LeadScoring = () => {
  const [leads] = useState<Lead[]>([
    {
      id: 1,
      name: "Sarah Thompson",
      email: "sarah@company.com",
      score: 85,
      maxScore: 100,
      rating: 'hot',
      lastContact: "2024-01-18",
      estimatedValue: 5000,
      factors: { engagement: 90, budget: 85, timeline: 80, authority: 85 }
    },
    {
      id: 2,
      name: "Robert Chen",
      email: "robert@business.com",
      score: 65,
      maxScore: 100,
      rating: 'warm',
      lastContact: "2024-01-15",
      estimatedValue: 3000,
      factors: { engagement: 70, budget: 60, timeline: 65, authority: 65 }
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily@startup.io",
      score: 35,
      maxScore: 100,
      rating: 'cold',
      lastContact: "2024-01-10",
      estimatedValue: 1500,
      factors: { engagement: 40, budget: 30, timeline: 35, authority: 35 }
    }
  ]);

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'hot':
        return <Badge className="bg-destructive/10 text-destructive">🔥 Hot Lead</Badge>;
      case 'warm':
        return <Badge className="bg-accent/10 text-accent">☀️ Warm Lead</Badge>;
      default:
        return <Badge variant="outline">❄️ Cold Lead</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-secondary';
    if (score >= 40) return 'text-accent';
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Lead Scoring System</CardTitle>
          <CardDescription>
            Automatically score and prioritize leads based on engagement, budget, timeline, and authority
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-4 gap-4">
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <Star className="h-5 w-5 mx-auto mb-2 text-destructive" />
                  <p className="text-2xl font-bold">{leads.filter(l => l.rating === 'hot').length}</p>
                  <p className="text-xs text-muted-foreground">Hot Leads</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto mb-2 text-accent" />
                  <p className="text-2xl font-bold">{leads.filter(l => l.rating === 'warm').length}</p>
                  <p className="text-xs text-muted-foreground">Warm Leads</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">${leads.reduce((sum, l) => sum + l.estimatedValue, 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Pipeline Value</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <Calendar className="h-5 w-5 mx-auto mb-2 text-secondary" />
                  <p className="text-2xl font-bold">{Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length)}</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            {leads.map((lead) => (
              <Card key={lead.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{lead.name}</h4>
                        {getRatingBadge(lead.rating)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Last contact: {new Date(lead.lastContact).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          Est. value: ${lead.estimatedValue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-3xl font-bold ${getScoreColor(lead.score)}`}>{lead.score}</p>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Overall Score</span>
                      <span className="font-medium">{lead.score}%</span>
                    </div>
                    <Progress value={lead.score} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Engagement</p>
                      <Progress value={lead.factors.engagement} className="h-1.5" />
                      <p className="text-xs font-medium mt-1">{lead.factors.engagement}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Budget</p>
                      <Progress value={lead.factors.budget} className="h-1.5" />
                      <p className="text-xs font-medium mt-1">{lead.factors.budget}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Timeline</p>
                      <Progress value={lead.factors.timeline} className="h-1.5" />
                      <p className="text-xs font-medium mt-1">{lead.factors.timeline}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Authority</p>
                      <Progress value={lead.factors.authority} className="h-1.5" />
                      <p className="text-xs font-medium mt-1">{lead.factors.authority}%</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm">View Details</Button>
                    <Button size="sm" variant="outline">Contact Lead</Button>
                    <Button size="sm" variant="outline">Update Score</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scoring Criteria</CardTitle>
          <CardDescription>Configure how leads are automatically scored</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
              <span className="font-medium">Email engagement (opens, clicks)</span>
              <Badge variant="outline">25 points</Badge>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
              <span className="font-medium">Website visits and time on site</span>
              <Badge variant="outline">20 points</Badge>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
              <span className="font-medium">Budget qualification</span>
              <Badge variant="outline">25 points</Badge>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
              <span className="font-medium">Decision-making authority</span>
              <Badge variant="outline">15 points</Badge>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
              <span className="font-medium">Timeline urgency</span>
              <Badge variant="outline">15 points</Badge>
            </div>
          </div>
          <Button className="w-full mt-4" variant="outline">Edit Scoring Rules</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadScoring;

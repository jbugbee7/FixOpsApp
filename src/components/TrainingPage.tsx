
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, GraduationCap, Trophy, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import AiSummaryPage from './AiSummaryPage';
import TrainingHeader from './training/TrainingHeader';
import GuidesTab from './training/GuidesTab';
import AiTrainingTab from './training/AiTrainingTab';

const TrainingPage = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [selectedApplianceForAI, setSelectedApplianceForAI] = useState<string | null>(null);

  const handleTrainingCardClick = (applianceType: string) => {
    setSelectedApplianceForAI(applianceType);
  };

  if (selectedApplianceForAI) {
    return (
      <AiSummaryPage 
        applianceType={selectedApplianceForAI}
        onBack={() => setSelectedApplianceForAI(null)}
      />
    );
  }

  // Mobile view (keep existing simple design)
  if (isMobile) {
    return (
      <div className="space-y-8">
        <TrainingHeader />

        <Tabs defaultValue="ai-training" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai-training">AI Training Center</TabsTrigger>
            <TabsTrigger value="guides">Troubleshooting Guides</TabsTrigger>
          </TabsList>

          <TabsContent value="ai-training" className="space-y-4">
            <AiTrainingTab user={user} onTrainingCardClick={handleTrainingCardClick} />
          </TabsContent>

          <TabsContent value="guides" className="space-y-4">
            <GuidesTab />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Desktop view (new detailed design)
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 animate-fade-in">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 rounded-3xl p-4 border border-border/50">
          <div className="flex items-center gap-4 mb-0.5">
            <GraduationCap className="h-10 w-10 text-primary" />
            <h1 className="text-2xl font-bold">Training Center</h1>
          </div>
          <p className="text-sm text-muted-foreground">Access AI-powered training, troubleshooting guides, and skill development resources</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="col-span-8 space-y-6">
            <Tabs defaultValue="ai-training" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ai-training">AI Training Center</TabsTrigger>
                <TabsTrigger value="guides">Troubleshooting Guides</TabsTrigger>
              </TabsList>

              <TabsContent value="ai-training" className="space-y-4">
                <AiTrainingTab user={user} onTrainingCardClick={handleTrainingCardClick} />
              </TabsContent>

              <TabsContent value="guides" className="space-y-4">
                <GuidesTab />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar Info */}
          <div className="col-span-4 space-y-6">
            {/* Learning Progress */}
            <Card className="rounded-2xl border-border/50">
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Your skill development</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">12</div>
                  <p className="text-sm text-muted-foreground">Courses Completed</p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                  <div className="flex items-center justify-between mb-2">
                    <BookOpen className="h-5 w-5 text-accent" />
                    <Badge variant="secondary">5</Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">5</div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="h-5 w-5 text-secondary" />
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                      +25%
                    </span>
                  </div>
                  <div className="text-3xl font-bold mb-1">85%</div>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                </div>
              </CardContent>
            </Card>

            {/* Current Goals */}
            <Card className="rounded-2xl border-border/50">
              <CardHeader>
                <CardTitle>Current Focus</CardTitle>
                <CardDescription>Areas to develop</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Refrigeration Systems</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-3/4"></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">75% complete</p>
                </div>

                <div className="p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">HVAC Diagnostics</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-1/2"></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">50% complete</p>
                </div>

                <div className="p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="h-4 w-4 text-secondary" />
                    <span className="text-sm font-medium">Electrical Systems</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-1/3"></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">33% complete</p>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle>Recommended</CardTitle>
                <CardDescription>Based on your activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg border border-border bg-background hover:bg-muted/30 transition-colors cursor-pointer">
                  <p className="text-sm font-medium mb-1">Advanced Compressor Repair</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Advanced</Badge>
                    <span className="text-xs text-muted-foreground">2h 30m</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border bg-background hover:bg-muted/30 transition-colors cursor-pointer">
                  <p className="text-sm font-medium mb-1">Smart Appliance Diagnostics</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Intermediate</Badge>
                    <span className="text-xs text-muted-foreground">1h 45m</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border bg-background hover:bg-muted/30 transition-colors cursor-pointer">
                  <p className="text-sm font-medium mb-1">Refrigerant Handling</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Advanced</Badge>
                    <span className="text-xs text-muted-foreground">3h 15m</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPage;

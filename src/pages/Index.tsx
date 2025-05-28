
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Smartphone, Database, Bot, Zap, Shield, Users, TrendingUp, ArrowRight, Menu, X, BarChart3, BookOpen, Settings, Wrench } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to get early access.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Thanks for your interest!",
      description: "We'll be in touch soon with updates about FixOps.",
    });
    
    setEmail('');
    setMessage('');
  };

  const features = [
    {
      icon: <Smartphone className="h-8 w-8 text-blue-500" />,
      title: "Mobile-First Design",
      description: "Built specifically for technicians in the field with offline capabilities."
    },
    {
      icon: <Bot className="h-8 w-8 text-purple-500" />,
      title: "AI Diagnostic Assistant",
      description: "Get intelligent suggestions based on historical repair data."
    },
    {
      icon: <Database className="h-8 w-8 text-green-500" />,
      title: "Structured Case Logging",
      description: "Efficiently capture and organize all repair information."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FixOps
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#contact" className="text-slate-600 hover:text-slate-900 transition-colors">Contact</a>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Get Early Access
              </Button>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 space-y-4">
              <a href="#features" className="block text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#contact" className="block text-slate-600 hover:text-slate-900 transition-colors">Contact</a>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Get Early Access
              </Button>
            </div>
          )}
        </div>
      </nav>

      <Tabs defaultValue="dashboard" className="w-full">
        {/* Main Content */}
        <div className="flex-1">
          <TabsContent value="dashboard" className="m-0">
            {/* Hero Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto text-center">
                <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200">
                  AI-Powered Repair Solutions
                </Badge>
                
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                  Transform Your
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Repair Operations</span>
                </h1>
                
                <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                  FixOps combines intelligent case logging with AI-powered diagnostics to help appliance repair technicians 
                  work smarter, faster, and more efficiently.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3">
                    Request Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="lg" className="px-8 py-3">
                    Watch Video
                  </Button>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    Everything You Need
                  </h2>
                  <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                    From case logging to AI-powered diagnostics, FixOps provides all the tools modern repair operations need.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {features.map((feature, index) => (
                    <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                      <CardHeader className="text-center">
                        <div className="mx-auto mb-4 w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                          {feature.icon}
                        </div>
                        <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-center text-slate-600">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="training" className="m-0">
            <section className="py-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <BookOpen className="h-16 w-16 text-blue-500 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                  Training & Resources
                </h2>
                <p className="text-xl text-slate-600 mb-8">
                  Comprehensive training materials and resources to help your team master FixOps and improve repair efficiency.
                </p>
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <span>Interactive tutorials</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <span>Video training library</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <span>Best practices guide</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <span>24/7 support access</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="ai-assistant" className="m-0">
            <section className="py-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <Bot className="h-16 w-16 text-purple-500 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                  AI Assistant
                </h2>
                <p className="text-xl text-slate-600 mb-8">
                  Get intelligent diagnostic suggestions and repair recommendations based on your historical data and similar cases.
                </p>
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-slate-900 mb-2">Smart Diagnostics</h3>
                        <p className="text-sm text-slate-600">AI analyzes symptoms and suggests likely causes</p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-slate-900 mb-2">Historical Insights</h3>
                        <p className="text-sm text-slate-600">Learn from past repairs and successful solutions</p>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-slate-900 mb-2">Parts Recommendations</h3>
                        <p className="text-sm text-slate-600">Get suggestions for required parts and tools</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="analytics" className="m-0">
            <section className="py-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <BarChart3 className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                  Analytics & Insights
                </h2>
                <p className="text-xl text-slate-600 mb-8">
                  Track performance metrics, identify trends, and optimize your repair operations with detailed analytics.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <TrendingUp className="h-8 w-8 text-blue-500 mb-3" />
                      <h3 className="font-semibold text-slate-900 mb-2">Performance Tracking</h3>
                      <p className="text-sm text-slate-600">Monitor repair times, success rates, and efficiency metrics</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <Users className="h-8 w-8 text-purple-500 mb-3" />
                      <h3 className="font-semibold text-slate-900 mb-2">Team Analytics</h3>
                      <p className="text-sm text-slate-600">Compare technician performance and identify training needs</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="settings" className="m-0">
            <section className="py-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <Settings className="h-16 w-16 text-slate-500 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                  Settings & Configuration
                </h2>
                <p className="text-xl text-slate-600 mb-8">
                  Customize FixOps to match your business needs and workflow preferences.
                </p>
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-slate-900 mb-2">User Management</h3>
                        <p className="text-sm text-slate-600">Manage team access and permissions</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-slate-900 mb-2">Data Sync</h3>
                        <p className="text-sm text-slate-600">Configure offline and sync settings</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-slate-900 mb-2">Integrations</h3>
                        <p className="text-sm text-slate-600">Connect with existing business tools</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-slate-900 mb-2">Security</h3>
                        <p className="text-sm text-slate-600">Enterprise-grade security settings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>

          {/* Contact Section - Visible on all tabs */}
          <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join the waitlist and be among the first to experience FixOps.
              </p>
              
              <Card className="max-w-2xl mx-auto border-0 shadow-2xl">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-lg py-3"
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Tell us about your repair business (optional)"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3"
                    >
                      Get Early Access
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                  
                  <p className="text-sm text-slate-500 mt-4">
                    We'll keep you updated on our progress and notify you when FixOps is ready to launch.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        {/* Bottom Navigation Tabs - Always Visible */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg">
          <TabsList className="grid w-full grid-cols-5 h-16 bg-white rounded-none">
            <TabsTrigger 
              value="dashboard" 
              className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
            >
              <TrendingUp className="h-5 w-5" />
              <span className="text-xs">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="training" 
              className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
            >
              <BookOpen className="h-5 w-5" />
              <span className="text-xs">Training</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ai-assistant" 
              className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
            >
              <Bot className="h-5 w-5" />
              <span className="text-xs">AI Assistant</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
            >
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">Analytics</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs">Settings</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
};

export default Index;

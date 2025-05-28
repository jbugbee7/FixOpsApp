
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Smartphone, Database, Bot, Zap, Shield, Users, TrendingUp, ArrowRight, Menu, X } from 'lucide-react';
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
      description: "Built specifically for technicians in the field with offline capabilities and intuitive mobile interface."
    },
    {
      icon: <Database className="h-8 w-8 text-green-500" />,
      title: "Structured Case Logging",
      description: "Efficiently capture customer info, appliance details, diagnostics, parts used, and resolutions in a centralized database."
    },
    {
      icon: <Bot className="h-8 w-8 text-purple-500" />,
      title: "AI Diagnostic Assistant",
      description: "Get intelligent suggestions based on historical repair data and similar cases from your growing knowledge base."
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Real-Time Sync",
      description: "Seamlessly sync data when connectivity returns, ensuring no job details are ever lost."
    },
    {
      icon: <Shield className="h-8 w-8 text-red-500" />,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with full compliance for customer data privacy and business requirements."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-indigo-500" />,
      title: "Analytics & Insights",
      description: "Track performance metrics, common issues, and repair trends to optimize your service operations."
    }
  ];

  const benefits = [
    "Reduce diagnostic time by up to 40%",
    "Standardize repair documentation",
    "Build institutional knowledge that grows over time",
    "Improve first-time fix rates",
    "Streamline parts inventory management",
    "Generate detailed service reports instantly"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FixOps
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">How it Works</a>
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
              <a href="#how-it-works" className="block text-slate-600 hover:text-slate-900 transition-colors">How it Works</a>
              <a href="#contact" className="block text-slate-600 hover:text-slate-900 transition-colors">Contact</a>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Get Early Access
              </Button>
            </div>
          )}
        </div>
      </nav>

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
            work smarter, faster, and more efficiently than ever before.
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

          {/* Hero Image Placeholder */}
          <div className="relative mx-auto max-w-4xl">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-slate-900">Mobile App Interface</h3>
                    <p className="text-slate-600 text-sm">Intuitive design for field technicians</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">Case Logging</h4>
                    <p className="text-sm text-slate-600">Quick entry forms for all repair details</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">AI Assistant</h4>
                    <p className="text-sm text-slate-600">Get diagnostic suggestions instantly</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">Offline Ready</h4>
                    <p className="text-sm text-slate-600">Works without internet connection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Why Technicians Choose FixOps
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Built by repair professionals, for repair professionals. FixOps understands the unique challenges 
                you face in the field and provides solutions that actually work.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader className="pb-3">
                  <Users className="h-8 w-8 text-blue-500 mb-2" />
                  <CardTitle className="text-lg">For Technicians</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Spend less time on paperwork and more time fixing appliances with intelligent automation.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader className="pb-3">
                  <TrendingUp className="h-8 w-8 text-purple-500 mb-2" />
                  <CardTitle className="text-lg">For Managers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Get insights into operations, track performance, and build a knowledge base that scales.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              From case logging to AI-powered diagnostics, FixOps provides all the tools modern repair operations need to succeed.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How FixOps Works
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              A simple three-step process that transforms how you handle repairs and builds intelligence over time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Log Your Cases</h3>
              <p className="text-slate-600">
                Quickly capture customer info, appliance details, symptoms, diagnostics, and resolutions using our intuitive mobile interface.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">AI Learns & Indexes</h3>
              <p className="text-slate-600">
                Our AI automatically processes your repair data, building a searchable knowledge base of solutions and patterns.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Get Smart Suggestions</h3>
              <p className="text-slate-600">
                Ask our AI assistant about similar cases and get diagnostic suggestions based on your team's accumulated expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Repair Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the waitlist and be among the first to experience the future of appliance repair technology.
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

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-2xl font-bold text-white">FixOps</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-slate-400 mb-2">
                Building the future of appliance repair technology
              </p>
              <p className="text-slate-500 text-sm">
                © 2024 FixOps. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

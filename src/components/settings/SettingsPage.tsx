import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/hooks/useCompany';
import ThemeToggle from "@/components/ThemeToggle";
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  Building2, 
  MessageSquare, 
  ChevronRight,
  ArrowLeft,
  Search,
  User,
  Bell,
  Eye,
  Lock,
  Headphones,
  Info
} from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { userProfile, user } = useAuth();
  const { company, loading: companyLoading } = useCompany();
  const [searchQuery, setSearchQuery] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleTextSupport = () => {
    const phoneNumber = '8283182617';
    const message = encodeURIComponent('Hi, I need support with my account.');
    
    try {
      window.location.href = `sms:${phoneNumber}?body=${message}`;
    } catch (error) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for a setting..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50"
          />
        </div>

        {/* Settings Menu Items */}
        <div className="space-y-2">
          {/* Account Section */}
          <Collapsible open={openSection === 'account'} onOpenChange={() => toggleSection('account')}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-accent transition-colors">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Account</span>
                </div>
                <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${openSection === 'account' ? 'rotate-90' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 p-4 bg-card border border-border rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display-name" className="text-sm font-medium">Display Name</Label>
                  <Input
                    id="display-name"
                    value={userProfile?.full_name || ''}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="profile-email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Contact support to change your email address
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-phone" className="text-sm font-medium">Phone Number</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="profile-phone"
                      value={userProfile?.phone_number || 'Not provided'}
                      disabled
                      className="bg-muted"
                    />
                    {userProfile?.phone_number && (
                      <Badge variant={userProfile?.phone_verified ? "default" : "destructive"} className="whitespace-nowrap">
                        {userProfile?.phone_verified ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Unverified
                          </>
                        )}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Account Type</Label>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default" className="text-sm px-3 py-1 font-medium">
                      Personal
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <Button className="px-6">
                  Save Changes
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Notifications Section */}
          <Collapsible open={openSection === 'notifications'} onOpenChange={() => toggleSection('notifications')}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-accent transition-colors">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Notifications</span>
                </div>
                <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${openSection === 'notifications' ? 'rotate-90' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 p-4 bg-card border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">Notification settings coming soon...</p>
            </CollapsibleContent>
          </Collapsible>

          {/* Appearance Section */}
          <Collapsible open={openSection === 'appearance'} onOpenChange={() => toggleSection('appearance')}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-accent transition-colors">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Appearance</span>
                </div>
                <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${openSection === 'appearance' ? 'rotate-90' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Theme</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Switch between light and dark mode
                  </p>
                </div>
                <ThemeToggle />
              </div>

              {companyLoading ? (
                <div className="animate-pulse mt-4">
                  <div className="h-10 w-full bg-muted rounded"></div>
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  <Label htmlFor="company-name" className="text-sm font-medium">Company Name</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="company-name"
                      value={company?.name || 'No company name'}
                      disabled
                      className="bg-muted"
                    />
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Privacy & Security Section */}
          <Collapsible open={openSection === 'privacy'} onOpenChange={() => toggleSection('privacy')}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-accent transition-colors">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Privacy & Security</span>
                </div>
                <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${openSection === 'privacy' ? 'rotate-90' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 p-4 bg-card border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">Privacy & security settings coming soon...</p>
            </CollapsibleContent>
          </Collapsible>

          {/* Help and Support Section */}
          <Collapsible open={openSection === 'support'} onOpenChange={() => toggleSection('support')}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-accent transition-colors">
                <div className="flex items-center gap-3">
                  <Headphones className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Help and Support</span>
                </div>
                <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${openSection === 'support' ? 'rotate-90' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 p-4 bg-card border border-border rounded-lg space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Get help with your account or technical issues
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col space-y-3">
                    <Button 
                      onClick={handleTextSupport}
                      className="flex items-center gap-2 w-fit"
                      size="lg"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Text Support
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Send us a text message at (828) 318-2617 for quick support
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span>9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday:</span>
                      <span>10:00 AM - 4:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* About Section */}
          <Collapsible open={openSection === 'about'} onOpenChange={() => toggleSection('about')}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-accent transition-colors">
                <div className="flex items-center gap-3">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">About</span>
                </div>
                <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${openSection === 'about' ? 'rotate-90' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 p-4 bg-card border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">About information coming soon...</p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

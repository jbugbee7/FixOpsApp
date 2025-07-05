import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone } from 'lucide-react';

const SupportTab = () => {
  const handleTextSupport = () => {
    const phoneNumber = '8283182617';
    const message = encodeURIComponent('Hi, I need support with my account.');
    window.open(`sms:${phoneNumber}?body=${message}`, '_self');
  };

  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default SupportTab;
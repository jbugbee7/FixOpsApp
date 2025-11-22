
import { Card, CardContent } from "@/components/ui/card";
import { Wrench } from 'lucide-react';

const AuthLoading = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Card className="shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-3">
              <Wrench className="h-6 w-6 text-white animate-spin" />
            </div>
            <h2 className="text-base font-semibold mb-1">Loading FixOps</h2>
            <p className="text-sm text-muted-foreground">Setting up your workspace...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthLoading;

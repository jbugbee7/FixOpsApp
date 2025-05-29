
import { Card, CardContent } from "@/components/ui/card";
import { Wrench } from 'lucide-react';

const AuthLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Wrench className="h-8 w-8 text-white animate-spin" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Loading FixOps</h2>
            <p className="text-slate-600 dark:text-slate-400">Please wait while we set things up...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthLoading;

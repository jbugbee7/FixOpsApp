
import { Card, CardContent } from "@/components/ui/card";
import { Wrench } from 'lucide-react';

const AuthLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Card className="dark:bg-slate-800 dark:border-slate-700 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Wrench className="h-6 w-6 text-white animate-spin" />
            </div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">Loading FixOps</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Setting up your workspace...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthLoading;

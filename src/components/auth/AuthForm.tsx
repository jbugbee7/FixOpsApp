
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Wrench } from 'lucide-react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

interface AuthFormProps {
  showVerificationMessage: boolean;
  showVerificationSuccess: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setShowVerificationMessage: (show: boolean) => void;
}

const AuthForm = ({ 
  showVerificationMessage, 
  showVerificationSuccess, 
  activeTab, 
  setActiveTab, 
  setShowVerificationMessage 
}: AuthFormProps) => {
  const [error, setError] = useState('');

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      {/* Mobile-optimized Logo */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-600 to-black rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <Wrench className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent">
          FixOps
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
          Your appliance repair management system
        </p>
      </div>

      <Card className="dark:bg-slate-800 dark:border-slate-700 border-0 sm:border shadow-lg">
        <CardHeader className="text-center pb-4 sm:pb-6">
          <CardTitle className="dark:text-slate-100 text-lg sm:text-xl">Welcome</CardTitle>
          <CardDescription className="dark:text-slate-400 text-sm">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {/* Email Verification Success Message */}
          {showVerificationSuccess && (
            <Alert className="mb-4 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-300 text-sm">
                Thanks for verifying your email! You can now sign in to your account.
              </AlertDescription>
            </Alert>
          )}

          {/* Verification Email Sent Message */}
          {showVerificationMessage && (
            <Alert className="mb-4 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-300 text-sm">
                A verification email has been sent to your email address. Please check your inbox and click the verification link to complete your registration.
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-9 sm:h-10">
              <TabsTrigger value="signin" className="text-sm sm:text-base">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="text-sm sm:text-base">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4 mt-4 sm:mt-6">
              <SignInForm error={error} setError={setError} />
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4 mt-4 sm:mt-6">
              <SignUpForm 
                error={error} 
                setError={setError}
                setShowVerificationMessage={setShowVerificationMessage}
                setActiveTab={setActiveTab}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;

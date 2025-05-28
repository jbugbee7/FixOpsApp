
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
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Wrench className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          FixOps
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Your appliance repair management system
        </p>
      </div>

      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="text-center">
          <CardTitle className="dark:text-slate-100">Welcome</CardTitle>
          <CardDescription className="dark:text-slate-400">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Email Verification Success Message */}
          {showVerificationSuccess && (
            <Alert className="mb-4 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-300">
                Thanks for verifying your email! You can now sign in to your account.
              </AlertDescription>
            </Alert>
          )}

          {/* Verification Email Sent Message */}
          {showVerificationMessage && (
            <Alert className="mb-4 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-300">
                A verification email has been sent to your email address. Please check your inbox and click the verification link to complete your registration.
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <SignInForm error={error} setError={setError} />
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
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

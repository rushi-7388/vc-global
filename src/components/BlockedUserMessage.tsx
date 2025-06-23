import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LogOut, Shield, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const BlockedUserMessage = () => {
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been signed out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            Account Blocked
          </CardTitle>
          <CardDescription className="text-gray-600">
            Your account has been temporarily suspended
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your account has been blocked due to suspicious activity or violation of our terms of service. 
              If you believe this is an error, please contact support.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>What this means:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>You cannot access any protected features</li>
              <li>Your login attempts will be logged</li>
              <li>Contact support to appeal this decision</li>
            </ul>
          </div>

          <div className="flex flex-col space-y-2">
            <Button 
              onClick={handleSignOut}
              variant="outline" 
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = 'mailto:support@vcglobal.com?subject=Account Blocked - Appeal'}
            >
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
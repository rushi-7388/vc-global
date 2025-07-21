import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye } from 'lucide-react';

export default function Security() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">Security Information</h1>
          <p className="text-center text-muted-foreground">
            Basic security features and information
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Authentication</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Secure user authentication with email and password verification.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle>Data Protection</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                User data is protected with industry-standard encryption.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-primary" />
                <CardTitle>Privacy</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your privacy is important to us. We follow best practices for data handling.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
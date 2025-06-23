import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { addCurrentUserAsAdmin } from "@/utils/addAdminUser";
import { useAdminCheck } from "@/hooks/useAdminCheck";

export const AdminSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: isAdmin, refetch } = useAdminCheck();

  const handleAddAsAdmin = async () => {
    setIsLoading(true);
    try {
      const result = await addCurrentUserAsAdmin();
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        // Refetch admin status
        refetch();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add as admin. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAdmin) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-green-600">Admin Access Granted</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You have admin access. You can now manage products.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Admin Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          You need admin access to manage products. Click the button below to add yourself as an admin.
        </p>
        <Button 
          onClick={handleAddAsAdmin} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Adding as Admin..." : "Add Me as Admin"}
        </Button>
      </CardContent>
    </Card>
  );
}; 
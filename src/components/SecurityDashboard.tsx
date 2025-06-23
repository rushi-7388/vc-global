import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from './LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

interface SecurityEvent {
  id: string;
  event: string;
  user_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string;
  user_agent: string;
  timestamp: string;
}

interface BlockedUser {
  id: string;
  user_id: string;
  reason: string;
  blocked_at: string;
  expires_at: string | null;
}

interface SecurityStats {
  totalEvents: number;
  failedLogins: number;
  suspiciousActivities: number;
  blockedUsers: number;
  recentEvents: SecurityEvent[];
}

export const SecurityDashboard = () => {
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const loadSecurityData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load security statistics
      const [eventsData, blockedUsersData] = await Promise.all([
        loadSecurityEvents(),
        loadBlockedUsers()
      ]);

      const stats: SecurityStats = {
        totalEvents: eventsData.length,
        failedLogins: eventsData.filter(e => e.event === 'login_failed').length,
        suspiciousActivities: eventsData.filter(e => e.event === 'suspicious_activity').length,
        blockedUsers: blockedUsersData.length,
        recentEvents: eventsData.slice(0, 10)
      };

      setStats(stats);
      setEvents(eventsData);
      setBlockedUsers(blockedUsersData);
    } catch (error) {
      console.error('Failed to load security data:', error);
      toast({
        title: "Error",
        description: "Failed to load security data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadSecurityEvents = async (): Promise<SecurityEvent[]> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('security_audit_log')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) {
        console.warn('Security audit log table not found, returning empty array');
        return [];
      }
      return data || [];
    } catch (error) {
      console.warn('Security audit log table not found, returning empty array');
      return [];
    }
  };

  const loadBlockedUsers = async (): Promise<BlockedUser[]> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('blocked_users')
        .select('*')
        .order('blocked_at', { ascending: false });

      if (error) {
        console.warn('Blocked users table not found, returning empty array');
        return [];
      }
      return data || [];
    } catch (error) {
      console.warn('Blocked users table not found, returning empty array');
      return [];
    }
  };

  const unblockUser = async (userId: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('blocked_users')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.warn('Blocked users table not found');
        toast({
          title: "Warning",
          description: "Security tables not yet created. Please run the database migration.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "User has been unblocked.",
      });

      loadSecurityData(); // Refresh data
    } catch (error) {
      console.error('Failed to unblock user:', error);
      toast({
        title: "Error",
        description: "Failed to unblock user. Security tables may not be created yet.",
        variant: "destructive",
      });
    }
  };

  const getEventIcon = (event: string) => {
    switch (event) {
      case 'login_failed':
        return '🔴';
      case 'login_success':
        return '🟢';
      case 'suspicious_activity':
        return '🟡';
      case 'api_call_failed':
        return '🔴';
      case 'api_call_success':
        return '🟢';
      default:
        return 'ℹ️';
    }
  };

  const getEventColor = (event: string) => {
    switch (event) {
      case 'login_failed':
      case 'api_call_failed':
        return 'text-red-600';
      case 'suspicious_activity':
        return 'text-yellow-600';
      case 'login_success':
      case 'api_call_success':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  useEffect(() => {
    loadSecurityData();
  }, [loadSecurityData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" text="Loading security data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor security events and manage user access
          </p>
        </div>
        <Button onClick={loadSecurityData} variant="outline">
          Refresh Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="blocked">Blocked Users</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Badge variant="secondary">{stats?.totalEvents}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalEvents}</div>
                <p className="text-xs text-muted-foreground">
                  Last 100 security events
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
                <Badge variant="destructive">{stats?.failedLogins}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats?.failedLogins}</div>
                <p className="text-xs text-muted-foreground">
                  Potential security threats
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suspicious Activities</CardTitle>
                <Badge variant="outline">{stats?.suspiciousActivities}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats?.suspiciousActivities}</div>
                <p className="text-xs text-muted-foreground">
                  Activities requiring attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blocked Users</CardTitle>
                <Badge variant="secondary">{stats?.blockedUsers}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.blockedUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Currently blocked accounts
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>
                Latest security events from the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats?.recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <span>{getEventIcon(event.event)}</span>
                      <span className={`font-medium ${getEventColor(event.event)}`}>
                        {event.event.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Events Log</CardTitle>
              <CardDescription>
                Detailed log of all security events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{getEventIcon(event.event)}</span>
                          <span className={getEventColor(event.event)}>
                            {event.event.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{event.user_id || 'Anonymous'}</TableCell>
                      <TableCell>{event.ip_address}</TableCell>
                      <TableCell>
                        {new Date(event.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {event.details ? (
                          <pre className="text-xs bg-muted p-1 rounded">
                            {JSON.stringify(event.details, null, 2)}
                          </pre>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocked" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blocked Users</CardTitle>
              <CardDescription>
                Manage blocked user accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {blockedUsers.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No users are currently blocked.
                  </AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Blocked At</TableHead>
                      <TableHead>Expires At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blockedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.user_id}</TableCell>
                        <TableCell>{user.reason}</TableCell>
                        <TableCell>
                          {new Date(user.blocked_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {user.expires_at 
                            ? new Date(user.expires_at).toLocaleString()
                            : 'Permanent'
                          }
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => unblockUser(user.user_id)}
                          >
                            Unblock
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  Security settings are managed through the database. 
                  Contact your system administrator to modify these settings.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 
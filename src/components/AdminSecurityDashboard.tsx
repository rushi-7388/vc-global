import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LoadingSpinner } from './LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { UserBlockingSystem, BlockedUser, SecurityEvent } from '@/utils/userBlocking';
import { supabase } from '@/integrations/supabase/client';

interface SecurityStats {
  totalEvents: number;
  blockedUsers: number;
  failedLogins: number;
  suspiciousActivities: number;
  recentEvents: SecurityEvent[];
}

// function TestSupabaseConnectionButton() {
//   const { toast } = useToast();
//   const [loading, setLoading] = useState(false);

//   const handleTest = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase.from('products').select('*').limit(1);
//       if (error) {
//         toast({
//           title: 'Supabase Connection Error',
//           description: error.message,
//           variant: 'destructive',
//         });
//       } else {
//         toast({
//           title: 'Supabase Connection Successful',
//           description: data && data.length > 0 ? 'Sample data loaded.' : 'Connected, but no data found.',
//         });
//       }
//     } catch (err) {
//       toast({
//         title: 'Unexpected Error',
//         description: err instanceof Error ? err.message : 'Unknown error',
//         variant: 'destructive',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Button onClick={handleTest} disabled={loading} variant="outline" className="mb-4">
//       {loading ? 'Testing...' : 'Test Supabase Connection'}
//     </Button>
//   );
// }

export const AdminSecurityDashboard = () => {
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockEmail, setBlockEmail] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadSecurityData();
    const interval = setInterval(loadSecurityData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSecurityData = () => {
    try {
      setLoading(true);
      const stats = UserBlockingSystem.getSecurityStats();
      const events = UserBlockingSystem.getSecurityEvents();
      const blockedUsers = UserBlockingSystem.getBlockedUsers();
      setStats(stats);
      setEvents(events);
      setBlockedUsers(blockedUsers);
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
  };

  const handleBlockUser = async () => {
    if (!blockEmail.trim() || !blockReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide both email and reason.",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await UserBlockingSystem.blockUser(
        `email_${Date.now()}`,
        blockEmail.trim(),
        blockReason.trim(),
        'Admin'
      );

      if (success) {
        toast({
          title: "Success",
          description: "User has been blocked.",
        });
        setBlockDialogOpen(false);
        setBlockEmail('');
        setBlockReason('');
        loadSecurityData();
      } else {
        toast({
          title: "Error",
          description: "Failed to block user.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to block user:', error);
      toast({
        title: "Error",
        description: "Failed to block user.",
        variant: "destructive",
      });
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      const success = await UserBlockingSystem.unblockUser(userId);
      if (success) {
        toast({
          title: "Success",
          description: "User has been unblocked.",
        });
        loadSecurityData();
      } else {
        toast({
          title: "Error",
          description: "Failed to unblock user.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to unblock user:', error);
      toast({
        title: "Error",
        description: "Failed to unblock user.",
        variant: "destructive",
      });
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'login_failed': return '🔴';
      case 'login_success': return '🟢';
      case 'suspicious_activity': return '🟡';
      case 'user_blocked': return '🚫';
      case 'user_unblocked': return '✅';
      default: return 'ℹ️';
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'login_failed': return 'text-red-600';
      case 'suspicious_activity': return 'text-yellow-600';
      case 'login_success': return 'text-green-600';
      case 'user_blocked': return 'text-red-600';
      case 'user_unblocked': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" text="Loading security data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* <TestSupabaseConnectionButton /> */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor security events and manage user access
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild className='text-sm text-muted-foreground'>
            <Link to="/">Home</Link>
          </Button>
          <Button onClick={loadSecurityData} variant="outline">
            Refresh Data
          </Button>
          <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Block User</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Block User</DialogTitle>
                <DialogDescription>
                  Block a user from accessing the system. This action can be reversed later.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">User Email</Label>
                  <Input
                    id="email"
                    value={blockEmail}
                    onChange={(e) => setBlockEmail(e.target.value)}
                    placeholder="Enter user email"
                  />
                </div>
                <div>
                  <Label htmlFor="reason">Reason for Blocking</Label>
                  <Textarea
                    id="reason"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder="Enter reason for blocking this user"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBlockUser} variant="destructive">
                  Block User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="blocked">Blocked Users</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
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
                <p className="text-xs text-muted-foreground">Security events tracked</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
                <Badge variant="destructive">{stats?.failedLogins}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats?.failedLogins}</div>
                <p className="text-xs text-muted-foreground">Potential security threats</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suspicious Activities</CardTitle>
                <Badge variant="outline">{stats?.suspiciousActivities}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats?.suspiciousActivities}</div>
                <p className="text-xs text-muted-foreground">Activities requiring attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blocked Users</CardTitle>
                <Badge variant="secondary">{stats?.blockedUsers}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.blockedUsers}</div>
                <p className="text-xs text-muted-foreground">Currently blocked accounts</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>Latest security events from the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats?.recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <span>{getEventIcon(event.event_type)}</span>
                      <span className={`font-medium ${getEventColor(event.event_type)}`}>
                        {event.event_type.replace(/_/g, ' ')}
                      </span>
                      {event.email && (
                        <span className="text-sm text-muted-foreground">({event.email})</span>
                      )}
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
              <CardDescription>Detailed log of all security events</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{getEventIcon(event.event_type)}</span>
                          <span className={getEventColor(event.event_type)}>
                            {event.event_type.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{event.email || 'Anonymous'}</TableCell>
                      <TableCell>{event.details}</TableCell>
                      <TableCell>{new Date(event.timestamp).toLocaleString()}</TableCell>
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
              <CardDescription>Manage blocked user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {blockedUsers.length === 0 ? (
                <Alert>
                  <AlertDescription>No users are currently blocked.</AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Blocked At</TableHead>
                      <TableHead>Blocked By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blockedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.reason}</TableCell>
                        <TableCell>{new Date(user.blocked_at).toLocaleString()}</TableCell>
                        <TableCell>{user.blocked_by}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUnblockUser(user.user_id)}
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

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Security Actions</CardTitle>
              <CardDescription>Common security management tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Block User</h3>
                  <p className="text-sm text-muted-foreground">Block a user from accessing the system</p>
                  <Button onClick={() => setBlockDialogOpen(true)} variant="destructive" size="sm">
                    Block User
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Clear Security Logs</h3>
                  <p className="text-sm text-muted-foreground">Clear all security event logs</p>
                  <Button 
                    onClick={() => {
                      localStorage.removeItem('security_events');
                      loadSecurityData();
                      toast({
                        title: "Success",
                        description: "Security logs cleared.",
                      });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Clear Logs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 
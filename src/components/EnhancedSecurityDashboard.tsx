import { useState, useEffect, useCallback } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from './LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { UserBlockingSystem, BlockedUser, SecurityEvent } from '@/utils/userBlocking';
import { SecurityMiddleware } from '@/utils/securityMiddleware';
import { supabase } from '@/integrations/supabase/client';

interface SecurityStats {
  totalEvents: number;
  blockedUsers: number;
  failedLogins: number;
  suspiciousActivities: number;
  activeThreats: number;
  securityScore: number;
  recentEvents: SecurityEvent[];
}

interface ThreatLevel {
  level: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  count: number;
}

interface SecurityMetric {
  name: string;
  value: number;
  maxValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export const EnhancedSecurityDashboard = () => {
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockEmail, setBlockEmail] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [blockDuration, setBlockDuration] = useState('permanent');
  const [securitySettings, setSecuritySettings] = useState({
    enableAdvancedMonitoring: true,
    enableRealTimeAlerts: true,
    enableAutoBlocking: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    rateLimitWindow: 5
  });
  const [threatLevels, setThreatLevels] = useState<ThreatLevel[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([]);
  const [realTimeData, setRealTimeData] = useState({
    activeSessions: 0,
    failedAttempts: 0,
    suspiciousIPs: 0,
    blockedRequests: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSecurityData();
    const interval = setInterval(loadSecurityData, 10000); // Update every 10 seconds
    const realTimeInterval = setInterval(updateRealTimeData, 5000); // Real-time updates every 5 seconds
    return () => {
      clearInterval(interval);
      clearInterval(realTimeInterval);
    };
  }, []);

  const loadSecurityData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load basic security data
      const stats = UserBlockingSystem.getSecurityStats();
      const events = UserBlockingSystem.getSecurityEvents();
      const blockedUsers = UserBlockingSystem.getBlockedUsers();
      
      // Calculate enhanced stats
      const enhancedStats = await calculateEnhancedStats(stats, events);
      
      // Calculate threat levels
      const threats = calculateThreatLevels(events);
      
      // Calculate security metrics
      const metrics = calculateSecurityMetrics(events, blockedUsers);
      
      setStats(enhancedStats);
      setEvents(events);
      setBlockedUsers(blockedUsers);
      setThreatLevels(threats);
      setSecurityMetrics(metrics);
      
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

  const updateRealTimeData = useCallback(async () => {
    try {
      // Simulate real-time data updates
      const newRealTimeData = {
        activeSessions: Math.floor(Math.random() * 50) + 10,
        failedAttempts: Math.floor(Math.random() * 20),
        suspiciousIPs: Math.floor(Math.random() * 10),
        blockedRequests: Math.floor(Math.random() * 30)
      };
      setRealTimeData(newRealTimeData);
    } catch (error) {
      console.error('Failed to update real-time data:', error);
    }
  }, []);

  const calculateEnhancedStats = async (baseStats: any, events: SecurityEvent[]): Promise<SecurityStats> => {
    const activeThreats = events.filter(event => 
      event.event_type === 'suspicious_activity' || 
      event.event_type === 'failed_login'
    ).length;

    const securityScore = calculateSecurityScore(events);

    return {
      ...baseStats,
      activeThreats,
      securityScore
    };
  };

  const calculateSecurityScore = (events: SecurityEvent[]): number => {
    let score = 100;
    
    // Deduct points for security events
    events.forEach(event => {
      switch (event.event_type) {
        case 'failed_login':
          score -= 5;
          break;
        case 'suspicious_activity':
          score -= 10;
          break;
        case 'user_blocked':
          score -= 15;
          break;
        case 'insecure_connection':
          score -= 20;
          break;
      }
    });
    
    return Math.max(0, score);
  };

  const calculateThreatLevels = (events: SecurityEvent[]): ThreatLevel[] => {
    const levels: ThreatLevel[] = [
      { level: 'low', description: 'Minor security events', count: 0 },
      { level: 'medium', description: 'Moderate security concerns', count: 0 },
      { level: 'high', description: 'High security threats', count: 0 },
      { level: 'critical', description: 'Critical security incidents', count: 0 }
    ];

    events.forEach(event => {
      switch (event.event_type) {
        case 'failed_login':
          levels[0].count++;
          break;
        case 'suspicious_activity':
          levels[1].count++;
          break;
        case 'user_blocked':
          levels[2].count++;
          break;
        case 'insecure_connection':
          levels[3].count++;
          break;
      }
    });

    return levels;
  };

  const calculateSecurityMetrics = (events: SecurityEvent[], blockedUsers: BlockedUser[]): SecurityMetric[] => {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentEvents = events.filter(event => 
      new Date(event.timestamp) > last24Hours
    );

    return [
      {
        name: 'Failed Logins (24h)',
        value: recentEvents.filter(e => e.event_type === 'failed_login').length,
        maxValue: 100,
        unit: 'attempts',
        trend: 'up'
      },
      {
        name: 'Blocked Users',
        value: blockedUsers.length,
        maxValue: 50,
        unit: 'users',
        trend: 'stable'
      },
      {
        name: 'Suspicious Activities',
        value: recentEvents.filter(e => e.event_type === 'suspicious_activity').length,
        maxValue: 20,
        unit: 'events',
        trend: 'down'
      },
      {
        name: 'Security Score',
        value: calculateSecurityScore(events),
        maxValue: 100,
        unit: 'points',
        trend: 'stable'
      }
    ];
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

  const handleSecuritySettingChange = async (setting: string, value: any) => {
    try {
      setSecuritySettings(prev => ({ ...prev, [setting]: value }));
      
      // Save to database
      // Remove or comment out this block:
      // await supabase
      //   .from('security_settings')
      //   .upsert({
      //     setting_key: setting,
      //     setting_value: value,
      //     updated_at: new Date().toISOString()
      //   });

      toast({
        title: "Success",
        description: "Security setting updated.",
      });
    } catch (error) {
      console.error('Failed to update security setting:', error);
      toast({
        title: "Error",
        description: "Failed to update security setting.",
        variant: "destructive",
      });
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading security dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enhanced Security Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time security monitoring and threat management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            Live Monitoring
          </Badge>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Security Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Overall Security Score
            <Badge className={getSecurityScoreColor(stats?.securityScore || 0)}>
              {stats?.securityScore || 0}/100
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={stats?.securityScore || 0} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            Based on recent security events and system health
          </p>
        </CardContent>
      </Card>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeData.activeSessions}</div>
            <p className="text-xs text-muted-foreground">Current users</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{realTimeData.failedAttempts}</div>
            <p className="text-xs text-muted-foreground">Last 5 minutes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Suspicious IPs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{realTimeData.suspiciousIPs}</div>
            <p className="text-xs text-muted-foreground">Being monitored</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Blocked Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{realTimeData.blockedRequests}</div>
            <p className="text-xs text-muted-foreground">Last 5 minutes</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="threats">Threats</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Security Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Security Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {securityMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{metric.name}</span>
                      <span className="font-medium">
                        {metric.value}/{metric.maxValue} {metric.unit}
                      </span>
                    </div>
                    <Progress value={(metric.value / metric.maxValue) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Threat Levels */}
            <Card>
              <CardHeader>
                <CardTitle>Threat Levels</CardTitle>
                <CardDescription>Current security threat assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {threatLevels.map((threat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getThreatLevelColor(threat.level)}`}></div>
                      <span className="text-sm font-medium capitalize">{threat.level}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {threat.count} {threat.count === 1 ? 'event' : 'events'}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Threats Tab */}
        <TabsContent value="threats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Threats</CardTitle>
              <CardDescription>Real-time threat monitoring and analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threatLevels.filter(threat => threat.count > 0).map((threat, index) => (
                  <Alert key={index} variant={threat.level === 'critical' ? 'destructive' : 'default'}>
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">{threat.level} Threat</span>
                        <Badge variant="outline">{threat.count} events</Badge>
                      </div>
                      <p className="text-sm mt-1">{threat.description}</p>
                    </AlertDescription>
                  </Alert>
                ))}
                
                {threatLevels.every(threat => threat.count === 0) && (
                  <Alert>
                    <AlertDescription>
                      No active threats detected. System is secure.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Events</CardTitle>
              <CardDescription>Recent security events and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>User/IP</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.slice(0, 20).map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="text-sm">
                        {new Date(event.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          event.event_type === 'login_success' ? 'default' :
                          event.event_type === 'failed_login' ? 'destructive' :
                          'secondary'
                        }>
                          {event.event_type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {event.email || event.user_id || 'Unknown'}
                      </TableCell>
                      <TableCell className="text-sm max-w-xs truncate">
                        {event.details}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          event.event_type === 'login_success' ? 'default' :
                          event.event_type === 'failed_login' ? 'destructive' :
                          'secondary'
                        }>
                          {event.event_type === 'login_success' ? 'Low' :
                           event.event_type === 'failed_login' ? 'High' : 'Medium'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blocked Users</CardTitle>
              <CardDescription>Manage blocked user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Button onClick={() => setBlockDialogOpen(true)}>
                  Block New User
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Blocked At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blockedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="max-w-xs truncate">{user.reason}</TableCell>
                      <TableCell>
                        {new Date(user.blocked_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnblockUser(user.user_id)}
                        >
                          Unblock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security parameters and monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Advanced Monitoring</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable real-time security monitoring
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.enableAdvancedMonitoring}
                    onCheckedChange={(checked) => 
                      handleSecuritySettingChange('enableAdvancedMonitoring', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Real-time Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Send immediate alerts for security events
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.enableRealTimeAlerts}
                    onCheckedChange={(checked) => 
                      handleSecuritySettingChange('enableRealTimeAlerts', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-blocking</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically block suspicious users
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.enableAutoBlocking}
                    onCheckedChange={(checked) => 
                      handleSecuritySettingChange('enableAutoBlocking', checked)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => 
                      handleSecuritySettingChange('sessionTimeout', parseInt(e.target.value))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Login Attempts</Label>
                  <Input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => 
                      handleSecuritySettingChange('maxLoginAttempts', parseInt(e.target.value))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rate Limit Window (minutes)</Label>
                  <Input
                    type="number"
                    value={securitySettings.rateLimitWindow}
                    onChange={(e) => 
                      handleSecuritySettingChange('rateLimitWindow', parseInt(e.target.value))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Block User Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block User</DialogTitle>
            <DialogDescription>
              Block a user from accessing the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                value={blockEmail}
                onChange={(e) => setBlockEmail(e.target.value)}
                placeholder="Enter user email"
              />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Enter blocking reason"
              />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={blockDuration} onValueChange={setBlockDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="permanent">Permanent</SelectItem>
                  <SelectItem value="1hour">1 Hour</SelectItem>
                  <SelectItem value="24hours">24 Hours</SelectItem>
                  <SelectItem value="7days">7 Days</SelectItem>
                </SelectContent>
              </Select>
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
  );
}; 
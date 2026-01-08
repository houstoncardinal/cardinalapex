import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Shield, UserPlus, Trash2, Search, Crown, Users, ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

interface UserWithRole {
  user_id: string;
  full_name: string | null;
  roles: AppRole[];
}

export const AdminRoleManager = ({ users }: { users: any[] }) => {
  const { toast } = useToast();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('user');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const fetchUserRoles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user roles:', error);
    } else {
      setUserRoles(data || []);
    }
    setLoading(false);
  };

  const grantRole = async () => {
    if (!selectedUserId || !selectedRole) {
      toast({ title: 'Error', description: 'Please select a user and role', variant: 'destructive' });
      return;
    }

    // Check if role already exists
    const existingRole = userRoles.find(
      (ur) => ur.user_id === selectedUserId && ur.role === selectedRole
    );
    if (existingRole) {
      toast({ title: 'Error', description: 'User already has this role', variant: 'destructive' });
      return;
    }

    const { error } = await supabase.from('user_roles').insert({
      user_id: selectedUserId,
      role: selectedRole,
    });

    if (error) {
      toast({ title: 'Error', description: 'Failed to grant role', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `Role "${selectedRole}" granted successfully` });
      setIsDialogOpen(false);
      setSelectedUserId('');
      setSelectedRole('user');
      fetchUserRoles();
    }
  };

  const revokeRole = async (roleId: string) => {
    const { error } = await supabase.from('user_roles').delete().eq('id', roleId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to revoke role', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Role revoked successfully' });
      fetchUserRoles();
    }
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4" />;
      case 'moderator': return <ShieldCheck className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadgeClass = (role: AppRole) => {
    switch (role) {
      case 'admin': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'moderator': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-green-500/10 text-green-500 border-green-500/20';
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.user_id === userId);
    return user?.full_name || 'Unknown User';
  };

  // Get users with their roles
  const usersWithRoles: UserWithRole[] = users.map((user) => ({
    user_id: user.user_id,
    full_name: user.full_name,
    roles: userRoles.filter((ur) => ur.user_id === user.user_id).map((ur) => ur.role),
  }));

  const filteredUsersWithRoles = usersWithRoles.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const adminCount = userRoles.filter((ur) => ur.role === 'admin').length;
  const moderatorCount = userRoles.filter((ur) => ur.role === 'moderator').length;

  return (
    <div className="space-y-6">
      {/* Role Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Crown className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{adminCount}</div>
            <p className="text-xs text-muted-foreground">Full access users</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Moderators</CardTitle>
            <ShieldCheck className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{moderatorCount}</div>
            <p className="text-xs text-muted-foreground">Limited access users</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
      </div>

      {/* Role Management */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Grant Role
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Grant User Role
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Select User</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user..." />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.user_id} value={user.user_id}>
                        {user.full_name || 'Anonymous'} ({user.user_id.slice(0, 8)}...)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Select Role</Label>
                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin (Full Access)</SelectItem>
                    <SelectItem value="moderator">Moderator (Limited Access)</SelectItem>
                    <SelectItem value="user">User (Standard)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={grantRole} className="w-full gap-2">
                <Shield className="h-4 w-4" />
                Grant Role
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Users & Roles</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Loading roles...
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsersWithRoles.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell className="font-medium">{user.full_name || 'Anonymous'}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {user.user_id.slice(0, 12)}...
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.length > 0 ? (
                            user.roles.map((role) => (
                              <Badge key={role} variant="outline" className={getRoleBadgeClass(role)}>
                                <span className="flex items-center gap-1">
                                  {getRoleIcon(role)}
                                  {role}
                                </span>
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">No special roles</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {userRoles
                            .filter((ur) => ur.user_id === user.user_id)
                            .map((ur) => (
                              <Button
                                key={ur.id}
                                variant="ghost"
                                size="sm"
                                className="gap-1 text-xs"
                                onClick={() => revokeRole(ur.id)}
                              >
                                <Trash2 className="h-3 w-3 text-destructive" />
                                Revoke {ur.role}
                              </Button>
                            ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

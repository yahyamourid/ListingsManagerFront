import React, { useState } from 'react';
import {
  Building2,
  LayoutGrid,
  LogOut,
  LayoutDashboard,
  Heart,
  User,
  Lock,
  Save
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const SubscriberProfile = () => {
  const { user, updateProfile, isEditor, isSubscriber, isAdmin, changePassword, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: user?.full_name || user?.name || '',
    email: user?.email || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsProfileLoading(true);
    
    const result = await updateProfile(profileData);
    
    if (result.success) {
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to update profile',
        variant: 'destructive',
      });
    }
    
    setIsProfileLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters',
        variant: 'destructive',
      });
      return;
    }
    
    setIsPasswordLoading(true);
    
    const result = await changePassword(passwordData.oldPassword, passwordData.newPassword);
    
    if (result.success) {
      toast({
        title: 'Success',
        description: 'Password changed successfully',
      });
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to change password',
        variant: 'destructive',
      });
    }
    
    setIsPasswordLoading(false);
  };

  const getRoleBadge = () => {
    if (isAdmin)
      return {
        label: "Admin",
        className: "bg-destructive/20 text-destructive",
      };
    if (isEditor)
      return { label: "Editor", className: "bg-accent/20 text-accent" };
    return { label: "Subscriber", className: "bg-primary/20 text-primary" };
  };

  const roleBadge = getRoleBadge();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold font-display text-foreground">
                        Listings Manager
                      </h1>
                      <p className="text-sm text-muted-foreground">BonMLS</p>
                    </div>
                  </div>
      
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* User Info */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isAdmin
                            ? "bg-destructive"
                            : isEditor
                            ? "bg-accent"
                            : "bg-primary"
                        }`}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {user?.name}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${roleBadge.className}`}
                      >
                        {roleBadge.label}
                      </span>
                    </div>
      
                    {/* Subscriber Actions */}
                    {isSubscriber && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigate("/favorites")}
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigate("/profile")}
                        >
                          <User className="w-4 h-4" />
                        </Button>
                      </>
                    )}
      
                    {/* Editor/Admin Actions */}
                    {(isEditor || isAdmin) && (
                      <>
                        {/* <Button
                          onClick={handleOpenCreateModal}
                          className="btn-gradient"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Listing
                        </Button> */}
                        <Button
                          variant="outline"
                          onClick={() => navigate(isAdmin ? "/admin" : "/editor")}
                          className="flex items-center gap-2"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate("/")}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </Button>
      
                    <Button variant="outline" size="icon" onClick={handleLogout}>
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </header>
      <div className="max-w-2xl mx-auto py-2">
        <div className="flex items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account settings</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      // onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      disabled
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      placeholder="Your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input value={user?.role || 'subscriber'} disabled className="bg-muted" />
                  </div>
                  {/* <Button type="submit" disabled={isProfileLoading} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {isProfileLoading ? 'Saving...' : 'Save Changes'}
                  </Button> */}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password securely</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">Current Password</Label>
                    <Input
                      id="oldPassword"
                      type="password"
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Enter new password"
                    />
                    <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button type="submit" disabled={isPasswordLoading} className="w-full">
                    <Lock className="h-4 w-4 mr-2" />
                    {isPasswordLoading ? 'Changing...' : 'Change Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SubscriberProfile;

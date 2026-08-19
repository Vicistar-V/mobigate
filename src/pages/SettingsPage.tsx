import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Key,
  Trash2,
  Save,
  Loader2,
  Search,
  ChevronRight,
  ArrowLeft,
  Camera,
  Check,
  Smartphone,
  Laptop,
  AlertTriangle,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Moon,
  Sun,
  Monitor,
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Download,
  Copy,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

// --- Category Definitions ---
interface SettingsCategory {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
  danger?: boolean;
}

const SETTINGS_CATEGORIES: SettingsCategory[] = [
  { id: 'profile', label: 'Profile', description: 'Public identity, bio & social presence', icon: User },
  { id: 'security', label: 'Security & Auth', description: 'Password, 2FA & active sessions', icon: Key },
  { id: 'privacy', label: 'Privacy & Visibility', description: 'Who sees your profile & activity', icon: Shield },
  { id: 'notifications', label: 'Notifications', description: 'Push, email & in-app preferences', icon: Bell },
  { id: 'appearance', label: 'Appearance', description: 'Themes, accent colors & accessibility', icon: Palette },
  { id: 'language', label: 'Language & Region', description: 'Locale, timezone & date formats', icon: Globe },
  { id: 'danger', label: 'Danger Zone', description: 'Deactivate or delete your account', icon: Trash2, danger: true },
];

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  // Navigation & Search State
  const [activeTab, setActiveTab] = useState('profile');
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Modals
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Form States
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    username: 'alexjohnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Product Designer & Full-stack Explorer. Passionate about sleek interfaces and open source.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alexjohnson',
    location: 'San Francisco, CA',
    website: 'https://alexjohnson.dev',
    dateOfBirth: '1995-06-12',
    gender: 'prefer_not_to_say',
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: true,
    twoFactorMethod: 'authenticator',
    loginAlerts: true,
    passwordLastChanged: '2 months ago',
    sessions: [
      { id: '1', device: 'Chrome on macOS (Sonoma)', location: 'San Francisco, US', ip: '192.0.2.1', lastActive: 'Now (Current session)', current: true, type: 'laptop' },
      { id: '2', device: 'Mobigate iOS App (iPhone 15 Pro)', location: 'San Francisco, US', ip: '198.51.100.4', lastActive: '45 minutes ago', current: false, type: 'mobile' },
      { id: '3', device: 'Firefox on Windows 11', location: 'Austin, TX', ip: '203.0.113.19', lastActive: '3 days ago', current: false, type: 'laptop' },
    ],
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLocation: true,
    showOnlineStatus: true,
    allowFriendRequests: 'everyone',
    allowMessages: 'friends',
    personalizedAds: false,
    analyticsTracking: true,
  });

  const [notifications, setNotifications] = useState({
    pushMentions: true,
    pushDirectMessages: true,
    pushFollows: true,
    pushComments: true,
    emailDigest: false,
    emailSecurity: true,
    emailMarketing: false,
    inAppSound: true,
  });

  const [appearance, setAppearance] = useState({
    theme: 'system',
    accentColor: 'indigo',
    fontSize: 'medium',
    reducedMotion: false,
    compactMode: false,
    highContrast: false,
  });

  const [language, setLanguage] = useState({
    language: 'en',
    region: 'US',
    timeFormat: '12h',
    dateFormat: 'MM/DD/YYYY',
  });

  const markDirty = () => setHasChanges(true);

  // Filter Categories by search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return SETTINGS_CATEGORIES;
    const q = searchQuery.toLowerCase();
    return SETTINGS_CATEGORIES.filter(
      (c) => c.label.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSaveAll = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    setHasChanges(false);
    toast.success('All settings saved successfully');
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result as string }));
        markDirty();
        toast.success('Avatar updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRevokeSession = (sessionId: string) => {
    setSecurity((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((s) => s.id !== sessionId),
    }));
    toast.success('Session revoked successfully');
  };

  // --- Sub-View Renderers ---

  const renderProfile = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Public Profile</h2>
        <p className="text-sm text-muted-foreground">Manage how your profile appears across Mobigate.</p>
      </div>

      {/* Avatar Header */}
      <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-muted/40 border">
        <div className="relative group">
          <Avatar className="h-20 w-20 ring-4 ring-background shadow-md">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback className="text-lg font-semibold">{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
            <Camera className="h-5 w-5" />
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="sr-only" />
          </label>
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="font-semibold text-lg">{profile.name}</h3>
            <Badge variant="secondary" className="text-xs">Verified</Badge>
          </div>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>
        </div>
        <div className="flex items-center gap-2">
          <label>
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="sr-only" />
            <Button variant="outline" size="sm" className="cursor-pointer" asChild>
              <span>Change</span>
            </Button>
          </label>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => {
              setProfile((p) => ({ ...p, avatar: '' }));
              markDirty();
            }}
          >
            Remove
          </Button>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => {
              setProfile({ ...profile, name: e.target.value });
              markDirty();
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
            <Input
              id="username"
              className="pl-8"
              value={profile.username}
              onChange={(e) => {
                setProfile({ ...profile, username: e.target.value });
                markDirty();
              }}
            />
          </div>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="bio">Bio</Label>
            <span className="text-xs text-muted-foreground">{profile.bio.length}/160</span>
          </div>
          <Textarea
            id="bio"
            rows={3}
            maxLength={160}
            value={profile.bio}
            onChange={(e) => {
              setProfile({ ...profile, bio: e.target.value });
              markDirty();
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            onChange={(e) => {
              setProfile({ ...profile, email: e.target.value });
              markDirty();
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={profile.phone}
            onChange={(e) => {
              setProfile({ ...profile, phone: e.target.value });
              markDirty();
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={profile.location}
            onChange={(e) => {
              setProfile({ ...profile, location: e.target.value });
              markDirty();
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Personal Website</Label>
          <Input
            id="website"
            type="url"
            value={profile.website}
            onChange={(e) => {
              setProfile({ ...profile, website: e.target.value });
              markDirty();
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Security & Authentication</h2>
        <p className="text-sm text-muted-foreground">Manage your credentials, 2FA, and authorized devices.</p>
      </div>

      {/* Password section */}
      <div className="p-4 sm:p-5 rounded-2xl border bg-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-semibold text-base">Account Password</h4>
            <p className="text-sm text-muted-foreground">Password last updated {security.passwordLastChanged}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setPasswordModalOpen(true)}>
            Change Password
          </Button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="p-4 sm:p-5 rounded-2xl border bg-card space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-base">Two-Factor Authentication (2FA)</h4>
              {security.twoFactorEnabled ? (
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Active</Badge>
              ) : (
                <Badge variant="outline">Disabled</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Secure your account using an authenticator app (Google Authenticator, 1Password, etc.)
            </p>
          </div>
          <Switch
            checked={security.twoFactorEnabled}
            onCheckedChange={(checked) => {
              setSecurity({ ...security, twoFactorEnabled: checked });
              markDirty();
              if (checked) setTwoFactorModalOpen(true);
            }}
          />
        </div>

        {security.twoFactorEnabled && (
          <div className="pt-3 border-t flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">Current method: <strong>Authenticator App (TOTP)</strong></span>
            <Button variant="ghost" size="sm" className="text-primary" onClick={() => setTwoFactorModalOpen(true)}>
              View Recovery Codes
            </Button>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-base">Active Logins & Devices</h4>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-destructive hover:bg-destructive/10"
            onClick={() => {
              setSecurity((prev) => ({ ...prev, sessions: prev.sessions.filter((s) => s.current) }));
              toast.success('Logged out of all other devices');
            }}
          >
            Log Out Other Sessions
          </Button>
        </div>

        <div className="space-y-2.5">
          {security.sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border bg-card/60 gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  {session.type === 'mobile' ? <Smartphone className="h-5 w-5 text-muted-foreground" /> : <Laptop className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{session.device}</p>
                    {session.current && <Badge variant="secondary" className="text-[10px] py-0 px-1.5">You</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{session.location} • {session.lastActive}</p>
                </div>
              </div>
              {!session.current && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-destructive flex-shrink-0"
                  onClick={() => handleRevokeSession(session.id)}
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Privacy & Social Reach</h2>
        <p className="text-sm text-muted-foreground">Decide who can discover you and how your data is treated.</p>
      </div>

      <div className="rounded-2xl border divide-y bg-card overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="font-medium text-sm">Account Visibility</p>
            <p className="text-xs text-muted-foreground">Control who can visit your profile feed</p>
          </div>
          <Select
            value={privacy.profileVisibility}
            onValueChange={(val) => {
              setPrivacy({ ...privacy, profileVisibility: val });
              markDirty();
            }}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public (Everyone)</SelectItem>
              <SelectItem value="friends">Followers Only</SelectItem>
              <SelectItem value="private">Private (Only Me)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-sm">Show Online Activity</p>
            <p className="text-xs text-muted-foreground">Allow friends to see when you are currently active</p>
          </div>
          <Switch
            checked={privacy.showOnlineStatus}
            onCheckedChange={(checked) => {
              setPrivacy({ ...privacy, showOnlineStatus: checked });
              markDirty();
            }}
          />
        </div>

        <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-sm">Display Location on Profile</p>
            <p className="text-xs text-muted-foreground">Show your city on your public badge</p>
          </div>
          <Switch
            checked={privacy.showLocation}
            onCheckedChange={(checked) => {
              setPrivacy({ ...privacy, showLocation: checked });
              markDirty();
            }}
          />
        </div>

        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="font-medium text-sm">Direct Messages</p>
            <p className="text-xs text-muted-foreground">Control who can send you direct messages</p>
          </div>
          <Select
            value={privacy.allowMessages}
            onValueChange={(val) => {
              setPrivacy({ ...privacy, allowMessages: val });
              markDirty();
            }}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="everyone">Everyone</SelectItem>
              <SelectItem value="friends">Followers only</SelectItem>
              <SelectItem value="none">No one</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-sm">Personalized Advertisements</p>
            <p className="text-xs text-muted-foreground">Allow tailored ads based on content interaction</p>
          </div>
          <Switch
            checked={privacy.personalizedAds}
            onCheckedChange={(checked) => {
              setPrivacy({ ...privacy, personalizedAds: checked });
              markDirty();
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Notification Channels</h2>
        <p className="text-sm text-muted-foreground">Choose what alerts reach your devices and email inbox.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">Push Notifications</h3>
        <div className="rounded-2xl border divide-y bg-card overflow-hidden">
          <div className="p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-sm">Mentions & Tags</p>
              <p className="text-xs text-muted-foreground">Notify when someone mentions @{profile.username}</p>
            </div>
            <Switch
              checked={notifications.pushMentions}
              onCheckedChange={(c) => {
                setNotifications({ ...notifications, pushMentions: c });
                markDirty();
              }}
            />
          </div>
          <div className="p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-sm">Direct Messages</p>
              <p className="text-xs text-muted-foreground">Instant notifications for inbox messages</p>
            </div>
            <Switch
              checked={notifications.pushDirectMessages}
              onCheckedChange={(c) => {
                setNotifications({ ...notifications, pushDirectMessages: c });
                markDirty();
              }}
            />
          </div>
          <div className="p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-sm">New Followers</p>
              <p className="text-xs text-muted-foreground">When someone starts following you</p>
            </div>
            <Switch
              checked={notifications.pushFollows}
              onCheckedChange={(c) => {
                setNotifications({ ...notifications, pushFollows: c });
                markDirty();
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">Email Updates</h3>
        <div className="rounded-2xl border divide-y bg-card overflow-hidden">
          <div className="p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-sm">Security & Account Alerts</p>
              <p className="text-xs text-muted-foreground">Critical warnings about unknown logins & pass changes</p>
            </div>
            <Switch
              checked={notifications.emailSecurity}
              disabled
            />
          </div>
          <div className="p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-sm">Weekly Activity Digest</p>
              <p className="text-xs text-muted-foreground">Summary of your top posts and interactions</p>
            </div>
            <Switch
              checked={notifications.emailDigest}
              onCheckedChange={(c) => {
                setNotifications({ ...notifications, emailDigest: c });
                markDirty();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Appearance & Theme</h2>
        <p className="text-sm text-muted-foreground">Customize styling, color accents, and motion accessibility.</p>
      </div>

      {/* Themes Grid */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Interface Theme</Label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light', icon: Sun, bg: 'bg-zinc-100 text-zinc-900 border-zinc-300' },
            { id: 'dark', label: 'Dark', icon: Moon, bg: 'bg-zinc-900 text-zinc-100 border-zinc-800' },
            { id: 'system', label: 'System', icon: Monitor, bg: 'bg-gradient-to-br from-zinc-100 to-zinc-900 text-foreground border-zinc-400' },
          ].map((theme) => {
            const Icon = theme.icon;
            const isSelected = appearance.theme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  setAppearance({ ...appearance, theme: theme.id });
                  markDirty();
                }}
                className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 text-center ${
                  isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-muted-foreground/40'
                }`}
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center border shadow-xs ${theme.bg}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold">{theme.label}</span>
                {isSelected && (
                  <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Check className="h-2.5 w-2.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent Colors */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Accent Color</Label>
        <div className="flex flex-wrap gap-3">
          {[
            { id: 'indigo', color: 'bg-indigo-600' },
            { id: 'emerald', color: 'bg-emerald-600' },
            { id: 'rose', color: 'bg-rose-600' },
            { id: 'amber', color: 'bg-amber-600' },
            { id: 'cyan', color: 'bg-cyan-600' },
          ].map((accent) => (
            <button
              key={accent.id}
              type="button"
              onClick={() => {
                setAppearance({ ...appearance, accentColor: accent.id });
                markDirty();
              }}
              className={`h-9 w-9 rounded-full ${accent.color} flex items-center justify-center text-white transition-transform ${
                appearance.accentColor === accent.id ? 'ring-4 ring-primary/20 scale-110' : 'hover:scale-105'
              }`}
            >
              {appearance.accentColor === accent.id && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Accessibility Switches */}
      <div className="rounded-2xl border divide-y bg-card overflow-hidden">
        <div className="p-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-sm">Reduced Motion</p>
            <p className="text-xs text-muted-foreground">Minimizes smooth sliding and zoom animations</p>
          </div>
          <Switch
            checked={appearance.reducedMotion}
            onCheckedChange={(c) => {
              setAppearance({ ...appearance, reducedMotion: c });
              markDirty();
            }}
          />
        </div>
        <div className="p-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-sm">High Contrast</p>
            <p className="text-xs text-muted-foreground">Increases border & text contrast for easier reading</p>
          </div>
          <Switch
            checked={appearance.highContrast}
            onCheckedChange={(c) => {
              setAppearance({ ...appearance, highContrast: c });
              markDirty();
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderLanguage = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Language & Regional Preferences</h2>
        <p className="text-sm text-muted-foreground">Configure timezones, calendar conventions, and displayed text.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Interface Language</Label>
          <Select
            value={language.language}
            onValueChange={(val) => {
              setLanguage({ ...language, language: val });
              markDirty();
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English (US)</SelectItem>
              <SelectItem value="es">Español (Spanish)</SelectItem>
              <SelectItem value="fr">Français (French)</SelectItem>
              <SelectItem value="de">Deutsch (German)</SelectItem>
              <SelectItem value="ja">日本語 (Japanese)</SelectItem>
              <SelectItem value="zh">简体中文 (Chinese)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Region</Label>
          <Select
            value={language.region}
            onValueChange={(val) => {
              setLanguage({ ...language, region: val });
              markDirty();
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States (USD $)</SelectItem>
              <SelectItem value="GB">United Kingdom (GBP £)</SelectItem>
              <SelectItem value="EU">European Union (EUR €)</SelectItem>
              <SelectItem value="CA">Canada (CAD $)</SelectItem>
              <SelectItem value="JP">Japan (JPY ¥)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Time Format</Label>
          <Select
            value={language.timeFormat}
            onValueChange={(val) => {
              setLanguage({ ...language, timeFormat: val });
              markDirty();
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12h">12-hour (e.g. 3:45 PM)</SelectItem>
              <SelectItem value="24h">24-hour (e.g. 15:45)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date Format</Label>
          <Select
            value={language.dateFormat}
            onValueChange={(val) => {
              setLanguage({ ...language, dateFormat: val });
              markDirty();
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderDanger = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-destructive">Danger Zone</h2>
        <p className="text-sm text-muted-foreground">Irreversible and destructive actions for your account.</p>
      </div>

      <div className="space-y-4">
        {/* Export Data */}
        <div className="p-4 sm:p-5 rounded-2xl border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">Download Archive</h4>
            <p className="text-xs text-muted-foreground">Get a copy of your posts, media, messages, and settings.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('Your export request is queued. An email will be sent shortly.')}
            className="flex items-center gap-2 self-start sm:self-auto"
          >
            <Download className="h-4 w-4" /> Request Archive
          </Button>
        </div>

        {/* Deactivate */}
        <div className="p-4 sm:p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-semibold text-sm text-amber-700 dark:text-amber-400">Deactivate Account</h4>
            <p className="text-xs text-muted-foreground">Temporarily hide your profile and posts. Reactivate anytime.</p>
          </div>
          <Button variant="outline" size="sm" className="border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 self-start sm:self-auto">
            Deactivate
          </Button>
        </div>

        {/* Delete */}
        <div className="p-4 sm:p-5 rounded-2xl border border-destructive/40 bg-destructive/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-semibold text-sm text-destructive">Delete Account Permanently</h4>
            <p className="text-xs text-muted-foreground">Erase your entire history, followers, and stored data forever.</p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setDeleteConfirmText('');
              setDeleteModalOpen(true);
            }}
            className="self-start sm:self-auto"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'profile': return renderProfile();
      case 'security': return renderSecurity();
      case 'privacy': return renderPrivacy();
      case 'notifications': return renderNotifications();
      case 'appearance': return renderAppearance();
      case 'language': return renderLanguage();
      case 'danger': return renderDanger();
      default: return renderProfile();
    }
  };

  const currentCategory = SETTINGS_CATEGORIES.find((c) => c.id === activeTab);

  return (
    <div className="min-h-screen bg-muted/20 pb-28 md:pb-16">
      {/* Top Mobile Sticky Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {mobileDetailOpen ? (
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden -ml-2 h-9 px-2 text-muted-foreground"
                onClick={() => setMobileDetailOpen(false)}
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                <span>Back</span>
              </Button>
            ) : null}
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight">
                {mobileDetailOpen && currentCategory ? currentCategory.label : 'Settings'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-xs text-muted-foreground">
              Exit
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR (Category List) */}
          <aside
            className={`md:col-span-4 lg:col-span-4 space-y-3 ${
              mobileDetailOpen ? 'hidden md:block' : 'block'
            }`}
          >
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-card rounded-xl border-border/80 text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Nav Items */}
            <nav className="rounded-2xl border bg-card/70 backdrop-blur-sm p-1.5 space-y-1 shadow-xs">
              {filteredCategories.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">No matching settings found</p>
              ) : (
                filteredCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeTab === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(cat.id);
                        setMobileDetailOpen(true);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-xs font-medium'
                          : cat.danger
                          ? 'text-destructive hover:bg-destructive/10'
                          : 'text-foreground hover:bg-muted/70'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : cat.danger
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-medium leading-none">{cat.label}</p>
                          <p
                            className={`text-[11px] truncate mt-1 ${
                              isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                            }`}
                          >
                            {cat.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 flex-shrink-0 ml-2 ${
                          isActive ? 'text-primary-foreground/70' : 'text-muted-foreground/40'
                        }`}
                      />
                    </button>
                  );
                })
              )}
            </nav>

            {/* Quick Profile Summary Badge on Desktop */}
            <div className="hidden md:flex items-center gap-3 p-3.5 rounded-2xl border bg-card/50">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate">{profile.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{profile.email}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => navigate('/login')}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </aside>

          {/* RIGHT DETAIL VIEW */}
          <section
            className={`md:col-span-8 lg:col-span-8 ${
              !mobileDetailOpen ? 'hidden md:block' : 'block'
            }`}
          >
            <div className="bg-card rounded-2xl border p-5 sm:p-7 shadow-xs">
              {renderActiveSection()}
            </div>
          </section>
        </div>
      </main>

      {/* FLOATING ACTION SAVE DOCK (Shows when changes exist) */}
      {hasChanges && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-foreground text-background shadow-2xl rounded-2xl p-3 px-4 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <p className="text-xs font-medium">You have unsaved changes</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 text-background hover:bg-background/20"
              onClick={() => setHasChanges(false)}
            >
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleSaveAll}
              disabled={isSaving}
              className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4"
            >
              {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Save className="h-3.5 w-3.5 mr-1.5" />}
              Save
            </Button>
          </div>
        </div>
      )}

      {/* --- MODALS & DIALOGS --- */}

      {/* 1. Change Password Dialog */}
      <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Password</DialogTitle>
            <DialogDescription>
              Ensure your account is using a long, random password to stay secure.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="current-pw">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-pw"
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-pw">New Password</Label>
              <div className="relative">
                <Input
                  id="new-pw"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setPasswordModalOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                setPasswordModalOpen(false);
                toast.success('Password updated successfully');
              }}
            >
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Two Factor Recovery Codes Dialog */}
      <Dialog open={twoFactorModalOpen} onOpenChange={setTwoFactorModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-2">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <DialogTitle>2FA Backup Recovery Codes</DialogTitle>
            <DialogDescription>
              Keep these one-time codes in a safe place. You can use them if you lose access to your authenticator app.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 p-3 bg-muted/60 rounded-xl font-mono text-xs text-center">
            {['8F92-KB41', '90X2-MA94', '44LC-9912', '12AA-ZZ90', '77QP-4301', '00PO-6731'].map((code) => (
              <div key={code} className="p-2 bg-background rounded-lg border">{code}</div>
            ))}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => {
                navigator.clipboard.writeText('8F92-KB41\n90X2-MA94\n44LC-9912\n12AA-ZZ90\n77QP-4301\n00PO-6731');
                toast.success('Codes copied to clipboard');
              }}
            >
              <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Codes
            </Button>
            <Button size="sm" className="w-full sm:w-auto" onClick={() => setTwoFactorModalOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Delete Account Dialog */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md border-destructive/30">
          <DialogHeader>
            <div className="h-10 w-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-2">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-destructive">Delete Account</DialogTitle>
            <DialogDescription>
              This is a permanent action. All your profile information, posts, messages, and uploaded files will be permanently erased.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="confirm-del" className="text-xs font-semibold">
              Type <span className="text-destructive font-mono font-bold">DELETE</span> to confirm
            </Label>
            <Input
              id="confirm-del"
              placeholder="DELETE"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="border-destructive/40 focus-visible:ring-destructive"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={deleteConfirmText !== 'DELETE'}
              onClick={() => {
                setDeleteModalOpen(false);
                toast.error('Account scheduled for permanent deletion');
                navigate('/register');
              }}
            >
              Permanently Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
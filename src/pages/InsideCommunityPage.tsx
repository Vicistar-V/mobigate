import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Users,
  TrendingUp,
  Activity,
  Calendar,
  DollarSign,
  Award,
  Target,
  UserPlus,
  UserMinus,
  MessageSquare,
  Heart,
  Eye,
} from "lucide-react";
import { LineChart, Line, BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { 
  communityStats, 
  activityData, 
  ageDistribution, 
  locationDistribution,
  professionDistribution,
  engagementMetrics,
  growthData,
  recentActivities
} from "@/data/communityStatsData";

export const InsideCommunityPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("month");

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  // Calculate period-specific data
  const newMembersByPeriod = {
    week: 7,
    month: communityStats.newMembersThisMonth,
    year: Math.round(communityStats.newMembersThisMonth * 12)
  };

  const genderData = [
    { name: "Male", count: communityStats.maleMembers, percentage: ((communityStats.maleMembers / communityStats.totalMembers) * 100).toFixed(1) },
    { name: "Female", count: communityStats.femaleMembers, percentage: ((communityStats.femaleMembers / communityStats.totalMembers) * 100).toFixed(1) },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Inside Community</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Comprehensive analytics and insights about our community
          </p>
        </Card>

        {/* Period Selector */}
        <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{communityStats.totalMembers}</p>
                <p className="text-xs text-muted-foreground">Total Members</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <UserPlus className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">+{newMembersByPeriod[selectedPeriod]}</p>
                <p className="text-xs text-muted-foreground">New Members</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{communityStats.activeMembers}%</p>
                <p className="text-xs text-muted-foreground">Active Rate</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{communityStats.engagementRate}%</p>
                <p className="text-xs text-muted-foreground">Engagement</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Member Demographics */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Member Demographics
          </h2>

          {/* Age Groups */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Age Distribution</h3>
            {ageDistribution.map((group) => (
              <div key={group.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{group.category}</span>
                  <span className="font-medium">{group.count} ({group.percentage}%)</span>
                </div>
                <Progress value={group.percentage} className="h-2" />
              </div>
            ))}
          </div>

          {/* Gender Distribution */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Gender Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Location Distribution */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Top Locations</h3>
            <div className="grid grid-cols-2 gap-3">
              {locationDistribution.map((location) => (
                <div key={location.category} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <span className="text-sm font-medium">{location.category}</span>
                  <Badge variant="secondary">{location.count}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Profession Distribution */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Profession Distribution</h3>
            <div className="grid grid-cols-1 gap-2">
              {professionDistribution.map((prof) => (
                <div key={prof.category} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{prof.category}</span>
                    <span className="font-medium">{prof.count} ({prof.percentage}%)</span>
                  </div>
                  <Progress value={prof.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Growth Metrics */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Growth Trends
          </h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="members" stroke="#8b5cf6" strokeWidth={2} name="Total Members" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                +{growthData[growthData.length - 1].members - growthData[0].members}
              </p>
              <p className="text-xs text-muted-foreground">Annual Growth</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {communityStats.memberGrowthRate}%
              </p>
              <p className="text-xs text-muted-foreground">Growth Rate</p>
            </div>
          </div>
        </Card>

        {/* Activity Timeline */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Activity Timeline
          </h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBar data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="posts" fill="#8b5cf6" name="Posts" />
                <Bar dataKey="meetings" fill="#3b82f6" name="Meetings" />
                <Bar dataKey="events" fill="#10b981" name="Events" />
              </RechartsBar>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Engagement Analytics */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Engagement Analytics
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {engagementMetrics.slice(0, 3).map((metric) => (
              <div key={metric.metric} className="p-4 bg-muted rounded-lg text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{metric.value}%</p>
                <p className="text-xs text-muted-foreground">{metric.metric}</p>
                <Badge variant={metric.trend === "up" ? "default" : metric.trend === "down" ? "destructive" : "secondary"} className="mt-2 text-xs">
                  {metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "→"} {Math.abs(metric.change)}%
                </Badge>
              </div>
            ))}
          </div>

          {/* Recent Activities */}
          <div className="space-y-3 pt-4">
            <h3 className="text-sm font-semibold">Recent Activities</h3>
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.participants} participants
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{activity.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 text-primary" />
            <p className="text-3xl font-bold">{communityStats.memberGrowthRate}%</p>
            <p className="text-sm text-muted-foreground">Growth Rate</p>
          </Card>

          <Card className="p-6 text-center">
            <Award className="h-12 w-12 mx-auto mb-3 text-yellow-600" />
            <p className="text-3xl font-bold">{communityStats.engagementRate}%</p>
            <p className="text-sm text-muted-foreground">Engagement Rate</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

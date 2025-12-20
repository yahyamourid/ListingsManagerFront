import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { useListings } from '@/hooks/useListings';

const EditorDashboard = () => {
  const { data: listings = [] } = useListings();

  const stats = [
    {
      title: 'Total Listings',
      value: listings.length,
      icon: Building2,
      change: '+12%',
    },
    {
      title: 'Active Listings',
      value: listings.filter(l => l.status === 'active').length,
      icon: TrendingUp,
      change: '+8%',
    },
    {
      title: 'Average Price',
      value: listings.length > 0 
        ? `$${Math.round(listings.reduce((sum, l) => sum + (l.current_price || 0), 0) / listings.length).toLocaleString()}`
        : '$0',
      icon: DollarSign,
      change: '+5%',
    },
    {
      title: 'Pending Review',
      value: listings.filter(l => l.status === 'pending').length,
      icon: Clock,
      change: '-2%',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome, Editor</h1>
        <p className="text-muted-foreground">Here's an overview of your listings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Updated listing price', time: '2 hours ago', listing: '123 Main St' },
              { action: 'Changed status to sold', time: '5 hours ago', listing: '456 Oak Ave' },
              { action: 'Updated sale date', time: '1 day ago', listing: '789 Pine Rd' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-foreground">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.listing}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditorDashboard;

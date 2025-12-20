import React from 'react';
import { Building2, DollarSign, BedDouble, CheckCircle } from 'lucide-react';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

export function StatsCards({ stats }) {
  const cards = [
    {
      label: 'Total Listings',
      value: stats.total,
      icon: Building2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Average Price',
      value: formatCurrency(stats.avgPrice),
      icon: DollarSign,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Total Bedrooms',
      value: stats.totalBedrooms,
      icon: BedDouble,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Sold Properties',
      value: stats.sold,
      icon: CheckCircle,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={card.label}
          className="stat-card animate-slide-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {card.label}
              </p>
              <p className="text-2xl font-bold font-display text-foreground">
                {card.value}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${card.bgColor}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

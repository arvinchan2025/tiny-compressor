'use client';

import React from 'react';

interface StatItem {
  label: string;
  value: string;
  color?: 'gray' | 'green' | 'blue' | 'red' | 'purple' | 'orange';
  highlight?: boolean;
}

interface ResultStatsProps {
  stats: StatItem[];
}

const colorClasses = {
  gray: 'text-gray-900 dark:text-gray-100',
  green: 'text-green-600 dark:text-green-400',
  blue: 'text-blue-600 dark:text-blue-400',
  red: 'text-red-600 dark:text-red-400',
  purple: 'text-purple-600 dark:text-purple-400',
  orange: 'text-orange-600 dark:text-orange-400'
};

export default function ResultStats({ stats }: ResultStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="card-glass p-4 text-center animate-slide-up transition-transform duration-300 hover:-translate-y-0.5"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={`text-3xl font-bold mb-1 ${colorClasses[stat.color || 'gray']}`}>
            {stat.value}
          </div>
          <div className="text-sm text-text-secondary">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}




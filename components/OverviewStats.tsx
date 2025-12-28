import { OverallInsights } from '@/types/campaign';

interface OverviewStatsProps {
  insights: OverallInsights;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export default function OverviewStats({ insights }: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="text-sm font-medium text-gray-500">Total Campaigns</div>
        <div className="mt-2 text-3xl font-semibold text-gray-900">
          {insights.total_campaigns}
        </div>
        <div className="mt-2 flex gap-2 text-sm">
          <span className="text-green-600 font-medium">{insights.active_campaigns} active</span>
          <span className="text-yellow-600">{insights.paused_campaigns} paused</span>
          <span className="text-gray-500">{insights.completed_campaigns} completed</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="text-sm font-medium text-gray-500">Total Spend</div>
        <div className="mt-2 text-3xl font-semibold text-gray-900">
          {formatCurrency(insights.total_spend)}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Avg CPC: {formatCurrency(insights.avg_cpc)}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="text-sm font-medium text-gray-500">Total Impressions</div>
        <div className="mt-2 text-3xl font-semibold text-gray-900">
          {formatNumber(insights.total_impressions)}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Clicks: {formatNumber(insights.total_clicks)}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="text-sm font-medium text-gray-500">Performance</div>
        <div className="mt-2 text-3xl font-semibold text-gray-900">
          {insights.avg_ctr.toFixed(2)}%
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Avg CTR • Conv Rate: {insights.avg_conversion_rate.toFixed(2)}%
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow p-6 border border-blue-200 md:col-span-2">
        <div className="text-sm font-medium text-blue-900">Total Conversions</div>
        <div className="mt-2 text-4xl font-bold text-blue-600">
          {formatNumber(insights.total_conversions)}
        </div>
        <div className="mt-2 text-sm text-blue-700">
          Conversion Rate: {insights.avg_conversion_rate.toFixed(2)}%
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow p-6 border border-green-200 md:col-span-2">
        <div className="text-sm font-medium text-green-900">Click Performance</div>
        <div className="mt-2 text-4xl font-bold text-green-600">
          {formatNumber(insights.total_clicks)}
        </div>
        <div className="mt-2 text-sm text-green-700">
          CTR: {insights.avg_ctr.toFixed(2)}% • CPC: {formatCurrency(insights.avg_cpc)}
        </div>
      </div>
    </div>
  );
}

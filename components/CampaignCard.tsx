'use client';

import { useState, useEffect } from 'react';
import { Campaign, CampaignInsights } from '@/types/campaign';
import { fetchCampaignInsights } from '@/lib/api';

interface CampaignCardProps {
  campaign: Campaign;
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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getStatusColor(status: Campaign['status']): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'paused':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'completed':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const [insights, setInsights] = useState<CampaignInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function loadInsights() {
      try {
        const data = await fetchCampaignInsights(campaign.id);
        setInsights(data.insights);
      } catch (error) {
        console.error('Failed to load insights:', error);
      } finally {
        setLoading(false);
      }
    }
    loadInsights();
  }, [campaign.id]);

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
            <p className="text-sm text-gray-500">{campaign.brand_id}</p>
          </div>
          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(campaign.status)}`}>
            {campaign.status}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {campaign.platforms.map((platform) => (
            <span
              key={platform}
              className="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-50 text-blue-700 border border-blue-200"
            >
              {platform}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-gray-500">Budget</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(campaign.budget)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Daily Budget</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(campaign.daily_budget)}
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-sm text-gray-500 text-center py-4">Loading insights...</div>
        )}

        {!loading && insights && (
          <>
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs text-gray-500">Impressions</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatNumber(insights.impressions)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Clicks</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatNumber(insights.clicks)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Spend</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(insights.spend)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Conversions</div>
                  <div className="text-sm font-semibold text-green-600">
                    {formatNumber(insights.conversions)}
                  </div>
                </div>
              </div>

              {expanded && (
                <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500">CTR</div>
                    <div className="text-sm font-semibold text-blue-600">
                      {insights.ctr.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">CPC</div>
                    <div className="text-sm font-semibold text-purple-600">
                      {formatCurrency(insights.cpc)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Conv Rate</div>
                    <div className="text-sm font-semibold text-green-600">
                      {insights.conversion_rate.toFixed(2)}%
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-4 w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {expanded ? 'Show Less' : 'Show More Details'}
            </button>
          </>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Created: {formatDate(campaign.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
}

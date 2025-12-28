'use client';

import { useState } from 'react';
import { Campaign } from '@/types/campaign';
import CampaignModal from './CampaignModal';

interface CampaignsGridProps {
  campaigns: Campaign[];
}

export default function CampaignsGrid({ campaigns }: CampaignsGridProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">All Campaigns</h2>
        <p className="text-sm text-gray-600 mt-1">Click on any campaign to view detailed insights</p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platforms
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Daily Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <CampaignListRow
                  key={campaign.id}
                  campaign={campaign}
                  onViewDetails={() => setSelectedCampaignId(campaign.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CampaignModal
        campaignId={selectedCampaignId || ''}
        isOpen={!!selectedCampaignId}
        onClose={() => setSelectedCampaignId(null)}
      />
    </>
  );
}

interface CampaignListRowProps {
  campaign: Campaign;
  onViewDetails: () => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
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

function CampaignListRow({ campaign, onViewDetails }: CampaignListRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
        <div className="text-sm text-gray-500">{campaign.brand_id}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(campaign.status)}`}>
          {campaign.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1">
          {campaign.platforms.map((platform) => (
            <span
              key={platform}
              className="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-50 text-blue-700 border border-blue-200"
            >
              {platform}
            </span>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatCurrency(campaign.budget)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatCurrency(campaign.daily_budget)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <button
          onClick={onViewDetails}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View Details
        </button>
      </td>
    </tr>
  );
}

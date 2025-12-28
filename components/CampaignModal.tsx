'use client';

import { useState, useEffect } from 'react';
import { Campaign, CampaignInsights } from '@/types/campaign';
import { fetchCampaignById, fetchCampaignInsights } from '@/lib/api';

interface CampaignModalProps {
  campaignId: string;
  isOpen: boolean;
  onClose: () => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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

export default function CampaignModal({ campaignId, isOpen, onClose }: CampaignModalProps) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [insights, setInsights] = useState<CampaignInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && campaignId) {
      console.log('Loading data for campaign:', campaignId);
      loadCampaignData();
    }
  }, [isOpen, campaignId]);

  async function loadCampaignData() {
    setLoading(true);
    setCampaign(null);
    setInsights(null);
    setError(null);

    try {
      console.log('Fetching campaign details and insights...');
      const results = await Promise.allSettled([
        fetchCampaignById(campaignId),
        fetchCampaignInsights(campaignId),
      ]);

      // Handle campaign data
      if (results[0].status === 'fulfilled') {
        setCampaign(results[0].value.campaign);
        console.log('Campaign data received:', results[0].value);
      } else {
        console.error('Failed to fetch campaign:', results[0].reason);
        setError('Unable to load campaign details. The API may be experiencing issues.');
      }

      // Handle insights data
      if (results[1].status === 'fulfilled') {
        setInsights(results[1].value.insights);
        console.log('Insights data received:', results[1].value);
      } else {
        console.error('Failed to fetch insights:', results[1].reason);
        if (!error) {
          setError('Unable to load campaign insights. The API may be experiencing issues.');
        }
      }

      // If both failed
      if (results[0].status === 'rejected' && results[1].status === 'rejected') {
        setError('Unable to load campaign data. The API server may be temporarily unavailable. Please try again later.');
      }
    } catch (err) {
      console.error('Unexpected error loading campaign data:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full z-10 relative">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Campaign Details</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading campaign details...</p>
              </div>
            ) : error ? (
              <div className="py-12">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                  <div className="flex">
                    <div className="shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error Loading Campaign</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                        <p className="mt-2">
                          Common causes:
                          <ul className="list-disc list-inside mt-1">
                            <li>API server timeout (504 Gateway Timeout)</li>
                            <li>Request timeout (408 Request Timeout)</li>
                            <li>Server temporarily unavailable</li>
                          </ul>
                        </p>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={loadCampaignData}
                          className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : campaign && insights ? (
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">{campaign.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">ID: {campaign.id}</p>
                      <p className="text-sm text-gray-500">Brand: {campaign.brand_id}</p>
                    </div>
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {campaign.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="inline-flex px-3 py-1 text-sm font-medium rounded bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">Total Budget</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">
                      {formatCurrency(campaign.budget)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">Daily Budget</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">
                      {formatCurrency(campaign.daily_budget)}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h5 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h5>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="text-xs text-blue-600 font-medium">Impressions</div>
                      <div className="text-2xl font-bold text-blue-900 mt-1">
                        {formatNumber(insights.impressions)}
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="text-xs text-green-600 font-medium">Clicks</div>
                      <div className="text-2xl font-bold text-green-900 mt-1">
                        {formatNumber(insights.clicks)}
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="text-xs text-purple-600 font-medium">Conversions</div>
                      <div className="text-2xl font-bold text-purple-900 mt-1">
                        {formatNumber(insights.conversions)}
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <div className="text-xs text-orange-600 font-medium">Spend</div>
                      <div className="text-2xl font-bold text-orange-900 mt-1">
                        {formatCurrency(insights.spend)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-gray-500">Click-Through Rate</div>
                      <div className="text-xl font-bold text-gray-900 mt-1">
                        {insights.ctr.toFixed(2)}%
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-gray-500">Cost Per Click</div>
                      <div className="text-xl font-bold text-gray-900 mt-1">
                        {formatCurrency(insights.cpc)}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-gray-500">Conversion Rate</div>
                      <div className="text-xl font-bold text-gray-900 mt-1">
                        {insights.conversion_rate.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-gray-500">
                    Last updated: {formatDate(insights.timestamp)}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="text-sm text-gray-500">
                    Campaign created: {formatDate(campaign.created_at)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Failed to load campaign data
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

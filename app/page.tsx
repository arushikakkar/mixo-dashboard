import { fetchCampaigns, fetchOverallInsights } from '@/lib/api';
import OverviewStats from '@/components/OverviewStats';
import CampaignsGrid from '@/components/CampaignsGrid';
import { Campaign, OverallInsights } from '@/types/campaign';

// Fallback data for when API is unavailable
const fallbackInsights: OverallInsights = {
  timestamp: new Date().toISOString(),
  total_campaigns: 0,
  active_campaigns: 0,
  paused_campaigns: 0,
  completed_campaigns: 0,
  total_impressions: 0,
  total_clicks: 0,
  total_conversions: 0,
  total_spend: 0,
  avg_ctr: 0,
  avg_cpc: 0,
  avg_conversion_rate: 0,
};

export default async function Home() {
  let campaigns: Campaign[] = [];
  let insights: OverallInsights = fallbackInsights;
  let hasError = false;
  let errorMessage = '';

  try {
    const results = await Promise.allSettled([
      fetchCampaigns(),
      fetchOverallInsights(),
    ]);

    // Handle campaigns result
    if (results[0].status === 'fulfilled') {
      campaigns = results[0].value.campaigns;
    } else {
      console.error('Failed to fetch campaigns:', results[0].reason);
      errorMessage = 'Unable to load campaigns. ';
      hasError = true;
    }

    // Handle insights result
    if (results[1].status === 'fulfilled') {
      insights = results[1].value.insights;
    } else {
      console.error('Failed to fetch insights:', results[1].reason);
      errorMessage += 'Unable to load insights. ';
      hasError = true;
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    hasError = true;
    errorMessage = 'An unexpected error occurred.';
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Campaign Monitoring Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Mixo Ads Campaign Performance</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {hasError && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Warning:</strong> {errorMessage}
                  The API server may be experiencing issues. Please try refreshing the page or contact support if the problem persists.
                </p>
              </div>
            </div>
          </div>
        )}

        <OverviewStats insights={insights} />

        {campaigns.length > 0 ? (
          <CampaignsGrid campaigns={campaigns} />
        ) : (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns available</h3>
            <p className="mt-1 text-sm text-gray-500">
              {hasError ? 'Unable to load campaign data at this time.' : 'Get started by creating your first campaign.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

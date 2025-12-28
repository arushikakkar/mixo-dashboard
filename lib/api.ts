import {
  CampaignsResponse,
  CampaignDetailResponse,
  CampaignInsightsResponse,
  OverallInsightsResponse
} from '@/types/campaign';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mixo-fe-backend-task.vercel.app';

// Retry helper with exponential backoff
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 2
): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // If we get a server error or timeout, retry
      if ((response.status >= 500 || response.status === 408) && i < retries) {
        const delay = Math.min(1000 * Math.pow(2, i), 5000); // Exponential backoff, max 5s
        console.log(`Retry ${i + 1}/${retries} for ${url} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('Request timeout for:', url);
        if (i < retries) {
          const delay = Math.min(1000 * Math.pow(2, i), 5000);
          console.log(`Retry ${i + 1}/${retries} after timeout`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      if (i === retries) throw error;
    }
  }

  throw new Error('Max retries exceeded');
}

export async function fetchCampaigns(): Promise<CampaignsResponse> {
  try {
    const url = `${API_BASE_URL}/campaigns`;
    console.log('Fetching from:', url);

    const response = await fetchWithRetry(url, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch campaigns: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export async function fetchCampaignById(campaignId: string): Promise<CampaignDetailResponse> {
  try {
    const url = `${API_BASE_URL}/campaigns/${campaignId}`;
    console.log('Fetching campaign details from:', url);

    const response = await fetchWithRetry(url, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch campaign details: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export async function fetchOverallInsights(): Promise<OverallInsightsResponse> {
  try {
    const url = `${API_BASE_URL}/campaigns/insights`;
    console.log('Fetching overall insights from:', url);

    const response = await fetchWithRetry(url, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch overall insights: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export async function fetchCampaignInsights(campaignId: string): Promise<CampaignInsightsResponse> {
  try {
    const url = `${API_BASE_URL}/campaigns/${campaignId}/insights`;
    console.log('Fetching campaign insights from:', url);

    const response = await fetchWithRetry(url, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch campaign insights: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export async function fetchCampaignInsightsStream(campaignId: string): Promise<ReadableStream<Uint8Array> | null> {
  try {
    const url = `${API_BASE_URL}/campaigns/${campaignId}/insights/stream`;
    console.log('Fetching campaign insights stream from:', url);

    const response = await fetch(url, {
      headers: {
        'Accept': 'text/event-stream',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch campaign insights stream: ${response.status} ${response.statusText}`);
    }

    return response.body;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

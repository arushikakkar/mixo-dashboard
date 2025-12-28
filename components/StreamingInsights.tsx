'use client';

import { useState, useEffect } from 'react';
import { fetchCampaignInsightsStream } from '@/lib/api';

interface StreamingInsightsProps {
  campaignId: string;
}

export default function StreamingInsights({ campaignId }: StreamingInsightsProps) {
  const [streamData, setStreamData] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startStreaming = async () => {
    setIsStreaming(true);
    setError(null);
    setStreamData([]);

    try {
      const stream = await fetchCampaignInsightsStream(campaignId);

      if (!stream) {
        throw new Error('Failed to get stream');
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setIsStreaming(false);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        setStreamData(prev => [...prev, chunk]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stream insights');
      setIsStreaming(false);
    }
  };

  const stopStreaming = () => {
    setIsStreaming(false);
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Real-time Insights Stream</h3>
        <button
          onClick={isStreaming ? stopStreaming : startStreaming}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            isStreaming
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isStreaming ? 'Stop Stream' : 'Start Stream'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">Error: {error}</p>
          <p className="text-xs text-red-500 mt-1">
            Note: The streaming endpoint may require specific parameters or may not be available yet.
          </p>
        </div>
      )}

      {isStreaming && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center">
            <div className="animate-pulse h-2 w-2 bg-blue-600 rounded-full mr-2"></div>
            <p className="text-sm text-blue-600">Streaming data...</p>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
        {streamData.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            No stream data yet. Click "Start Stream" to begin.
          </p>
        ) : (
          <div className="space-y-2">
            {streamData.map((data, index) => (
              <div key={index} className="text-xs font-mono bg-white p-2 rounded border border-gray-200">
                {data}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

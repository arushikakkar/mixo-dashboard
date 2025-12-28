'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full border border-red-200">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          Something went wrong
        </h2>

        <p className="text-sm text-gray-600 text-center mb-6">
          {error.message || 'Failed to load campaign data'}
        </p>

        <button
          onClick={reset}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Try again
        </button>

        <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            If the problem persists, please check your network connection and try again later.
          </p>
        </div>
      </div>
    </div>
  );
}

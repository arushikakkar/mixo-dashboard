export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="h-8 bg-gray-200 rounded w-96 animate-pulse"></div>
          <div className="mt-2 h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="mt-2 h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>

          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex space-x-4">
                <div className="flex-1 h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1 h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1 h-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

import { Link } from "@/i18n/routing"
import { BASE_URL, REVALIDATE_TIME } from "@/redux/api/config"

async function getImprint() {
  try {
    const res = await fetch(`${BASE_URL}/legal-docs/imprint`, {
      // next: { revalidate: REVALIDATE_TIME },
      cache: 'no-store',
    });

    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function Imprint() {
  const response = await getImprint();
  const imprintData = response?.data;
  const isError = !response;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <span className="text-red-600 hover:text-red-700 flex items-center gap-1">← Back to Home</span>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Imprint</h1>
          <p className="text-gray-600">
            {imprintData?.lastUpdated
              ? `Last updated: ${new Date(imprintData.lastUpdated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
              : 'Last updated: November 2024'
            }
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-semibold">Failed to load Imprint</p>
            <p className="text-red-600 text-sm mt-2">Please try again later.</p>
          </div>
        )}

        {/* Imprint Content */}
        {!isError && imprintData && (
          <div className="prose max-w-none">
            <div
              className="space-y-8 text-gray-700"
              dangerouslySetInnerHTML={{ __html: imprintData?.content }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

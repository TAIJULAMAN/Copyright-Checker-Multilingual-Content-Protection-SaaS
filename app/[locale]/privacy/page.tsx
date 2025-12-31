"use client"

import Link from "next/link"
import { useGetPrivacyQuery } from "@/redux/api/privacyApi"

export default function PrivacyPolicy() {
  // Fetch privacy policy from API
  const { data, isLoading, isError } = useGetPrivacyQuery()

  const privacyData = data?.data

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">
            {privacyData?.lastUpdated
              ? `Last updated: ${new Date(privacyData.lastUpdated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
              : 'Last updated: November 2024'
            }
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-semibold">Failed to load Privacy Policy</p>
            <p className="text-red-600 text-sm mt-2">Please try again later.</p>
          </div>
        )}

        {/* Privacy Policy Content */}
        {!isLoading && !isError && privacyData && (
          <div className="prose max-w-none">
            <div
              className="space-y-8 text-gray-700"
              dangerouslySetInnerHTML={{ __html: privacyData?.content }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

"use client";

import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Shield } from "lucide-react";
import { useState } from "react";
import { useGetMyJobsQuery, Job } from "@/redux/api/copyrightApi";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { BASE_URL } from "@/redux/api/config";

export default function ResultsPage() {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadReport = async () => {
    if (!latestJob) return;

    try {
      setIsDownloading(true);
      const token = Cookies.get("accessToken");
      const response = await fetch(`${BASE_URL}/copyright/my-jobs/export/${latestJob.jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to download report');
      }
      
      // Get the filename from the Content-Disposition header or use a default one
      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1].replace(/"/g, '') 
        : `copyright-report-${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Create a blob from the response
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading report:', error);
      // You might want to show an error toast/message here
    } finally {
      setIsDownloading(false);
    }
  };
  const { data, isLoading } = useGetMyJobsQuery();
  const jobs = data?.data?.jobs || [];
  
  // Use the latest job for summary stats, or default to 0
  const latestJob = jobs[0];
  const safeReels = latestJob ? (latestJob.totalVideos - latestJob.copyrightMatches) : 0;
  const flaggedReels = latestJob ? latestJob.copyrightMatches : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="border-b bg-white mt-20">
        <div className="container mx-auto px-5 lg:px-0 py-4 flex flex-col lg:flex-row gap-5 lg:gap-0 items-start lg:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your Copyright Check Results
            </h1>
            <p className="text-gray-600 mt-1">
              Social Media King – Instagram Reels Copyright Checker
            </p>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Secure & Trusted</span>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-5 my-5">
        <div className="container mx-auto px-5 lg:px-0 flex items-start gap-3">
          <div className="text-yellow-600 mt-0.5">⏰</div>
          <p className="text-yellow-800 text-sm">
            All data is deleted 24 hours after report delivery.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-5 lg:px-0 py-8 space-y-8">
        {/* Summary Cards (Based on Latest Job) */}
        {latestJob && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Safe Reels Card */}
            <div className="bg-white border-2 border-green-100 rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-full p-3 flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </div>
                <div>
                  <div className="text-4xl font-bold text-gray-900">
                    {safeReels}
                  </div>
                  <p className="text-gray-600 font-medium">Safe Reels (Latest Scan)</p>
                  <p className="text-sm text-gray-500">
                    No copyright issues detected
                  </p>
                </div>
              </div>
            </div>

            {/* Flagged Reels Card */}
            <div className="bg-white border-2 border-red-100 rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-red-100 rounded-full p-3 flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                  </svg>
                </div>
                <div>
                  <div className="text-4xl font-bold text-gray-900">
                    {flaggedReels}
                  </div>
                  <p className="text-gray-600 font-medium">Flagged Reels (Latest Scan)</p>
                  <p className="text-sm text-gray-500">
                    Requires immediate attention
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Jobs Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
             Scan History
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Videos Scanned
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Matches Found
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.length === 0 ? (
                   <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No scan history found.
                    </td>
                  </tr>
                ) : (
                  jobs.map((job: Job) => (
                    <tr
                      key={job.jobId}
                      onClick={() => router.push(`/results/${job.jobId}`)}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">
                         {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        @{job.instagramUsername}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                            job.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {job.processedVideos} / {job.totalVideos}
                      </td>
                       <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <span className={`font-bold ${job.copyrightMatches > 0 ? 'text-red-600' : 'text-green-600'}`}>
                             {job.copyrightMatches}
                           </span>
                           {job.copyrightMatches > 0 && <Shield className="w-4 h-4 text-red-500" />}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleDownloadReport}
            disabled={isDownloading}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download Report (xlsx)
              </>
            )}
          </Button>


   


        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-5 sm:p-15 rounded-lg my-10 container mx-auto px-5 lg:px-0">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-800 mb-2">
              Disclaimer
            </h3>
            <p className="text-xs text-blue-700">
              This report is provided solely for informational and educational
              purposes. It should not be interpreted as legal advice or a
              substitute for consultation with a qualified attorney. Although we
              make every effort to ensure the accuracy and completeness of the
              information presented, we cannot guarantee that all copyrighted
              materials, potential infringements, or intellectual property
              issues have been fully identified or assessed. Copyright laws can
              be complex and may vary by jurisdiction, and interpretations can
              differ based on specific facts and circumstances. If you require
              guidance on copyright ownership, infringement risks, licensing, or
              any other legal considerations, we strongly recommend consulting
              with a licensed legal professional who can provide advice tailored
              to your particular situation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

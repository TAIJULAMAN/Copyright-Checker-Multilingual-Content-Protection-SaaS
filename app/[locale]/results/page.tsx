"use client";

import { Button } from "@/components/ui/button";
import { Download, Shield } from "lucide-react";
import { useState } from "react";
import { useGetMyJobsQuery, Job } from "@/redux/api/copyrightApi";
import { useRouter } from "@/i18n/routing";
import Cookies from "js-cookie";
import { BASE_URL } from "@/redux/api/config";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function ResultsPage() {
  const t = useTranslations('Results');
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const handleDownloadReport = async (jobId: string) => {
    try {
      setIsDownloading(true);
      const token = Cookies.get("accessToken");
      const response = await fetch(`${BASE_URL}/copyright/my-jobs/export/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to download report');
      }
      
      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1].replace(/"/g, '') 
        : `copyright-report-${new Date().toISOString().split('T')[0]}.xlsx`;
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading report:', error);
    } finally {
      setIsDownloading(false);
    }
  };
  const { data, isLoading } = useGetMyJobsQuery(undefined);
  const jobs = data?.data?.jobs || [];
  
  // Calculate total statistics across all jobs
  const totalSafeReels = jobs.reduce((acc: number, job: Job) => acc + (job.totalVideos - job.copyrightMatches), 0);
  const totalFlaggedReels = jobs.reduce((acc: number, job: Job) => acc + job.copyrightMatches, 0);

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
              {t('title')}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">{t('secure')}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-5 lg:px-0 py-8 space-y-8">
        {/* Info Banner */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-5">
            <div className="flex items-start gap-3">
            <div className="text-yellow-600 mt-0.5">⏰</div>
            <p className="text-yellow-800 text-sm">
                {t('dataDelete')}
            </p>
            </div>
        </div>

        {/* Summary Cards (Total Stats) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Safe Reels Card */}
            <div className="bg-white border border-green-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                    <div className="text-3xl font-bold text-green-600">{totalSafeReels}</div>
                    <div className="font-semibold text-gray-900">{t('safeReels')}</div>
                    <div className="text-sm text-gray-500">{t('safeDesc')}</div>
                </div>
            </div>

            {/* Flagged Reels Card */}
            <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
                 <div className="bg-red-100 p-3 rounded-full">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div>
                    <div className="text-3xl font-bold text-red-600">{totalFlaggedReels}</div>
                    <div className="font-semibold text-gray-900">{t('flaggedReels')}</div>
                    <div className="text-sm text-gray-500">{t('flaggedDesc')}</div>
                </div>
            </div>
        </div>

        {/* Recent Jobs Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
             {t('history')}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    {t('date')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    {t('username')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    {t('status')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    {t('videosScanned')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    {t('matchesFound')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-3">
                           <Shield className="w-12 h-12 text-gray-300" />
                           <p className="text-lg font-medium text-gray-900">{t('noHistory')}</p>
                           <p className="text-sm text-gray-500 max-w-sm">
                             {t('noHistoryDesc')}
                           </p>
                           <Link href="/scan" className="mt-2">
                             <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50">
                               {t('scanNow')}
                             </Button>
                           </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                  jobs.map((job: Job) => (
                    <tr
                      key={job.jobId}
                      onClick={() => router.push(`/results/${job.jobId}`)}
                      className={`border-b border-gray-100 cursor-pointer transition-colors ${
                        job.copyrightMatches > 0 ? "bg-red-50 hover:bg-red-100" : "hover:bg-gray-50 bg-green-50/30"
                      }`}
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                           <Button 
                             size="sm" 
                             variant="outline"
                             className={`${
                               job.copyrightMatches > 0 
                                 ? "text-purple-600 border-purple-600 hover:bg-purple-50" 
                                 : "text-green-600 border-green-600 hover:bg-green-50"
                             }`}
                             onClick={() => router.push(`/results/${job.jobId}`)}
                           >
                             {t('viewDetails')}
                           </Button>
                           <Button 
                             size="sm"
                             className={`${
                               job.copyrightMatches > 0 
                                 ? "bg-purple-600 hover:bg-purple-700 text-white" 
                                 : "bg-green-600 hover:bg-green-700 text-white"
                             }`}
                             onClick={() => handleDownloadReport(job.jobId)}
                             disabled={isDownloading}
                           >
                              <Download className="w-4 h-4" />
                           </Button>
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
              {t('disclaimerTitle')}
            </h3>
            <p className="text-xs text-blue-700">
              {t('disclaimerText')}
            </p>
          </div>
      </div>
      </div>
    </div>
  );
}

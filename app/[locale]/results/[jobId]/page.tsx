"use client";

import { useGetJobDetailsQuery } from "@/redux/api/copyrightApi";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { ArrowLeft, ExternalLink, Shield, AlertTriangle, CheckCircle, Music, Play, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import Cookies from "js-cookie";
import { BASE_URL } from "@/redux/api/config";
import { Download, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function JobDetailsPage() {
  const t = useTranslations('JobDetails');
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  const { data, isLoading, error } = useGetJobDetailsQuery(jobId);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);

  const handleDownloadReport = async () => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{t('error')}</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 w-4 h-4" /> {t('goBack')}
        </Button>
      </div>
    );
  }

  const { jobDetails } = { jobDetails: data.data };
  const { results, summary } = jobDetails;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
             <Button variant="ghost" className="mb-2 pl-0 hover:bg-transparent hover:text-purple-600" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 w-4 h-4" /> {t('backToHistory')}
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-600 mt-1">
              {t('analysisFor')} <span className="font-semibold text-purple-600">@{jobDetails.username}</span> • {new Date(jobDetails.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
             <Button 
               onClick={handleDownloadReport}
               disabled={isDownloading}
               className="bg-purple-600 hover:bg-purple-700 text-white"
             >
               {isDownloading ? (
                 <>
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                   {t('downloading')}
                 </>
               ) : (
                 <>
                   <Download className="mr-2 h-4 w-4" />
                   {t('downloadReport')}
                 </>
               )}
             </Button>
             <Badge variant={jobDetails.status === 'completed' ? 'default' : 'secondary'} className="text-sm px-3 py-1 capitalize">
              {jobDetails.status}
             </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-500 mb-1">{t('totalAnalyzed')}</div>
              <div className="text-2xl font-bold">{summary.totalAnalyzed}</div>
            </CardContent>
          </Card>
          <Card>
             <CardContent className="pt-6">
              <div className="text-sm text-gray-500 mb-1">{t('copyrightDetected')}</div>
              <div className="text-2xl font-bold text-red-600">{summary.copyrightedCount}</div>
            </CardContent>
          </Card>
          <Card>
             <CardContent className="pt-6">
              <div className="text-sm text-gray-500 mb-1">{t('uniqueSongs')}</div>
              <div className="text-2xl font-bold">{summary.uniqueSongs}</div>
            </CardContent>
          </Card>
           <Card>
             <CardContent className="pt-6">
              <div className="text-sm text-gray-500 mb-1">{t('riskLevel')}</div>
              <div className="text-2xl font-bold capitalize">
                {summary.riskBreakdown.high > 0 ? (
                  <span className="text-red-600 flex items-center gap-2">{t('high')} <AlertTriangle className="w-5 h-5" /></span>
                ) : (
                  <span className="text-green-600 flex items-center gap-2">{t('low')} <CheckCircle className="w-5 h-5" /></span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">{t('analyzedVideos')}</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">{t('thumbnail')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('details')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result: any) => (
                <TableRow 
                  key={result._id} 
                  className={`
                    ${result.copyright.copyrighted 
                      ? "bg-red-50/30 hover:bg-red-50 border-l-2 border-l-red-500" 
                      : "bg-white hover:bg-gray-50 border-l-2 border-l-green-500"
                    }
                  `}
                >
                  <TableCell>
                    <div className="w-16 h-16 relative rounded-md overflow-hidden bg-gray-100 border border-gray-200 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img 
                        src={result.thumbnail} 
                        alt="Thumbnail" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                      <div className="flex items-center gap-2">
                        <span 
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            result.copyright.copyrighted 
                                ? "bg-red-100 text-red-700" 
                                : "bg-green-100 text-green-700"
                            }`}
                        >
                            {result.copyright.copyrighted ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                            {result.copyright.copyrighted ? t('flagged') : t('safe')}
                        </span>
                      </div>
                  </TableCell>
                  <TableCell>
                    {result.copyright.copyrighted ? (
                        <div className="text-sm">
                            <p className="font-medium text-gray-900">{result.detection.title}</p>
                            <p className="text-gray-500">{result.detection.artist}</p>
                        </div>
                    ) : (
                        <span className="text-sm text-gray-500">{t('noCopyright')}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setSelectedResult(result)}
                    >
                        <Eye className="w-5 h-5 text-gray-500 hover:text-purple-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Custom Modal */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{t('modalTitle')}</h2>
                <p className="text-gray-500 text-sm mt-1">{t('modalDesc')}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedResult(null)}
                className="h-8 w-8 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Thumbnail */}
                <div className="w-full md:w-64 flex-shrink-0">
                  <div className="aspect-[9/16] relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={selectedResult.thumbnail} 
                      alt="Reel Thumbnail" 
                      className="w-full h-full object-cover"
                    />
                    <a 
                      href={selectedResult.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Play className="w-12 h-12 text-white fill-white" />
                    </a>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <span 
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                            selectedResult.copyright.copyrighted 
                              ? "bg-red-100 text-red-700" 
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {selectedResult.copyright.copyrighted ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          {selectedResult.copyright.copyrighted ? t('copyrightDetected') : t('safeContent')}
                        </span>
                    </div>
                    
                    <a href={selectedResult.url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2 text-lg">
                      {t('viewReel')} <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {selectedResult.copyright.copyrighted ? (
                    <div className="bg-red-50 rounded-xl p-6 border border-red-100 space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-red-100 rounded-full">
                            <Music className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-red-600 mb-1">{t('detectedDetails')}</p>
                            <p className="text-xl font-bold text-gray-900">{selectedResult.detection.title}</p>
                            <p className="text-lg text-gray-700">{selectedResult.detection.artist}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                          <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                            <span className="block text-sm text-gray-500 mb-1">{t('label')}</span>
                            <span className="block text-gray-900 font-semibold">{selectedResult.detection.label}</span>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                            <span className="block text-sm text-gray-500 mb-1">{t('confidence')}</span>
                            <span className="block text-gray-900 font-semibold text-lg">{selectedResult.detection.confidence}%</span>
                          </div>
                        </div>

                        {selectedResult.copyright.notes && (
                          <div className="bg-red-100/50 p-4 rounded-lg border border-red-100">
                             <p className="text-sm font-semibold text-red-900 mb-1">{t('notes')}</p>
                             <p className="text-sm text-red-800">{selectedResult.copyright.notes}</p>
                          </div>
                        )}
                    </div>
                  ) : (
                    <div className="bg-green-50 rounded-xl p-8 border border-green-100 flex flex-col items-center justify-center text-center space-y-3">
                       <div className="p-4 bg-green-100 rounded-full">
                         <CheckCircle className="w-8 h-8 text-green-600" />
                       </div>
                       <h3 className="text-lg font-bold text-green-900">{t('noIssues')}</h3>
                       <p className="text-green-800 max-w-md">{t('noIssuesDesc')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

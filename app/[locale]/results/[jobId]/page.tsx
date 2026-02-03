"use client";

import { useGetJobDetailsQuery, useExportJobReportMutation } from "@/redux/api/copyrightApi";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { ArrowLeft, ExternalLink, Shield, AlertTriangle, CheckCircle, Music, Play, Eye, X, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { Download, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function JobDetailsPage() {
  const t = useTranslations('JobDetails');
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetJobDetailsQuery({ jobId, page, limit: 10 });
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [exportJobReport, { isLoading: isDownloading }] = useExportJobReportMutation();
  const [selectedResult, setSelectedResult] = useState<any>(null);

  const handleDownloadReport = async () => {
    try {
      const { blob, filename } = await exportJobReport(jobId).unwrap();
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
    }
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [visitedResults, setVisitedResults] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem("visited_results");
    if (saved) {
      try {
        setVisitedResults(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error("Failed to parse visited results", e);
      }
    }
  }, []);

  const addToVisited = (id: string) => {
    setVisitedResults(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      localStorage.setItem("visited_results", JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const handleResultClick = (result: any) => {
    setSelectedResult(result);
    addToVisited(result._id);
  };

  const handleLinkClick = (e: React.MouseEvent, resultId: string) => {
    e.stopPropagation();
    addToVisited(resultId);
  };

  // Helper to get styling and icons based on risk level
  const getRiskStyles = (riskLevel: string, isVisited: boolean) => {
    const baseClasses = isVisited
      ? "bg-gray-100 border-gray-400"
      : "";

    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return {
          rowClass: isVisited
            ? "bg-gray-100 hover:bg-gray-200 border-l-4 border-l-gray-400"
            : "bg-red-100 hover:bg-red-200 border-l-4 border-l-red-600",
          cardClass: isVisited
            ? "border-gray-300 bg-gray-50 border-l-[6px] border-l-gray-400"
            : "border-red-200 bg-red-50 border-l-[6px] border-l-red-600",
          badgeClass: isVisited
            ? "bg-gray-200 text-gray-600"
            : "bg-red-100 text-red-700",
          icon: <AlertTriangle className="w-3 h-3" />,
          label: t('highRisk')
        };
      case 'medium':
        return {
          rowClass: isVisited
            ? "bg-gray-100 hover:bg-gray-200 border-l-4 border-l-gray-400"
            : "bg-yellow-50 hover:bg-yellow-100 border-l-4 border-l-yellow-500",
          cardClass: isVisited
            ? "border-gray-300 bg-gray-50 border-l-[6px] border-l-gray-400"
            : "border-yellow-200 bg-yellow-50 border-l-[6px] border-l-yellow-500",
          badgeClass: isVisited
            ? "bg-gray-200 text-gray-600"
            : "bg-yellow-100 text-yellow-700",
          icon: <AlertTriangle className="w-3 h-3" />,
          label: t('mediumRisk')
        };
      case 'low':
        return {
          rowClass: isVisited
            ? "bg-gray-100 hover:bg-gray-200 border-l-4 border-l-gray-400"
            : "bg-green-50 hover:bg-green-100 border-l-4 border-l-green-500",
          cardClass: isVisited
            ? "border-gray-300 bg-gray-50 border-l-[6px] border-l-gray-400"
            : "border-green-200 bg-green-50 border-l-[6px] border-l-green-500",
          badgeClass: isVisited
            ? "bg-gray-200 text-gray-600"
            : "bg-green-100 text-green-700",
          icon: <CheckCircle className="w-3 h-3" />,
          label: t('lowRisk')
        };
      default: // Unknown or No Audio
        return {
          rowClass: isVisited
            ? "bg-gray-100 hover:bg-gray-200 border-l-4 border-l-gray-400"
            : "bg-white hover:bg-gray-50 border-l-4 border-l-gray-200",
          cardClass: isVisited
            ? "border-gray-300 bg-gray-50 border-l-[6px] border-l-gray-400"
            : "border-gray-200 bg-white border-l-[6px] border-l-gray-200",
          badgeClass: isVisited
            ? "bg-gray-200 text-gray-600"
            : "bg-gray-100 text-gray-600",
          icon: <Shield className="w-3 h-3" />,
          label: t('noAudio')
        };
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ">
          <div>
            <Button variant="ghost" className="mb-2 pl-0 hover:bg-transparent hover:text-purple-600" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 w-4 h-4" /> {t('backToHistory')}
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-600 mt-1">
              {t('analysisFor')} <span className="font-semibold text-purple-600">@{jobDetails.username}</span> • {new Date(jobDetails.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3 hidden md:flex">
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
        <div className="grid grid-cols-4 gap-1 md:gap-4">
          <Card>
            <CardContent className="p-1.5 md:pt-6 flex flex-col items-center justify-center text-center">
              <div className="text-[10px] md:text-sm text-gray-500 mb-0.5 md:mb-1 leading-tight">{t('totalAnalyzed')}</div>
              <div className="text-sm md:text-2xl font-bold">{summary.totalAnalyzed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-1.5 md:pt-6 flex flex-col items-center justify-center text-center">
              <div className="text-[10px] md:text-sm text-gray-500 mb-0.5 md:mb-1 leading-tight ">{t('copyrightDetected')}</div>
              <div className="text-sm md:text-2xl font-bold text-red-600">{summary.copyrightedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-1.5 md:pt-6 flex flex-col items-center justify-center text-center">
              <div className="text-[10px] md:text-sm text-gray-500 mb-0.5 md:mb-1 leading-tight ">{t('uniqueSongs')}</div>
              <div className="text-sm md:text-2xl font-bold">{summary.uniqueSongs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-1.5 md:pt-6 relative flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 mb-0.5 md:mb-1 justify-center">
                <div className="text-[10px] md:text-sm text-gray-500 leading-tight">{t('riskLevel')}</div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Info className="w-3 h-3 md:w-4 md:h-4 text-gray-400 cursor-pointer hover:text-gray-600 hidden md:block" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-gray-900 border-b pb-2">{t('riskGuide')}</h4>

                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5 shrink-0 shadow-sm" />
                        <div>
                          <span className="font-medium block text-sm text-gray-900">{t('lowRisk')}</span>
                          <span className="text-xs text-gray-500 leading-tight block mt-0.5">{t('lowRiskDesc')}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mt-1.5 shrink-0 shadow-sm" />
                        <div>
                          <span className="font-medium block text-sm text-gray-900">{t('mediumRisk')}</span>
                          <span className="text-xs text-gray-500 leading-tight block mt-0.5">{t('mediumRiskDesc')}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-600 mt-1.5 shrink-0 shadow-sm" />
                        <div>
                          <span className="font-medium block text-sm text-gray-900">{t('highRisk')}</span>
                          <span className="text-xs text-gray-500 leading-tight block mt-0.5">{t('highRiskDesc')}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 rounded-full bg-white border border-gray-300 mt-1.5 shrink-0 shadow-sm" />
                        <div>
                          <span className="font-medium block text-sm text-gray-900">{t('noAudio')}</span>
                          <span className="text-xs text-gray-500 leading-tight block mt-0.5">{t('noAudioDesc')}</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-gray-400 mt-2 pt-3 border-t border-gray-100 italic">
                        {t('disclaimerTitle')}: Technical risk assessment - no legal advice.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="text-sm md:text-2xl font-bold capitalize">
                {summary.riskBreakdown.high > 0 ? (
                  <span className="text-red-600 flex items-center justify-center gap-1 md:gap-2">{t('high')} <AlertTriangle className="w-3 h-3 md:w-5 md:h-5" /></span>
                ) : summary.riskBreakdown.medium > 0 ? (
                  <span className="text-yellow-600 flex items-center justify-center gap-1 md:gap-2">{t('medium')} <AlertTriangle className="w-3 h-3 md:w-5 md:h-5" /></span>
                ) : summary.riskBreakdown.low > 0 ? (
                  <span className="text-green-600 flex items-center justify-center gap-1 md:gap-2">{t('low')} <CheckCircle className="w-3 h-3 md:w-5 md:h-5" /></span>
                ) : (
                  <span className="text-gray-500 flex items-center justify-center gap-1 md:gap-2">{t('noAudio')} <Shield className="w-3 h-3 md:w-5 md:h-5" /></span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Guide */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="risk-guide" className="border-b-0">
              <AccordionTrigger className="hover:no-underline py-0">
                <span className="text-lg font-semibold text-gray-900">{t('riskGuide')}</span>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-2 p-3 rounded-lg bg-green-50 border border-green-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm" />
                      <span className="font-semibold text-green-900">{t('lowRisk')}</span>
                    </div>
                    <span className="text-sm text-green-800 leading-relaxed">{t('lowRiskDesc')}</span>
                  </div>

                  <div className="flex flex-col gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm" />
                      <span className="font-semibold text-yellow-900">{t('mediumRisk')}</span>
                    </div>
                    <span className="text-sm text-yellow-800 leading-relaxed">{t('mediumRiskDesc')}</span>
                  </div>

                  <div className="flex flex-col gap-2 p-3 rounded-lg bg-red-50 border border-red-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-600 shadow-sm" />
                      <span className="font-semibold text-red-900">{t('highRisk')}</span>
                    </div>
                    <span className="text-sm text-red-800 leading-relaxed">{t('highRiskDesc')}</span>
                  </div>

                  <div className="flex flex-col gap-2 p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-white border border-gray-300 shadow-sm" />
                      <span className="font-semibold text-gray-900">{t('noAudio')}</span>
                    </div>
                    <span className="text-sm text-gray-600 leading-relaxed">{t('noAudioDesc')}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100 italic">
                  {t('disclaimerTitle')}: Technical risk assessment - no legal advice.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{t('analyzedVideos')}</h2>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">{t('thumbnail')}</TableHead>
                  <TableHead className="w-[120px]">{t('status')}</TableHead>
                  <TableHead className="w-[80px]">Link</TableHead>
                  <TableHead className="w-[80px]">{t('actions')}</TableHead>
                  <TableHead>{t('details')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result: any) => {
                  const isVisited = visitedResults.has(result._id);
                  const riskLevel = result.copyright?.riskLevel || (result.copyright?.copyrighted ? 'high' : 'low');
                  const styles = getRiskStyles(riskLevel, isVisited);

                  return (
                    <TableRow
                      key={result._id}
                      onClick={() => handleResultClick(result)}
                      className={`cursor-pointer transition-colors ${styles.rowClass}`}
                    >
                      {/* 1. Thumbnail */}
                      <TableCell>
                        <div className={`w-16 h-16 relative rounded-md overflow-hidden border group ${isVisited ? 'border-gray-300 opacity-75' : 'border-gray-200'}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={result.thumbnail}
                            alt="Thumbnail"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>

                      {/* 2. Status */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles.badgeClass}`}
                          >
                            {styles.icon}
                            {styles.label}
                          </span>
                        </div>
                      </TableCell>

                      {/* 3. Link */}
                      <TableCell>
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => handleLinkClick(e, result._id)}
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isVisited ? "text-gray-400 hover:text-gray-600 hover:bg-gray-200" : "text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                            }`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </TableCell>

                      {/* 4. Actions (Eye) */}
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResultClick(result);
                          }}
                        >
                          <Eye className={`w-5 h-5 ${isVisited ? "text-gray-400" : "text-gray-500 hover:text-purple-600"}`} />
                        </Button>
                      </TableCell>

                      {/* 5. Details */}
                      <TableCell>
                        {result.copyright?.copyrighted ? (
                          <div className={`text-sm ${isVisited ? "opacity-60" : ""}`}>
                            <p className={`font-medium ${isVisited ? "text-gray-700" : "text-gray-900"}`}>{result.detection.title}</p>
                            <p className="text-gray-500">{result.detection.artist}</p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">{t('noCopyright')}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-2">
            {results.map((result: any) => {
              const isVisited = visitedResults.has(result._id);
              const riskLevel = result.copyright?.riskLevel || (result.copyright?.copyrighted ? 'high' : 'low');
              const styles = getRiskStyles(riskLevel, isVisited);

              return (
                <div
                  key={result._id}
                  onClick={() => handleResultClick(result)}
                  className={`rounded-lg shadow-sm border p-4 cursor-pointer transition-colors ${styles.cardClass}`}
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      <div className={`w-20 h-20 relative rounded-md overflow-hidden border ${isVisited ? 'border-gray-300 opacity-75' : 'border-gray-200'}`}>
                        <img
                          src={result.thumbnail}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles.badgeClass}`}
                        >
                          {styles.icon}
                          {styles.label}
                        </span>

                        {/* Link Icon */}
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => handleLinkClick(e, result._id)}
                          className={`p-1.5 rounded-full ${isVisited
                            ? "text-gray-400 hover:bg-gray-200"
                            : "text-purple-600 hover:bg-purple-50"
                            }`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>

                      {/* Title/Artist or Safe Text */}
                      {result.copyright?.copyrighted ? (
                        <div className={`${isVisited ? "opacity-60" : ""}`}>
                          <p className={`font-medium text-sm truncate ${isVisited ? "text-gray-700" : "text-gray-900"}`}>
                            {result.detection.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{result.detection.artist}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">{t('noCopyright')}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>


          {/* Mobile View */}
          <div className="flex items-center gap-3 md:hidden">
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

        {/* Pagination */
          jobDetails.pagination && jobDetails.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8 pb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!jobDetails.pagination.hasPrevPage}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {jobDetails.pagination.currentPage} of {jobDetails.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={!jobDetails.pagination.hasNextPage}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
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
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${selectedResult.copyright?.copyrighted
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                          }`}
                      >
                        {selectedResult.copyright?.copyrighted ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        {selectedResult.copyright?.copyrighted ? t('copyrightDetected') : t('safeContent')}
                      </span>
                    </div>

                    <a href={selectedResult.url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2 text-lg">
                      {t('viewReel')} <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {selectedResult.copyright?.copyrighted ? (
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

                      {selectedResult.copyright?.notes && (
                        <div className="bg-red-100/50 p-4 rounded-lg border border-red-100">
                          <p className="text-sm font-semibold text-red-900 mb-1">{t('notes')}</p>
                          <p className="text-sm text-red-800">{selectedResult.copyright?.notes}</p>
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

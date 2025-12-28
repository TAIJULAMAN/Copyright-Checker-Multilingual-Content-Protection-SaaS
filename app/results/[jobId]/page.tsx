"use client";

import { useGetJobDetailsQuery } from "@/redux/api/copyrightApi";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Shield, AlertTriangle, CheckCircle, Music, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  const { data, isLoading, error } = useGetJobDetailsQuery(jobId);

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
        <p className="text-red-500">Failed to load job details.</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 w-4 h-4" /> Go Back
        </Button>
      </div>
    );
  }

  const { jobDetails } = { jobDetails: data.data };
  const { results, summary } = jobDetails;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
             <Button variant="ghost" className="mb-2 pl-0 hover:bg-transparent hover:text-purple-600" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 w-4 h-4" /> Back to History
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Scan Results</h1>
            <p className="text-gray-600 mt-1">
              Analysis for <span className="font-semibold text-purple-600">@{jobDetails.username}</span> • {new Date(jobDetails.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
             <Badge variant={jobDetails.status === 'completed' ? 'default' : 'secondary'} className="text-sm px-3 py-1 capitalize">
              {jobDetails.status}
             </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-500 mb-1">Total Analyzed</div>
              <div className="text-2xl font-bold">{summary.totalAnalyzed}</div>
            </CardContent>
          </Card>
          <Card>
             <CardContent className="pt-6">
              <div className="text-sm text-gray-500 mb-1">Copyright Detected</div>
              <div className="text-2xl font-bold text-red-600">{summary.copyrightedCount}</div>
            </CardContent>
          </Card>
          <Card>
             <CardContent className="pt-6">
              <div className="text-sm text-gray-500 mb-1">Unique Songs</div>
              <div className="text-2xl font-bold">{summary.uniqueSongs}</div>
            </CardContent>
          </Card>
           <Card>
             <CardContent className="pt-6">
              <div className="text-sm text-gray-500 mb-1">Risk Level</div>
              <div className="text-2xl font-bold capitalize">
                {summary.riskBreakdown.high > 0 ? (
                  <span className="text-red-600 flex items-center gap-2">High <AlertTriangle className="w-5 h-5" /></span>
                ) : (
                  <span className="text-green-600 flex items-center gap-2">Low <CheckCircle className="w-5 h-5" /></span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
           <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Analyzed Videos</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {results.map((result) => (
              <div key={result._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Thumbnail */}
                  <div className="w-full md:w-48 flex-shrink-0">
                    <div className="aspect-[9/16] relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img 
                        src={result.thumbnail} 
                        alt="Reel Thumbnail" 
                        className="w-full h-full object-cover"
                      />
                      <a 
                        href={result.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                         <Play className="w-10 h-10 text-white fill-white" />
                      </a>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                       <div>
                         <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                           {result.copyright.copyrighted ? "Copyright Detected" : "Safe Content"}
                         </h3>
                         <div className="flex items-center gap-2 mt-1">
                            <span 
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                result.copyright.copyrighted 
                                  ? "bg-red-100 text-red-700" 
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {result.copyright.copyrighted ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                              {result.copyright.copyrighted ? "Flagged" : "Safe"}
                            </span>
                            <span className="text-gray-400 text-sm">•</span>
                            <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1">
                              View on Instagram <ExternalLink className="w-3 h-3" />
                            </a>
                         </div>
                       </div>
                    </div>

                    {result.copyright.copyrighted && (
                      <div className="bg-red-50 rounded-lg p-4 border border-red-100 space-y-3">
                         <div className="flex items-start gap-3">
                           <Music className="w-5 h-5 text-red-500 mt-0.5" />
                           <div>
                             <p className="font-medium text-gray-900">{result.detection.title}</p>
                             <p className="text-sm text-gray-600">{result.detection.artist}</p>
                           </div>
                         </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                           <div className="text-sm">
                             <span className="text-gray-500">Label:</span> <span className="text-gray-900 font-medium">{result.detection.label}</span>
                           </div>
                             <div className="text-sm">
                             <span className="text-gray-500">Confidence:</span> <span className="text-gray-900 font-medium">{result.detection.confidence}%</span>
                           </div>
                         </div>
                         {result.copyright.notes && (
                            <div className="text-sm text-red-700 bg-red-100/50 p-2 rounded mt-2">
                              {result.copyright.notes}
                            </div>
                         )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

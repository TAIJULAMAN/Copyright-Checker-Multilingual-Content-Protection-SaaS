import { baseApi } from './baseApi';

export interface CheckProfileRequest {
  profileUrl: string;
}

export interface CheckProfileResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: any;
}

export interface Job {
  jobId: string;
  instagramUsername: string;
  status: string;
  totalVideos: number;
  processedVideos: number;
  copyrightMatches: number;
  startedAt: string;
  completedAt: string;
  createdAt: string;
}

export interface MyJobsResponse {
  statusCode: number;
  data: {
    jobs: Job[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalJobs: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  message: string;
  success: boolean;
}

export interface JobResult {
  _id: string;
  copyright: {
    copyrighted: boolean;
    riskLevel: string;
    owner: string;
    notes: string;
  };
  detection: {
    title: string;
    artist: string;
    album: string;
    label: string;
    confidence: number;
  };
  url: string;
  shortcode: string;
  thumbnail: string;
  status: string;
}

export interface JobSummary {
  riskBreakdown: {
    high: number;
    medium: number;
    low: number;
    unknown: number;
  };
  totalAnalyzed: number;
  copyrightedCount: number;
  uniqueSongs: number;
  detectedSongs: Array<{
    title: string;
    artist: string;
    count: number;
    _id: string;
  }>;
}

export interface JobDetails {
  jobId: string;
  status: string;
  progress: number;
  profileUrl: string;
  username: string;
  totalVideos: number;
  processedVideos: number;
  results: JobResult[];
  summary: JobSummary;
  createdAt: string;
  updatedAt: string;
  completedAt: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    resultsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface JobDetailsResponse {
  statusCode: number;
  data: JobDetails;
  message: string;
  success: boolean;
}

export const copyrightApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkProfile: builder.mutation<CheckProfileResponse, CheckProfileRequest>({
      query: (data) => ({
        url: '/copyright/check-profile',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Jobs'],
    }),
    getMyJobs: builder.query<MyJobsResponse, void>({
      query: () => '/copyright/my-jobs',
      providesTags: ['Jobs'],
    }),
    getJobDetails: builder.query<JobDetailsResponse, { jobId: string; page: number; limit: number }>({
      query: ({ jobId, page, limit }) => `/copyright/my-jobs/${jobId}?page=${page}&limit=${limit}`,
    }),
    exportJobReport: builder.mutation<{ blob: Blob; filename: string }, string>({
      query: (jobId) => ({
        url: `/copyright/my-jobs/export/${jobId}`,
        method: 'GET',
        responseHandler: async (response: Response) => {
          const blob = await response.blob();
          const contentDisposition = response.headers.get('content-disposition');
          const filename = contentDisposition
            ? contentDisposition.split('filename=')[1].replace(/"/g, '')
            : `copyright-report-${new Date().toISOString().split('T')[0]}.xlsx`;
          return { blob, filename };
        },
        cache: 'no-store',
      }),
    }),
  }),
});

export const { useCheckProfileMutation, useGetMyJobsQuery, useGetJobDetailsQuery, useExportJobReportMutation } = copyrightApi;

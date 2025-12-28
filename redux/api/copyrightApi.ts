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
    }),
    getMyJobs: builder.query<MyJobsResponse, void>({
      query: () => '/copyright/my-jobs',
    }),
    getJobDetails: builder.query<JobDetailsResponse, string>({
      query: (jobId) => `/copyright/my-jobs/${jobId}`,
    }),
  }),
});

export const { useCheckProfileMutation, useGetMyJobsQuery, useGetJobDetailsQuery } = copyrightApi;

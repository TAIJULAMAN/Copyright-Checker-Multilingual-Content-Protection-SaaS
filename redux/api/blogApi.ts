import { baseApi } from "./baseApi";

export interface Blog {
    _id: string;
    title: string;
    excerpt?: string;
    content?: string;
    body?: string;
    image?: string;
    coverImage?: string;
    author?: string;
    category?: string;
    tags?: string[];
    publishedDate?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface GetAllBlogsParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
}

export interface GetAllBlogsResponse {
    statusCode: number;
    data: Blog[];
    message: string;
    success: boolean;
}

export interface GetBlogByIdResponse {
    statusCode: number;
    data: Blog;
    message: string;
    success: boolean;
}

export const blogApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllBlogs: builder.query<GetAllBlogsResponse, GetAllBlogsParams | undefined>({
            query: (params) => ({
                url: "/blogs",
                method: "GET",
                params,
            }),
            providesTags: ["blog"],
        }),
        getBlogById: builder.query<GetBlogByIdResponse, string>({
            query: (id) => ({
                url: `/blogs/${id}`,
                method: "GET",
            }),
            providesTags: ["blog"],
        }),
    }),
});

export const {
    useGetAllBlogsQuery,
    useGetBlogByIdQuery,
} = blogApi;
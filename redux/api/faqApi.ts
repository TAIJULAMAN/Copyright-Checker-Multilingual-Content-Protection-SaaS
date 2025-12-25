import { baseApi } from "./baseApi";

export interface Faq {
    _id: string;
    question: string;
    answer: string;
    category?: string;
    order?: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface GetAllFaqParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
}

export interface GetAllFaqResponse {
    statusCode: number;
    data: Faq[];
    message: string;
    success: boolean;
}

const faqApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllFaq: builder.query<GetAllFaqResponse, GetAllFaqParams | undefined>({
            query: (params) => ({
                url: "faqs",
                method: "GET",
                params,
            }),
            providesTags: ["faq"],
        }),
    }),
});

export const {
    useGetAllFaqQuery,
} = faqApi;

export default faqApi;
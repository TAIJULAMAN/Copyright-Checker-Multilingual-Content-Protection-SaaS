import { baseApi } from "./baseApi";

export interface PrivacyPolicy {
    _id: string;
    title?: string;
    content: string;
    lastUpdated?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface GetPrivacyResponse {
    statusCode: number;
    data: PrivacyPolicy;
    message: string;
    success: boolean;
}

const privacyApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPrivacy: builder.query<GetPrivacyResponse, void>({
            query: () => ({
                url: "legal-docs/privacy-policy",
                method: "GET",
            }),
            providesTags: ["privacy"]
        }),
    }),
});

export const { useGetPrivacyQuery } = privacyApi;
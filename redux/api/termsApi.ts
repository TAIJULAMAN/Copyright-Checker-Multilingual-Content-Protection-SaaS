import { baseApi } from "./baseApi";

const termsAndConditionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTermsAndConditions: builder.query({
      query: () => ({
        url: "legal-docs/terms-conditions",
        method: "GET",
      }),
      providesTags: ["termsAndConditions"],
    }),

    getImprint: builder.query({
      query: () => ({
        url: "legal-docs/imprint",
        method: "GET",
      }),
      providesTags: ["imprint"],
    }),

  }),
});

export const {
  useGetTermsAndConditionsQuery,
  useGetImprintQuery,
} = termsAndConditionsApi;

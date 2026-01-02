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

  }),
});

export const {
  useGetTermsAndConditionsQuery,
} = termsAndConditionsApi;

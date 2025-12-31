import { baseApi } from "./baseApi";

const aboutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAbout: builder.query({
      query: () => ({
        url: "legal-docs/about-us",
        method: "GET",
      }),
      providesTags: ["about"],
    }),

  }),
});

export const { useGetAboutQuery } = aboutApi;

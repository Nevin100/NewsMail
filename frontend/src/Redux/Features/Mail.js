import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `https://newsmail-2s5a.onrender.com/news-mail`,
  credentials: "include",
});

const MailsApi = createApi({
  reducerPath: "MailsApi",
  baseQuery,
  tagTypes: ["Mails"],
  endpoints: (builder) => ({
    //Add Mail
    AddMail: builder.mutation({
      query: (newMail) => ({
        url: `/mails-newsletter`,
        method: "POST",
        body: newMail,
      }),
    }),
  }),
});

export const { useAddMailMutation } = MailsApi;

export default MailsApi;

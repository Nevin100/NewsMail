import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_URL || "";

const baseQuery = fetchBaseQuery({
  baseUrl: `${baseUrl}`,
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
        url: `/news-mail/mails-newsletter`,
        method: "POST",
        body: newMail,
      }),
    }),
  }),
});

export const { useAddMailMutation } = MailsApi;

export default MailsApi;

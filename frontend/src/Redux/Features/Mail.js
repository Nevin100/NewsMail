import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `http://localhost:8000/tensorBoy`,
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

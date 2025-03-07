import { configureStore } from "@reduxjs/toolkit";
import MailsApi from "./Features/Mail.js";

export const store = configureStore({
  reducer: {
    [MailsApi.reducerPath]: MailsApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(MailsApi.middleware),
});

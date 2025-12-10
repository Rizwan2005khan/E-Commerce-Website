import {fetchBaseQuery, createApi} from '@reduxjs/toolkit/query/react';

import { BASE_URL } from '../constant';


export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.token; // ✅ get token from Redux state
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); // ✅ attach it
      }
      return headers;
    },
  }),
  tagTypes: ["Product", "Order", "User"],
  endpoints: () => ({}),
});
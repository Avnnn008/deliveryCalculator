import { configureStore } from "@reduxjs/toolkit";
import { dadataApi } from "./dadataApi";
import deliveryRouteSlice from "./deliveryRouteSlice";

export const store = configureStore({
  reducer: {
    [dadataApi.reducerPath]: dadataApi.reducer,
    deliveryRoute: deliveryRouteSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(dadataApi.middleware),
});

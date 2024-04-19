import { /*createAsyncThunk,*/ createSlice } from "@reduxjs/toolkit";
// import { dadataApi } from "./dadataApi";

// export const getAddressIds = createAsyncThunk(
//   "deliveryRoute/getAdressIds",
//   async (payload) => {
//     const {address, direction} = payload
//     const response = await fetch(
//       "http://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/delivery",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           Authorization: "Token " + import.meta.env.VITE_DADATA_TOKEN,
//         },
//         body: JSON.stringify({
//           query: address.kladr,
//         }),
//       }
//     );
//     const data = await response.json()
//     return {
//       direction: direction,
//       ids: {
//         kladr: address.kladr,
//         post: address.post,
//         cdek: data.suggestions[0].data.cdek_id,
//         boxberry: data.suggestions[0].data.boxberry_id,
//         dpd: data.suggestions[0].data.dpd_id,
//       },
//     };
//   }
// );

const initialDirectionsData = {
  name: null,
  kladr: null,
  post: null,
  house: null
  // cdek: null,
  // boxberry: null,
  // dpd: null,
};

const initialDimensions = {
  width: "",
  length: "",
  height: "",
  full: false,
};

const deliveryRouteSlice = createSlice({
  name: "deliveryRoute",
  initialState: {
    from: initialDirectionsData,
    to: initialDirectionsData,
    weight: "",
    dimensions: initialDimensions,
  },
  reducers: {
    setDimensions(state, action) {
      (state.dimensions.width = action.payload.width),
        (state.dimensions.length = action.payload.length);
      state.dimensions.height = action.payload.height;
      state.dimensions.full = true;
    },
    resetDimensions(state) {
      state.dimensions = initialDimensions;
    },
    setStoreWeight(state, action) {
      state.weight = action.payload;
    },
    setDirectionData(state, action) {
      state[action.payload.direction] = action.payload.values;
    },
  },
  // extraReducers(builder) {
  //   builder.addCase(getAddressIds.fulfilled, (state, action) => {
  //     state[action.payload.direction] = action.payload.ids;
  //   }).addCase(getAddressIds.rejected, (error) => console.log(error))
  //   builder
  //     .addMatcher(
  //       dadataApi.endpoints.getDeliveryIds.matchFulfilled,
  //       (state, { payload }) => {
  //         state[payload.direction] = payload.ids;
  //       }
  //     )
  //     .addMatcher(
  //       dadataApi.endpoints.getDeliveryIds.matchRejected,
  //       (state, { payload }) => {
  //         state[payload.direction] = payload.ids;
  //       }
  //     );
  // },
});

export const {
  setDimensions,
  setStoreWeight,
  resetDimensions,
  setDirectionData,
} = deliveryRouteSlice.actions;
export default deliveryRouteSlice.reducer;

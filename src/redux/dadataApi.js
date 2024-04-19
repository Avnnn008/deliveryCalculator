import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dadataApi = createApi({
  reducerPath: "dadataApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://suggestions.dadata.ru/suggestions/api/4_1/rs/",
    method: "POST",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      headers.set(
        "Authorization",
        "Token " + import.meta.env.VITE_DADATA_TOKEN
      );
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Поиск списка городов и поселков по введенным параметрам name
    getAddress: builder.query({
      queryFn: async (name, api, extraOptions, baseQuery) => {
        try {
          const result = await baseQuery({
            url: "suggest/address",
            body: JSON.stringify({
              query: name,
              from_bound: { value: "city" },
              to_bound: { value: "house" },
            }),
          });
          // форматирование результата
          // отсеиваются адреса без индекса и кладр
          // возвращается массив обектов, содержащих адрес, индекс и код кладр
          const data = result.data.suggestions
            .filter(
              (obj) => !!obj.data["postal_code"] && !!obj.data["kladr_id"]
            )
            .map((obj) => {
              return {
                name: obj.value,
                post: obj.data["postal_code"],
                kladr: obj.data["kladr_id"],
                house: !!obj.data.house
              };
            });
          return { data };
        } catch (error) {
          return { error: error.message };
        }
      },
    }),
    // getDeliveryIds: builder.query({
    //   queryFn: async ({address, direction}, api, extraOptions, baseQuery) => {
    //     const ids = { post: address.post, kladr: address.kladr, cdek: null, boxberry: null, dpd: null, name: address.name };
    //     try {
    //       const response = await baseQuery({
    //         url: "findById/delivery",
    //         body: JSON.stringify({
    //           query: address.kladr,
    //         }),
    //       });
    //       if (response.data.suggestions.length) {
    //         (ids.cdek = response.data.suggestions[0].data.cdek_id),
    //           (ids.boxberry = response.data.suggestions[0].data.boxberry_id),
    //           (ids.dpd = response.data.suggestions[0].data.dpd_id);
    //       }
    //       return { data : {direction, ids}};
    //     } catch (error) {
    //       console.error(error.message)
    //       return { error: {message: error.message, ids, direction} };
    //     }
    //   },
    // }),
  }),
});

export const {
  useGetAddressQuery,
  // useGetDeliveryIdsQuery,
} = dadataApi;

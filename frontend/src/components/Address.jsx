import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useGetAddressQuery,
  // useGetDeliveryIdsQuery,
} from "../redux/dadataApi";
import { setDirectionData } from "../redux/deliveryRouteSlice";
import { useDebounce } from "../hooks/useDebounce";
import s from "./address.module.css";

// https://redux.js.org/tutorials/essentials/part-7-rtk-query-basics

export default function Address({ direction }) {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const [address, setAddress] = useState("");
  const [addressIsSelected, setAddressIsSelected] = useState(false);
  const searchValue = useDebounce(address);
  // Поиск списка населенных пунктов по введенному запросу
  const { data, error } = useGetAddressQuery(searchValue, {
    skip:
      searchValue.length < 1 ||
      addressIsSelected ||
      searchValue !== inputRef.current.value,
  });
  // useGetDeliveryIdsQuery(
  //   { address: addressIsSelected, direction },
  //   { skip: !addressIsSelected }
  // );

  useEffect(() => {
    if (addressIsSelected) {
      dispatch(setDirectionData({ direction, values: addressIsSelected }));
    }
  }, [addressIsSelected, dispatch, direction]);

  const dataList = data ? data : [];

  const placeholder = {
    from: "Откуда",
    to: "Куда",
  };

  return (
    <div className={s.search}>
      <input
        type="text"
        ref={inputRef}
        onChange={(e) => {
          setAddress(e.target.value);
          if (addressIsSelected) {
            setAddressIsSelected(false);
          }
        }}
        onFocus={(e) =>
          e.target.setSelectionRange(
            e.target.value.length,
            e.target.value.length
          )
        }
        placeholder={placeholder[direction]}
      />
      <div className={s.datalist}>
        {address &&
          !addressIsSelected &&
          (dataList.length === 0 ? (
            <div key={"no result"} className={s.data + " " + s.noresult}>
              {error
                ? "Произошла ошибка при получении списка населенных пунктов"
                : "Не найдено"}
            </div>
          ) : (
            dataList.map((data) => (
              <div
                key={data.name}
                className={s.data}
                onClick={() => {
                  inputRef.current.value = data.name;
                  setAddressIsSelected(() => data);
                }}
              >
                {data.name}
              </div>
            ))
          ))}
      </div>
    </div>
  );
}

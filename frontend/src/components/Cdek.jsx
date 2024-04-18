import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import Loader from "./UI/Loader";
import s from "./delivery.module.css";

export default function Cdek() {
  const from = useSelector((state) => state.deliveryRoute.from.post);
  const to = useSelector((state) => state.deliveryRoute.to.post);
  const weight = useSelector((state) => state.deliveryRoute.weight);
  const dimensions = useSelector((state) => state.deliveryRoute.dimensions);
  const [cdekData, setCdekData] = useState({
    tariff: [],
    error: null,
    status: 0,
  });
  const [loading, setLoading] = useState(false);

  const addDimensions = useCallback(() => {
    if (dimensions.full) {
      return {
        width: Math.round(dimensions.width),
        length: Math.round(dimensions.length),
        height: Math.round(dimensions.height),
      };
    } else return {};
  }, [dimensions]);

  const getCdekData = useCallback(async () => {
    try {
      setLoading(true);
      const cdekResponse = await fetch("/api/cdek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to,
          weight,
          ...addDimensions(),
        }),
      });
      const responseData = await cdekResponse.json();
      const data = responseData.cdekData;
      if (data.errors || data.error) {
        setCdekData({
          tariff: [],
          error: data.errors
            ? data.errors[0].message
            : "Ошибка при получении данных",
          status: 1,
        });
      } else {
        setCdekData({
          tariff: data.tariff_codes.map((el) => ({
            name: el.tariff_name,
            price: el.delivery_sum,
            min: el.calendar_min,
            max: el.calendar_max,
          })),
          error: null,
          status: 1,
        });
        setLoading(false);
      }
    } catch (e) {
      setCdekData({
        tariff: [],
        error: "Ошибка при получении данных",
        status: 1,
      });
      setLoading(false);
      console.log(e);
    }
  }, [from, to, weight, addDimensions]);

  useEffect(() => {
    if (from && to && weight > 0) {
      getCdekData();
    }
  }, [from, to, weight, getCdekData, dimensions.full]);

  return (
    <div className={s.block}>
      <div className={s.logo}>
        <img src="cdek.png" alt="" />
      </div>
      <div className={s.info}>
        {loading ? (
          <Loader />
        ) : !cdekData.status ? (
          <>
            <div className={s.notice}>
              Необходимые данные: откуда, куда, вес.
            </div>
            <div className={s.notice}>Для более точного расчета: габариты.</div>
          </>
        ) : cdekData.error ? (
          <div className={s.error}>{cdekData.error}</div>
        ) : !cdekData.tariff.length ? (
          "Нет доступных тарифов по заданным параметрам"
        ) : (
          <>
            {cdekData.tariff.map((el) => (
              <div className={s.line} key={el.name}>
                <div>
                  <span className={s.notice}>{el.name}</span>
                </div>
                <div>
                  от <span className={s.number}>{el.price}</span> руб.
                </div>
                <div>
                  <span className={s.number}>
                    {el.min} - {el.max}
                  </span>{" "}
                  дн.
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

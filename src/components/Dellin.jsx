import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import Loader from "./UI/Loader";
import s from "./delivery.module.css";

export default function Dellin() {
  const from = useSelector((state) => state.deliveryRoute.from.name);
  const to = useSelector((state) => state.deliveryRoute.to.name);
  const weight = useSelector((state) => state.deliveryRoute.weight);
  const dimensions = useSelector((state) => state.deliveryRoute.dimensions);
  const [loading, setLoading] = useState(false);
  const [dellinData, setDellinData] = useState({
    status: 0,
    error: null,
    price: null,
    time: null,
  });

  const getDellinData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/dellin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to,
          weight: (weight / 1000).toFixed(3),
          width: (dimensions.width / 100).toFixed(2),
          length: (dimensions.length / 100).toFixed(2),
          height: (dimensions.height / 100).toFixed(2),
        }),
      });
      const responseData = await response.json();
      if (responseData.error) {
        setDellinData({
          status: 1,
          error: responseData.error
            ? responseData.error
            : "Ошибка при получении данных",
          price: null,
          time: null,
        });
        setLoading(false);
        return;
      }
      setDellinData({
        price: responseData.data.price,
        time:
          parseInt(
            responseData.data.orderDates.derivalFromOspReceiver
              .split("-")
              .slice(-1)
          ) -
          parseInt(responseData.data.orderDates.pickup.split("-").slice(-1)),
        status: 1,
        error: null,
      });
      const data = responseData.dellinData;
      setLoading(false);
      console.log(data);
    } catch (e) {
      console.log(e);
      setDellinData({
        price: null,
        time: null,
        status: 1,
        error: "Ошибка при получении данных",
      });
      setLoading(false);
    }
  }, [from, to, weight, dimensions]);

  useEffect(() => {
    if (from && to && weight > 0 && dimensions.full) {
      getDellinData();
    }
  }, [from, to, weight, dimensions.full, getDellinData]);

  return (
    <div className={s.block}>
      <div className={s.logo}>
        <img src="dellin.png" alt="" />
      </div>
      <div className={s.info}>
        {loading ? (
          <Loader />
        ) : !dellinData.status ? (
          <>
            <div className={s.notice}>
              Необходимые данные: откуда, куда, вес, габариты.
            </div>
            <div className={s.notice}>
              Адреса должны быть указаны с точностью до дома.
            </div>
          </>
        ) : dellinData.error ? (
          dellinData.error.split("|").map((el) => (
            <div className={s.error} key={el}>
              {el}
            </div>
          ))
        ) : (
          <>
            <div>
              от <span className={s.number}>{dellinData.price}</span> руб.
            </div>
            {dellinData.time ? (
              <div>
                около <span className={s.number}>{dellinData.time}</span> дн.
              </div>
            ) : (
              <div>в течение суток</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

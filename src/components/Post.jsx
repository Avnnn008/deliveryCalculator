import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import Loader from "./UI/Loader";
import s from "./delivery.module.css";

export default function Post() {
  const from = useSelector((state) => state.deliveryRoute.from.post);
  const to = useSelector((state) => state.deliveryRoute.to.post);
  const weight = useSelector((state) => state.deliveryRoute.weight);
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState({
    status: 0, //0 - данные не запрошены, 1 - данные получены или ошибка
    min: null,
    max: null,
    price: null,
    error: null,
  });

  const getPostData = useCallback(async () => {
    setLoading(true);
    try {
      const postResponse = await fetch(
        `https://delivery.pochta.ru/v2/calculate/tariff/delivery?json=&object=4030&from=${from}&to=${to}&weight=${weight}`
      );
      const data = await postResponse.json();
      if (data.errors) {
        // обработка ошибок
        let errorMessage;
        if (data.errors[0].code === 2003) {
          errorMessage = "Вес посылки не может превышать 50 кг";
        } else if (5000 <= data.errors[0].code <= 5999) {
          errorMessage = "Ошибка при получении данных";
        } else {
          errorMessage = "Доставка не осуществляется";
        }
        setPostData(() => ({
          status: 1,
          price: null,
          min: null,
          max: null,
          error: errorMessage,
        }));
        setLoading(false);
      } else {
        //запись полученных данных
        setPostData(() => ({
          status: 1,
          price: Math.floor(data.paynds / 100),
          min: data.delivery.min,
          max: data.delivery.max,
          error: null,
        }));
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setPostData(() => ({
        status: 1,
        price: null,
        min: null,
        max: null,
        error: "Ошибка при получении данных",
      }));
      setLoading(false);
    }
  }, [from, to, weight]);

  useEffect(() => {
    if (from && to && weight > 0) {
      getPostData();
    }
  }, [from, to, weight, getPostData]);

  return (
    <div className={s.block}>
      <div className={s.logo}>
        <a href="https://www.pochta.ru/shipment?type=PARCEL" target="_blank" title="Почта России">
          <img src="post.png" alt="" />
        </a>
      </div>
      <div className={s.info}>
        {loading ? (
          <Loader />
        ) : postData.status ? (
          postData.error ? (
            <div className={s.error}>{postData.error}</div>
          ) : (
            <>
              <div className={s.price}>
                от <span className={s.number}>{postData.price}</span> руб.
              </div>
              <div className={s.time}>
                {postData.min === postData.max ? (
                  <>
                    до <span className={s.number}>{postData.min}</span>
                  </>
                ) : (
                  <>
                    от <span className={s.number}>{postData.min}</span> до{" "}
                    <span className={s.number}>{postData.max}</span>
                  </>
                )}{" "}
                рабочих дней{" "}
                <span className={s.notice}>без учета дня приема</span>
              </div>
            </>
          )
        ) : (
          <div className={s.notice}>Необходымые данные: откуда, куда, вес.</div>
        )}
      </div>
    </div>
  );
}

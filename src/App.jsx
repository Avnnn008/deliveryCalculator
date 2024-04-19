import { useSelector } from "react-redux";
import Address from "./components/Address";
import Post from "./components/Post";
import Cdek from "./components/Cdek";
import Dellin from "./components/Dellin";
import Dimensions from "./components/Dimensions";
import s from "./App.module.css";

function App() {
  const directions = ["from", "to"];
  const from = useSelector((state) => state.deliveryRoute.from);
  const to = useSelector((state) => state.deliveryRoute.to);
  const dimensions = useSelector((state) => state.deliveryRoute.dimensions);
  const weight = useSelector((state) => state.deliveryRoute.weight);

  return (
    <div className={s.app}>
      <div className={s.container}>
        <h1 className={s.title}>Рассчитать стоимость и сроки доставки</h1>
        <section className={s.form}>
          <div className={s.destination}>
            {directions.map((direction) => (
              <Address key={direction} direction={direction} />
            ))}
          </div>
          <Dimensions />
        </section>

        <section className={s.result}>
          {from.name && to.name ? (
            <div className={s.cities}>
              <div>{from.name}</div>
              <div className={s.size}>
                {weight ? <div>{weight / 1000} кг</div> : <></>}
                {dimensions.full ? (
                  <div>
                    {dimensions.width}см x {dimensions.length}см x{" "}
                    {dimensions.height}см
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className={s.symbol}>↓</div>
              <div>{to.name}</div>
            </div>
          ) : (
            <></>
          )}

          <Post />
          <Cdek />
          <Dellin />
        </section>
      </div>
    </div>
  );
}

export default App;

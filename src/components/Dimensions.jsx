import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  resetDimensions,
  setDimensions,
  setStoreWeight,
} from "../redux/deliveryRouteSlice";
import { useDebounce } from "../hooks/useDebounce";
import s from "./dimensions.module.css";

export default function Dimensions() {
  const dispatch = useDispatch();
  const [weight, setWeight] = useState("");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [height, setHeight] = useState("");

  const debouncedWeight = useDebounce(weight);
  const debouncedWidth = useDebounce(width);
  const debouncedLength = useDebounce(length);
  const debouncedHeight = useDebounce(height);

  useEffect(() => {
    if (debouncedWeight > 0) {
      dispatch(setStoreWeight(debouncedWeight));
    }
  }, [debouncedWeight, dispatch]);

  useEffect(() => {
    if (debouncedWidth > 0 && debouncedLength > 0 && debouncedHeight > 0) {
      dispatch(
        setDimensions({
          width: debouncedWidth,
          length: debouncedLength,
          height: debouncedHeight,
        })
      );
    } else if (!debouncedWidth && !debouncedLength && !debouncedHeight) {
      dispatch(resetDimensions());
    }
  }, [debouncedWidth, debouncedLength, debouncedHeight, dispatch]);

  return (
    <div className={s.dimensions}>
      <label>
        Вес:{" "}
        <input
          type="number"
          min={1}
          inputMode="numeric"
          value={weight}
          onInput={(e) => setWeight(e.target.value)}
        />{" "}
        грамм
      </label>
      <div>
        <label>Габариты (в см): </label>
        <div className={s.measuring}>
          <input
            type="number"
            min={1}
            inputMode="numeric"
            value={width}
            placeholder="ширина"
            onInput={(e) => setWidth(e.target.value)}
          />
          <input
            type="number"
            min={1}
            inputMode="numeric"
            value={length}
            placeholder="длина"
            onInput={(e) => setLength(e.target.value)}
          />
          <input
            type="number"
            min={1}
            inputMode="numeric"
            value={height}
            placeholder="высота"
            onInput={(e) => setHeight(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

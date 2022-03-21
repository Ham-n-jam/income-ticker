import React, { useEffect, useState } from "react";
import styles from "./EarningsDisplay.module.scss";
import Counter from "../counter/Counter";

export default function EarningsDisplay({ getCurrentValFunc }) {
  const [earningsCents, setEarningsCents] = useState(getCurrentValFunc);

  useEffect(() => {
    const interval = setInterval(() => {
      setEarningsCents(Math.round(getCurrentValFunc()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const decimals = earningsCents.toString().split("");
  const cents = decimals.splice(Math.max(decimals.length - 2, 0));
  if (cents.length === 1) {
    cents.unshift("0");
  }
  let dollars = parseInt(
    earningsCents.toString().slice(0, -2)
  ).toLocaleString();
  if (dollars === "NaN") {
    dollars = "0";
  }
  dollars = dollars.split("");
  if (dollars.length === 0) {
    dollars.unshift("0");
  }

  return (
    <div className={styles.wrapper}>
      $
      {dollars.map((value) => {
        return value !== "," || value !== "." ? (
          <Counter val={value} />
        ) : (
          <span>value</span>
        );
      })}
      .
      {cents.map((value, idx) => (
        <Counter val={value} />
      ))}
    </div>
  );
}

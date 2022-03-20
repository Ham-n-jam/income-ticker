import React, { useEffect, useState } from "react";
import styles from "./EarningsDisplay.module.scss";
import Counter from "../counter/Counter";

export default function EarningsDisplay({ initialVal }) {
  const [earningsCents, setEarningsCents] = useState(initialVal);

  useEffect(() => {
    const interval = setInterval(() => {
      setEarningsCents((earningsCents) => earningsCents + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const decimals = earningsCents.toString().split("");
  const cents = decimals.splice(Math.max(decimals.length - 2, 0));
  if (cents.length === 1) {
    cents.unshift("0");
  }
  if (decimals.length === 0) {
    decimals.unshift("0");
  }

  return (
    <div className={styles.wrapper}>
      $
      {decimals.map((value, idx) => {
        {
          return (idx + 2) % 3 === 0 && idx != decimals.length - 1 ? (
            <>
              <Counter val={value} />
              <span>,</span>
            </>
          ) : (
            <Counter val={value} />
          );
        }
      })}
      .
      {cents.map((value, idx) => (
        <Counter val={value} />
      ))}
    </div>
  );
}

import React from "react";
import styles from "./IncomeScreen.module.scss";
import EarningsDisplay from "./earningsDisplay/EarningsDisplay";
import Button from "./button/Button";
import SetupIcon from "../icons/options.svg";

export default function IncomeScreen() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Today's cheddar</div>
      <div className={styles.mainEarningsDisplay}>
        <EarningsDisplay initialVal={0} />
      </div>
      <div className={styles.subTitle}>Total earnings</div>
      <div className={styles.subEarningsDisplay}>
        <EarningsDisplay initialVal={1234567890} />
      </div>
      <div className={styles.spacer}>
        <div className={styles.settings}>
          <Button
            icon={<img src={SetupIcon} alt={"SetupScreen"} />}
            link={"setup"}
          />
        </div>
      </div>
    </div>
  );
}

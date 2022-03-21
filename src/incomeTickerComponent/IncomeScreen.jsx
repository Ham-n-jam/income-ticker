import React, { useEffect, useState } from "react";
import styles from "./IncomeScreen.module.scss";
import EarningsDisplay from "./earningsDisplay/EarningsDisplay";
import Button from "./button/Button";
import SetupIcon from "./icons/options.svg";
import { Navigate } from "react-router-dom";
import moment from "moment";

export default function IncomeScreen() {
  const [workStatus, setWorkStatus] = useState("");

  // Redirect user to setup if save data isn't found
  if (localStorage.getItem("paymentFreq") === null) {
    return <Navigate to={"./setup"} />;
  }

  const paymentFreq = JSON.parse(localStorage.getItem("paymentFreq"));
  const paymentAmount = JSON.parse(localStorage.getItem("paymentAmount"));
  const workdays = JSON.parse(localStorage.getItem("workdays"));
  const workHoursStr = JSON.parse(localStorage.getItem("workHours"));
  const lunchBreakStr = JSON.parse(localStorage.getItem("lunchBreak"));
  const workHours = {
    start: moment(workHoursStr.start),
    end: moment(workHoursStr.end),
  };
  const lunchBreak = {
    start: moment(lunchBreakStr.start),
    end: moment(lunchBreakStr.end),
  };

  function getIsWorkday() {
    const currentDateTime = moment();
    return workdays.includes(currentDateTime.format("dddd").toLowerCase());
  }

  function getPayrateCentsPerSecond() {
    let daysWorkedPerPayFreq;
    switch (paymentFreq) {
      case "weekly":
        daysWorkedPerPayFreq = workdays.length;
        break;
      case "fortnightly":
        daysWorkedPerPayFreq = workdays.length * 2;
        break;
      case "monthly":
        daysWorkedPerPayFreq = workdays.length * 4;
        break;
      default:
        break;
    }
    let payrateCentsPerDay =
      (parseFloat(paymentAmount) * 100) / daysWorkedPerPayFreq;
    let timeWorkedPerDay =
      workHours.end - workHours.start - (lunchBreak.end - lunchBreak.start);
    return payrateCentsPerDay * (1000.0 / timeWorkedPerDay);
  }
  const payrateCentsPerSecond = getPayrateCentsPerSecond();

  function getMilliSecondsWorkedToday() {
    const currentTime = moment();
    if (currentTime.isBefore(workHours.start)) {
      setWorkStatus("Work starting soon");
      return 0.0;
    } else if (currentTime.isBefore(lunchBreak.start)) {
      setWorkStatus("Work in progress");
      return currentTime - workHours.start;
    } else if (currentTime.isBetween(lunchBreak.start, lunchBreak.end)) {
      setWorkStatus("Lunch break");
      return lunchBreak.start - workHours.start;
    } else if (currentTime.isBetween(lunchBreak.end, workHours.end)) {
      setWorkStatus("Work in progress");
      return (
        lunchBreak.start - workHours.start + (currentTime - lunchBreak.end)
      );
    } else {
      setWorkStatus("Done for the day");
      return (
        lunchBreak.start - workHours.start + (workHours.end - lunchBreak.end)
      );
    }
  }

  function getTodaysEarningsCents() {
    let todaysEarningsCents = 0.0;
    if (!getIsWorkday()) {
      setWorkStatus("Off work today");
      return todaysEarningsCents;
    }
    const secondsWorkedToday = getMilliSecondsWorkedToday();
    todaysEarningsCents = (payrateCentsPerSecond * secondsWorkedToday) / 1000;
    return todaysEarningsCents;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Today's cheddar</div>
      <div className={styles.mainEarningsDisplay}>
        <EarningsDisplay getCurrentValFunc={getTodaysEarningsCents} />
      </div>
      <div className={styles.subTitle}>Total earnings</div>
      <div className={styles.subEarningsDisplay}>
        <EarningsDisplay getCurrentValFunc={getTodaysEarningsCents} />
      </div>
      <div className={styles.spacer}>
        <div className={styles.settings}>
          <Button
            icon={<img src={SetupIcon} alt={"SetupScreen"} />}
            link={"setup"}
          />
        </div>
        <div className={styles.workStatus}>{workStatus}</div>
      </div>
    </div>
  );
}

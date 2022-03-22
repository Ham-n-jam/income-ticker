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
  const startDate = new Date(Number(localStorage.getItem("startDate")));

  function getIsWorkday() {
    const currentDateTime = moment();
    return workdays.includes(currentDateTime.format("dddd").toLowerCase());
  }

  function msOfDay(m, ignoreSec = true) {
    let ms = m.minutes() * 60000 + m.hours() * 3600000;
    if (!ignoreSec) {
      ms += m.milliseconds() + m.seconds() * 1000;
    }
    return ms;
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
      msOfDay(workHours.end) -
      msOfDay(workHours.start) -
      (msOfDay(lunchBreak.end) - msOfDay(lunchBreak.start));
    return payrateCentsPerDay * (1000.0 / timeWorkedPerDay);
  }
  const payrateCentsPerSecond = getPayrateCentsPerSecond();

  function getMilliSecondsWorkedToday() {
    const currentTime = moment();
    if (msOfDay(currentTime, false) < msOfDay(workHours.start)) {
      setWorkStatus("Work starting soon");
      return 0.0;
    } else if (msOfDay(currentTime, false) < msOfDay(lunchBreak.start)) {
      setWorkStatus("Work in progress");
      return msOfDay(currentTime, false) - msOfDay(workHours.start);
    } else if (msOfDay(currentTime, false) < msOfDay(lunchBreak.end)) {
      setWorkStatus("Lunch break");
      return msOfDay(lunchBreak.start) - msOfDay(workHours.start);
    } else if (msOfDay(currentTime, false) < msOfDay(workHours.end)) {
      setWorkStatus("Work in progress");
      return (
        msOfDay(lunchBreak.start) -
        msOfDay(workHours.start) +
        (msOfDay(currentTime, false) - msOfDay(lunchBreak.end))
      );
    } else {
      setWorkStatus("Done for the day");
      return (
        msOfDay(lunchBreak.start) -
        msOfDay(workHours.start) +
        (msOfDay(workHours.end) - msOfDay(lunchBreak.end))
      );
    }
  }

  function getTodaysEarningsCents() {
    let todaysEarningsCents = 0.0;
    if (!getIsWorkday()) {
      setWorkStatus("Off work today");
      return todaysEarningsCents;
    }
    const millisecondsWorkedToday = getMilliSecondsWorkedToday();
    todaysEarningsCents =
      (payrateCentsPerSecond * millisecondsWorkedToday) / 1000;
    return todaysEarningsCents;
  }

  const daysOfWeek = [];
  daysOfWeek[0] = "monday";
  daysOfWeek[1] = "tuesday";
  daysOfWeek[2] = "wednesday";
  daysOfWeek[3] = "thursday";
  daysOfWeek[4] = "friday";
  daysOfWeek[5] = "saturday";
  daysOfWeek[6] = "sunday";

  function getTotalEarningsCents() {
    let daysWorkedInFirstWeek = 0;
    let daysWorkedUpToThisWeek = 0;
    let daysWorkedThisWeek = 0;

    const startDay = moment(startDate).format("dddd").toLowerCase();
    let idxOfStartDayInWeek = 0;
    for (let i = 0; i < daysOfWeek.length; i++) {
      if (daysOfWeek[i] === startDay) {
        idxOfStartDayInWeek = i;
      }
    }
    let daysSinceStartOfWeek = 0;
    const currentDay = moment().format("dddd").toLowerCase();
    for (let i = 0; i < daysOfWeek.length; i++) {
      if (daysOfWeek[i] === currentDay) {
        daysSinceStartOfWeek = i;
      }
    }

    const weeksSinceStart = moment().diff(moment(startDate), "week");
    // If at least a week has passed since starting work
    if (Math.abs(weeksSinceStart) >= 1) {
      for (let i = 0; i < workdays.length; i++) {
        if (daysOfWeek.indexOf(workdays[i]) >= idxOfStartDayInWeek) {
          daysWorkedInFirstWeek++;
        }
      }

      const weeksSinceStartDate = moment().diff(
        moment(startDate).add(1, "week").startOf("isoWeek"),
        "week"
      );
      daysWorkedUpToThisWeek = weeksSinceStartDate * workdays.length;

      for (let i = 0; i < daysSinceStartOfWeek; i++) {
        if (workdays.includes(daysOfWeek[i])) {
          daysWorkedThisWeek++;
        }
      }
    } else {
      // Started working this week
      for (let i = idxOfStartDayInWeek; i < daysSinceStartOfWeek; i++) {
        if (workdays.includes(daysOfWeek[i])) {
          daysWorkedThisWeek++;
        }
      }
    }

    let totalMillisecondsWorkedUpToThisWeek =
      (daysWorkedUpToThisWeek + daysWorkedThisWeek + daysWorkedInFirstWeek) *
      (msOfDay(lunchBreak.start) -
        msOfDay(workHours.start) +
        (msOfDay(workHours.end) - msOfDay(lunchBreak.end)));
    const total =
      (payrateCentsPerSecond * totalMillisecondsWorkedUpToThisWeek) / 1000 +
      getTodaysEarningsCents();

    console.log({
      daysWorkedInFirstWeek: daysWorkedInFirstWeek,
      daysWorkedUpToThisWeek: daysWorkedUpToThisWeek,
      daysWorkedThisWeek: daysWorkedThisWeek,
      idxOfStartDayInWeek: idxOfStartDayInWeek,
    });

    return total;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Today's cheddar</div>
      <div className={styles.mainEarningsDisplay}>
        <EarningsDisplay getCurrentValFunc={getTodaysEarningsCents} />
      </div>
      <div className={styles.subTitle}>Total earnings</div>
      <div className={styles.subEarningsDisplay}>
        <EarningsDisplay getCurrentValFunc={getTotalEarningsCents} />
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

import React, { useState } from "react";
import styles from "./SetupScreen.module.scss";
import Button from "../button/Button";
import TimePicker from "rc-time-picker";
import moment from "moment";
import "rc-time-picker/assets/index.css";

export default function SetupScreen() {
  const daysOfTheWeek = {
    monday: "Mo",
    tuesday: "Tu",
    wednesday: "We",
    thursday: "Th",
    friday: "Fr",
    saturday: "Sa",
    sunday: "Su",
  };
  const format = "h:mm a";
  const [paymentFreq, setPaymentFreq] = useState(
    loadDataField("paymentFreq", "weekly")
  );
  const [paymentAmount, setPaymentAmount] = useState(
    loadDataField("paymentAmount", "1.00")
  );
  const [workdays, setWorkdays] = useState(
    loadDataField("workdays", [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
    ])
  );
  const [workHours, setWorkHours] = useState(
    loadDataField("workHours", {
      start: moment().hour(9).minute(0).second(0),
      end: moment().hour(17).minute(0).second(0),
    })
  );
  const [lunchBreak, setLunchBreak] = useState(
    loadDataField("lunchBreak", {
      start: moment().hour(12).minute(0).second(0),
      end: moment().hour(13).minute(0).second(0),
    })
  );

  function handlePaymentFreqChange(event) {
    setPaymentFreq(event.target.value);
  }
  function handlePaymentAmountChange(event) {
    setPaymentAmount(event.target.value);
  }
  function handlePaymentAmountFocusOut(event) {
    // Add the correct number of decimal places
    if (!paymentAmount.includes(".")) {
      setPaymentAmount(paymentAmount + ".00");
    } else if (paymentAmount.split(".")[1].length === 1) {
      setPaymentAmount(paymentAmount + "0");
    }
  }
  function handleWorkdayChange(event) {
    if (event.target.checked) {
      setWorkdays([event.target.id, ...workdays]);
    } else {
      setWorkdays(workdays.filter((item) => item !== event.target.id));
    }
  }
  function handleTimeChange(newTime, target) {
    switch (target) {
      case "workStart":
        setWorkHours({ start: newTime, end: workHours.end });
        break;
      case "workEnd":
        setWorkHours({ start: workHours.start, end: newTime });
        break;
      case "lunchStart":
        setLunchBreak({ start: newTime, end: lunchBreak.end });
        break;
      case "lunchEnd":
        setLunchBreak({ start: lunchBreak.start, end: newTime });
        break;
      default:
        break;
    }
  }

  function loadDataField(fieldName, defaultVal) {
    let savedVal = JSON.parse(localStorage.getItem(fieldName));
    if (savedVal && (fieldName === "workHours" || fieldName === "lunchBreak")) {
      savedVal = { start: moment(savedVal.start), end: moment(savedVal.end) };
    }
    return savedVal || defaultVal;
  }

  function saveDataToLocalStorage() {
    localStorage.setItem("paymentFreq", JSON.stringify(paymentFreq));
    localStorage.setItem("paymentAmount", JSON.stringify(paymentAmount));
    localStorage.setItem("workdays", JSON.stringify(workdays));
    localStorage.setItem("workHours", JSON.stringify(workHours));
    localStorage.setItem("lunchBreak", JSON.stringify(lunchBreak));
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Setup</div>
      <form className={styles.form}>
        <div className={styles.inputWrapper}>
          <label htmlFor="frequency">Payment frequency:</label>
          <div className={styles.right}>
            <select
              className={`${styles.darkBg} ${styles.input}`}
              id="frequency"
              name="frequency"
              onChange={handlePaymentFreqChange}
              value={paymentFreq}
            >
              <option value="weekly">Weekly</option>
              <option value="fortnightly">Fortnightly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className={styles.inputWrapper}>
          <label htmlFor="amount">Payment amount:</label>
          <div className={styles.right}>
            <span>$</span>
            <input
              className={styles.darkBg}
              type="number"
              step="any"
              min="0"
              id="amount"
              name="amount"
              value={paymentAmount}
              onChange={handlePaymentAmountChange}
              onBlur={handlePaymentAmountFocusOut}
            />
          </div>
        </div>

        <div className={styles.inputWrapper}>
          <label htmlFor="workdays">
            Workdays:
            <br />
          </label>
          <div className={styles.right}>
            {Object.keys(daysOfTheWeek).map((day) => (
              <div key={day}>
                <label className={styles.input} htmlFor="monday">
                  {daysOfTheWeek[day]}
                </label>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  id={day}
                  checked={workdays.includes(day)}
                  onChange={handleWorkdayChange}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.inputWrapper}>
          <label htmlFor="workhours">Work hours:</label>
          <div className={styles.right}>
            <TimePicker
              showSecond={false}
              defaultValue={workHours.start}
              className="xxx"
              onChange={(newTime) => {
                handleTimeChange(newTime, "workStart");
              }}
              format={format}
              use12Hours
            />
            <span className={styles.margin}>to</span>
            <TimePicker
              showSecond={false}
              defaultValue={workHours.end}
              className="xxx"
              onChange={(newTime) => {
                handleTimeChange(newTime, "workEnd");
              }}
              format={format}
              use12Hours
            />
          </div>
        </div>

        <div className={styles.inputWrapper}>
          <label htmlFor="lunch">Lunch break:</label>
          <div className={styles.right}>
            <TimePicker
              showSecond={false}
              defaultValue={lunchBreak.start}
              className="xxx"
              onChange={(newTime) => {
                handleTimeChange(newTime, "lunchStart");
              }}
              format={format}
              use12Hours
            />
            <span className={styles.margin}>to</span>
            <TimePicker
              showSecond={false}
              defaultValue={lunchBreak.end}
              className="xxx"
              onChange={(newTime) => {
                handleTimeChange(newTime, "lunchEnd");
              }}
              format={format}
              use12Hours
            />
          </div>
        </div>
      </form>

      <div className={styles.spacer}>
        <Button
          onClick={saveDataToLocalStorage}
          type="submit"
          text={"Done"}
          link={"../"}
          color="blue"
        />
      </div>
    </div>
  );
}

import React from "react";
import styles from "./SetupScreen.module.scss";
import Button from "../button/Button";
import TimePicker from "rc-time-picker";
import moment from "moment";
import "rc-time-picker/assets/index.css";

export default function SetupScreen() {
  function onChange() {}
  const format = "h:mm a";

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
            >
              <option value="weekly">Weekly</option>
              <option value="fortnightly">Fortnightly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
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
            />
          </div>
        </div>

        <div className={styles.inputWrapper}>
          <label htmlFor="workdays">
            Workdays:
            <br />
          </label>
          <div className={styles.right}>
            <label className={styles.input} htmlFor="monday">
              Mo
            </label>
            <input
              className={styles.checkbox}
              type="checkbox"
              id="monday"
              value="monday"
              checked
            />
            <label className={styles.input} htmlFor="tuesday">
              Tu
            </label>
            <input
              className={styles.checkbox}
              type="checkbox"
              id="tuesday"
              value="tuesday"
              checked
            />
            <label className={styles.input} htmlFor="tuesday">
              We
            </label>
            <input
              className={styles.checkbox}
              type="checkbox"
              id="wednesday"
              value="wednesday"
              checked
            />
            <label className={styles.input} htmlFor="wednesday">
              Th
            </label>
            <input
              className={styles.checkbox}
              type="checkbox"
              id="thursday"
              value="thursday"
              checked
            />
            <label className={styles.input} htmlFor="thursday">
              Fr
            </label>
            <input
              className={styles.checkbox}
              type="checkbox"
              id="friday"
              value="friday"
              checked
            />
            <label className={styles.input} htmlFor="friday">
              Sa
            </label>
            <input
              className={styles.checkbox}
              type="checkbox"
              id="saturday"
              value="saturday"
            />
            <label className={styles.input} htmlFor="saturday">
              Su
            </label>
            <input
              className={styles.checkbox}
              type="checkbox"
              id="sunday"
              value="sunday"
            />
          </div>
        </div>

        <div className={styles.inputWrapper}>
          <label htmlFor="workhours">Work hours:</label>
          <div className={styles.right}>
            <TimePicker
              showSecond={false}
              defaultValue={moment().hour(9).minute(0)}
              className="xxx"
              onChange={onChange}
              format={format}
              use12Hours
            />
            <span className={styles.margin}>to</span>
            <TimePicker
              showSecond={false}
              defaultValue={moment().hour(17).minute(0)}
              className="xxx"
              onChange={onChange}
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
              defaultValue={moment().hour(12).minute(0)}
              className="xxx"
              onChange={onChange}
              format={format}
              use12Hours
            />
            <span className={styles.margin}>to</span>
            <TimePicker
              showSecond={false}
              defaultValue={moment().hour(13).minute(0)}
              className="xxx"
              onChange={onChange}
              format={format}
              use12Hours
            />
          </div>
        </div>
      </form>

      <div className={styles.spacer}>
        <Button text={"Done"} link={"../"} color="blue" />
      </div>
    </div>
  );
}

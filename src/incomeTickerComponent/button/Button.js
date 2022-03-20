import React from "react";
import styles from "./Button.module.scss";

export default function Button({ text, icon }) {
  return (
    <div className={styles.button}>
      {icon ? <div className={styles.icon}>{icon}</div> : null} {text}
    </div>
  );
}

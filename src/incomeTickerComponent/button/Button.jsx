import React from "react";
import styles from "./Button.module.scss";
import { Link } from "react-router-dom";

export default function Button({ text, icon, onClick, link, color }) {
  const classNames = {
    black: "black",
    white: "white",
    blue: "blue",
  };

  const className = classNames.hasOwnProperty(color)
    ? classNames[color]
    : "black";

  const buttonDiv = (
    <div className={`${styles.button} ${styles[className]}`} onClick={onClick}>
      {icon ? <div className={styles.icon}>{icon}</div> : null} {text}
    </div>
  );

  return link ? (
    <Link className={styles.link} to={link}>
      {buttonDiv}
    </Link>
  ) : (
    { buttonDiv }
  );
}

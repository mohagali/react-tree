import React from "react";
import styles from "./Placeholder.module.css";

export const Placeholder = (props) => (
  <div
    className={styles.root}
    style={{ left: props.depth * 24 }}
    data-testid="placeholder"
  ></div>
);

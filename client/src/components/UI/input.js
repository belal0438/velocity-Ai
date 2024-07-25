import React from "react";
import classes from "./input.module.css";
const Input = (props) => {
  return (
    <>
      <label className={classes.label}>{props.label}</label>
      <input className={classes.input} {...props.input} />
    </>
  );
};

export default Input;

"use client";
import { useRef } from "react";
import { Button } from "antd";

import style from "./index.module.scss";

const Trigger = ({ children, className, onClick }) => {
  const inputRef = useRef(null);
  const handleClick = () => {
    if (!inputRef.current) return;
    inputRef.current.click();
    console.log(inputRef.current.file);
  };
  return (
    <div className={style.container}>
      <input type="file" className={style.fileInput} ref={inputRef} />
      <Button className={className || ""} onClick={handleClick}>
        {children}
      </Button>
    </div>
  );
};
export default Trigger;

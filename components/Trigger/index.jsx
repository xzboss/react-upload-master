"use client";
import { useRef } from "react";
import { Button } from "antd";

import style from "./index.module.scss";

const Trigger = ({ children, className, onChange, multiple = false }) => {
  const inputRef = useRef(null);
  const handleClick = () => {
    if (!inputRef.current) return;
    inputRef.current.click();
  };
  return (
    <div className={style.container}>
      <input
        multiple={multiple}
        type="file"
        className={style.fileInput}
        ref={inputRef}
        onChange={(e) => onChange(e.target.files)}
      />
      <Button className={className || ""} onClick={handleClick}>
        {children}
      </Button>
    </div>
  );
};
export default Trigger;

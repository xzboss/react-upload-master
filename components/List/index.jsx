"use client";
import { useRef } from "react";
import { Button, Progress } from "antd";

import style from "./index.module.scss";

const List = ({ fileList = [], onRemove }) => {
  console.log(fileList);

  const remove = (index) => {
    onRemove(index);
  };
  return (
    <div className={style.container}>
      {fileList.map((item, index) => {
        return (
          <div className={style.itemWrapper} key={index}>
            <div className={style.content}>
              <div className={style.filename}>{item.name}</div>
              <div className={style.operation}>
                <Button type="primary" danger onClick={remove(index)}>
                  remove
                </Button>
                <Button danger>cancel</Button>
              </div>
            </div>
            <Progress percent={30} className={style.progress} />
          </div>
        );
      })}
    </div>
  );
};
export default List;

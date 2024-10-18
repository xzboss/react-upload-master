"use client";
import { useRef } from "react";
import { Button, Progress } from "antd";

import style from "./index.module.scss";

/**
 * 文件列表组件
 *
 * @param {Object[]} fileList - 文件信息列表
 * @param {File} fileList[].file - 文件对象
 * @param {number} fileList[].progress - 文件上传进度（百分比）
 * @param {AbortController} fileList[].controller - 用于取消文件上传的控制器
 * @param {Function} onRemove - 文件移除回调函数
 * @param {Function} onCancel - 文件上传取消回调函数
 */
const List = ({ fileList = [], onRemove, onCancel }) => {
  const remove = (index) => {
    onRemove(index);
  };
  const cancel = (index, controller) => {
    controller.abort();
    onCancel(index);
  };
  return (
    <div className={style.container}>
      {fileList.map(({ file, progress, controller }, index) => {
        return (
          <div className={style.itemWrapper} key={index} style={{ opacity: controller.signal.aborted ? 0.5 : 1 }}>
            <div className={style.content}>
              <div className={style.filename}>{file.name}</div>
              <div className={style.operation}>
                <Button type="primary" danger onClick={() => remove(index)}>
                  remove
                </Button>
                <Button danger onClick={() => cancel(index, controller)}>
                  cancel
                </Button>
              </div>
            </div>
            <Progress percent={progress} className={style.progress} />
          </div>
        );
      })}
    </div>
  );
};
export default List;

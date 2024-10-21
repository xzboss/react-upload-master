"use client";
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
const List = ({ fileList = [], onRemove, onCancel, onStop, onResume }) => {
  const remove = (index) => {
    onRemove(index);
  };
  const cancel = (index, controller, progress) => {
    if (progress >= 100 || controller.signal.aborted) return;
    controller.abort();
    onCancel(index);
  };
  const stop = (index, controller, progress) => {
    if (progress >= 100 || controller.signal.aborted) return;
    controller.abort();
    onStop(index);
  };
  const resume = (file, progress, controller, hash, index) => {
    if (progress >= 100 || !controller.signal.aborted) return;
    onResume(file, progress, controller, hash, index);
  };
  return (
    <div className={style.container}>
      {fileList.map(({ file, progress, controller, hash }, index) => {
        return (
          <div className={style.itemWrapper} key={index} style={{ opacity: controller.signal.aborted ? 0.8 : 1 }}>
            <div className={style.content}>
              <div className={style.filename}>{file.name}</div>
              <div className={style.operation}>
                <Button type="primary" danger onClick={() => remove(index)}>
                  remove
                </Button>
                <Button danger onClick={() => cancel(index, controller, progress)}>
                  cancel
                </Button>
                <Button danger onClick={() => stop(index, controller, progress)}>
                  stop
                </Button>
                <Button onClick={() => resume(file, progress, controller, hash, index)}>resume</Button>
              </div>
            </div>

            <div>
              generate hash progress
              <Progress percent={hash?.progress} className={style.progress} />
            </div>

            <div>
              upload progress
              <Progress percent={progress} className={style.progress} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default List;

"use client";
import { Button, Progress } from "antd";

import style from "./index.module.scss";

const List = ({ fileList = [], onRemove, onStop, onResume }) => {
  const remove = (index, controller, progress) => {
    controller.abort();
    onRemove(index);
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
          <div className={style.itemWrapper} key={index}>
            <div className={style.content}>
              <div className={style.filename}>{file.name}</div>
              <div className={style.operation}>
                <Button type="primary" danger onClick={() => remove(index, controller, progress)}>
                  remove
                </Button>
                {onStop && onResume ? (
                  <div>
                    <Button danger onClick={() => stop(index, controller, progress)}>
                      stop
                    </Button>
                    <Button onClick={() => resume(file, progress, controller, hash, index)}>resume</Button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            {hash ? (
              <div>
                generate hash progress
                <Progress percent={hash?.progress} className={style.progress} />
              </div>
            ) : (
              ""
            )}

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

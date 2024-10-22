"use client";
import { useState } from "react";
import { Button, Spin, message } from "antd";
import Trigger from "@/components/Trigger";
import List from "@/components/List";
import { post } from "@/utils/request";
import axios from "axios";

const chunkSize = 1024 * 1024;

const InstantUpload = () => {
  const [fileList, setFileList] = useState([]);
  const [ing, setIng] = useState(false);

  const onChange = (files) => {
    const list = Array.from(files).map((file) => ({
      file,
      progress: 0,
      controller: new AbortController(),
      hash: { value: "", progress: 0 },
    }));

    // 计算 hash
    list.map((file) => {
      const worker = new Worker("/hash.js");
      const chunkNum = Math.ceil(file.file.size / chunkSize);
      const chunkList = [];
      for (let i = 0; i < chunkNum; i++) {
        const chunkStart = i * chunkSize;
        const chunkEnd = Math.min(chunkStart + chunkSize, file.file.size);
        chunkList.push(file.file.slice(chunkStart, chunkEnd));
      }
      worker.postMessage({ chunkList });
      worker.onmessage = function ({ data: { value, progress } }) {
        file.hash.value = value;
        file.hash.progress = progress;
        setFileList((l) => [...l]);
      };
    });
    setFileList([...list]);
  };

  const submit = async () => {
    if (fileList.some(({ hash }) => !hash.value)) return message.loading("请等待hash计算完成");
    fileList.forEach(async (file, index) => {
      const chunkNum = Math.ceil(file.file.size / chunkSize);
      // 是否已经上传
      let {
        data: { uploaded, chunkIndex },
      } = await axios({
        url: "/api/chunk-index",
        params: {
          hash: file.hash.value,
          fileName: file.file.name,
          chunkNum,
        },
      });

      if (Number(chunkIndex) === chunkNum - 1) {
        file.progress = 100;
        setFileList([...fileList]);
        return message.success("秒传成功");
      }
      if (!uploaded) chunkIndex = 0;

      file.progress = Math.floor((chunkIndex / chunkNum) * 100);
      onResume(file.file, file.progress, file.controller, file.hash, index);
    });
  };

  const onRemove = (index) => {
    fileList.splice(index, 1);
    setFileList([...fileList]);
  };

  // 暂停
  const onStop = (index) => {
    setFileList([...fileList]);
  };

  // 继续
  const onResume = async (file, progress, controller, hash, index) => {
    if (hash.value === "") return message.loading("请等待hash计算完成");
    const chunkNum = Math.ceil(file.size / chunkSize);

    // 获取传到哪个分片
    let {
      data: { uploaded, chunkIndex },
    } = await axios({
      url: "/api/chunk-index",
      params: {
        hash: hash.value,
        fileName: file.name,
        chunkNum,
      },
    });

    if (!uploaded) chunkIndex = 0;

    file = {
      file,
      progress: progress,
      controller: new AbortController(),
      hash,
    };
    file.controller = new AbortController();
    fileList[index] = file;
    setFileList([...fileList]);

    for (let i = chunkIndex; i < chunkNum; i++) {
      const chunkStart = i * chunkSize;
      const chunkEnd = Math.min(chunkStart + chunkSize, file.file.size);
      const fileChunk = file.file.slice(chunkStart, chunkEnd);

      const formData = new FormData();
      formData.append("file", fileChunk);
      formData.append("chunkIndex", i);
      formData.append("chunkNum", chunkNum);
      formData.append("fileName", file.file.name.split(".")[0]);
      formData.append("fileExt", file.file.name.split(".")[1] || "");
      formData.append("contentHash", file.hash.value);

      post("/api/instant-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal: file.controller.signal,
        onUploadProgress: (event) => {
          if (event.progress === 1) {
            file.progress = (file.progress + (1 / chunkNum) * 100);
            setFileList((list) => [...list]);
          }
        },
      }).finally(() => setIng(false)); // 全部请求执行后回调，不止此请求
    }
  };
  return (
    <div>
      <Trigger onChange={onChange} multiple={true}>
        select
      </Trigger>
      <List fileList={fileList} onRemove={onRemove} onStop={onStop} onResume={onResume} hashProgress={true} />
      {fileList.length > 0 ? <Button color="green" type="primary" onClick={submit} children="submit" /> : ""}
    </div>
  );
};
export default InstantUpload;

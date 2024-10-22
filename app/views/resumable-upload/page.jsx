"use client";
import { useState } from "react";
import { Button, Spin, message } from "antd";
import Trigger from "@/components/Trigger";
import List from "@/components/List";
import { post } from "@/utils/request";
import axios from "axios";

const chunkSize = 1024 * 1024;

const ResumableUpload = () => {
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
    if (ing) return;
    setIng(true);
    fileList.forEach((file, index) => {
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
    if (ing) return;
    setIng(true);
    // 获取传到哪个分片
    let {
      data: { uploaded, chunkIndex },
    } = await axios(`/api/chunk-index?hash=${hash.value}`);

    if (!uploaded) chunkIndex = 0;

    file = {
      file,
      progress,
      controller: new AbortController(),
      hash,
    };
    file.controller = new AbortController();
    fileList[index] = file;
    setFileList([...fileList]);

    const chunkNum = Math.ceil(file.file.size / chunkSize);
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

      post("/api/resumable-upload", formData, {
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
      <Spin spinning={ing} className="m-loading" />

      <Trigger onChange={onChange} multiple={true}>
        select
      </Trigger>
      <List fileList={fileList} onRemove={onRemove} onStop={onStop} onResume={onResume} />
      {fileList.length > 0 ? <Button color="green" type="primary" onClick={submit} children="submit" /> : ""}
    </div>
  );
};
export default ResumableUpload;

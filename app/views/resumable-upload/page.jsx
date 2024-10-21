"use client";
import { useState } from "react";
import { Button } from "antd";
import Trigger from "@/components/Trigger";
import List from "@/components/List";
import { post } from "@/utils/request";

const chunkSize = 1024 * 1024;

const ResumableUpload = () => {
  const [fileList, setFileList] = useState([]);

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
        setFileList([...list]);
      };
    });
    setFileList([...list]);
  };

  const submit = () => {
    console.log(fileList);
    for (const file of fileList) {
      // 分片
      const chunkNum = Math.ceil(file.file.size / chunkSize);
      const part = Math.round((1 / chunkNum) * 100);
      for (let i = 0; i < chunkNum; i++) {
        const chunkStart = i * chunkSize;
        const chunkEnd = Math.min(chunkStart + chunkSize, file.file.size);
        const fileChunk = file.file.slice(chunkStart, chunkEnd);

        const formData = new FormData();
        formData.append("file", fileChunk);
        formData.append("chunkIndex", i);
        formData.append("chunkNum", chunkNum);
        formData.append("fileName", file.file.name.split(".")[0]);
        formData.append("fileExt", file.file.name.split(".")[1] || "");
        formData.append("contentHash", file.file.hash.value);

        post("/api/chunk-upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          signal: file.controller.signal,
          onUploadProgress: (event) => {
            file.progress = part * i + Math.round(part * event.progress * 100);
            setFileList([...fileList]);
          },
        });
      }
    }
  };
  const onRemove = (index) => {
    fileList.splice(index, 1);
    setFileList([...fileList]);
  };
  const onCancel = (index) => {
    setFileList([...fileList]);
    //
  };
  return (
    <div>
      <Trigger onChange={onChange} multiple={true}>
        select
      </Trigger>
      <List fileList={fileList} onRemove={onRemove} onCancel={onCancel} hashProgress={true} />
      {fileList.length > 0 ? <Button color="green" type="primary" onClick={submit} children="submit" /> : ""}
    </div>
  );
};
export default ResumableUpload;

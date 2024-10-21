"use client";
import { startTransition, useState } from "react";
import { Button } from "antd";
import Trigger from "@/components/Trigger";
import List from "@/components/List";
import { post } from "@/utils/request";

const chunkSize = 1024 * 1024;

const ChunkUpload = () => {
  console.clear();
  const [fileList, setFileList] = useState([]); // { file: File, progress: number, controller: AbortController }[]

  const onChange = (files) => {
    setFileList(Array.from(files).map((file) => ({ file, progress: 0, controller: new AbortController() })));
  };
  const submit = () => {
    console.log(fileList);
    for (const file of fileList) {
      // 分片
      const chunkNum = Math.ceil(file.file.size / chunkSize);
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

        post("/api/chunk-upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          signal: file.controller.signal,
          onUploadProgress: (event) => {
            if (event.progress === 1) {
              file.progress += Math.ceil((1 / chunkNum) * 100);
              setFileList([...fileList]);
            }
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
      <List fileList={fileList} onRemove={onRemove} onCancel={onCancel} />
      {fileList.length > 0 ? <Button color="green" type="primary" onClick={submit} children="submit" /> : ""}
    </div>
  );
};
export default ChunkUpload;

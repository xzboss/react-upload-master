"use client";
import { useState } from "react";
import { Button } from "antd";
import Trigger from "@/components/Trigger";
import List from "@/components/List";
import axios from "axios";

const SingleUpload = () => {
  const [fileList, setFileList] = useState([]); // { file: File, progress: number, controller: AbortController }[]

  const onChange = (files) => {
    setFileList(Array.from(files).map((file) => ({ file, progress: 0, controller: new AbortController() })));
  };
  const submit = () => {
    const formData = new FormData();
    formData.append("file", fileList[0].file);

    axios.post("/api/single-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      signal: fileList[0].controller.signal,
      onUploadProgress: (event) => {
        fileList[0].progress = (event.progress * 100) >> 0;
        setFileList([...fileList]);
      },
    });
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
      <Trigger onChange={onChange}>select</Trigger>
      <List fileList={fileList} onRemove={onRemove} onCancel={onCancel} />
      {fileList.length > 0 ? <Button color="green" type="primary" onClick={submit} children="submit" /> : ""}
    </div>
  );
};
export default SingleUpload;

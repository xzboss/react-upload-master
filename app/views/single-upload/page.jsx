"use client";
import { useState } from "react";
import { Button } from "antd";
import Trigger from "@/components/Trigger";
import List from "@/components/List";
import axios from "axios";

const SingleUpload = () => {
  const [fileList, setFileList] = useState([]);
  const [ing, setIng] = useState(false);

  const onChange = (files) => {
    setFileList(
      Array.from(files).map((file) => ({
        file,
        progress: 0,
        controller: new AbortController(),
      }))
    );
  };
  const submit = async () => {
    if (ing) return;
    setIng(true);

    const formData = new FormData();
    formData.append("file", fileList[0].file);

    axios
      .post("/api/single-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal: fileList[0].controller.signal,
        onUploadProgress: (event) => {
          fileList[0].progress = (event.progress * 100) >> 0;
          setFileList([...fileList]);
        },
      })
      .finally(() => {
        setIng(false);
      });
  };
  const onRemove = (index) => {
    fileList.splice(index, 1);
    setFileList([...fileList]);
  };
  return (
    <div>
      <Trigger onChange={onChange}>select</Trigger>
      <List fileList={fileList} onRemove={onRemove} />
      {fileList.length > 0 ? <Button color="green" type="primary" onClick={submit} children="submit" /> : ""}
    </div>
  );
};
export default SingleUpload;

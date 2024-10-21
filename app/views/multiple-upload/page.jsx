"use client";
import { useState } from "react";
import { Button, Spin } from "antd";
import Trigger from "@/components/Trigger";
import List from "@/components/List";
import { post } from "@/utils/request";

const MultipleUpload = () => {
  const [fileList, setFileList] = useState([]);
  const [ing, setIng] = useState(false);

  const onChange = (files) => {
    setFileList(Array.from(files).map((file) => ({ file, progress: 0, controller: new AbortController() })));
  };
  const submit = () => {
    if (ing) return;
    setIng(true);
    for (const file of fileList) {
      const formData = new FormData();
      formData.append("file", file.file);

      post("/api/multiple-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal: file.controller.signal,
        onUploadProgress: (event) => {
          file.progress = (event.progress * 100) >> 0;
          setFileList([...fileList]);
        },
      }).finally(() => setIng(false));
    }
  };
  const onRemove = (index) => {
    fileList.splice(index, 1);
    setFileList([...fileList]);
  };
  return (
    <div>
      <Spin spinning={ing} className="m-loading" />
      <Trigger onChange={onChange} multiple={true}>
        select
      </Trigger>
      <List fileList={fileList} onRemove={onRemove} />
      {fileList.length > 0 ? <Button color="green" type="primary" onClick={submit} children="submit" /> : ""}
    </div>
  );
};
export default MultipleUpload;

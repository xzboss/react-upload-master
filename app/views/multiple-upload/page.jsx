"use client";
import { useState } from "react";
import { Button } from "antd";
import Trigger from "@/components/Trigger";
import List from "@/components/List";
import { post } from "@/utils/request";

const MultipleUpload = () => {
  const [fileList, setFileList] = useState([]); // { file: File, progress: number, controller: AbortController }[]

  const onChange = (files) => {
    setFileList(Array.from(files).map((file) => ({ file, progress: 0, controller: new AbortController() })));
  };
  const submit = () => {
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
      });
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
export default MultipleUpload;

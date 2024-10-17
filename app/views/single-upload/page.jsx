"use client";
import { useState } from "react";
import { Button } from "antd";
import Trigger from "@/components/Trigger";
import List from "@/components/List";
import axios from "axios";

const SingleUpload = () => {
  const [fileList, setFileList] = useState([]);
  const onChange = (files) => {
    setFileList(Array.from(files));
  };
  const submit = () => {
    const formData = new FormData();
    formData.append("file", fileList[0]);
    axios.post("/api/single-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };
  const onRemove = (index) => {
    setFileList(fileList.splice(index, 1));
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

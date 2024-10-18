"use client";
import { useState } from "react";
import { Input, Button } from "antd";
import { generateFile } from "@/utils";

export default function RootLayout({ children }) {
  const [size, setSize] = useState();
  return (
    <div>
      <div style={{ width: 300, display: "flex", gap: 10, alignItems: "center" }}>
        <Input value={size} onInput={(e) => setSize(e.target.value)} placeholder="size <= 1000KB" />
        KB
        <Button type="primary" onClick={() => generateFile(size)}>
          Generated File
        </Button>
      </div>
      <br />
      <div>{children}</div>
    </div>
  );
}

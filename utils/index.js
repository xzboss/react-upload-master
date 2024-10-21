import dayjs from "dayjs";

// 生成简单文件
export const generateFile = (size) => {
  size = Number(size);
  if (size <= 0 || typeof size !== "number") return;
  if (size > 1000) {
    return alert("size <= 1000");
  }
  const sizeByte = size * 1024;
  const blob = new Blob(new Uint8Array(sizeByte), { type: "multipart/form-data" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `test-${dayjs(new Date()).format("MM-DD-HH-mm-ss")}-${size}KB.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
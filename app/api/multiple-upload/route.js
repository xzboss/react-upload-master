import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const formData = await req.formData(); // {Symbol(): [{ name: '前端命名', value: File }]}
  const file = formData.get("file");

  if (!file) return NextResponse.json({ error: "你没有上传任何东西" });

  try {
    // 定义暂存路径
    const uploadDir = path.join(process.cwd(), "/uploadCache");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    const filePath = path.join(uploadDir, file.name);
    const reader = file.stream().getReader();
    const writer = fs.createWriteStream(filePath);

    const pump = async () => {
      const { done, value } = await reader.read();
      if (done) {
        writer.end();
        return console.log(`写入${file.name} 成功`);
      }
      writer.write(value);
      pump();
    };
    pump();
    return NextResponse.json({ error: "上传成功" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "500" });
  }
}

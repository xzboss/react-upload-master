import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  console.clear();
  const formData = await req.formData();
  const file = formData.get("file");
  const chunkIndex = formData.get("chunkIndex");
  const chunkNum = formData.get("chunkNum");
  const fileName = formData.get("fileName");
  const fileExt = formData.get("fileExt");

  if (!file) return NextResponse.json({ error: "你没有上传任何东西" });

  try {
    // 定义暂存路径
    const uploadDir = path.join(
      process.cwd(),
      `/uploadCache/${fileName}-total${chunkNum}`
    );
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    const filePath = path.join(uploadDir, `chunk-${chunkIndex}`);
    const reader = file.stream().getReader();
    const writer = fs.createWriteStream(filePath);

    const pump = async () => {
      const { done, value } = await reader.read();
      if (done) {
        writer.end();
        return console.log(`写入chunk-${chunkIndex} 成功`);
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

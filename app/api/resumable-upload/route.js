import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");
  const chunkIndex = formData.get("chunkIndex");
  const chunkNum = formData.get("chunkNum");
  const fileName = formData.get("fileName");
  const fileExt = formData.get("fileExt");
  const contentHash = formData.get("contentHash");

  try {
    // 定义暂存路径
    const uploadDir = path.join(process.cwd(), `/uploadCache/${contentHash}`);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    const filePath = path.join(uploadDir, `chunk-${chunkIndex}`);
    const reader = file.stream().getReader();
    const writer = fs.createWriteStream(filePath);

    // 缓存分片
    await new Promise((resolve) => {
      const pump = async () => {
        const { done, value } = await reader.read();
        if (done) {
          writer.end();
          writer.on("finish", resolve);
          return console.log(`写入chunk-${chunkIndex} 成功`);
        }
        writer.write(value);
        pump();
      };
      pump();
    });

    // 合并
    if (Number(chunkIndex) === chunkNum - 1) {
      mergeFs(
        uploadDir,
        path.join(process.cwd(), `/uploadCache/${fileName}-${contentHash}.${fileExt}`),
        chunkNum,
        `${fileName}-${contentHash}.${fileExt}`
      );
    }

    return NextResponse.json({ error: "上传成功" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "500" });
  }
}

/**
 * @description 合并
 * @param {文件目录} fileDir
 * @param {文件路径} filePath
 * @param {分片数量} chunkNum
 * @param {文件名} fileName
 * @returns
 */
async function mergeFs(fileDir, filePath, chunkNum, fileName) {
  const writeStream = fs.createWriteStream(filePath);
  await new Promise((resolve, _) => {
    for (let i = 0; i < chunkNum; i++) {
      const chunkPath = path.join(fileDir, `chunk-${i}`);
      const data = fs.readFileSync(chunkPath);
      writeStream.write(data);
      fs.unlinkSync(chunkPath);
    }
    writeStream.end();
    writeStream.on("finish", resolve);
  });

  fs.rmdirSync(fileDir);
  return console.log(`合并${fileName} 成功`);
}

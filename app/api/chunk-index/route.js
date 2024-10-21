import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const hash = searchParams.get("hash");
    const fileName = searchParams.get("fileName");
    const chunkNum = searchParams.get("chunkNum");

    const uploadDir = path.join(process.cwd(), `/uploadCache/${hash}`);
    const filePath = path.join(process.cwd(), `/uploadCache/${fileName.split(".")[0]}-${hash}.${fileName.split(".")[1]}`);
    console.log(filePath, fs.existsSync(filePath), "&&&");

    if (!fs.existsSync(uploadDir)) {
      // 文件存在
      if (fs.existsSync(filePath)) {
        return NextResponse.json({ uploaded: true, chunkIndex: chunkNum - 1 });
      } else {
        return NextResponse.json({ uploaded: false });
      }
    }
    // 未传完
    const chunks = fs.readdirSync(uploadDir);

    return NextResponse.json({ uploaded: true, chunkIndex: chunks.length - 1 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "500" });
  }
}

import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const hash = searchParams.get("hash");

    const uploadDir = path.join(process.cwd(), `/uploadCache/${hash}`);


    if (!fs.existsSync(uploadDir)) return NextResponse.json({ uploaded: false });
    console.log(uploadDir)

    const chunks = fs.readdirSync(uploadDir);

    return NextResponse.json({ uploaded: true, chunkIndex: chunks.length - 1 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "500" });
  }
}

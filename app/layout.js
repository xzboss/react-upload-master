import Link from "next/link";
import { Menu, Flex, Input } from "antd";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "文件上传",
  description: "续传、秒传、大文件上传、进度、取消、删除、暂停、恢复、多文件上传、控制并发",
};

export default function RootLayout({ children }) {
  const items = [
    { key: "1", label: <Link href="/views/single-upload">单（小）文件上传</Link> },
    { key: "2", label: <Link href="/views/multiple-upload">多（小）文件上传</Link> },
    { key: "3", label: <Link href="/views/chunk-upload">大文件上传分片</Link> },
    { key: "4", label: <Link href="/views/resumable-upload">续传</Link> },
    { key: "5", label: <Link href="/views/instant-upload">秒传</Link> },
  ];
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Flex>
          <Menu style={{ width: 256 }} mode="inline" items={items} />
          <div style={{ padding: "20px" }}>{children}</div>
        </Flex>
      </body>
    </html>
  );
}

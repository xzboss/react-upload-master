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
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  const items = [
    { key: "1", label: "", icon: <Link href="/views/single-upload">single</Link> },
    { key: "2", label: "", icon: <Link href="/views/multiple-upload">multiple</Link> },
    { key: "3", label: "", icon: <Link href="/views/single-upload">single</Link> },
    { key: "4", label: "", icon: <Link href="/views/single-upload">single</Link> },
    { key: "5", label: "", icon: <Link href="/views/single-upload">single</Link> },
    { key: "6", label: "", icon: <Link href="/views/single-upload">single</Link> },
    { key: "7", label: "", icon: <Link href="/views/single-upload">single</Link> },
  ];
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Flex>
          <Menu
            style={{ width: 256 }}
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            items={items}
          />
          <div style={{ padding: "20px" }}>{children}</div>
        </Flex>
      </body>
    </html>
  );
}

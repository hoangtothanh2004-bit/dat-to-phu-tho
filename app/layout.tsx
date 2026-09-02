import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const bodyFont = localFont({
  variable: "--font-body",
  display: "swap",
  src: [
    { path: "./fonts/BeVietnamPro-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/BeVietnamPro-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/BeVietnamPro-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/BeVietnamPro-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/BeVietnamPro-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
});

const displayFont = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "./fonts/Lora-Variable.ttf", weight: "400 700", style: "normal" },
    { path: "./fonts/Lora-Italic-Variable.ttf", weight: "400 700", style: "italic" },
  ],
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const title = "Đất Tổ — Trợ lý du lịch Phú Thọ";
const description =
  "Khám phá điểm đến, món ngon, chỗ nghỉ và tạo lịch trình thông minh cho chuyến đi Phú Thọ.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  icons: {
    icon: `${basePath}/favicon.svg`,
    shortcut: `${basePath}/favicon.svg`,
  },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "vi_VN",
    images: [
      {
        url: `${basePath}/og.png`,
        width: 1792,
        height: 934,
        alt: "Đất Tổ — Trợ lý du lịch Phú Thọ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${basePath}/og.png`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <head>
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/sf-pro-display" />
      </head>
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>{children}</body>
    </html>
  );
}

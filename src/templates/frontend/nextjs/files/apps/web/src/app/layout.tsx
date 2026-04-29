import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: '{{projectName}}',
  description: '由 YM CLI 生成的鹰脉团队 Next.js 应用',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

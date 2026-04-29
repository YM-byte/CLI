import type { PropsWithChildren } from 'react';
import { ConfigProvider, Layout, Typography } from 'antd';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 24,
          colorPrimary: '#0f766e',
          colorTextBase: '#0f172a',
          fontFamily: '"Avenir Next", "Segoe UI", "PingFang SC", sans-serif',
        },
      }}
    >
      <Layout className="app-shell">
        <header className="app-shell__header">
          <Typography.Text className="app-shell__eyebrow">YM CLI / React 标准模板</Typography.Text>
          <Typography.Title level={2} className="app-shell__title">
            {{projectName}}
          </Typography.Title>
        </header>
        <main className="app-shell__body">{children}</main>
      </Layout>
    </ConfigProvider>
  );
}

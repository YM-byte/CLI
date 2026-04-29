import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, List, Row, Skeleton, Space, Tag, Typography } from 'antd';

import { fetchDashboardSummary } from '../features/dashboard/data';

export function DashboardPage() {
  const summaryQuery = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: fetchDashboardSummary,
  });

  if (summaryQuery.isPending) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }

  const summary = summaryQuery.data;

  if (!summary) {
    return <Typography.Text>未能加载项目摘要。</Typography.Text>;
  }

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <Card className="hero-card">
        <Tag color="cyan">推荐搭配</Tag>
        <Typography.Title level={3} style={{ marginTop: 16 }}>
          这套模板适合后台、运营平台和纯 SPA 场景。
        </Typography.Title>
        <Typography.Paragraph className="hero-card__desc">
          当前模板已经预置 React Router、TanStack Query 和 Ant Design。你可以直接在此基础上补业务模块，
          保持页面结构、数据请求和组件层次都更清晰。
        </Typography.Paragraph>
        <Space wrap>
          <Button href="http://localhost:3001/api/health" target="_blank" type="primary">
            打开后端健康检查
          </Button>
          <Button href="https://vite.dev/guide/" target="_blank">
            查看 Vite 文档
          </Button>
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        {summary.metrics.map((metric) => (
          <Col key={metric.label} span={24} md={8}>
            <Card className="metric-card">
              <Typography.Text className="metric-card__label">{metric.label}</Typography.Text>
              <Typography.Title level={4}>{metric.value}</Typography.Title>
              <Typography.Paragraph className="metric-card__desc">
                {metric.description}
              </Typography.Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      <Card>
        <Typography.Title level={4}>建议的下一步</Typography.Title>
        <List
          dataSource={summary.milestones}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text>{item}</Typography.Text>
            </List.Item>
          )}
        />
      </Card>
    </Space>
  );
}

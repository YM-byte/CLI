# YM CLI

`YM CLI` 是鹰脉团队内部使用的项目脚手架，用于统一创建标准化的 `pnpm Monorepo` 工程，收敛前后端技术栈、目录结构、基础文档、代码规范和工程基础设施。

## 当前进度

当前仓库已完成：

- `ym create <project-name>` 命令入口
- 参数解析与交互补齐
- `base` 骨架模板生成
- `docker / ci / e2e` 最小 addon 生成
- 3 套前端模板接入：
  - `nextjs`
  - `react-vite`
  - `vue3-vite`
- 3 套后端模板接入：
  - `nestjs`
  - `fastify`
  - `springboot`

## 真实验证状态

已经做过真实项目级冒烟验证的组合：

- `nextjs + nestjs`
- `react-vite + fastify`
- `vue3-vite + fastify`

说明：

- `springboot` 模板已经支持完整工程生成。
- 当前机器缺少 `mvn`，且本机 Java 版本不是模板目标的 `Java 21`，所以 Spring Boot 还没有做本机真实构建验证。

## 本地开发

```bash
pnpm install
pnpm dev
pnpm test
pnpm build
```

## 示例

```bash
pnpm dev create demo-app --mode fullstack --frontend nextjs --backend nestjs --yes --install false
```

```bash
pnpm dev create admin-app --mode fullstack --frontend react-vite --backend fastify --yes --install false
```

```bash
pnpm dev create order-service --mode backend --backend springboot --yes --install false
```

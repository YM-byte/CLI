# YM CLI

`YM CLI` 是鹰脉团队内部使用的项目脚手架，用于统一创建标准化的 `pnpm Monorepo` 工程，收敛前后端技术栈、目录结构、基础文档、代码规范和工程基础设施。

## 安装与使用

### 方式一：临时执行

适合偶尔创建项目，使用后不保留全局安装。

```bash
pnpm dlx @ymbyte/create-app create demo-app
```

也可以使用：

```bash
npx @ymbyte/create-app create demo-app
```

### 方式二：全局安装

适合团队内频繁创建项目。安装完成后，直接使用 `ym` 命令即可。

```bash
npm i -g @ymbyte/create-app
ym create demo-app
```

### 常见示例

创建 `Next.js + NestJS` 全栈项目：

```bash
ym create demo-app --mode fullstack --frontend nextjs --backend nestjs --yes
```

创建 `React + Fastify` 全栈项目：

```bash
ym create admin-app --mode fullstack --frontend react-vite --backend fastify --yes
```

创建 `Spring Boot` 后端项目：

```bash
ym create order-service --mode backend --backend springboot --yes
```

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

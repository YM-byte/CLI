# YM CLI 沟通与决策纪要

> 日期：2026-04-29
> 主题：鹰脉团队内部 Monorepo 脚手架 `YM CLI` 的需求收敛、架构设计、实施落地与发布准备

## 1. 目标背景

本次沟通的起点，是希望新建一个类似 `create-vue`、`create-react-app` 的团队内部 CLI。

核心目标包括：

- 支持前后端技术栈选择
- 支持测试工具接入与代码规范能力
- 默认生成合理的 Monorepo 目录结构
- 默认生成常用 Markdown 文档与工程基础设施
- 最终可提交到 Git，并发布到 npm 私有仓库

## 2. 需求收敛过程

### 2.1 产品定位

最初首先确认 CLI 的定位。

最终结论：

- 定位为“团队内部统一项目模板工具”
- 不做面向外部公开生态的高度插件化平台

这样做的原因：

- 更有利于统一团队规范
- 更容易控制模板质量
- 维护成本更低

这体现了：

- `KISS`：优先做团队内部稳定方案，而不是复杂通用平台
- `YAGNI`：不为未来假设的外部扩展场景提前设计

### 2.2 项目形态

随后确认生成项目的组织方式。

最终结论：

- 默认采用 `Monorepo`
- 同时支持：
  - `fullstack`
  - `frontend`
  - `backend`

即使选择“仅前端”或“仅后端”，也依旧基于统一 Monorepo 骨架生成。

这样做的原因：

- 保持团队目录结构一致
- 便于后续扩展共享包与统一脚本
- 降低跨项目协作成本

### 2.3 前后端技术栈选择策略

用户一开始倾向于“强约束少选项”，但又希望保留三套技术栈。

最终结论：

- 采用“前端 3 选 1、后端 3 选 1”
- 不做任意 UI 库与框架自由拼装
- 保持“官方支持模板”策略

前端最终确定为：

- `nextjs`
- `react-vite`
- `vue3-vite`

后端最终确定为：

- `nestjs`
- `fastify`
- `springboot`

这体现了：

- `KISS`：少而精，而不是自由组合爆炸
- `DRY`：模板按分层复用，不为每种组合复制全套骨架

### 2.4 质量工具与工程底座

质量策略最终确定为“默认全量接入”。

默认接入包括：

- `ESLint`
- `Prettier`
- `Husky`
- `lint-staged`
- `commitlint`
- 单元测试骨架

工程底座最终确定为：

- `pnpm`
- `Node.js + TypeScript` 实现 CLI
- 默认生成工程基础设施

工程基础设施包括：

- `Dockerfile`
- `docker-compose.yml`
- `.editorconfig`
- `.nvmrc`
- `.gitignore`
- `README.md`
- `CHANGELOG.md`
- `GitHub Actions CI`

## 3. 架构设计结论

### 3.1 方案选择

围绕 CLI 架构，评估过三种方案：

- 简单模板直拷型
- 基础骨架 + 模块化生成型
- 插件化平台型

最终采用：

- 基础骨架 + 模块化生成型

原因：

- 结构清晰
- 公共部分可复用
- 模板不会随着组合数快速失控
- 后续仍可平滑演进为轻量插件机制

### 3.2 CLI 命令边界

第一版明确只做创建能力。

主命令设计为：

```bash
ym create <project-name>
```

支持方式：

- 交互式问答
- 命令参数直出

主要参数包括：

- `--mode`
- `--frontend`
- `--backend`
- `--e2e`
- `--docker`
- `--ci`
- `--git`
- `--install`
- `--yes`

第一版明确不做：

- `generate`
- `migrate`
- `doctor`
- 插件市场

### 3.3 模板分层

模板采用四层结构：

- `base`
- `frontend`
- `backend`
- `addons`

对应职责：

- `base`：Monorepo 根骨架与团队共享规范
- `frontend`：只负责 `apps/web`
- `backend`：只负责 `apps/server`
- `addons`：CI、Docker、E2E、文档等增强能力

这样设计体现了：

- `SRP`：每层只做一件事
- `OCP`：后续新增模板只需扩展对应层
- `DRY`：公共文件只维护一份

### 3.4 目录结构

默认生成目录结构收敛为：

```text
<project>/
├── apps/
│   ├── web/
│   └── server/
├── packages/
│   ├── shared/
│   ├── config-eslint/
│   ├── config-ts/
│   └── ui/
├── docs/
├── scripts/
├── .github/workflows/
├── .husky/
├── .tooling/
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## 4. 文档与规范策略

围绕“常规 md 也好配置”的诉求，最终收敛为默认生成一套最小文档体系：

- 根级 `README.md`
- `docs/architecture.md`
- `docs/development.md`
- `docs/api.md`
- `CHANGELOG.md`

文档不是空壳，而是会注入：

- 选中的前端模板
- 选中的后端模板
- 常用启动命令
- 目录说明
- 工程约定

## 5. 实施过程摘要

### 5.1 第一阶段：CLI 最小可用链路

已完成：

- `YM CLI` 工程骨架
- `ym create` 命令入口
- 参数解析与交互式补齐
- 选项标准化与校验
- `base` 模板生成
- 最小版 `docker / ci / e2e` addon

### 5.2 第二阶段：前后端模板接入

前端模板已接入：

- `nextjs`
- `react-vite`
- `vue3-vite`

后端模板已接入：

- `nestjs`
- `fastify`
- `springboot`

其中：

- `react-vite` 模板带 `React Router + TanStack Query + Ant Design`
- `vue3-vite` 模板采用 `Vue 3 + <script setup lang="ts"> + Pinia + Vue Router + Element Plus`
- `fastify` 模板带 `zod` 环境变量校验和 `/api/health`
- `springboot` 模板带 `Spring Web + JPA + PostgreSQL` 默认工程结构

### 5.3 Java 模板的特殊处理

针对 `springboot` 模板，额外实现了：

- Java 包名上下文计算
- Java 包路径动态渲染
- Java 启动类名动态渲染

从而可直接生成类似：

```text
apps/server/src/main/java/com/ym/<project>/...
```

## 6. 验证记录

### 6.1 CLI 本体验证

已通过：

- `pnpm install`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build`

### 6.2 真实项目级冒烟

已真实验证通过的组合：

- `nextjs + nestjs`
- `react-vite + fastify`
- `vue3-vite + fastify`

### 6.3 Spring Boot 当前状态

当前已完成：

- `springboot` 模板完整工程生成
- `pom.xml`
- `application.yml`
- Java 包结构与测试骨架

当前尚未完成：

- 本机真实 Maven 构建验证

原因：

- 当前环境缺少 `mvn`
- 当前机器 Java 版本不是模板目标的 `Java 21`

## 7. Git 与 npm 准备阶段

在准备提交与发布时，又确认了几个关键事实：

- 包名确定为 `@ymbyte/create-app`
- CLI 命令名为 `ym`
- npm 默认 registry 指向：

```text
http://10.168.2.110:31001/repository/ym-group/
```

同时发现两个发布前阻塞项：

1. `package.json` 中存在 `"private": true`
2. `bin` 指向 `dist/bin/index.js`，但实际构建产物为 `dist/index.js`

随后进行了最小修复：

- 移除 `private`
- 将 `bin.ym` 修正为 `dist/index.js`
- 增加 `publishConfig.registry`

这一步属于典型的发布前收口，避免“能本地开发但发布后不可用”的问题。

## 8. 提交与 PR 建议

本次沟通过程中，也整理了建议的提交与 PR 说明。

建议 commit 标题：

```text
feat(cli): scaffold YM monorepo templates and project generator
```

建议 PR 标题：

```text
feat: add YM CLI project generator and official monorepo templates
```

## 9. 设计原则回顾

整个过程里，设计和实现都持续围绕以下原则推进：

### KISS

- 第一版只做 `create`
- 不做插件市场、升级器、代码生成器
- 发布前只修最必要配置，不做额外包装

### YAGNI

- 不提前做模板升级能力
- 不做自由 UI 库拼装
- 不做过度复杂的组合开关

### SOLID

- `commands`、`prompts`、`core`、`render`、`templates` 各司其职
- 前后端模板彼此隔离，便于扩展
- 校验逻辑集中在 `validator`

### DRY

- 公共骨架抽到 `base`
- 文档、CI、Docker 作为 addon 复用
- 共享配置下沉到 `packages/config-eslint` 与 `packages/config-ts`

## 10. 当前结论

到本轮整理时，`YM CLI` 已具备：

- 团队内部 Monorepo 初始化能力
- 官方前端三套模板
- 官方后端三套模板
- 默认测试、规范、文档、CI、Docker 基础设施
- Git 提交准备能力
- npm 私服发布准备能力

后续如果继续推进，最自然的下一步包括：

- 为 `springboot` 模板补 `mvnw / .mvn/wrapper`
- 补更完整的组合级测试矩阵
- 增加版本升级与迁移策略

## 12. 发布目标调整补记

在后续提交流程中，发布目标从“内部 npm 私服”调整为：

- Git 仓库：`https://github.com/YM-byte/CLI`
- npm 平台：公网 `https://registry.npmjs.org/`

因此发布配置也同步调整为：

- `repository` 指向 GitHub 仓库
- `publishConfig.registry` 指向公网 npm
- `publishConfig.access` 设为 `public`

同时确认到一个现实前提：

- 当前机器尚未登录公网 npm

这意味着代码推送到 GitHub 可以继续完成，但公网 npm 发布仍依赖先完成一次 `npm login` 或配置可用的 npm Token。

## 11. 附：关键产物索引

- 设计文档：`docs/superpowers/specs/2026-04-29-ym-cli-design.md`
- 实施计划：`docs/superpowers/plans/2026-04-29-ym-cli-implementation-plan.md`
- 本文档：`docs/superpowers/records/2026-04-29-ym-cli-communication-record.md`

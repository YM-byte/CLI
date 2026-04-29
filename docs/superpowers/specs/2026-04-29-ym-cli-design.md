# YM CLI 设计文档

## 1. 项目概述

`YM CLI` 是一个面向鹰脉团队内部的项目脚手架，用于快速创建统一规范的 `pnpm Monorepo` 工程。

它的目标不是做一个开放式模板市场，而是提供一套收敛、稳定、低维护成本的官方模板体系，让团队在创建新项目时可以：

- 选择前端技术栈
- 选择后端技术栈
- 选择创建模式（全栈 / 仅前端 / 仅后端）
- 默认接入代码规范、测试、文档、CI、容器化基础设施

## 2. 设计目标

### 2.1 核心目标

1. 用一条命令创建可直接开发的团队标准工程。
2. 将工程规范、目录结构、脚本命令、文档模板统一固化。
3. 在保留选择空间的前提下，严格限制模板复杂度。
4. 让交互式创建和命令式创建共享同一套配置解析与生成逻辑。

### 2.2 非目标

第一版不做以下能力：

1. 不做二级代码生成，如 `generate module/page/controller`。
2. 不做项目原地升级或迁移，如 `migrate`、`doctor`。
3. 不做开放式插件市场。
4. 不支持任意 UI 库、状态库、测试库的自由拼装。
5. 不支持除 `pnpm workspace` 外的工程底座。

## 3. 已确认的产品约束

### 3.1 使用场景

- 面向团队内部使用
- 默认采用 `Monorepo`
- 支持三种创建模式：
  - `fullstack`
  - `frontend`
  - `backend`

### 3.2 前端官方模板

1. `nextjs`
   - 技术栈：`Next.js + TypeScript + Tailwind CSS + shadcn/ui`
   - 适用场景：官网、内容站、SSR、SEO、偏全栈项目

2. `react-vite`
   - 技术栈：`React + Vite + TypeScript + React Router + TanStack Query + Ant Design`
   - 适用场景：后台管理系统、企业内部平台、纯 SPA

3. `vue3-vite`
   - 技术栈：`Vue 3 + Vite + TypeScript + Pinia + Vue Router + Element Plus`
   - 适用场景：Vue 团队、中后台场景

### 3.3 后端官方模板

1. `nestjs`
   - 技术栈：`NestJS + TypeScript + Prisma + PostgreSQL`

2. `fastify`
   - 技术栈：`Fastify + TypeScript + Zod + Prisma + PostgreSQL`

3. `springboot`
   - 技术栈：`Spring Boot + Java + JPA + PostgreSQL`

说明：Spring Boot 模板第一版默认固定 `JPA`，不再提供 `JPA / MyBatis` 二选一，以控制模板复杂度。

### 3.4 工程与质量策略

- 包管理器统一为 `pnpm`
- CLI 本体使用 `Node.js + TypeScript`
- 默认接入：
  - `ESLint`
  - `Prettier`
  - `Husky`
  - `lint-staged`
  - `commitlint`
  - 单元测试
- `E2E` 测试保留显式开关
- 默认生成工程基础设施：
  - `Dockerfile`
  - `docker-compose`
  - `.editorconfig`
  - `.nvmrc`
  - `.gitignore`
  - `README.md`
  - `CHANGELOG.md`
  - `CI` 配置

## 4. 命名与分发约定

### 4.1 命名

- 产品名称：`鹰脉 CLI`
- 英文标识：`YM CLI`
- npm scope：`@ymbyte`
- npm 包名：`@ymbyte/create-app`
- 可执行命令：`ym`

### 4.2 分发方式

第一版默认分发到团队内部包仓库；若未指定其他平台，默认采用 `GitHub Packages`。

推荐使用方式：

```bash
pnpm dlx @ymbyte/create-app create demo-app
```

## 5. CLI 命令设计

### 5.1 第一版命令范围

第一版只提供一个主命令：

```bash
ym create <project-name>
```

### 5.2 支持的参数

- `--mode <fullstack|frontend|backend>`
- `--frontend <nextjs|react-vite|vue3-vite>`
- `--backend <nestjs|fastify|springboot>`
- `--e2e <true|false>`
- `--docker <true|false>`
- `--ci <true|false>`
- `--package-manager <pnpm>`
- `--git <true|false>`
- `--install <true|false>`
- `--yes`

### 5.3 使用模式

#### 交互式

```bash
ym create demo-app
```

#### 参数式

```bash
ym create demo-app \
  --mode fullstack \
  --frontend nextjs \
  --backend nestjs \
  --e2e true \
  --git true \
  --install true
```

### 5.4 交互流程

1. 采集项目基本信息
   - 项目名
   - 创建模式
   - 是否初始化 Git
   - 是否自动安装依赖
2. 采集技术栈
   - `fullstack`：选择前端 + 后端
   - `frontend`：只选前端
   - `backend`：只选后端
3. 采集增强项
   - 是否启用 `E2E`
   - 是否生成 `Docker`
   - 是否生成 `CI`
4. 输出配置确认摘要并执行生成

## 6. 工程生成范围

### 6.1 根目录结构

无论选择全栈、仅前端还是仅后端，统一生成以下 Monorepo 骨架：

```text
<project-name>/
├── apps/
│   ├── web/
│   └── server/
├── packages/
│   ├── shared/
│   ├── config-eslint/
│   ├── config-ts/
│   └── ui/
├── docs/
│   ├── architecture.md
│   ├── development.md
│   └── api.md
├── scripts/
│   ├── setup/
│   └── release/
├── .github/workflows/
├── .husky/
├── .tooling/
│   └── create-meta.json
├── .env.example
├── .editorconfig
├── .gitignore
├── .nvmrc
├── CHANGELOG.md
├── README.md
├── commitlint.config.cjs
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

说明：

1. `apps/` 只存放可运行应用。
2. `packages/` 只存放共享代码与共享配置。
3. `docs/` 存放项目级文档模板。
4. `scripts/` 存放团队通用脚本。
5. 即使是仅前端或仅后端项目，也保留统一骨架，以保证团队结构一致性。

### 6.2 应用生成规则

- `mode=frontend` 时：
  - 生成 `apps/web`
  - 不生成 `apps/server` 实际应用内容
- `mode=backend` 时：
  - 生成 `apps/server`
  - 不生成 `apps/web` 实际应用内容
- `mode=fullstack` 时：
  - 同时生成 `apps/web` 与 `apps/server`

## 7. 模板组织设计

### 7.1 模板分层

模板按能力分层，不按技术栈组合存放：

```text
src/templates/
├── base/
│   ├── common/
│   ├── fullstack/
│   ├── frontend-only/
│   └── backend-only/
├── frontend/
│   ├── nextjs/
│   ├── react-vite/
│   └── vue3-vite/
├── backend/
│   ├── nestjs/
│   ├── fastify/
│   └── springboot/
└── addons/
    ├── e2e/
    ├── docker/
    ├── ci/
    └── docs/
```

### 7.2 模板元数据

每个模板目录包含：

1. `files/`：模板文件
2. `template.meta.json`：模板元数据

示例：

```json
{
  "name": "nextjs",
  "targetDir": "apps/web",
  "conditions": {
    "mode": ["fullstack", "frontend"]
  }
}
```

### 7.3 设计原则

1. `base` 负责通用骨架与团队规范。
2. `frontend` 只负责 `apps/web`。
3. `backend` 只负责 `apps/server`。
4. `addons` 只负责增强能力。
5. 避免按 `nextjs-nestjs` 这类组合复制整套模板，防止重复维护。

## 8. 组合规则

### 8.1 官方支持矩阵

CLI 允许前后端分别选择，但只维护官方支持组合：

- `nextjs + nestjs`
- `nextjs + fastify`
- `nextjs + springboot`
- `react-vite + nestjs`
- `react-vite + fastify`
- `react-vite + springboot`
- `vue3-vite + nestjs`
- `vue3-vite + fastify`
- `vue3-vite + springboot`

### 8.2 支持级别

- `recommended`
  - `nextjs + nestjs`
  - `react-vite + nestjs`
  - `vue3-vite + springboot`
- `supported`
  - 其余官方支持组合

支持级别只影响文档与提示文案，不影响第一版创建能力。

## 9. CLI 内部架构

### 9.1 目录结构

```text
cli/
├── src/
│   ├── bin/
│   │   └── index.ts
│   ├── commands/
│   │   └── create.ts
│   ├── core/
│   │   ├── types.ts
│   │   ├── context.ts
│   │   ├── options.ts
│   │   ├── validator.ts
│   │   └── generator.ts
│   ├── prompts/
│   │   └── create.ts
│   ├── templates/
│   │   ├── base/
│   │   ├── frontend/
│   │   ├── backend/
│   │   └── addons/
│   ├── render/
│   │   ├── copy.ts
│   │   ├── ejs.ts
│   │   └── merge.ts
│   ├── utils/
│   │   ├── fs.ts
│   │   ├── logger.ts
│   │   ├── execa.ts
│   │   └── path.ts
│   └── constants/
│       └── stacks.ts
├── tests/
├── package.json
├── tsconfig.json
└── README.md
```

### 9.2 模块职责

1. `commands/`
   - 注册命令
   - 调用核心流程
   - 不承载生成细节

2. `prompts/`
   - 收集交互输入
   - 不负责业务校验与文件落盘

3. `core/options.ts`
   - 合并命令参数、交互输入和默认值
   - 统一输出标准配置对象

4. `core/validator.ts`
   - 校验模式、技术栈、组合和运行选项

5. `core/generator.ts`
   - 编排生成顺序
   - 驱动模板渲染与后置动作

6. `render/`
   - 处理复制、变量替换、JSON/YAML 合并

7. `templates/`
   - 保存模板文件与模板元信息

### 9.3 核心类型

```ts
type ProjectMode = 'fullstack' | 'frontend' | 'backend';
type FrontendStack = 'nextjs' | 'react-vite' | 'vue3-vite';
type BackendStack = 'nestjs' | 'fastify' | 'springboot';

interface ProjectOptions {
  projectName: string;
  mode: ProjectMode;
  frontend?: FrontendStack;
  backend?: BackendStack;
  packageManager: 'pnpm';
  e2e: boolean;
  docker: boolean;
  ci: boolean;
  git: boolean;
  install: boolean;
}
```

## 10. 生成流程设计

### 10.1 标准流程

```text
parse
-> prompt
-> normalize
-> validate
-> generate base
-> generate app templates
-> generate addons
-> format files
-> install deps
-> init git
```

### 10.2 执行原则

1. 交互式与参数式共用一套标准化流程。
2. 第一版采用串行流程，优先保证稳定性和可调试性。
3. 所有后置动作失败时，必须清晰提示“项目已生成，但后置步骤失败”。

## 11. 默认文档策略

### 11.1 默认生成文档

1. 根目录 `README.md`
2. `docs/architecture.md`
3. `docs/development.md`
4. `docs/api.md`
5. 根目录 `CHANGELOG.md`

### 11.2 文档内容要求

#### README.md

必须包含：

- 项目简介
- 技术栈摘要
- 目录说明
- 启动方式
- 常用脚本
- 环境变量说明
- 提交流程

#### architecture.md

必须包含：

- Monorepo 结构说明
- 前后端职责边界
- 共享包职责
- 目录设计原因

#### development.md

必须包含：

- 本地开发步骤
- 依赖安装说明
- 常见问题
- 代码规范执行流程

#### api.md

必须包含：

- 服务入口
- API 文档入口说明
- 前后端联调方式
- 认证说明章节

### 11.3 文档渲染原则

所有文档都通过模板变量渲染，自动注入：

- 项目名
- 创建模式
- 前端模板
- 后端模板
- 常用命令
- 目录树
- 是否启用 `E2E / Docker / CI`

## 12. 根级脚本契约

所有生成项目统一暴露以下根脚本：

```json
{
  "scripts": {
    "dev": "...",
    "build": "...",
    "lint": "...",
    "format": "...",
    "test": "...",
    "test:e2e": "...",
    "typecheck": "..."
  }
}
```

说明：

1. 具体命令由模板注入。
2. 脚本名称必须保持统一，方便团队文档、CI 和协作约定。

## 13. 错误处理策略

错误分为四类：

1. 用户输入错误
   - 非法参数
   - 缺失必要选项
   - 不合法组合

2. 模板错误
   - 模板不存在
   - 模板冲突
   - 目标目录非空

3. 外部命令错误
   - `pnpm install` 失败
   - `git init` 失败

4. 内部程序错误
   - 未捕获异常
   - 配置渲染失败

日志级别统一为：

- `info`
- `success`
- `warn`
- `error`

## 14. 测试策略

### 14.1 单元测试

覆盖以下核心模块：

- 选项合并
- 参数校验
- 模板选择
- `package.json` 合并
- 路径处理
- 文档变量渲染

测试框架统一采用 `Vitest`，单测执行超时不超过 60 秒。

### 14.2 夹具快照测试

生成典型项目组合并对关键文件与目录做断言，优先覆盖：

1. `nextjs + nestjs`
2. `react-vite + fastify`
3. `vue3-vite + springboot`
4. `frontend-only`
5. `backend-only`

### 14.3 冒烟测试

对推荐组合执行真实验证：

1. `ym create`
2. `pnpm install`
3. `pnpm lint`
4. `pnpm typecheck`
5. `pnpm test`
6. `pnpm build`

## 15. 发布与版本策略

### 15.1 构建与发布

- 使用 `tsup` 打包 CLI
- 产出 `bin` 可执行入口
- 发布前必须通过：
  - `lint`
  - `test`
  - `build`

### 15.2 版本策略

CLI 本体遵循 `SemVer`：

- `major`：模板结构或默认规范存在不兼容变更
- `minor`：新增模板能力或增强选项
- `patch`：修复创建问题

### 15.3 项目元信息

所有生成项目都写入：

```text
.tooling/create-meta.json
```

记录以下信息：

- CLI 版本
- 创建时间
- 创建模式
- 前端模板
- 后端模板
- 是否启用 `E2E`
- 是否启用 `Docker`
- 是否启用 `CI`

### 15.4 升级边界

第一版明确不提供已有项目升级命令。升级问题通过文档与人工迁移处理，待模板体系稳定后再评估是否引入 `migrate`。

## 16. 默认环境版本

若实现阶段未被额外指定，默认采用：

- `Node.js 22 LTS`
- `pnpm 10`
- `JDK 21`
- `CI 平台：GitHub Actions`

## 17. 实施建议

推荐按以下顺序实现：

1. CLI 基础入口与 `create` 命令
2. `ProjectOptions` 标准化与参数校验
3. `base` 模板生成
4. `frontend` / `backend` 模板注入
5. 文档模板与基础设施模板
6. 依赖安装与 Git 初始化
7. 测试补齐与冒烟验证

## 18. 设计结论

`YM CLI` 第一版应聚焦为：

> 一个面向鹰脉团队内部的 `pnpm Monorepo` 项目创建器，支持 `全栈 / 仅前端 / 仅后端` 三种模式，提供 3 套前端官方模板、3 套后端官方模板，并默认接入统一的测试、规范、文档、CI 与容器化基础设施。

这套方案的核心价值是：

1. 统一但不死板
2. 可选但不失控
3. 完整但不过度设计

# YM CLI 实现计划

## 1. 计划目标

本计划用于将已批准的设计文档落地为一个可执行的第一版实现方案。

第一版交付目标只有一个：

> 交付一个可运行、可测试、可发布的 `YM CLI`，支持通过 `ym create <project-name>` 创建团队标准化 `pnpm Monorepo` 项目。

### 1.1 当前实施状态

截至当前实现进度，已经完成：

1. CLI 骨架、`create` 命令与模板渲染流程
2. 前端模板：
   - `nextjs`
   - `react-vite`
   - `vue3-vite`
3. 后端模板：
   - `nestjs`
   - `fastify`
   - `springboot`
4. 真实项目级冒烟验证：
   - `nextjs + nestjs`
   - `react-vite + fastify`
   - `vue3-vite + fastify`

说明：

`springboot` 模板已支持完整工程生成，但由于当前机器缺少 `mvn` 且 Java 版本不是模板目标的 `Java 21`，尚未完成本机真实构建验证。

## 2. 实施范围

### 2.1 本次实现包含

1. CLI 基础工程搭建
2. `create` 主命令
3. 参数模式与交互模式统一收敛
4. `base` 骨架模板生成
5. 3 套前端模板接入
6. 3 套后端模板接入
7. `E2E / Docker / CI / docs` addon 接入
8. 根级脚本契约与共享配置包
9. 文档模板渲染
10. 基础测试、夹具测试、冒烟测试
11. 打包与发布配置

### 2.2 本次实现不包含

1. `generate` 二级代码生成命令
2. 已有项目升级能力
3. 插件市场或外部模板扩展机制
4. 任意技术栈自由拼装
5. `pnpm` 之外的包管理器支持

## 3. 实施原则

### 3.1 KISS

- 第一版只做 `create`
- 先保证“能稳定生成”，再考虑“更智能”
- 生成流程采用串行编排，降低排错成本

### 3.2 YAGNI

- 不提前做插件系统
- 不提前做项目升级
- 不提前做模板远程拉取
- 不做过多命令参数和自由组合

### 3.3 SOLID

- `commands` 只负责命令入口
- `prompts` 只负责交互
- `options` 只负责标准化
- `validator` 只负责规则校验
- `generator` 只负责流程编排
- `render` 只负责文件渲染与合并

### 3.4 DRY

- 交互式与命令式共用一份 `ProjectOptions`
- 模板按层拆分，避免按组合复制
- 共享配置统一收敛到 `packages/config-*`

## 4. 里程碑拆分

### M1：CLI 骨架与核心类型

目标：建立 CLI 可运行骨架，打通最小命令入口。

交付物：

1. CLI 工程初始化
2. `src/bin/index.ts`
3. `src/commands/create.ts`
4. `src/core/types.ts`
5. `src/utils/logger.ts`
6. `tsconfig.json`
7. `package.json`
8. `tsup` 构建配置

验收标准：

1. 能执行 `ym --help`
2. 能执行 `ym create demo-app --help`
3. 能完成基础构建输出

### M2：配置收敛与校验

目标：打通命令参数、交互输入、默认值合并流程。

交付物：

1. `src/prompts/create.ts`
2. `src/core/options.ts`
3. `src/core/validator.ts`
4. `src/constants/stacks.ts`
5. `ProjectOptions` 标准化流程

验收标准：

1. 交互模式与参数模式都能得到同一结构的 `ProjectOptions`
2. 非法组合能被准确拦截
3. 缺失必填项能被正确补齐或报错

### M3：Base 模板生成能力

目标：先让 CLI 能生成统一 Monorepo 骨架，不依赖具体技术栈。

交付物：

1. `src/templates/base/*`
2. `src/render/copy.ts`
3. `src/render/ejs.ts`
4. `src/render/merge.ts`
5. `src/core/context.ts`
6. `src/core/generator.ts` 初版

验收标准：

1. 能生成根目录基础结构
2. 能渲染根级 `README.md`
3. 能生成 `.env.example`、`pnpm-workspace.yaml`、`package.json`
4. 根级脚本契约存在且格式正确

### M4：前端模板接入

目标：完成 3 套前端模板的注入能力。

交付物：

1. `src/templates/frontend/nextjs`
2. `src/templates/frontend/react-vite`
3. `src/templates/frontend/vue3-vite`
4. 对应 `template.meta.json`

验收标准：

1. `mode=frontend` 可生成任一前端项目
2. `mode=fullstack` 可正确注入 `apps/web`
3. `README` 与文档中能自动反映当前前端栈

### M5：后端模板接入

目标：完成 3 套后端模板的注入能力。

交付物：

1. `src/templates/backend/nestjs`
2. `src/templates/backend/fastify`
3. `src/templates/backend/springboot`
4. 后端模板元数据

验收标准：

1. `mode=backend` 可生成任一后端项目
2. `mode=fullstack` 可正确注入 `apps/server`
3. Spring Boot 模板的目录、构建文件、运行文档可用

### M6：Addon 与文档体系

目标：接入增强能力与默认文档系统。

交付物：

1. `src/templates/addons/e2e`
2. `src/templates/addons/docker`
3. `src/templates/addons/ci`
4. `src/templates/addons/docs`
5. `docs` 模板变量渲染规则

验收标准：

1. `E2E / Docker / CI` 能按选项开关生成
2. 根目录与 `docs/` 内文档都能根据技术栈渲染
3. `.tooling/create-meta.json` 正确写入

### M7：后置动作与用户体验补齐

目标：让 CLI 具备接近可发布状态的操作体验。

交付物：

1. `pnpm install` 后置执行
2. `git init` 后置执行
3. 目标目录校验
4. 错误提示分层
5. 日志输出规范

验收标准：

1. 安装依赖失败时能保留已生成项目并提示原因
2. Git 初始化失败时能提示但不破坏项目
3. 空目录、非空目录、同名目录场景处理清晰

### M8：测试、打包与发布准备

目标：建立质量闭环和可发布能力。

交付物：

1. 单元测试
2. 夹具快照测试
3. 冒烟测试脚本
4. 构建与发布说明
5. `README.md`（CLI 项目自身）

验收标准：

1. `lint`
2. `test`
3. `build`
4. 至少 3 套代表性组合完成冒烟验证

## 5. 工作分解结构

### 5.1 CLI 工程层

任务项：

1. 初始化 `package.json`
2. 配置 TypeScript
3. 配置 `tsup`
4. 配置 `bin` 命令入口
5. 配置测试框架 `Vitest`
6. 配置代码规范工具

### 5.2 领域模型层

任务项：

1. 定义 `ProjectMode`
2. 定义 `FrontendStack`
3. 定义 `BackendStack`
4. 定义 `ProjectOptions`
5. 定义模板元数据类型
6. 定义生成上下文类型

### 5.3 输入与校验层

任务项：

1. 命令参数解析
2. 交互问题定义
3. 默认值策略
4. 参数与交互合并
5. 组合合法性校验
6. 错误消息规范化

### 5.4 渲染与生成层

任务项：

1. 模板复制
2. 模板变量替换
3. JSON 合并
4. YAML 文本渲染
5. 根级文件生成
6. 模板分层加载
7. 后置动作执行

### 5.5 模板资产层

任务项：

1. `base/common`
2. `base/fullstack`
3. `base/frontend-only`
4. `base/backend-only`
5. 3 套前端模板
6. 3 套后端模板
7. `e2e / docker / ci / docs` 模板

### 5.6 测试与发布层

任务项：

1. 单元测试
2. 夹具生成与断言
3. 冒烟测试脚本
4. 打包验证
5. 发布说明

## 6. 并行与串行安排

### 6.1 必须串行的部分

1. `M1 -> M2 -> M3`
原因：没有 CLI 骨架、标准配置和基础渲染层，后续模板接入没有稳定落点。

2. `M7 -> M8`
原因：后置动作与错误处理确定后，测试用例才能稳定收口。

### 6.2 可并行的部分

在 `M3` 完成后，可以并行推进：

1. 前端模板接入
2. 后端模板接入
3. 文档模板与 addon 模板准备

原因：

- 三者写入目录大体独立
- 模板文件冲突较少
- 编排逻辑可以保持在 `generator` 层统一集成

### 6.3 推荐执行节奏

1. 先落 `M1-M3`
2. 再做一次最小可用演示
3. 然后并行准备前端模板、后端模板、文档与 addon
4. 最后统一收口到测试与发布

## 7. 推荐迭代顺序

### 迭代 1：最小可用 CLI

目标：先生成一个仅包含 base 骨架的项目。

范围：

1. CLI 入口
2. 参数解析
3. 交互补齐
4. `base/common` 模板
5. `README` 基础渲染

完成标志：

```bash
ym create demo-base --mode frontend --yes --install false --git false
```

能输出一个结构正确的基础仓库。

### 迭代 2：单技术栈打通

目标：先打通一条推荐链路，验证设计闭环。

推荐组合：

- `nextjs + nestjs`

范围：

1. `apps/web` 的 `nextjs` 模板
2. `apps/server` 的 `nestjs` 模板
3. 文档模板注入
4. `docker / ci` 基础接入

完成标志：

```bash
ym create demo-fullstack --mode fullstack --frontend nextjs --backend nestjs
```

生成后的项目可完成：

1. `pnpm install`
2. `pnpm lint`
3. `pnpm test`
4. `pnpm build`

### 迭代 3：全模板铺开

目标：补齐其余前后端模板。

范围：

1. `react-vite`
2. `vue3-vite`
3. `fastify`
4. `springboot`
5. `frontend-only`
6. `backend-only`

完成标志：

所有官方支持模板都能被成功生成。

### 迭代 4：质量闭环

目标：补齐测试矩阵与发布流程。

范围：

1. 单元测试
2. 夹具测试
3. 冒烟测试
4. 发布前校验脚本

完成标志：

CLI 达到可内部试用状态。

## 8. 关键文件落地清单

第一批建议优先创建这些文件：

```text
src/bin/index.ts
src/commands/create.ts
src/core/types.ts
src/core/options.ts
src/core/validator.ts
src/core/context.ts
src/core/generator.ts
src/prompts/create.ts
src/render/copy.ts
src/render/ejs.ts
src/render/merge.ts
src/utils/logger.ts
src/constants/stacks.ts
src/templates/base/common/
tests/
package.json
tsconfig.json
```

## 9. 风险与应对

### 风险 1：模板数量上升导致维护复杂

应对：

1. 坚持模板分层
2. 禁止按组合复制整套模板
3. 用 `template.meta.json` 收敛模板声明

### 风险 2：前后端模板依赖差异大

应对：

1. 统一根级命令契约
2. 在模板内部解决各自技术栈差异
3. `generator` 不侵入模板内部构建细节

### 风险 3：Spring Boot 模板拉高实现成本

应对：

1. 第一版只支持 `JPA`
2. 先以最小可运行工程为目标
3. 文档和脚本统一由模板提供

### 风险 4：交互模式与参数模式出现逻辑分叉

应对：

1. 所有输入统一映射到 `ProjectOptions`
2. 交互层不做业务判断
3. 所有规则集中在 `validator`

### 风险 5：生成项目后置命令不稳定

应对：

1. `install` 与 `git` 作为可选动作
2. 失败时保留项目结果
3. 清晰提示用户可手动继续的命令

## 10. 验收标准

实现完成后，至少满足以下验收项：

1. 能通过 `ym create <project-name>` 创建项目
2. 支持 `fullstack / frontend / backend`
3. 支持 3 套前端模板
4. 支持 3 套后端模板
5. 支持 `E2E / Docker / CI` 生成开关
6. 默认生成团队文档模板
7. 根级脚本契约一致
8. 单元测试、夹具测试、冒烟测试可执行
9. CLI 自身可打包
10. 生成项目可完成至少一条推荐链路的完整验证

## 11. 建议的首个开发切片

如果现在就开始实现，我建议第一刀只做下面这些：

1. 初始化 CLI 工程
2. 完成 `ym create` 命令入口
3. 定义 `ProjectOptions`
4. 完成参数解析与交互补齐
5. 生成 `base/common` 模板
6. 输出一个基础 `README.md`

这样做的好处是：

1. 风险最低
2. 最快能看到结果
3. 能尽早验证目录结构、模板渲染、命令体验是否顺手

## 12. 下一步执行建议

建议直接按下面顺序进入开发：

1. 创建 CLI 项目骨架
2. 打通 `M1-M3`
3. 先落地 `nextjs + nestjs`
4. 再补其余模板
5. 最后收口测试与发布

如果进入实现阶段，推荐从“CLI 骨架 + `create` 最小可用链路”开始，而不是一次性铺满全部模板。

import { Button } from '@/components/ui/button';

const highlights = [
  {
    label: '前端',
    value: 'Next.js 16 + React 19 + Tailwind 4',
  },
  {
    label: '后端',
    value: '{{backendDisplay}}',
  },
  {
    label: '规范',
    value: 'ESLint / Prettier / Husky / lint-staged',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dbeafe,_transparent_35%),linear-gradient(135deg,_#f8fafc,_#eef2ff_50%,_#eff6ff)] px-6 py-10 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <section className="grid gap-8 rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:grid-cols-[1.3fr_0.7fr] md:p-12">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-sky-100 px-4 py-1 text-sm font-medium text-sky-700">
              YM CLI / 标准全栈模板
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                {{projectName}} 已准备好，适合直接进入业务开发。
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                当前模板默认采用 App Router、Server Component 优先、Tailwind 4 以及可复用的 UI
                组件模式。你可以在这个骨架上继续补页面、接口和领域模块。
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <a href="http://localhost:3001/api" target="_blank" rel="noreferrer">
                  打开后端 API
                </a>
              </Button>
              <Button asChild variant="secondary">
                <a
                  href="https://nextjs.org/docs/app/getting-started"
                  target="_blank"
                  rel="noreferrer"
                >
                  查看 Next.js 文档
                </a>
              </Button>
            </div>
          </div>

          <aside className="rounded-[1.5rem] bg-slate-950 p-6 text-slate-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">项目清单</p>
            <div className="mt-6 space-y-4">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="mt-2 text-base font-medium leading-7">{item.value}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">页面结构</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              业务页面建议放在 `src/app`，公共展示组件放在 `src/components`，和 Next.js
              官方 App Router 习惯保持一致。
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">联调约定</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              默认后端地址示例为 `http://localhost:3001/api`，可以通过根目录环境变量继续收敛。
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">下一步</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              优先补充真实业务路由、数据获取层和设计系统组件，再接入鉴权、埋点和测试。
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}

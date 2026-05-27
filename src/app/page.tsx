import Link from "next/link"
import { GitBranch, Wallet, GanttChart, ArrowRight, CheckCircle2, Sparkles } from "lucide-react"

const features = [
  {
    icon: GanttChart,
    title: "Kanban Board",
    desc: "Drag-and-drop task management with real-time reordering across backlog, todo, in-progress, and done columns.",
  },
  {
    icon: Wallet,
    title: "Web3 Native",
    desc: "Connect your wallet and interact with deployed smart contracts directly from the board.",
  },
  {
    icon: GitBranch,
    title: "Subtask Tracking",
    desc: "Break down complex tasks with nested subtasks, checklists, and progress indicators.",
  },
  {
    icon: Sparkles,
    title: "Smart Labels",
    desc: "Organize tasks with custom labels, priority levels, due dates, and advanced filtering.",
  },
]

const stats = [
  { value: "100%", label: "On-chain Ready" },
  { value: "4", label: "Board Columns" },
  { value: "0ms", label: "Drag Latency" },
  { value: "∞", label: "Customizable" },
]

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] animate-float-slow rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] animate-float rounded-full bg-pink-500/8 blur-[100px]" />
        <div className="absolute top-1/3 left-1/2 h-[300px] w-[300px] animate-float-fast rounded-full bg-blue-500/6 blur-[80px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.65_0.25_285/0.1),transparent)]" />
      </div>

      <nav className="relative z-10 border-b border-zinc-800/50 bg-zinc-950/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center border border-purple-500/30 bg-zinc-950">
              <span className="bg-linear-to-br from-purple-300 to-pink-300 bg-clip-text text-[11px] font-bold text-transparent">T</span>
            </div>
            <span className="hidden bg-linear-to-r from-zinc-300 to-zinc-500 bg-clip-text text-xs font-semibold uppercase tracking-[0.2em] text-transparent sm:inline">
              Todo Kanban
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/board"
              className="flex items-center gap-1.5 border border-purple-500/20 bg-purple-500/8 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-purple-300 shadow-[0_0_12px_oklch(0.65_0.25_285/0.05)] backdrop-blur-sm transition-all duration-300 hover:border-purple-500/40 hover:bg-purple-500/15 hover:shadow-[0_0_20px_oklch(0.65_0.25_285/0.1)] sm:px-3 sm:text-[11px]"
            >
              <span className="hidden sm:inline">Launch</span> App
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="mx-auto flex max-w-6xl flex-col items-center px-4 pt-20 pb-16 text-center sm:px-5 sm:pt-28 sm:pb-20">
          <div className="animate-fade-in mb-5 inline-flex items-center gap-1.5 border border-purple-500/15 bg-purple-500/5 px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] text-purple-400 sm:px-3 sm:text-[10px]">
            <span className="h-1.5 w-1.5 bg-purple-500 shadow-[0_0_6px_oklch(0.65_0.25_285/0.5)]" />
            Next.js 16 + Web3 + Kanban
          </div>

          <h1 className="animate-fade-up max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="bg-linear-to-r from-zinc-100 via-purple-300 to-pink-300 bg-clip-text bg-[length:200%_auto] text-transparent animate-shimmer">
              Manage Tasks
            </span>
            <br />
            <span className="text-zinc-400">On The</span>{" "}
            <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Blockchain
            </span>
          </h1>

          <p className="animate-fade-up mt-4 max-w-xl text-[12px] leading-relaxed text-zinc-500 sm:mt-6 sm:text-[13px]">
            A modern kanban board with drag-and-drop, wallet connectivity, and smart contract integration.
            Built with Next.js 16, Tailwind CSS v4, and dnd-kit.
          </p>

          <div className="animate-fade-up mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:gap-4" style={{ animationDelay: "0.2s" }}>
            <Link
              href="/board"
              className="group flex w-full items-center justify-center gap-2 border border-purple-500/30 bg-purple-500/12 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-purple-200 shadow-[0_0_20px_oklch(0.65_0.25_285/0.08)] backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-500/20 hover:shadow-[0_0_30px_oklch(0.65_0.25_285/0.15)] sm:w-auto sm:text-[12px]"
            >
              Open Board
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/board"
              className="flex w-full items-center justify-center border border-zinc-800/60 bg-zinc-900/30 px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] text-zinc-500 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700/60 hover:text-zinc-400 sm:w-auto sm:text-[12px]"
            >
              Learn More
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-5 sm:pb-24">
          <div className="mb-10 text-center sm:mb-14">
            <h2 className="animate-fade-up text-[10px] font-semibold uppercase tracking-[0.2em] text-purple-400 sm:text-[11px]">
              Everything You Need
            </h2>
            <p className="animate-fade-up mt-2 text-xl font-bold text-zinc-200 sm:text-2xl md:text-3xl" style={{ animationDelay: "0.05s" }}>
              Built for Modern Workflows
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="animate-fade-up group border border-zinc-800/60 bg-zinc-950/30 px-4 py-5 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700/60 hover:bg-zinc-900/40 hover:shadow-[0_0_20px_oklch(0.65_0.25_285/0.04)] sm:px-5 sm:py-6"
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center border border-purple-500/20 bg-purple-500/8">
                  <f.icon className="h-4 w-4 text-purple-400" />
                </div>
                <h3 className="mb-1 text-[13px] font-semibold text-zinc-200">{f.title}</h3>
                <p className="text-[11px] leading-relaxed text-zinc-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-5 sm:pb-24">
          <div className="border border-zinc-800/50 bg-zinc-950/20 px-5 py-10 backdrop-blur-sm sm:px-8 sm:py-12">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="animate-fade-up text-center"
                  style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                >
                  <div className="text-2xl font-bold text-purple-300 sm:text-3xl md:text-4xl">{s.value}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.15em] text-zinc-600 sm:text-[11px]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-5 sm:pb-24">
          <div className="animate-fade-up relative overflow-hidden border border-zinc-800/50 bg-zinc-950/20 px-5 py-10 text-center backdrop-blur-sm sm:px-8 sm:py-14">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-purple-500/5 via-transparent to-pink-500/5" />
            <h2 className="relative text-xl font-bold text-zinc-200 sm:text-2xl md:text-3xl">
              Ready to streamline your workflow?
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-[12px] text-zinc-600 sm:text-[13px]">
              Jump into the board and start organizing tasks with the power of drag-and-drop and Web3.
            </p>
            <div className="relative mt-6 flex items-center justify-center sm:mt-8">
              <Link
                href="/board"
                className="group flex w-full items-center justify-center gap-2 border border-purple-500/30 bg-purple-500/12 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-purple-200 shadow-[0_0_20px_oklch(0.65_0.25_285/0.08)] transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-500/20 hover:shadow-[0_0_30px_oklch(0.65_0.25_285/0.15)] sm:w-auto sm:px-6 sm:text-[12px]"
              >
                Get Started
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-zinc-800/50 bg-zinc-950/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-4 sm:flex-row sm:justify-between sm:px-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3 w-3 text-zinc-700" />
            <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-700 sm:text-[10px]">
              Todo Kanban &copy; {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] uppercase tracking-[0.1em] text-zinc-700 sm:text-[10px]">
              Next.js 16 + Tailwind v4
            </span>
            <span className="flex h-1.5 w-1.5 bg-emerald-500/50 shadow-[0_0_6px_oklch(0.7_0.2_145/0.3)]" />
          </div>
        </div>
      </footer>
    </div>
  )
}

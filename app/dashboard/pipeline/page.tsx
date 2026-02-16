import Link from "next/link";

const steps = [
  {
    id: 1,
    title: "Hujjatni o'qish",
    desc: "PDF formatidan xom matn ajratib olindi",
    chips: ["Format: PDF", "Sahifalar: 124 bet"],
    status: "YAKUNLANDI",
    statusClass:
      "text-[10px] font-black text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-lg tracking-[0.1em]",
    icon: "check_circle",
    iconClass:
      "w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner",
    accentClass:
      "absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]",
    cardClass:
      "glass-card rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:border-emerald-500/30",
  },
  {
    id: 2,
    title: "HTML ga aylantirish",
    desc: "Matn semantik HTML formatiga o'tkazildi",
    chips: ["Rasmlar: 12 ta", "Jadvallar: 45 ta"],
    status: "YAKUNLANDI",
    statusClass:
      "text-[10px] font-black text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-lg tracking-[0.1em]",
    icon: "check_circle",
    iconClass:
      "w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner",
    accentClass:
      "absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]",
    cardClass:
      "glass-card rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:border-emerald-500/30",
  },
  {
    id: 3,
    title: "Strukturaga ajratish",
    desc: "Boblar, moddalar va bandlar aniqlandi",
    chips: ["Boblar: 8 ta", "Bandlar: 218 ta"],
    status: "YAKUNLANDI",
    statusClass:
      "text-[10px] font-black text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-lg tracking-[0.1em]",
    icon: "check_circle",
    iconClass:
      "w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner",
    accentClass:
      "absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]",
    cardClass:
      "glass-card rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:border-emerald-500/30",
  },
  {
    id: 4,
    title: "Chunklash (Bo'laklarga ajratish)",
    desc: "Vektorlash uchun matn bo'laklarga ajratilmoqda...",
    chips: ["342 bo'lak yaratildi", "Avg tokens: 512"],
    status: "JARAYONDA",
    statusClass:
      "flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg",
    icon: "layers",
    iconClass:
      "w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-inner pulse-soft",
    accentClass: "absolute left-0 top-0 bottom-0 w-1.5 bg-primary shadow-[0_0_20px_#137fec]",
    cardClass:
      "glass-card rounded-2xl p-7 relative overflow-hidden active-glowing-card border-primary/50",
  },
  {
    id: 5,
    title: "Embedding (Vektorlashtirish)",
    desc: "AI model yordamida raqamli ko'rinishga keltirish",
    chips: ["Model: text-embedding-3-small", "Dim: 1536"],
    status: "NAVBATDA",
    statusClass:
      "text-[10px] font-black text-slate-500 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg tracking-[0.1em]",
    icon: "bolt",
    iconClass:
      "w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500",
    accentClass: "",
    cardClass:
      "glass-card rounded-2xl p-6 relative opacity-40 hover:opacity-60 transition-opacity",
  },
  {
    id: 6,
    title: "Saqlash",
    desc: "Vektor bazasiga ma'lumotlarni yozish",
    chips: ["Target: Pinecone Cloud", "Namespace: shnq-uz"],
    status: "KUTILMOQDA",
    statusClass:
      "text-[10px] font-black text-slate-500 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg tracking-[0.1em]",
    icon: "storage",
    iconClass:
      "w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500",
    accentClass: "",
    cardClass:
      "glass-card rounded-2xl p-6 relative opacity-40 hover:opacity-60 transition-opacity",
  },
];

const logs = [
  {
    time: "10:24:01",
    text: "Hujjat o'qish jarayoni boshlandi...",
    className: "text-slate-400",
  },
  {
    time: "10:24:05",
    text: "OK: 124 bet aniqlandi.",
    className: "text-emerald-400 font-semibold",
  },
  {
    time: "10:24:12",
    text: "HTML conversion status: 15%",
    className: "text-slate-400",
    highlight: "text-primary",
  },
  {
    time: "10:25:30",
    text: "OK: HTML parsing yakunlandi.",
    className: "text-emerald-400 font-semibold",
  },
  {
    time: "10:25:45",
    text: "Struktura aniqlanmoqda (Heuristic Engine v2)...",
    className: "text-slate-400",
  },
  {
    time: "10:26:01",
    text: "8 ta bo'lim topildi. 218 ta punkt.",
    className: "text-slate-300",
  },
  {
    time: "10:26:10",
    text: "INFO: Chunking algorithm: Sliding Window",
    className: "text-primary font-bold",
  },
  {
    time: "10:26:12",
    text: "Chunk 001 created. Tokens: 488",
    className: "text-slate-500",
  },
  {
    time: "10:26:15",
    text: "Chunk 045 created. Tokens: 512",
    className: "text-slate-500",
  },
  {
    time: "10:26:22",
    text: "Chunk 120 created. Tokens: 490",
    className: "text-slate-500 opacity-80",
  },
  {
    time: "10:26:30",
    text: "Processing chunk 215...",
    className: "text-yellow-500 font-bold",
    ping: true,
  },
];

export default function PipelinePage() {
  return (
    <div className="pipeline-shell -mx-6 -mt-6 px-6 pb-12 pt-6 lg:-mx-10 lg:px-10">
      <div className="sticky top-0 z-40 -mx-6 border-b border-white/5 bg-black/20 px-6 backdrop-blur-xl lg:-mx-10 lg:px-10">
        <div className="mx-auto flex h-20 w-full max-w-[1600px] items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="rounded-xl bg-gradient-to-br from-primary to-indigo-600 p-2.5 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[24px] text-white">
                architecture
              </span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                SHNQ AI Processor
              </h1>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                O'zbekiston Qurilish Normalari
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="glass-card group flex items-center gap-2 rounded-xl px-5 py-2.5 transition-all duration-300 hover:bg-white/5">
              <span className="material-symbols-outlined text-[18px] text-slate-400 transition-colors group-hover:text-white">
                settings
              </span>
              <span className="text-sm font-semibold">Sozlamalar</span>
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95">
              <span className="material-symbols-outlined text-[18px]">
                refresh
              </span>
              <span className="text-sm font-bold tracking-wide">
                Qayta ishga tushirish
              </span>
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1600px] px-0 py-10">
        <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-500">
              <Link href="/dashboard" className="hover:text-primary">
                Loyihalar
              </Link>
              <span className="material-symbols-outlined text-[10px]">
                arrow_forward_ios
              </span>
              <span className="hover:text-primary">SHNQ 2.01.01-22</span>
              <span className="material-symbols-outlined text-[10px]">
                arrow_forward_ios
              </span>
              <span className="text-primary/80">Pipeline</span>
            </div>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white">
              SHNQ 2.01.01-22{" "}
              <span className="font-light text-slate-500">
                "Iqlimiy ma'lumotlar"
              </span>
            </h2>
            <div className="flex flex-wrap items-center gap-6">
              <span className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Hujjat faol
              </span>
              <span className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <span className="material-symbols-outlined text-[18px] opacity-60">
                  description
                </span>
                14.2 MB
              </span>
              <span className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <span className="material-symbols-outlined text-[18px] opacity-60">
                  calendar_today
                </span>
                24 May, 2024
              </span>
            </div>
          </div>
          <div className="glass-card flex items-center gap-8 rounded-2xl p-6 shadow-2xl">
            <div className="relative flex items-center justify-center">
              <svg className="h-20 w-20 -rotate-90 transform">
                <circle
                  className="text-slate-800"
                  cx="40"
                  cy="40"
                  r="34"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="6"
                />
                <circle
                  className="text-primary progress-ring-glow transition-all duration-1000"
                  cx="40"
                  cy="40"
                  r="34"
                  fill="transparent"
                  stroke="currentColor"
                  strokeDasharray="213.6"
                  strokeDashoffset="47"
                  strokeWidth="6"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-white">78%</span>
              </div>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div>
              <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Sarflangan vaqt
              </p>
              <p className="tabular-nums text-2xl font-black tracking-tight text-white">
                04:12<span className="ml-0.5 text-sm text-primary">s</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 space-y-5 lg:col-span-8">
            {steps.map((step) => (
              <div key={step.id} className={step.cardClass}>
                {step.accentClass ? <div className={step.accentClass} /> : null}
                <div className="flex items-start justify-between">
                  <div className="flex gap-6">
                    <div className={step.iconClass}>
                      <span className="material-symbols-outlined text-[24px]">
                        {step.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="mb-1 text-lg font-bold text-white">
                        {step.id}. {step.title}
                      </h3>
                      <p className="text-sm font-medium text-slate-400">
                        {step.desc}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {step.chips.map((chip) => (
                          <span
                            key={chip}
                            className="rounded-lg border border-white/5 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-300"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                      {step.id === 4 ? (
                        <div className="mt-6">
                          <div className="relative mb-6 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                            <div className="progress-gradient-animate absolute left-0 top-0 h-full w-[65%] rounded-full shadow-[0_0_10px_#137fec]" />
                          </div>
                          <div className="flex flex-wrap gap-4">
                            <span className="rounded-lg border border-primary/20 bg-primary/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-primary">
                              342 bo'lak yaratildi
                            </span>
                            <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              Avg tokens: 512
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {step.id === 4 ? (
                    <div className={step.statusClass}>
                      <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                      <span className="text-[10px] font-black tracking-[0.1em] text-primary">
                        {step.status}
                      </span>
                    </div>
                  ) : (
                    <span className={step.statusClass}>{step.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="glass-card sticky top-28 flex h-[calc(100vh-220px)] flex-col overflow-hidden rounded-2xl border-white/5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] p-5">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                    Jarayon loglari
                  </h3>
                </div>
                <button className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-white">
                  <span className="material-symbols-outlined text-[20px]">
                    download
                  </span>
                </button>
              </div>
              <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto bg-black/40 p-6 font-mono text-[11px]">
                {logs.map((log) => (
                  <div key={`${log.time}-${log.text}`} className="flex gap-3">
                    <span className="font-bold text-primary/60">
                      [{log.time}]
                    </span>
                    <span className={`${log.className} leading-relaxed`}>
                      {log.highlight ? (
                        <>
                          HTML conversion status:{" "}
                          <span className={log.highlight}>15%</span>
                        </>
                      ) : (
                        log.text
                      )}
                      {log.ping ? (
                        <span className="ml-2 inline-flex items-center gap-2">
                          <span className="h-1 w-1 animate-ping rounded-full bg-yellow-500" />
                        </span>
                      ) : null}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/5 bg-white/[0.02] p-5">
                <div className="flex items-center gap-3">
                  <div className="group flex flex-1 items-center justify-between rounded-xl border border-white/5 bg-black/40 px-4 py-2.5 transition-all focus-within:border-primary/50">
                    <input
                      type="text"
                      placeholder="Filtrlash..."
                      className="w-full bg-transparent p-0 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none"
                    />
                    <span className="material-symbols-outlined text-[18px] text-slate-600 transition-colors group-hover:text-primary">
                      search
                    </span>
                  </div>
                  <button className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-400 transition-all hover:border-white/20 hover:bg-white/10">
                    <span className="material-symbols-outlined text-[18px]">
                      filter_list
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

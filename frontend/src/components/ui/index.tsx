import React from "react";
import { cx } from "../../data/mockData";

export const Card = React.forwardRef<HTMLDivElement, any>(function Card({ children, className = "" }, ref) {
  return (
    <div
      ref={ref}
      className={cx(
        "rounded-[28px] border border-cyan-400/10 bg-[#11161f]/90 shadow-2xl shadow-black/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/10",
        className
      )}
    >
      {children}
    </div>
  );
});

export function Button({ children, className = "", variant = "default", ...props }: any) {
  const styles =
    variant === "ghost"
      ? "border border-cyan-400/15 bg-white/4 text-slate-100 hover:bg-white/8"
      : variant === "subtle"
        ? "border border-white/10 bg-white/6 text-slate-100 hover:bg-white/10"
        : "bg-cyan-300 text-slate-950 hover:bg-cyan-200";

  return (
    <button
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-300 active:scale-[0.99] hover:-translate-y-0.5",
        styles,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({ children, tone = "neutral" }: any) {
  const styles =
    tone === "success"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
      : tone === "warning"
        ? "border-amber-400/20 bg-amber-400/10 text-amber-200"
        : tone === "danger"
          ? "border-rose-400/20 bg-rose-400/10 text-rose-200"
          : "border-cyan-400/15 bg-white/5 text-slate-200";

  return <span className={cx("inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase", styles)}>{children}</span>;
}

export function Switch({ checked, onChange, label }: any) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left transition-all duration-300 hover:bg-black/30"
      aria-pressed={checked}
      aria-label={label}
    >
      <div className="pr-4">
        <p className="text-sm font-medium text-white">{label}</p>
      </div>
      <span
        className={cx(
          "relative inline-flex h-7 w-12 items-center rounded-full border transition-all duration-300",
          checked ? "border-cyan-300/30 bg-cyan-300/20" : "border-white/15 bg-white/5"
        )}
      >
        <span
          className={cx(
            "absolute h-5 w-5 rounded-full bg-white shadow-lg transition-all duration-300",
            checked ? "left-6 bg-cyan-200" : "left-1"
          )}
        />
      </span>
    </button>
  );
}

export function SectionTitle({ title, subtitle, action }: any) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export function MetricCard({ label, value, hint, accent = "CY" }: any) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</p>
          <p className="mt-2 text-xs text-slate-500">{hint}</p>
        </div>
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-200 shadow-lg shadow-cyan-900/20">
          {accent}
        </div>
      </div>
    </Card>
  );
}

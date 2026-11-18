import { Package } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 p-4">
      <header className="flex items-center justify-between">
        <h1 className="font-primary text-2xl font-semibold text-ink">Sales App</h1>
        <ThemeToggle />
      </header>

      <section className="rounded-xl border border-line bg-surface p-4">
        <div className="flex items-center gap-2">
          <Package className="size-5 text-brand" />
          <h2 className="font-secondary text-lg font-semibold text-ink">Today</h2>
        </div>
        <p className="mt-1 text-muted">12 orders, NGN 64,000.00</p>
        <span className="mt-3 inline-block rounded-full bg-brand-soft px-3 py-1 text-sm text-brand">
          pending
        </span>
        <button className="mt-4 block w-full rounded-lg bg-brand px-4 py-3 font-medium text-on-brand hover:opacity-90">
          Deliver
        </button>
      </section>
    </main>
  );
}
import { ThemeToggle } from "@/components/ThemeToggle";

export const inputClass =
  "w-full rounded-lg border border-line bg-page px-3 py-3 text-ink placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand";
export const buttonClass =
  "flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 font-medium text-on-brand hover:opacity-90 disabled:opacity-50";
export const errorClass = "text-sm text-red-600 dark:text-red-400";

export function AuthShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative grid min-h-dvh place-items-center p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-6">
        <h1 className="font-primary text-2xl font-semibold text-ink">
          {title}
        </h1>
        {children}
      </div>
    </main>
  );
}
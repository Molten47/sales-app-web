"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ThemeToggle } from "@/components/ThemeToggle";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { OrderPage } from "@/lib/types";

export default function OrdersPage() {
  const router = useRouter();
  const { session, ready, logout } = useAuth();

  useEffect(() => {
    if (ready && !session) router.replace("/login");
  }, [ready, session, router]);

  const orders = useQuery({
    queryKey: ["orders", "first-page"],
    queryFn: () => api<OrderPage>("/api/v1/orders?limit=5"),
    enabled: !!session,
  });

  if (!ready || !session) return <p className="p-4 text-muted">Loading…</p>;

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 p-4">
      <header className="flex items-center justify-between">
        <h1 className="font-primary text-2xl font-semibold text-ink">Orders</h1>
        <ThemeToggle />
      </header>

      <section className="rounded-xl border border-line bg-surface p-4">
        <p className="text-muted">
          Signed in as <span className="text-ink">{session.role}</span>
        </p>
        <p className="mt-2 text-muted">
          {orders.isPending && "Loading orders…"}
          {orders.error && orders.error.message}
          {orders.data &&
            `Loaded ${orders.data.items.length} order(s)${orders.data.next_cursor ? " (more available)" : ""}.`}
        </p>
        <button
          onClick={logout}
          className="mt-4 rounded-lg border border-line px-4 py-2 text-ink hover:bg-brand-soft"
        >
          Sign out
        </button>
      </section>
    </main>
  );
}
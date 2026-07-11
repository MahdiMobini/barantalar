import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, formatPrice } from "@/lib/api";
import type { MenuItem, RiceOption } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "منو — تالار باران گناباد" },
      { name: "description", content: "لیست غذاها، پکیج‌های ویژه و سرویس‌های خودسرویس تالار باران." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const [items, setItems] = useState<MenuItem[] | null>(null);
  const [specials, setSpecials] = useState<any[] | null>(null);
  const [selfs, setSelfs] = useState<any[] | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [it, sp, ss] = await Promise.all([api.getMenuItems(), api.getSpecialMenus(), api.getSelfService()]);
        if (!mounted) return;
        setItems(it);
        setSpecials(sp);
        setSelfs(ss);
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Read-only menu: no selection state required here.

  return (
    <div dir="rtl" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="mt-3 font-display text-5xl sm:text-6xl font-bold">منوی پذیرایی</h1>
        <p className="mt-5 text-muted-foreground leading-8"></p>
      </div>

      <section className="mt-12 space-y-6">
        <div className="rounded-3xl border border-border/60 bg-card p-8">
          <div className="mb-6 flex items-center gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-primary">منوی اصلی</p>
              <h2 className="mt-3 text-3xl font-display font-semibold">منوی پذیرایی</h2>
            </div>
            <span className="h-0.5 flex-1 rounded-full bg-primary/20" />
          </div>
          <div className="space-y-5">
            {items == null ? (
              [0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-48 w-full rounded-3xl" />
              ))
            ) : (
              items.map((item) => {
                return (
                  <article
                    key={item.id}
                    className={`rounded-2xl border border-border/60 bg-background/70 p-4 ${!item.is_available ? "opacity-50" : ""}`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                          <span className="font-display text-xl font-semibold">{item.name}</span>
                          {!item.is_available && <Badge variant="outline">ناموجود</Badge>}
                        </div>
                        {item.description && (
                          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{item.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      {item.rice_options.map((option) => (
                        <div key={option.id} className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{option.rice_type_display}</span>
                          <span className="font-mono tabular-nums text-sm font-semibold text-foreground">{formatPrice(option.price)}</span>
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary">پکیج ویژه</p>
            <h3 className="mt-2 text-3xl font-display font-semibold">پکیج‌های ویژه</h3>
          </div>
          <span className="hidden sm:block h-0.5 w-36 rounded-full bg-primary/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {specials == null ? (
            [0, 1, 2].map((i) => <Skeleton key={i} className="h-44 w-full rounded-3xl" />)
          ) : (
            specials.map((s) => (
              <article
                key={s.id}
                className={`relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-6 shadow-sm ${!s.is_available ? "opacity-50" : ""}`}
              >
                <div className="absolute top-5 left-5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary">ویژه</div>
                <div className="pt-8">
                  <h4 className="text-xl font-display font-semibold text-foreground">{s.name}</h4>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{s.description}</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4 text-sm">
                  <span className="text-muted-foreground">قیمت</span>
                  <span className="font-mono tabular-nums text-lg font-semibold text-foreground">{formatPrice(s.price)}</span>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="mt-12 rounded-3xl border border-border/60 bg-background/70 p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary">اختیاری</p>
            <h3 className="mt-2 text-2xl font-semibold">میوه و دسر سلف‌سرویس</h3>
          </div>
          <span className="hidden sm:block h-0.5 w-24 rounded-full bg-primary/20" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {selfs == null ? (
            [0, 1].map((i) => <Skeleton key={i} className="h-14 w-full rounded-3xl" />)
          ) : (
            selfs.map((ss) => (
              <div
                key={ss.id}
                className={`rounded-3xl border border-border/50 bg-card/80 px-4 py-4 ${!ss.is_available ? "opacity-50" : ""}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-foreground">{ss.name}</span>
                  <span className="font-mono tabular-nums text-sm text-foreground">{formatPrice(ss.price)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

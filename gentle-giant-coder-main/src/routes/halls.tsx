import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, faNum } from "@/lib/api";
import { getHallDisplayName } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/halls")({
  head: () => ({
    meta: [
      { title: "سالن‌های ما — تالار باران گناباد" },
      { name: "description", content: "سالن مجزای آقایان و سالن مجزای خانم‌ها در تالار باران گناباد با ظرفیت و امکانات کامل." },
      { property: "og:title", content: "سالن‌های تالار باران" },
      { property: "og:description", content: "دو سالن مجزا با دو شیفت در روز." },
    ],
  }),
  component: HallsPage,
});

// dynamic halls will be loaded from the backend
function HallsPage() {
  const [hallsData, setHallsData] = useState<any[] | null>(null);
  const [mainHall, setMainHall] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const h = await api.getHalls();
        const m = await api.getMainHall();
        if (!mounted) return;
        setHallsData(h);
        setMainHall(m);
      } catch (e) {
        // ignore errors silently to keep UI stable
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div dir="rtl">
      <section className="relative isolate overflow-hidden">
        {mainHall && mainHall.images && mainHall.images.length > 0 ? (
          <img src={[...mainHall.images].sort((a: any, b: any) => a.order - b.order)[0].image} alt="سالن‌های تالار باران" width={1920} height={1080}
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60" />
        ) : (
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/70 to-background" />
        )}
        <div className="mx-auto max-w-full sm:max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-16 sm:py-24 md:py-28 text-center">
          <span className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary">Our Halls</span>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">سالن‌های <span className="text-gradient-gold">ما</span></h1>
          <p className="mt-4 sm:mt-5 max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground leading-6 sm:leading-8">
            دو فضای کاملاً مجزا برای آقایان و بانوان، با امکانات کامل و خدمات ممتاز.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-full sm:max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20 space-y-10 sm:space-y-14 md:space-y-16">
        {hallsData && hallsData.length > 0 ? (
          hallsData.map((h, i) => (
            <div key={h.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-start ${i % 2 ? "lg:[direction:ltr]" : ""}`}>
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/60">
                {h.images && h.images.length > 0 ? (
                  <img src={[...h.images].sort((a: any, b: any) => a.order - b.order)[0].image} alt={h.images[0].caption || getHallDisplayName(h.name)} width={1280} height={960} loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105" />
                ) : (
                  <Skeleton className="aspect-[4/3] w-full" />
                )}
              </div>
              <div dir="rtl" className="space-y-4 sm:space-y-5">
                <span className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary">{h.name === "man" ? "Men" : "Women"}</span>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold">{getHallDisplayName(h.name)}</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-7 sm:leading-8">{h.description}</p>
                <div className="flex flex-wrap gap-2 sm:gap-3 text-sm">
                  <span className="rounded-full border border-border bg-card px-3 sm:px-4 py-1.5">ظرفیت: {faNum(h.capacity)} نفر</span>
                  <span className="rounded-full border border-border bg-card px-3 sm:px-4 py-1.5">شیفت ظهر</span>
                  <span className="rounded-full border border-border bg-card px-3 sm:px-4 py-1.5">شیفت شب</span>
                </div>
                <Link to="/booking"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full gradient-gold px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]">
                  رزرو این سالن
                </Link>
              </div>
            </div>
          ))
        ) : (
          [0, 1].map((i) => (
            <div key={i} className={`grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-start ${i % 2 ? "lg:[direction:ltr]" : ""}`}>
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/60">
                <Skeleton className="aspect-[4/3] w-full" />
              </div>
              <div dir="rtl" className="space-y-4 sm:space-y-5">
                <span className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary">-</span>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold"><Skeleton className="h-6 w-48" /></h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-7 sm:leading-8"><Skeleton className="h-24 w-full" /></p>
                <div className="flex flex-wrap gap-2 sm:gap-3 text-sm">
                  <span className="rounded-full border border-border bg-card px-3 sm:px-4 py-1.5">ظرفیت</span>
                </div>
                <Skeleton className="h-10 w-32 mt-4" />
              </div>
            </div>
          ))
        )}
      </section>

      {/* <section className="mx-auto max-w-full sm:max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16">
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-center">گالری</h3>
        <div className="mt-6 sm:mt-8 flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-4 sm:gap-4">
          {hallsData && hallsData.length > 0 ? (
            hallsData.flatMap((h: any) => {
              const imgs = [...(h.images || [])].sort((a: any, b: any) => a.order - b.order).slice(1);
              return imgs.map((img: any, i: number) => (
                <div key={`${h.id}-${i}`} className="min-w-[72vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-border/60 aspect-square sm:min-w-0">
                  <img src={img.image} alt={img.caption || "گالری"} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" />
                </div>
              ));
            })
          ) : (
            [0,1,2,3].map((i) => (
              <div key={i} className="min-w-[72vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-border/60 aspect-square sm:min-w-0">
                <Skeleton className="h-full w-full" />
              </div>
            ))
          )}
        </div>
      </section> */}
    </div>
  );
}
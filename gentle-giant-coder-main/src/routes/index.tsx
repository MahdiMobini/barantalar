import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, faNum } from "@/lib/api";
import { getHallDisplayName } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "تالار باران گناباد — رزرو آنلاین مراسم عروسی" },
      { name: "description", content: "تالار باران در گناباد با دو سالن مجزا برای آقایان و خانم‌ها. رزرو آنلاین تاریخ، تأیید هویت و پرداخت بیعانه." },
      { property: "og:title", content: "تالار باران گناباد" },
      { property: "og:description", content: "میزبان لحظه‌های ماندگار شما. رزرو آنلاین تاریخ مراسم." },
    ],
  }),
  component: Index,
});

function Index() {
  const [mainHall, setMainHall] = useState<any | null>(null);
  const [hallsData, setHallsData] = useState<any[] | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const m = await api.getMainHall();
        const h = await api.getHalls();
        if (!mounted) return;
        setMainHall(m);
        setHallsData(h);
      } catch (e) {
        // ignore — keep UI intact
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <>
      {/* HERO */}
      <section className="relative isolate min-h-[92vh] overflow-hidden flex items-center grain">
        {mainHall && mainHall.images && mainHall.images.length > 0 ? (
          <img
            src={[...mainHall.images].sort((a: any, b: any) => a.order - b.order)[0].image}
            alt="تالار باران گناباد"
            width={1920}
            height={1080}
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 -z-10 bg-gradient-to-l from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-1.5 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-xs tracking-wider text-foreground/80">گناباد · خراسان رضوی</span>
            </div>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] text-foreground">
              مراسم رویایی شما،
              <br />
              <span className="text-gradient-gold">در تالار باران</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-foreground/75">
              دو سالن مجزای آقایان و خانم‌ها، دو شیفت در روز، فضایی خاص و خاطره‌انگیز برای ماندگارترین شب زندگی شما.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 rounded-full gradient-gold px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_-10px_oklch(0.76_0.13_85/0.7)] transition-transform hover:scale-[1.03]"
              >
                رزرو تاریخ
                <ArrowLeft />
              </Link>
              <Link
                to="/halls"
                className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-card/60"
              >
                مشاهده سالن‌ها
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground tracking-widest animate-pulse">SCROLL</div>
      </section>

      {/* STATS */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {[
            { value: 1200, label: "مراسم موفق" },
            { value: 18, label: "سال تجربه" },
            { value: 400, label: "نفر ظرفیت سالن" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-display text-5xl sm:text-6xl font-bold text-gradient-gold">+{faNum(s.value)}</div>
              <div className="mt-2 text-sm text-muted-foreground tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1 grid grid-cols-2 gap-4">
          {mainHall && mainHall.images ? (
            (() => {
              const imgs = [...mainHall.images].sort((a: any, b: any) => a.order - b.order);
              const first = imgs[1];
              const second = imgs[2];
              return (
                <>
                  {first ? (
                    <img src={first.image} alt={first.caption || "مراسم"} width={1280} height={960} loading="lazy" className="rounded-2xl object-cover aspect-[4/5] w-full shadow-2xl" />
                  ) : (
                    <Skeleton className="h-[420px] rounded-2xl" />
                  )}
                  {second ? (
                    <img src={second.image} alt={second.caption || "پذیرایی"} width={1280} height={960} loading="lazy" className="rounded-2xl object-cover aspect-[4/5] w-full shadow-2xl mt-10" />
                  ) : (
                    <Skeleton className="h-[420px] rounded-2xl mt-10" />
                  )}
                </>
              );
            })()
          ) : (
            <>
              <Skeleton className="h-[420px] rounded-2xl" />
              <Skeleton className="h-[420px] rounded-2xl mt-10" />
            </>
          )}
        </div>
        <div className="order-1 md:order-2 text-right">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">درباره ما</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold leading-tight">
            میزبان لحظه‌های <span className="text-gradient-gold">به‌یادماندنی</span>
          </h2>
          <p className="mt-6 text-base leading-8 text-muted-foreground">
            تالار باران در قلب گناباد، با بیش از یک دهه تجربه در برگزاری مراسم‌های عروسی، نامزدی و جشن‌های خانوادگی، فضایی آرام، شیک و کاملاً مجزا برای آقایان و بانوان فراهم کرده است.
          </p>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            کادر مجرب، دکوراسیون اختصاصی، نورپردازی حرفه‌ای و پذیرایی درجه‌یک، تجربه‌ای متفاوت را برایتان رقم می‌زند.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-3 text-sm">
            {["دو سالن مجزا", "دو شیفت در روز", "پارکینگ اختصاصی", "کادر حرفه‌ای"].map((f) => (
              <li key={f} className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/40 px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* HALLS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">سالن‌های ما</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold">دو فضای مجزا، یک تجربه ممتاز</h2>
        </div>
        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {hallsData && hallsData.length > 0 ? (
            hallsData.map((h) => (
              <div key={h.id} className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card">
                <div className="aspect-[4/3] overflow-hidden">
                  {h.images && h.images.length > 0 ? (
                    <img src={[...h.images].sort((a: any, b: any) => a.order - b.order)[0].image} alt={h.caption || getHallDisplayName(h.name)} width={1280} height={960} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <Skeleton className="h-full w-full" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                <div className="absolute bottom-0 right-0 left-0 p-7">
                  <h3 className="font-display text-3xl font-bold text-foreground">{getHallDisplayName(h.name)}</h3>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-border bg-background/60 px-3 py-1 backdrop-blur">ظرفیت {faNum(h.capacity)} نفر</span>
                    <span className="rounded-full border border-border bg-background/60 px-3 py-1 backdrop-blur">شیفت ظهر</span>
                    <span className="rounded-full border border-border bg-background/60 px-3 py-1 backdrop-blur">شیفت شب</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            [0, 1].map((i) => (
              <div key={i} className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card">
                <div className="aspect-[4/3] overflow-hidden">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                <div className="absolute bottom-0 right-0 left-0 p-7">
                  <h3 className="font-display text-3xl font-bold text-foreground"><Skeleton className="h-6 w-32" /></h3>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-border bg-background/60 px-3 py-1 backdrop-blur">ظرفیت</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">مراحل رزرو</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold">فقط چهار قدم تا رزرو</h2>
        </div>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {[
            { n: 1, t: "ثبت شماره", d: "شماره موبایل خود را وارد کنید" },
            { n: 2, t: "تأیید هویت", d: "کد ارسال‌شده را وارد کنید" },
            { n: 3, t: "انتخاب تاریخ", d: "سالن، تاریخ و شیفت دلخواه را انتخاب کنید" },
            { n: 4, t: "پرداخت بیعانه", d: "رزرو خود را قطعی کنید" },
          ].map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-border/60 bg-card/40 p-6 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full gradient-gold font-display text-xl font-bold text-primary-foreground shadow-[0_10px_30px_-10px_oklch(0.76_0.13_85/0.6)]">
                {faNum(s.n)}
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 grain">
          <div className="absolute inset-0 gradient-gold opacity-95" />
          <div className="relative p-10 sm:p-16 text-center text-primary-foreground">
            <h3 className="font-display text-3xl sm:text-5xl font-bold">همین حالا تاریخ مراسم خود را رزرو کنید</h3>
            <p className="mt-4 text-base sm:text-lg opacity-80 max-w-xl mx-auto">
              با چند کلیک ساده، تاریخ دلخواه خود را قفل کنید و خیال خود را راحت کنید.
            </p>
            <Link
              to="/booking"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-background px-8 py-3.5 text-sm font-semibold text-primary transition-transform hover:scale-[1.03]"
            >
              شروع رزرو
              <ArrowLeft />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

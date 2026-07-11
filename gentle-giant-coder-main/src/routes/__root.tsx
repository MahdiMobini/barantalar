import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { api } from "../lib/api";
import type { MainHall } from "../lib/types";
import { reportLovableError } from "../lib/lovable-error-reporting";
import BrandMark from "@/components/BrandMark";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4" dir="rtl">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-gradient-gold">۴۰۴</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">صفحه پیدا نشد</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          صفحه‌ای که دنبالش هستید وجود ندارد یا منتقل شده است.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md gradient-gold px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            بازگشت به خانه
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "تالار باران گناباد — رزرو آنلاین مراسم عروسی" },
      { name: "description", content: "تالار باران در گناباد، خراسان رضوی. رزرو آنلاین تاریخ مراسم با تأیید هویت و پرداخت بیعانه." },
      { name: "author", content: "تالار باران" },
      { property: "og:title", content: "تالار باران گناباد" },
      { property: "og:description", content: "رزرو آنلاین تاریخ مراسم در تالار باران گناباد." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-background text-foreground" dir="rtl">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}

function SiteHeader() {
  const linkBase =
    "relative px-1 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary";
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-gold">
            <BrandMark className="w-10 h-10" />
          </span>
          <span className="flex flex-col leading-tight flex-shrink-0">
            <span className="text-base font-display font-semibold whitespace-nowrap">
              <span className="text-gold opacity-95">تالار</span>{" "}
              <span className="text-gradient-gold">باران</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Baran · Gonabad</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          <Link to="/" className={linkBase} activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }}>خانه</Link>
          <Link to="/halls" className={linkBase} activeProps={{ className: "text-primary" }}>سالن‌ها</Link>
          <Link to="/menu" className={linkBase} activeProps={{ className: "text-primary" }}>منو</Link>
          <Link to="/booking" className={linkBase} activeProps={{ className: "text-primary" }}>رزرو</Link>
          <Link to="/contact" className={linkBase} activeProps={{ className: "text-primary" }}>تماس با ما</Link>
        </nav>
        <Link
          to="/booking"
          className="hidden md:inline-flex items-center justify-center rounded-full gradient-gold px-5 py-2 text-sm font-semibold text-primary-foreground shadow-[0_8px_30px_-10px_oklch(0.76_0.13_85/0.6)] transition-transform hover:scale-[1.03]"
          style={{ filter: "brightness(0.92)" }}
        >
          رزرو تاریخ
        </Link>
        <Link
          to="/booking"
          className="md:hidden inline-flex items-center justify-center rounded-full gradient-gold px-4 py-1.5 text-xs font-semibold text-primary-foreground"
        >
          رزرو
        </Link>
      </div>
      <nav className="md:hidden flex items-center justify-center gap-5 border-t border-border/40 py-2 text-sm">
        <Link to="/" className={linkBase} activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }}>خانه</Link>
        <Link to="/halls" className={linkBase} activeProps={{ className: "text-primary" }}>سالن‌ها</Link>
        <Link to="/menu" className={linkBase} activeProps={{ className: "text-primary" }}>منو</Link>
        <Link to="/booking" className={linkBase} activeProps={{ className: "text-primary" }}>رزرو</Link>
        <Link to="/contact" className={linkBase} activeProps={{ className: "text-primary" }}>تماس</Link>
      </nav>
    </header>
  );
}

function SiteFooter() {
  const { data: mainHall } = useQuery<MainHall | undefined>({
    queryKey: ["mainHall"],
    queryFn: api.getMainHall,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const address = mainHall?.address || "گناباد، خراسان رضوی";
  const phone = mainHall?.phone || "۰۵۱-۵۷۲۲۳۳۴۴";
  const mobile = mainHall?.mobile || "۰۹۱۵۰۰۰۰۰۰۰";

  return (
    <footer className="border-t border-border/60 bg-card/40 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <BrandMark className="w-24 h-24 text-gold" />
            <span className="font-display text-xl font-semibold text-gradient-gold">تالار باران</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            میزبان لحظه‌های ماندگار شما در گناباد. سالن‌های مجزای آقایان و خانم‌ها با کیفیت برتر پذیرایی.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-4">تماس</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>{address}</li>
            <li>تلفن: <span className="text-foreground">{phone}</span></li>
            <li>همراه: <span className="text-foreground">{mobile}</span></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-4">دسترسی سریع</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/halls" className="text-muted-foreground hover:text-primary">سالن‌ها</Link></li>
            <li><Link to="/booking" className="text-muted-foreground hover:text-primary">رزرو آنلاین</Link></li>
            <li><Link to="/contact" className="text-muted-foreground hover:text-primary">تماس با ما</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} تالار باران گناباد — تمامی حقوق محفوظ است.
        <div className="mt-2 text-xs text-muted-foreground">
          طراحی و توسعه توسط {' '}
          <a
            href="mailto:ma.mobini83@gmail.com"
            onClick={() => {
              try {
                navigator.clipboard?.writeText("ma.mobini83@gmail.com");
                toast.success("ایمیل کپی شد: ma.mobini83@gmail.com");
              } catch (e) {
                // ignore clipboard errors
              }
            }}
            className="text-gradient-gold hover:underline"
          >
            مهدی مبینی
          </a>
        </div>
      </div>
      <Toaster />
    </footer>
  );
}

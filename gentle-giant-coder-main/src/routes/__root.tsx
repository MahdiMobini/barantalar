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
    "relative px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-foreground/80 transition-colors hover:text-primary";
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 sm:h-16 max-w-full sm:max-w-7xl items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="text-gold">
            <BrandMark className="w-8 h-8 sm:w-10 sm:h-10" />
          </span>
          <span className="hidden xs:flex flex-col leading-tight flex-shrink-0">
            <span className="text-sm sm:text-base font-display font-semibold whitespace-nowrap">
              <span className="text-gold opacity-95">تالار</span>{" "}
              <span className="text-gradient-gold">باران</span>
            </span>
            <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground">Baran · Gonabad</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-4 lg:gap-7">
          <Link to="/" className={linkBase} activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }}>خانه</Link>
          <Link to="/halls" className={linkBase} activeProps={{ className: "text-primary" }}>سالن‌ها</Link>
          <Link to="/menu" className={linkBase} activeProps={{ className: "text-primary" }}>منو</Link>
          <Link to="/booking" className={linkBase} activeProps={{ className: "text-primary" }}>رزرو</Link>
          <Link to="/contact" className={linkBase} activeProps={{ className: "text-primary" }}>تماس</Link>
        </nav>
        
        <Link
          to="/booking"
          className="inline-flex items-center justify-center rounded-full gradient-gold px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-[0_8px_30px_-10px_oklch(0.76_0.13_85/0.6)] transition-transform hover:scale-105 active:scale-95"
        >
          <span className="md:hidden">رزرو</span>
          <span className="hidden md:inline">رزرو تاریخ</span>
        </Link>
      </div>
      
      <nav className="md:hidden flex items-center justify-center gap-2 sm:gap-4 border-t border-border/40 py-2 sm:py-2.5 px-2 overflow-x-auto">
        <Link to="/" className={linkBase} activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }}>خانه</Link>
        <span className="text-border/40">|</span>
        <Link to="/halls" className={linkBase} activeProps={{ className: "text-primary" }}>سالن‌ها</Link>
        <span className="text-border/40">|</span>
        <Link to="/menu" className={linkBase} activeProps={{ className: "text-primary" }}>منو</Link>
        <span className="text-border/40">|</span>
        <Link to="/booking" className={linkBase} activeProps={{ className: "text-primary" }}>رزرو</Link>
        <span className="text-border/40">|</span>
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
    <footer className="border-t border-border/60 bg-card/40 mt-16 sm:mt-24">
      <div className="mx-auto max-w-full sm:max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-12 grid gap-6 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-right">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <BrandMark className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-gold flex-shrink-0" />
            <span className="font-display text-lg sm:text-xl font-semibold text-gradient-gold">تالار باران</span>
          </div>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-6 sm:leading-7 text-muted-foreground max-w-xs">
            میزبان لحظه‌های ماندگار شما در گناباد. سالن‌های مجزای آقایان و خانم‌ها با کیفیت برتر پذیرایی.
          </p>
        </div>

        <div className="text-center sm:text-right">
          <h4 className="text-sm font-semibold text-foreground mb-3 sm:mb-4">تماس</h4>
          <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
            <li className="break-words">{address}</li>
            <li>تلفن: <span className="text-foreground block sm:inline">{phone}</span></li>
            <li>همراه: <span className="text-foreground block sm:inline">{mobile}</span></li>
          </ul>
        </div>

        <div className="text-center sm:text-right">
          <h4 className="text-sm font-semibold text-foreground mb-3 sm:mb-4">دسترسی سریع</h4>
          <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
            <li><Link to="/halls" className="text-muted-foreground hover:text-primary transition">سالن‌ها</Link></li>
            <li><Link to="/booking" className="text-muted-foreground hover:text-primary transition">رزرو آنلاین</Link></li>
            <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition">تماس با ما</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/40 py-4 sm:py-5 text-center text-xs text-muted-foreground px-3">
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

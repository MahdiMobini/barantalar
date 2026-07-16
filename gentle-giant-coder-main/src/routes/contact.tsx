import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تماس با ما — تالار باران گناباد" },
      { name: "description", content: "آدرس، تلفن و ساعات کاری تالار باران در گناباد، خراسان رضوی." },
      { property: "og:title", content: "تماس با تالار باران" },
      { property: "og:description", content: "آدرس و تلفن تالار باران گناباد." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: mainHall, isLoading } = useQuery({
    queryKey: ["mainHall"],
    queryFn: api.getMainHall,
    staleTime: 1000 * 60 * 5,
  });

  const mapEmbedUrl =
    mainHall?.latitude && mainHall?.longitude
      ? `https://maps.google.com/maps?q=${mainHall.latitude},${mainHall.longitude}&z=16&output=embed`
      : null;

  const directionsUrl =
    mainHall?.latitude && mainHall?.longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${mainHall.latitude},${mainHall.longitude}`
      : null;

  const rows = [
    {
      label: "آدرس",
      value: mainHall?.address,
      icon: <IconPin />,
    },
    {
      label: "تلفن ثابت",
      value: mainHall?.phone,
      icon: <IconPhone />,
    },
    {
      label: "موبایل",
      value: mainHall?.mobile,
      icon: <IconPhone />,
    },
    {
      label: "ساعات کاری",
      value: "همه‌روزه از ۹ صبح تا ۱۱ شب",
      icon: <IconClock />,
    },
  ];

  return (
    <div dir="rtl" className="mx-auto max-w-full sm:max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary">تماس</span>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">تماس <span className="text-gradient-gold">با ما</span></h1>
        <p className="mt-4 sm:mt-5 text-sm sm:text-base text-muted-foreground leading-6 sm:leading-8">
          برای رزرو، بازدید حضوری از تالار یا هرگونه سؤال، در کنار شما هستیم.
        </p>
      </div>

      <div className="mt-10 sm:mt-12 lg:mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="rounded-2xl sm:rounded-3xl border border-border/60 bg-card p-5 sm:p-6 lg:p-8">
          <h2 className="font-display text-xl sm:text-2xl font-semibold">اطلاعات تماس</h2>
          <ul className="mt-6 sm:mt-8 space-y-4 sm:space-y-6 text-sm">
            {rows.map((row) => (
              <ContactRow
                key={row.label}
                label={row.label}
                value={row.value}
                icon={row.icon}
                isLoading={isLoading}
              />
            ))}
          </ul>

          <div className="mt-8 sm:mt-10 rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5">
            <p className="text-sm text-foreground/85 leading-7">
              برای مشاهده حضوری سالن‌ها لطفاً قبل از مراجعه، تماس بگیرید تا هماهنگی لازم انجام شود.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-border/60 bg-card">
          {mapEmbedUrl ? (
            <>
              <iframe
                title="Baran Hall location on map"
                src={mapEmbedUrl}
                className="h-64 w-full sm:h-80 lg:h-96 grayscale-[40%] contrast-110"
                loading="lazy"
                style={{ border: 0 }}
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="border-t border-border/60 p-4 sm:p-5">
                <a
                  href={directionsUrl ?? "#"}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
                >
                  مسیر یابی در گوگل مپس
                </a>
              </div>
            </>
          ) : (
            <div className="flex min-h-[256px] items-center justify-center px-6 py-10 text-center text-sm text-muted-foreground sm:min-h-[320px] lg:min-h-[384px]">
              موقعیت نقشه به زودی اضافه می‌شود.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  label,
  value,
  icon,
  isLoading,
}: {
  label: string;
  value?: string | null;
  icon: React.ReactNode;
  isLoading?: boolean;
}) {
  return (
    <li className="flex items-start gap-4">
      <span className="grid h-10 w-10 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary shrink-0">{icon}</span>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        {isLoading && !value ? (
          <Skeleton className="mt-2 h-5 w-48 rounded-lg" />
        ) : (
          <div className="mt-1 font-medium text-foreground">
            {value ?? "به‌زودی در پنل درج می‌شود"}
          </div>
        )}
      </div>
    </li>
  );
}

function IconPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
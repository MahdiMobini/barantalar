import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { api, faNum } from "@/lib/api";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "رزرو آنلاین — تالار باران گناباد" },
      { name: "description", content: "رزرو تاریخ مراسم در تالار باران گناباد در چهار قدم: ثبت شماره، تأیید هویت، انتخاب تاریخ و پرداخت بیعانه." },
      { property: "og:title", content: "رزرو آنلاین تالار باران" },
      { property: "og:description", content: "چهار قدم تا رزرو قطعی تاریخ مراسم." },
    ],
  }),
  component: BookingPage,
});

type Step = "phone" | "otp" | "form" | "done";
const STEPS: { key: Step; label: string }[] = [
  { key: "phone", label: "شماره" },
  { key: "otp", label: "تأیید" },
  { key: "form", label: "رزرو" },
  { key: "done", label: "تکمیل" },
];

function BookingPage() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [reservationCode, setReservationCode] = useState<string | number | null>(null);

  return (
    <div dir="rtl" className="mx-auto max-w-full sm:max-w-2xl lg:max-w-3xl px-3 sm:px-4 md:px-6 py-12 sm:py-16">
      <div className="text-center">
        <span className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary">رزرو آنلاین</span>
        <h1 className="mt-2 sm:mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold">
          تاریخ <span className="text-gradient-gold">دلخواه</span> خود را رزرو کنید
        </h1>
      </div>

      <Stepper current={step} />

      <div className="mt-8 sm:mt-10 rounded-2xl sm:rounded-3xl border border-border/60 bg-card/60 backdrop-blur p-5 sm:p-8 lg:p-10 shadow-2xl">
        {step === "phone" && (
          <PhoneStep
            onSent={(p) => { setPhone(p); setStep("otp"); }}
          />
        )}
        {step === "otp" && (
          <OtpStep
            phone={phone}
            onBack={() => setStep("phone")}
            onVerified={() => setStep("form")}
          />
        )}
        {step === "form" && (
          <FormStep
            phone={phone}
            onDone={(id) => { setReservationCode(id); setStep("done"); }}
          />
        )}
        {step === "done" && <DoneStep code={reservationCode} />}
      </div>
    </div>
  );
}

function Stepper({ current }: { current: Step }) {
  const idx = STEPS.findIndex((s) => s.key === current);
  return (
    <div className="mt-8 sm:mt-12 flex items-center justify-between gap-1 sm:gap-2 md:gap-4">
      {STEPS.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={s.key} className="flex-1 flex items-center gap-1 sm:gap-2 md:gap-3">
            <div className="flex flex-col items-center gap-1 sm:gap-2 flex-1 min-w-0">
              <div className={`grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-full text-xs sm:text-sm font-semibold transition-all flex-shrink-0
                ${done ? "gradient-gold text-primary-foreground" :
                  active ? "border-2 border-primary text-primary bg-background" :
                  "border border-border text-muted-foreground bg-background"}`}>
                {done ? "✓" : faNum(i + 1)}
              </div>
              <span className={`text-[10px] sm:text-xs text-center line-clamp-1 ${active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px flex-1 mb-6 min-w-0 ${i < idx ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- STEP 1: phone ---------- */
function PhoneStep({ onSent }: { onSent: (phone: string) => void }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const valid = /^09\d{9}$/.test(phone);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return setError("شماره موبایل معتبر نیست");
    setLoading(true); setError(null);
    try {
      await api.sendOTP(phone);
      onSent(phone);
    } catch (err) {
      setError((err as Error).message || "ارسال کد با خطا مواجه شد");
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-5 sm:space-y-6 animate-fade-up">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-semibold">شماره موبایل خود را وارد کنید</h2>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
          یک کد تأیید به این شماره ارسال خواهد شد.
        </p>
      </div>
      <div>
        <label className="text-xs sm:text-sm text-muted-foreground">شماره موبایل</label>
        <input
          type="tel"
          inputMode="numeric"
          maxLength={11}
          dir="ltr"
          placeholder="09xxxxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 sm:py-3.5 text-lg tracking-widest font-mono focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition min-h-[44px]"
          required
        />
        {error && <p className="mt-2 text-xs sm:text-sm text-destructive">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={!valid || loading}
        className="w-full rounded-xl gradient-gold py-3 sm:py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-transform enabled:hover:scale-105 active:scale-95 shadow-[0_10px_40px_-15px_oklch(0.76_0.13_85/0.7)] min-h-[44px] sm:min-h-[48px]"
      >
        {loading ? "در حال ارسال…" : "ارسال کد تأیید"}
      </button>
    </form>
  );
}

/* ---------- STEP 2: OTP ---------- */
function OtpStep({ phone, onBack, onVerified }: { phone: string; onBack: () => void; onVerified: () => void }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6) return;
    setLoading(true); setError(null);
    try {
      const res = await api.verifyOTP(phone, code);
      localStorage.setItem("access_token", res.access);
      localStorage.setItem("refresh_token", res.refresh);
      onVerified();
    } catch (err) {
      setError((err as Error).message || "کد نامعتبر است");
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-5 sm:space-y-6 animate-fade-up">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-semibold">کد تأیید را وارد کنید</h2>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
          کد ۶ رقمی ارسال‌شده به <span dir="ltr" className="font-mono text-foreground">{phone}</span>
        </p>
      </div>
      <div>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          dir="ltr"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="------"
          className="w-full rounded-xl border border-border bg-background px-4 py-4 sm:py-5 text-2xl sm:text-3xl tracking-[0.8em] font-mono text-center focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition min-h-[56px] sm:min-h-[64px]"
          autoFocus
        />
        {error && <p className="mt-2 text-xs sm:text-sm text-destructive">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={code.length !== 6 || loading}
        className="w-full rounded-xl gradient-gold py-3 sm:py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-transform enabled:hover:scale-105 active:scale-95 min-h-[44px] sm:min-h-[48px]"
      >
        {loading ? "در حال تأیید…" : "تأیید کد"}
      </button>
      <button
        type="button"
        onClick={onBack}
        className="block mx-auto text-xs sm:text-sm text-muted-foreground hover:text-primary transition min-h-[44px] flex items-center justify-center"
      >
        ویرایش شماره
      </button>
    </form>
  );
}

/* ---------- STEP 3: Reservation Form ---------- */
function jalaliToGregorian(jy: number, jm: number, jd: number) {
  jy += 1595;
  let days = -355668 + (365 * jy) + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4) + jd + (jm < 7 ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
  let gy = 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  let sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm;
  for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
  return [gy, gm, gd];
}

function FormStep({ phone, onDone }: { phone: string; onDone: (id: string | number) => void }) {
  // گرفتن تاریخ امروز به فرمت YYYY-MM-DD
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  
  // محاسبه داینامیک سال شمسی فعلی
  const currentJalaliYear = new Date().getFullYear() - 621;

  const [name, setName] = useState("");
  
  // قرار دادن سال جاری به عنوان مقدار پیش‌فرض
  const [jYear, setJYear] = useState(currentJalaliYear);
  const [jMonth, setJMonth] = useState(5);
  const [jDay, setJDay] = useState(1);

  const [shift, setShift] = useState<"noon" | "night">("night");
  const [guests, setGuests] = useState(100);
  const [notes, setNotes] = useState("");

  const [availability, setAvailability] = useState<null | boolean>(null);
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // استیت‌های جدید برای هندل کردن کاربری که از قبل رزرو دارد
  const [alreadyReserved, setAlreadyReserved] = useState(false);
  const [reservationInfo, setReservationInfo] = useState<any>(null);

  // تبدیل تاریخ شمسی به میلادی
  const gregorianDate = useMemo(() => {
    const [gy, gm, gd] = jalaliToGregorian(jYear, jMonth, jDay);
    return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
  }, [jYear, jMonth, jDay]);

  // بررسی اینکه آیا تاریخ انتخاب شده گذشته است یا نه؟
  const isPastDate = gregorianDate < today;

  // بررسی وضعیت پر بودن رزرو با API و چک کردن رزرو قبلی کاربر
  useEffect(() => {
    if (isPastDate) {
      setAvailability(null);
      return;
    }
    
    let cancelled = false;
    setChecking(true); setAvailability(null);
    api.checkAvailability(gregorianDate, shift)
      .then((r) => { 
        if (!cancelled) {
          // اگر کاربر رزرو فعال داشت
          if (r.already_reserved) {
            setAlreadyReserved(true);
            setReservationInfo(r.reservation_info);
          } else {
            // اگر رزرو نداشت، فقط وضعیت ظرفیت سالن را چک کن
            setAvailability(r.available);
            setAlreadyReserved(false);
          }
        } 
      })
      .catch(() => { if (!cancelled) setAvailability(null); })
      .finally(() => { if (!cancelled) setChecking(false); });
    return () => { cancelled = true; };
  }, [gregorianDate, shift, isPastDate]);

  const canSubmit = name.trim() && gregorianDate && availability === true && !loading && !isPastDate;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true); setError(null);
    try {
      const res = await api.createReservation({
        date: gregorianDate, shift, customer_name: name.trim(), phone_number: phone, guests, notes: notes.trim() || undefined,
      });
      onDone(res.id);
    } catch (err) {
      setError((err as Error).message || "ثبت رزرو با خطا مواجه شد");
    } finally { setLoading(false); }
  }

  const days = Array.from({ length: jMonth <= 6 ? 31 : 30 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 5 }, (_, i) => currentJalaliYear + i);

  // ---------- نمایش کارت رزرو فعال (در صورت وجود) ----------
  if (alreadyReserved && reservationInfo) {
    return (
      <div className="space-y-5 sm:space-y-7 animate-fade-up text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10 mb-4 shadow-inner">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-semibold">شما یک رزرو فعال دارید!</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">امکان ثبت رزرو جدید تا تعیین تکلیف رزرو فعلی وجود ندارد.</p>

        <div className="mt-6 text-right bg-card/60 border border-border p-5 rounded-2xl space-y-4 shadow-sm">
          <div className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-muted-foreground text-xs sm:text-sm">نام رزرو کننده:</span>
            <span className="font-semibold text-sm sm:text-base">{reservationInfo.customer_name}</span>
          </div>
          <div className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-muted-foreground text-xs sm:text-sm">تاریخ مراسم:</span>
            <span className="font-semibold text-sm sm:text-base">
                {new Date(reservationInfo.date).toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </span>
          </div>
          <div className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-muted-foreground text-xs sm:text-sm">شیفت:</span>
            <span className="font-semibold text-sm sm:text-base">{reservationInfo.shift === 'noon' ? 'ظهر' : 'شب'}</span>
          </div>
          <div className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-muted-foreground text-xs sm:text-sm">تعداد مهمانان:</span>
            <span className="font-semibold text-sm sm:text-base">{faNum(reservationInfo.guests)} نفر</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-xs sm:text-sm">وضعیت رزرو:</span>
            <span className="font-semibold text-primary text-sm sm:text-base">{
              reservationInfo.status === 'pending' ? 'در انتظار بیعانه' :
              reservationInfo.status === 'confirmed' ? 'تایید شده' : reservationInfo.status
            }</span>
          </div>
        </div>
      </div>
    );
  }

  // ---------- نمایش فرم اصلی رزرو ----------
  return (
    <form onSubmit={submit} className="space-y-5 sm:space-y-7 animate-fade-up">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-semibold">جزئیات مراسم</h2>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">اطلاعات زیر را با دقت تکمیل کنید.</p>
      </div>

      <Field label="نام و نام خانوادگی">
        <input
          type="text" value={name} onChange={(e) => setName(e.target.value)} required
          className="w-full rounded-xl border border-border bg-background px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition min-h-[44px]"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <Field label="تاریخ مراسم">
          <div className="flex gap-2 w-full" dir="ltr">
            <select value={jYear} onChange={(e) => setJYear(Number(e.target.value))} className="w-1/3 rounded-xl border border-border bg-background px-2 py-2.5 sm:py-3 text-sm focus:border-primary outline-none">
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select value={jMonth} onChange={(e) => setJMonth(Number(e.target.value))} className="w-1/3 rounded-xl border border-border bg-background px-2 py-2.5 sm:py-3 text-sm focus:border-primary outline-none">
              {months.map(m => <option key={m} value={m}>{String(m).padStart(2, '0')}</option>)}
            </select>
            <select value={jDay} onChange={(e) => setJDay(Number(e.target.value))} className="w-1/3 rounded-xl border border-border bg-background px-2 py-2.5 sm:py-3 text-sm focus:border-primary outline-none">
              {days.map(d => <option key={d} value={d}>{String(d).padStart(2, '0')}</option>)}
            </select>
          </div>
        </Field>
        <Field label="شیفت">
          <ToggleGroup
            value={shift}
            onChange={(v) => setShift(v as "noon" | "night")}
            options={[{ value: "noon", label: "ظهر" }, { value: "night", label: "شب" }]}
          />
        </Field>
      </div>

      {isPastDate ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-destructive transition-all">
          ✗ امکان رزرو تاریخ‌های گذشته وجود ندارد
        </div>
      ) : gregorianDate && (
        <div
          className={`rounded-xl border px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm transition-all
            ${checking ? "border-border bg-muted/40 text-muted-foreground" :
              availability === true ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" :
              availability === false ? "border-destructive/40 bg-destructive/10 text-destructive" :
              "border-border bg-muted/40 text-muted-foreground"}`}
        >
          {checking ? "در حال بررسی وضعیت…" :
            availability === true ? "✓ این تاریخ آزاد است" :
            availability === false ? "✗ این تاریخ رزرو شده است" :
            "وضعیت قابل بررسی نیست"}
        </div>
      )}

      <Field label={`تعداد مهمانان: ${faNum(guests)} نفر`}>
        <input
          type="range" min={200} max={1500} step={10} value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full accent-[oklch(0.76_0.13_85)]"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1.5 sm:mt-2">
          <span>{faNum(200)}</span><span>{faNum(1500)}</span>
        </div>
      </Field>

      <Field label="توضیحات (اختیاری)">
        <textarea
          rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:border-primary outline-none transition resize-none min-h-[96px]"
        />
      </Field>

      {error && <p className="text-xs sm:text-sm text-destructive">{error}</p>}

      <button
        type="submit" disabled={!canSubmit}
        className="w-full rounded-xl gradient-gold py-3 sm:py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-transform enabled:hover:scale-105 active:scale-95 min-h-[44px] sm:min-h-[48px]"
      >
        {loading ? "در حال ثبت رزرو…" : "ثبت رزرو"}
      </button>
    </form>
  );
}
function ToggleGroup({
  value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 rounded-xl border border-border bg-background p-1">
        {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value} type="button" onClick={() => onChange(o.value)}
            className={`rounded-lg py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all min-h-[44px] sm:min-h-[48px]
              ${active ? "gradient-gold text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">{label}</label>
      {children}
    </div>
  );
}

/* ---------- STEP 4: Done ---------- */
function DoneStep({ code }: { code: string | number | null }) {
  return (
    <div className="text-center py-6 sm:py-8 animate-fade-up">
      <div className="mx-auto grid h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 place-items-center rounded-full gradient-gold check-pop shadow-[0_15px_50px_-10px_oklch(0.76_0.13_85/0.7)] flex-shrink-0">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground sm:w-10 sm:h-10">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h2 className="mt-6 sm:mt-8 font-display text-2xl sm:text-3xl font-bold">رزرو شما ثبت شد</h2>
      <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground">به‌زودی برای هماهنگی نهایی با شما تماس خواهیم گرفت.</p>

      {code != null && (
        <div className="mt-6 sm:mt-8 inline-flex flex-col items-center rounded-xl sm:rounded-2xl border border-primary/30 bg-primary/5 px-5 sm:px-8 py-4 sm:py-5">
          <span className="text-xs text-muted-foreground">کد پیگیری</span>
          <span dir="ltr" className="mt-1 sm:mt-2 font-mono text-xl sm:text-2xl font-bold text-gradient-gold">{faNum(String(code))}</span>
        </div>
      )}

      <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-muted-foreground max-w-xs sm:max-w-md mx-auto leading-6 sm:leading-7">
        برای پرداخت بیعانه با تالار تماس بگیرید. پس از پرداخت، رزرو شما قطعی خواهد شد.
      </p>

      <Link to="/" className="mt-8 sm:mt-10 inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm hover:bg-card transition min-h-[44px]">
        بازگشت به خانه
      </Link>
    </div>
  );
}
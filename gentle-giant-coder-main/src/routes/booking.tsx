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
function FormStep({ phone, onDone }: { phone: string; onDone: (id: string | number) => void }) {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [shift, setShift] = useState<"noon" | "night">("night");
  const [guests, setGuests] = useState(100);
  const [notes, setNotes] = useState("");

  const [availability, setAvailability] = useState<null | boolean>(null);
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // availability check
  useEffect(() => {
    if (!date) { setAvailability(null); return; }
    let cancelled = false;
    setChecking(true); setAvailability(null);
    api.checkAvailability(date, shift)
      .then((r) => { if (!cancelled) setAvailability(r.available); })
      .catch(() => { if (!cancelled) setAvailability(null); })
      .finally(() => { if (!cancelled) setChecking(false); });
    return () => { cancelled = true; };
  }, [date, shift]);

  const canSubmit = name.trim() && date && availability === true && !loading;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true); setError(null);
    try {
      const res = await api.createReservation({
        date, shift, customer_name: name.trim(), phone_number: phone, guests, notes: notes.trim() || undefined,
      });
      onDone(res.id);
    } catch (err) {
      setError((err as Error).message || "ثبت رزرو با خطا مواجه شد");
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-5 sm:space-y-7 animate-fade-up">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-semibold">جزئیات مراسم</h2>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">اطلاعات زیر را با دقت تکمیل کنید.</p>
      </div>

      <Field label="نام و نام خانوادگی">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-xl border border-border bg-background px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition min-h-[44px]"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <Field label="تاریخ مراسم">
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full rounded-xl border border-border bg-background px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition min-h-[44px]"
          />
        </Field>
        <Field label="شیفت">
          <ToggleGroup
            value={shift}
            onChange={(v) => setShift(v as "noon" | "night")}
            options={[{ value: "noon", label: "ظهر" }, { value: "night", label: "شب" }]}
          />
        </Field>
      </div>

      {date && (
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
          type="range" min={20} max={400} step={10}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full accent-[oklch(0.76_0.13_85)]"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1.5 sm:mt-2">
          <span>{faNum(20)}</span><span>{faNum(400)}</span>
        </div>
      </Field>

      <Field label="توضیحات (اختیاری)">
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition resize-none min-h-[96px]"
        />
      </Field>

      {error && <p className="text-xs sm:text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-xl gradient-gold py-3 sm:py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-transform enabled:hover:scale-105 active:scale-95 min-h-[44px] sm:min-h-[48px]"
      >
        {loading ? "در حال ثبت رزرو…" : "ثبت رزرو"}
      </button>
    </form>
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
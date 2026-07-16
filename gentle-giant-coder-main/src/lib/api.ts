import type {
  MainHall,
  Hall,
  MenuItem,
  SpecialMenu,
  SelfService,
} from "./types";

const BASE_URL = "http://127.0.0.1:8000/api";
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return (data?.error as string) || (data?.detail as string) || "خطایی رخ داد";
  } catch {
    return "خطایی در ارتباط با سرور رخ داد";
  }
}

export const api = {
  sendOTP: async (phone_number: string) => {
    const res = await fetch(`${BASE_URL}/auth/send-otp/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number }),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  },

  verifyOTP: async (phone_number: string, code: string) => {
    const res = await fetch(`${BASE_URL}/auth/verify-otp/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number, code }),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<{ access: string; refresh: string }>;
  },

  checkAvailability: async (date: string, shift: string) => {
    const res = await fetch(
      `${BASE_URL}/reservations/check/?date=${date}&shift=${shift}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken() ?? ""}`,
        },
      }
    );
    if (!res.ok) throw new Error("خطا در بررسی وضعیت");
    return res.json() as Promise<{ 
      available: boolean; 
      already_reserved?: boolean;
      reservation_info?: any; 
    }>;
  },

  createReservation: async (data: {
    date: string;
    shift: string;
    customer_name: string;
    phone_number: string;
    guests: number;
    notes?: string;
  }) => {
    const res = await fetch(`${BASE_URL}/reservations/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken() ?? ""}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<{ id: string | number }>;
  },

  getMainHall: async () => {
    const res = await fetch(`${BASE_URL}/content/main-hall/`);
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<MainHall>;
  },

  getHalls: async () => {
    const res = await fetch(`${BASE_URL}/content/halls/`);
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<Hall[]>;
  },

  getMenuItems: async () => {
    const res = await fetch(`${BASE_URL}/menu/items/`);
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<MenuItem[]>;
  },

  getSpecialMenus: async () => {
    const res = await fetch(`${BASE_URL}/menu/special/`);
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<SpecialMenu[]>;
  },

  getSelfService: async () => {
    const res = await fetch(`${BASE_URL}/menu/self-service/`);
    if (!res.ok) throw new Error(await parseError(res));
    return res.json() as Promise<SelfService[]>;
  },
};

export const formatPrice = (n: number | string) =>
  `${Number(n).toLocaleString("fa-IR")} ریال`;

export const faNum = (n: number | string) =>
  Number(n).toLocaleString("fa-IR");
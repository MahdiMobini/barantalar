export interface MainHallImage {
  id: number;
  image: string;
  caption: string;
  order: number;
}

export interface MainHall {
  address: string;
  phone: string;
  mobile: string;
  latitude: string | null;
  longitude: string | null;
  images: MainHallImage[];
}

export type HallName = "man" | "women";

export interface HallImage {
  id: number;
  image: string;
  caption: string;
  order: number;
}

export interface Hall {
  id: number;
  name: HallName;
  capacity: number;
  description: string;
  images: HallImage[];
}

export interface RiceOption {
  id: number;
  rice_type: "none" | "pakistani" | "iranian";
  rice_type_display: string;
  price: number;
  order: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  is_available: boolean;
  rice_options: RiceOption[];
}

export interface SpecialMenu {
  id: number;
  name: string;
  description: string;
  price: number;
  is_available: boolean;
}

export interface SelfService {
  id: number;
  name: string;
  price: number;
  is_available: boolean;
}

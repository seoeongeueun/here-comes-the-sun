import type { City } from "@/entities/city";

export interface Favorite extends City {
  nickname: string;
}

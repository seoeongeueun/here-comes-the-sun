import type { ImgHTMLAttributes } from "react";
import type { WeatherEmoji } from "@/entities/weather";

interface WeatherImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  size: "small" | "medium" | "large";
  weather: WeatherEmoji;
}

export function WeatherImage({ size, weather }: WeatherImageProps) {
  return (
    <img
      loading="lazy"
      width={size === "small" ? 24 : size === "medium" ? 48 : 64}
      height={size === "small" ? 24 : size === "medium" ? 48 : 64}
      alt={`${weather} weather icon`}
      src={`/weather/${weather}.png`}
      className="object-contain"
    />
  );
}

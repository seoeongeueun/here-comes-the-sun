import type { City } from "@/entities/city";

export function fillCityMarkerContent(city: City) {
  return `
    <article class="city-marker" role="button" tabindex="0" aria-label="${
      city.name
    } 날씨 정보">
        <span class="text-md" aria-hidden="true">☀️</span>    
        <div class="flex flex-row items-center justify-between px-1 w-full h-fit gap-1">
            <h3>${city.name}</h3>
            <span>${"25°"}C</span>
        </div>
    </article>
  `;
}

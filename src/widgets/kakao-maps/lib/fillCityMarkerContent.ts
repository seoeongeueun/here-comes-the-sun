import type { City } from "@/entities/city";

export function fillCityMarkerContent(city: City) {
  return `
    <article class="city-marker" role="button" tabindex="0" aria-label="${
      city.sido
    } 날씨 정보">
        <span class="text-md" aria-hidden="true">☀️</span>    
        <div class="flex flex-col items-center justify-between px-1 w-full h-fit gap-0.5 truncate">
            <div class="flex flex-row items-center justify-between w-full gap-1 text-xs">
                <h3>${city.sido}</h3>
                <p class="text-xxs text-orange-500">${"25°"}C</p>
            </div>
            <span class="text-xxs truncate w-full text-secondary">${
              city.sigungu ?? ""
            } ${city.dong ?? ""}</span>
        </div>
    </article>
  `;
}

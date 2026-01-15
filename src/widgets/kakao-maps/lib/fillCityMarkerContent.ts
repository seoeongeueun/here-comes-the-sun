import type { City } from "@/entities/city";

export function fillCityMarkerContent(city: City) {
  return `
    <article class="city-marker" role="button" tabindex="0" aria-label="${
      city.sido
    } 날씨 정보">
        <span class="text-md" aria-hidden="true">☀️</span>    
        <div class="flex flex-col items-center justify-between px-1 w-full h-fit gap-1 truncate">
            <div class="flex flex-row items-center justify-between w-full">
                <h3>${city.sido}</h3>
                <h3>${"25°"}C</h3>
            </div>
            
            <span class="text-xxs truncate w-full">${city.sigungu ?? ""} ${
    city.dong ?? ""
  }</span>
        </div>
    </article>
  `;
}

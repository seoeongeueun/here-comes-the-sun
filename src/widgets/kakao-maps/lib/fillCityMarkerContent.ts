import type { City } from "@/entities/city";

export function fillCityMarkerContent(city: City) {
  return `
    <article class="city-marker" role="button" tabindex="0" aria-label="${
      city.sido
    } 날씨 정보">
        ${fillFavoriteMarkerContent(city)}
        <span id="weather-emoji" class="text-md h-8 w-8 flex items-center justify-center bg-background rounded-sm animate-[pulse_1.6s_ease-in-out_infinite] transition-colors duration-300" aria-hidden="true"></span>    
        <div class="flex flex-col items-center justify-between px-1 w-full h-fit gap-0.5 truncate">
            <div class="flex flex-row items-center justify-between w-full gap-1 text-xs">
                <h3>${city.sido}</h3>
                <p id="temperature" class="text-xxs text-orange-500 min-w-4 h-4 bg-background rounded-sm animate-[pulse_1.6s_ease-in-out_infinite] transition-colors duration-300"></p>
            </div>
            <span id="city-secondary" class="text-xxs truncate w-full text-secondary">${
              city.sigungu ?? ""
            } ${city.dong ?? ""}</span>
        </div>
    </article>
  `;
}

function fillFavoriteMarkerContent(city: City) {
  return `
    <button
        id="favorite-button"
        type="button"
        class="star-icon ml-auto hidden"
        data-action="toggle-favorite"
        data-city-id="${city.id}"
        aria-label="즐겨찾기 토글"
      ></button>
  `;
}

import { useEffect, useState } from "react";
import { fetchDistricts } from "@/entities/district/api/fetchDistricts";
import { buildDistrictsIndex } from "@/entities/district/model";
import type { DistrictIndex } from "@/entities/district/model/types";

//TODO: 캐싱 필요
export function useDistrictsIndex() {
  const [index, setIndex] = useState<DistrictIndex | null>(null);

  useEffect(() => {
    fetchDistricts()
      .then((data) => {
        const index = buildDistrictsIndex(data); // 데이터를 먼저 인덱싱
        setIndex(index);
      })
      .catch((e) => console.error(e));
  }, []);

  return index;
}

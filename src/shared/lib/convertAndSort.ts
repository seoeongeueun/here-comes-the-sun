// 맵의 value인 set를 배열로 변환해서 정렬하고 다시 맵으로 반환
export function convertAndSort<K, V>(map: Map<K, Set<V>>): Map<K, V[]> {
  const result = new Map<K, V[]>();
  for (const [key, set] of map.entries()) {
    result.set(key, Array.from(set).sort());
  }
  return result;
}

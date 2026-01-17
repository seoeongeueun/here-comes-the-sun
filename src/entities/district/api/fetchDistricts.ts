export async function fetchDistricts(): Promise<string[]> {
  const res = await fetch("/data/korea_districts.json");
  if (!res.ok) throw new Error("Failed to load korea-districts.json");
  return res.json(); // string[]
}

export const routes = {
  home: "/",
  infoDetailPattern: "/info/:id",
  infoDetail: (id: string) => `/info/${encodeURIComponent(id)}`,
} as const;

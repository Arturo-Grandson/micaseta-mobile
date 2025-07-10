export const PAGES = {
  HOME: "/",
  LOGIN: "/auth/login",
  DASHBOARD: "/dashboard",
  SELECT_BOOTH: "/select-booth",
  CONSUMPTIONS: "/consumptions",
  PENALTIES: "/penalties",
  EXPENSES: "/expenses",
};

export const API_ROUTES = {
  LOGIN: "/auth/login",
  REFRESH_TOKEN: "/auth/refresh",
  SELECT_BOOTH: "/users/select-booth",
  USER_BOOTHS: (userId: number) => `/users/${userId}/booths`,
  CONSUMPTIONS: (userId: number, boothId: number) =>
    `/consumption/user/${userId}/booth/${boothId}`,
  CREATE_CONSUMPTION: "/consumption",
  PENALTIES: (userId: number, boothId: number) =>
    `/penalty/user/${userId}/booth/${boothId}`,
  CREATE_PENALTY: "/penalty",
  COMMON_EXPENSES: (boothId: number, year: number) =>
    `/expenses/common-expense/${boothId}/${year}`,
  CREATE_COMMON_EXPENSE: "/expenses/common-expense",
  BOOTH_PRODUCTS: (boothId: number) => `/product/booth/${boothId}`,
};

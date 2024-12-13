import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse } from "@/types/index.d";

const REVENUE_API = {
  TOTAL: () => `revenue/total`,
  MONTHLY: (year: number, month: number, duration: number) =>
    `/revenue/monthly?year=${year}&month=${month}&duration=${duration}`,
  YEARLY: (year: number, duration: number) =>
    `/revenue/yearly?year=${year}&duration=${duration}`,
} as const;

export const revenueService = {
  TOTAL: () => fetchHandler<ApiResponse>(REVENUE_API.TOTAL(), "GET"),

  MONTHLY: (year: number, month: number, duration: number) =>
    fetchHandler<ApiResponse>(
      REVENUE_API.MONTHLY(year, month, duration),
      "GET"
    ),

  YEARLY: (year: number, duration: number) =>
    fetchHandler<ApiResponse>(REVENUE_API.YEARLY(year, duration), "GET"),
};

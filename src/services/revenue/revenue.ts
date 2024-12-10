import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse } from "@/types/index.d";

const REVENUE_API = {
  TOTAL: (projectId: number) => `revenue/total/${projectId}`,
  MONTHLY: (projectId: number, year: number, month: number, duration: number) =>
    `/revenue/monthly?projectId=${projectId}&year=${year}&month=${month}&duration=${duration}`,
  YEARLY: (year: number, duration: number) =>
    `/revenue/yearly?year=${year}&duration=${duration}`, 
} as const;

export const revenueService = {

  TOTAL: (projectId: number) =>
    fetchHandler<ApiResponse>(REVENUE_API.TOTAL(projectId), "GET"),

  MONTHLY: (projectId: number, year: number, month: number, duration: number) =>
    fetchHandler<ApiResponse>(REVENUE_API.MONTHLY(projectId, year, month, duration), "GET"),


  YEARLY: (year: number, duration: number) =>
    fetchHandler<ApiResponse>(REVENUE_API.YEARLY(year, duration), "GET"),
};

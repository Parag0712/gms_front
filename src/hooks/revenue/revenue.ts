import { useQuery } from "@tanstack/react-query";
import { revenueService } from "@/services/revenue/revenue";

// Fetch total revenue for a specific project
export const useRevenueTotal = () => {
  return useQuery({
    queryKey: ["revenue"],
    queryFn: () => revenueService.TOTAL(),
  });
};

// Fetch monthly revenue for a specific year and month
export const useRevenueMonthly = (
  year: number,
  month: number,
  duration: number
) => {
  return useQuery({
    queryKey: ["revenue", year, month, duration],
    queryFn: () => revenueService.MONTHLY(year, month, duration),
    enabled: !!year && !!month,
  });
};

// Fetch yearly revenue for a specific year
export const useRevenueYearly = (year: number, duration: number) => {
  return useQuery({
    queryKey: ["revenue", year, duration],
    queryFn: () => revenueService.YEARLY(year, duration),
    enabled: !!year,
  });
};

export const useCustomRange = (
  startDate: string,
  endDate: string,
  frequency: string,
  status: string
) => {
  return useQuery({
    queryKey: ["revenue", startDate, endDate, frequency, status],
    queryFn: () =>
      revenueService.GETCUSTOMRANGE(startDate, endDate, frequency, status),
    enabled: !!startDate && !!endDate,
  });
};

import { useQuery} from "@tanstack/react-query";
import { revenueService } from "@/services/revenue/revenue";


// Fetch total revenue for a specific project
export const useRevenueTotal = (projectId: number) => {
  return useQuery({
    queryKey: ["revenue", projectId],
    queryFn: () => revenueService.TOTAL(projectId), 
    enabled: !!projectId,
  });
};

export const useRevenueMonthly = (projectId: number, year: number, month: number, duration: number) => {
  return useQuery({
    queryKey: ["revenue", projectId, year, month, duration],
    queryFn: () => revenueService.MONTHLY(projectId, year, month, duration),
    enabled: !!projectId && !!year && !!month,
  });
};

// Fetch yearly revenue for a specific year and duration
export const useRevenueYearly = (year: number, duration: number) => {
  return useQuery({
    queryKey: ["revenue", year, duration],
    queryFn: () => revenueService.YEARLY(year, duration), 
  });
};


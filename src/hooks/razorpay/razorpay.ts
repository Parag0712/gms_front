import { useQuery } from "@tanstack/react-query";
import { razorpayService } from "@/services/razorpay/razorpay";
import { ApiResponse } from "@/types/index.d";

export const useFetchRazorpaySettlements = () => {
  return useQuery<ApiResponse, Error>({
    queryKey: ["razorpaySettlement"],
    queryFn: razorpayService.fetchSettlement,
  });
};

export const useFetchRazorpayOrders = () => {
  return useQuery<ApiResponse, Error>({
    queryKey: ["razorpayOrder"],
    queryFn: razorpayService.fetchOrder,
  });
};

export const useFetchRazorpayPayments = () => {
  return useQuery<ApiResponse, Error>({
    queryKey: ["razorpayPayments"],
    queryFn: razorpayService.fetchPayment,
  });
};

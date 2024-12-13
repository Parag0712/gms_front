import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse } from "@/types/index.d";

const RAZORPAY_API = {
  SETTLEMENT: "/payment/settlements",
  ORDER: "/payment/orders",
  PAYMENT: "/payment/payments",
} as const;

export const razorpayService = {
  fetchSettlement: () =>
    fetchHandler<ApiResponse>(RAZORPAY_API.SETTLEMENT, "GET"),
  fetchOrder: () => fetchHandler<ApiResponse>(RAZORPAY_API.ORDER, "GET"),
  fetchPayment: () => fetchHandler<ApiResponse>(RAZORPAY_API.PAYMENT, "GET"),
};

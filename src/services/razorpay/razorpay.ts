import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse } from "@/types/index.d";

const RAZORPAY_API = {
  GET_ALL_PAYMENTS: "/payments",
} as const;

export const razorpayService = {
  getAllPayments: () =>
    fetchHandler<ApiResponse>(RAZORPAY_API.GET_ALL_PAYMENTS, "GET"),
};

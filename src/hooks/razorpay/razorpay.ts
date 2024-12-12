import { razorpayService } from '@/services/razorpay/razorpay';
import { useQuery } from '@tanstack/react-query';

export const useRazorpayPayments = () => {
    return useQuery({
        queryKey: ['razorpayPayments'],
        queryFn: razorpayService.getAllPayments,
    });
}
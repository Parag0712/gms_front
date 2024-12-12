import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { invoiceService } from "@/services/invoice/invoice";
import {
  handleMutationSuccess,
  handleMutationError,
} from "@/lib/mutation-utils";
import { InvoicePayload } from "@/types/index.d";

export const useInvoices = () => {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: invoiceService.getAll,
  });
};

export const useAddInvoice = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: invoiceService.add,
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["invoices"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useEditInvoice = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: ({
      invoiceId,
      invoiceData,
    }: {
      invoiceId: number;
      invoiceData: Partial<InvoicePayload>;
    }) => invoiceService.edit(invoiceId, invoiceData),
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["invoices"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: (invoiceId: number) => invoiceService.delete(invoiceId),
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["invoices"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useInvoicesByProjectId = (projectId: number) => {
  return useQuery({
    queryKey: ["invoices", projectId],
    queryFn: () => invoiceService.filterByProjectId(projectId),
    enabled: !!projectId,
  });
};

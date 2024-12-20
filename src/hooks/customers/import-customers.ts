import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCustomToast } from "@/components/providers/toaster-provider";

import {
  handleMutationSuccess,
  handleMutationError,
} from "@/lib/mutation-utils";
import { importDataPayload, ApiResponse } from "@/types/index.d";
import { importCustomerService } from "@/services/customers/import-customers";

export const useImportCustomer = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  const mutation = useMutation<ApiResponse, Error, importDataPayload>({
    mutationFn: async (payload: importDataPayload) => {
      const formData = new FormData();
      formData.append("file", payload.file);
      formData.append("projectId", payload.projectId);
      return importCustomerService.import(formData);
    },
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["importData"]),
    onError: (error) => handleMutationError(error, toast),
  });

  return {
    ...mutation,
    isUploading: mutation.isPending,
  };
};

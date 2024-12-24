import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCustomToast } from "@/components/providers/toaster-provider";

import {
  handleMutationSuccess,
  handleMutationError,
} from "@/lib/mutation-utils";
import { importDataPayload, ApiResponse } from "@/types/index.d";
import { importCustomerService } from "@/services/customers/import-customers";

/**
 * Custom hook for handling the customer import process.
 * @returns Mutation object for managing import state and methods.
 */
export const useImportCustomer = () => {
  const queryClient = useQueryClient(); // Query client for cache management
  const toast = useCustomToast(); // Custom toast provider for notifications

  // Mutation for handling customer import
  const importCustomerMutation = useMutation<
    ApiResponse,
    Error,
    importDataPayload
  >({
    mutationFn: async (payload: importDataPayload) => {
      // Prepare FormData with file and projectId
      const formData = new FormData();
      formData.append("file", payload.file);
      formData.append("projectId", payload.projectId);

      // Call the import service
      return importCustomerService.import(formData);
    },
    onSuccess: (response) => {
      // Handle success: Notify user and invalidate relevant cache
      handleMutationSuccess(response, toast, queryClient, ["importData"]);
    },
    onError: (error) => {
      // Handle errors: Display error message via toast
      handleMutationError(error, toast);
    },
  });

  return {
    ...importCustomerMutation,
    isUploading: importCustomerMutation.isPending, // Alias for upload status
  };
};

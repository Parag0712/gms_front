import { fetchHandlerWithFormData } from "@/lib/api-utils";
import { ApiResponse } from "@/types/index.d";

const IMPORTDATA_API = {
  IMPORT: "/import-customer",
} as const;

export const importCustomerService = {
  import: (formData: FormData) =>
    fetchHandlerWithFormData<ApiResponse>(
      IMPORTDATA_API.IMPORT,
      "POST",
      formData
    ),
};

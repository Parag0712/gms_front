import { fetchHandlerWithFormData } from "@/lib/api-utils";
import { ApiResponse } from "@/types/index.d";

// Define API endpoint constants
const IMPORTDATA_API = {
  IMPORT: "/import-customer",
} as const;

// Service for customer import
export const importCustomerService = {
  /**
   * Imports customer data by sending a POST request with form data.
   * @param formData - The FormData object containing the file and projectId.
   * @returns Promise<ApiResponse>
   */
  import: (formData: FormData) =>
    fetchHandlerWithFormData<ApiResponse>(
      IMPORTDATA_API.IMPORT,
      "POST",
      formData
    ),
};

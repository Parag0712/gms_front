import { fetchHandler } from "@/lib/api-utils";

interface ReportResponse {
  statusCode: number;
  data: {
    downloadUrl: string;
    reportDetails: {
      id: number;
      report_type: string;
      file_path: string;
    };
  };
  message: string;
  success: boolean;
}

interface ConsumerReportParams {
  projectId: number;
  startDate?: string;
  endDate?: string;
  singleDate?: string;
}

interface InvoiceReportParams {
  projectId: number;
  startDate?: string;
  endDate?: string;
  singleDate?: string;
  meterId: number;
  flatId?: number;
}

interface PaymentReportParams {
  projectId: number;
  startDate?: string;
  endDate?: string;
  singleDate?: string;
  invoiceId: number;
}

interface OrderReportParams {
  startDate?: string;
  endDate?: string;
  singleDate?: string;
}

interface AllReportParams {
  projectId?: number;
}

const GENERATEREPORTS_API = {
  GET_CONSUMER_REPORT: "/reports/consumer-reading-reports",
  GET_INVOICE_REPORT: "/reports/consumer-reading-reports",
  GET_ORDER_REPORT: "/reports/order-report",
  GET_SETTLEMENT_REPORT: "/reports/settlement-report",
  GET_RECONSILATION_REPORT: "/reports/reconciliation-report",
  GET_PAYMENT_REPORT: "/reports/payment-report",
  GET_ALL: "/reports",
  DOWNLOAD: "/reports/download",
} as const;

export const generateReportService = {
  getConsumerReport: (params: ConsumerReportParams) => {
    const queryParams = new URLSearchParams({
      projectId: params.projectId.toString(),
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate }),
      ...(params.singleDate && { singleDate: params.singleDate }),
    }).toString();

    return fetchHandler<ReportResponse>(
      `${GENERATEREPORTS_API.GET_CONSUMER_REPORT}?${queryParams}`,
      "GET"
    );
  },

  getInvoiceReport: (params: InvoiceReportParams) => {
    const queryParams = new URLSearchParams({
      projectId: params.projectId.toString(),
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate }),
      ...(params.singleDate && { singleDate: params.singleDate }),
      meterId: params.meterId.toString(),
      ...(params.flatId && { flatId: params.flatId.toString() }),
    }).toString();

    return fetchHandler<ReportResponse>(
      `${GENERATEREPORTS_API.GET_INVOICE_REPORT}?${queryParams}`,
      "GET"
    );
  },

  getOrderReport: (params: OrderReportParams) => {
    const queryParams = new URLSearchParams({
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate }),
      ...(params.singleDate && { singleDate: params.singleDate }),
    }).toString();

    return fetchHandler<ReportResponse>(
      `${GENERATEREPORTS_API.GET_ORDER_REPORT}?${queryParams}`,
      "GET"
    );
  },

  getSettlementReport: (params: OrderReportParams) => {
    const queryParams = new URLSearchParams({
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate }),
      ...(params.singleDate && { singleDate: params.singleDate }),
    }).toString();

    return fetchHandler<ReportResponse>(
      `${GENERATEREPORTS_API.GET_SETTLEMENT_REPORT}?${queryParams}`,
      "GET"
    );
  },

  getreconciliationReport: (params: OrderReportParams) => {
    const queryParams = new URLSearchParams({
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate }),
      ...(params.singleDate && { singleDate: params.singleDate }),
    }).toString();

    return fetchHandler<ReportResponse>(
      `${GENERATEREPORTS_API.GET_RECONSILATION_REPORT}?${queryParams}`,
      "GET"
    );
  },

  getpaymentReport: (params: PaymentReportParams) => {
    const queryParams = new URLSearchParams({
      projectId: params.projectId.toString(),
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate }),
      ...(params.singleDate && { singleDate: params.singleDate }),
      invoiceId: params.invoiceId.toString(),
    }).toString();

    return fetchHandler<ReportResponse>(
      `${GENERATEREPORTS_API.GET_PAYMENT_REPORT}?${queryParams}`,
      "GET"
    );
  },

  getAllReports: (params: AllReportParams) => {
    const queryParams = new URLSearchParams({
      ...(params.projectId && { projectId: params.projectId.toString() }),
    }).toString();

    return fetchHandler<ReportResponse>(
      `${GENERATEREPORTS_API.GET_ALL}?${queryParams}`,
      "GET"
    );
  },

  downloadReport: (reportId: number) => {
    return fetchHandler<ReportResponse>(`${GENERATEREPORTS_API.DOWNLOAD}/${reportId}`, "GET");
  },
};

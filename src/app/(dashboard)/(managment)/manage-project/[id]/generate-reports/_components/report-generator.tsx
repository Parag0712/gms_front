"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { generateReportService } from "@/services/generate-report/generate-report";
import { Download } from "lucide-react";
import { useParams } from "next/navigation";
import { getSession } from "next-auth/react";

type ReportType =
  | "consumer"
  | "invoice"
  | "order"
  | "settlement"
  | "reconciliation"
  | "payment";

interface DownloadUrls {
  [key: string]: string;
}

// Define the response type for all report services
interface ReportResponse {
  success: boolean;
  data: {
    downloadUrl: string;
  };
}

interface FormData {
  startDate: string;
  endDate: string;
  singleDate: string;
  meterId: string;
  flatId: string;
  invoiceId: string;
}

export default function ReportGenerator() {
  const [reportType, setReportType] = useState<ReportType>("consumer");
  const [loading, setLoading] = useState(false);
  const [downloadUrls, setDownloadUrls] = useState<DownloadUrls>({
    consumer: "",
    invoiceMeter: "",
    invoiceFlat: "",
    order: "",
    settlement: "",
    reconciliation: "",
    payment: "",
  });

  const [formData, setFormData] = useState<FormData>({
    startDate: "",
    endDate: "",
    singleDate: "",
    meterId: "",
    flatId: "",
    invoiceId: "",
  });

  const params = useParams();
  const projectId = Number(params.id);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGenerate = async (
    reportType: ReportType,
    useMeterId: boolean = true
  ) => {
    setLoading(true);
    try {
      let response: ReportResponse;

      switch (reportType) {
        case "consumer":
          response = await generateReportService.getConsumerReport({
            projectId,
            startDate: formData.startDate,
            endDate: formData.endDate,
            singleDate: formData.singleDate,
          });
          if (response.success) {
            setDownloadUrls((prev) => ({
              ...prev,
              consumer: response.data.downloadUrl,
            }));
          }
          break;
        case "invoice":
          response = await generateReportService.getInvoiceReport({
            projectId,
            startDate: formData.startDate,
            endDate: formData.endDate,
            singleDate: formData.singleDate,
            meterId: useMeterId ? Number(formData.meterId) : 0,
            flatId: !useMeterId ? Number(formData.flatId) : undefined,
          });
          if (response.success) {
            setDownloadUrls((prev) => ({
              ...prev,
              [useMeterId ? "invoiceMeter" : "invoiceFlat"]:
                response.data.downloadUrl,
            }));
          }
          break;
        case "order":
          response = await generateReportService.getOrderReport({
            startDate: formData.startDate,
            endDate: formData.endDate,
            singleDate: formData.singleDate,
          });
          if (response.success) {
            setDownloadUrls((prev) => ({
              ...prev,
              order: response.data.downloadUrl,
            }));
          }
          break;
        case "settlement":
          response = await generateReportService.getSettlementReport({
            startDate: formData.startDate,
            endDate: formData.endDate,
            singleDate: formData.singleDate,
          });
          if (response.success) {
            setDownloadUrls((prev) => ({
              ...prev,
              settlement: response.data.downloadUrl,
            }));
          }
          break;
        case "reconciliation":
          response = await generateReportService.getreconciliationReport({
            startDate: formData.startDate,
            endDate: formData.endDate,
            singleDate: formData.singleDate,
          });
          if (response.success) {
            setDownloadUrls((prev) => ({
              ...prev,
              reconciliation: response.data.downloadUrl,
            }));
          }
          break;
        case "payment":
          response = await generateReportService.getpaymentReport({
            projectId,
            startDate: formData.startDate,
            endDate: formData.endDate,
            singleDate: formData.singleDate,
            invoiceId: Number(formData.invoiceId),
          });
          if (response.success) {
            setDownloadUrls((prev) => ({
              ...prev,
              payment: response.data.downloadUrl,
            }));
          }
          break;
      }
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (downloadUrl: string) => {
    try {
      const session = await getSession();
      const token = session?.user.token;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOWNLOAD}${downloadUrl}`,
        {
          headers: {
            "api-key": process.env.NEXT_PUBLIC_API_KEY || "",
            Authorization: token || "",
          },
        }
      );

      if (!response.ok) throw new Error("Download failed");

      const contentDisposition = response.headers.get("content-disposition");
      let filename = "report";
      if (contentDisposition && contentDisposition.includes("filename=")) {
        filename = contentDisposition
          .split("filename=")[1]
          .replace(/["']/g, "");
      }

      const contentType = response.headers.get("content-type");
      const extension = contentType?.includes("sheet")
        ? ".xlsx"
        : contentType?.includes("pdf")
        ? ".pdf"
        : contentType?.includes("csv")
        ? ".csv"
        : ".xlsx";

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${filename}${extension}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  const renderDateInputs = () => (
    <>
      <div className="grid gap-4">
        <Label>Date Range</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            placeholder="Start Date"
          />
          <Input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            placeholder="End Date"
          />
        </div>
      </div>
      <div className="grid gap-4">
        <Label htmlFor="singleDate">Single Date</Label>
        <Input
          type="date"
          id="singleDate"
          name="singleDate"
          value={formData.singleDate}
          onChange={handleInputChange}
          placeholder="Select Single Date"
        />
      </div>
    </>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold text-primary">
          Generate Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs
          defaultValue="consumer"
          onValueChange={(value) => setReportType(value as ReportType)}
        >
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-6">
            <TabsTrigger value="consumer">Consumer</TabsTrigger>
            <TabsTrigger value="invoice">Invoice</TabsTrigger>
            <TabsTrigger value="order">Order</TabsTrigger>
            <TabsTrigger value="settlement">Settlement</TabsTrigger>
            <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>

          <div className="grid gap-6">
            {reportType === "invoice" ? (
              <>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">
                      Meter Report
                    </Label>
                    <div className="grid gap-4">
                      <Label htmlFor="meterId">Meter ID</Label>
                      <Input
                        id="meterId"
                        name="meterId"
                        value={formData.meterId}
                        onChange={handleInputChange}
                        placeholder="Enter Meter ID"
                      />
                    </div>
                    {renderDateInputs()}
                    <div className="flex gap-4">
                      <Button
                        onClick={() => handleGenerate("invoice", true)}
                        disabled={loading}
                      >
                        {loading ? "Generating..." : "Generate Meter Report"}
                      </Button>
                      {downloadUrls.invoiceMeter && (
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleDownload(downloadUrls.invoiceMeter)
                          }
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Meter Report
                        </Button>
                      )}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Flat Report</Label>
                    <div className="grid gap-4">
                      <Label htmlFor="flatId">Flat ID</Label>
                      <Input
                        id="flatId"
                        name="flatId"
                        value={formData.flatId}
                        onChange={handleInputChange}
                        placeholder="Enter Flat ID"
                      />
                    </div>
                    {renderDateInputs()}
                    <div className="flex gap-4">
                      <Button
                        onClick={() => handleGenerate("invoice", false)}
                        disabled={loading}
                      >
                        {loading ? "Generating..." : "Generate Flat Report"}
                      </Button>
                      {downloadUrls.invoiceFlat && (
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleDownload(downloadUrls.invoiceFlat)
                          }
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Flat Report
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {reportType === "payment" && (
                  <div className="grid gap-4">
                    <Label htmlFor="invoiceId">Invoice ID</Label>
                    <Input
                      id="invoiceId"
                      name="invoiceId"
                      value={formData.invoiceId}
                      onChange={handleInputChange}
                      placeholder="Enter Invoice ID"
                    />
                  </div>
                )}
                {renderDateInputs()}
                <div className="flex gap-4 justify-end">
                  <Button
                    onClick={() => handleGenerate(reportType)}
                    disabled={loading}
                  >
                    {loading ? "Generating..." : "Generate Report"}
                  </Button>
                  {downloadUrls[reportType] && (
                    <Button
                      variant="outline"
                      onClick={() => handleDownload(downloadUrls[reportType])}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}

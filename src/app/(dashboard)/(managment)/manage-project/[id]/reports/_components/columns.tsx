// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Report } from "@/types/index.d";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { getSession } from "next-auth/react";
import { useState } from "react";

// DownloadCell Component
const DownloadCell = ({ reportId }: { reportId: number }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const session = await getSession();
      const token = session?.user.token;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOWNLOAD}/api/v1/reports/download/${reportId}`,
        {
          headers: {
            "api-key": process.env.NEXT_PUBLIC_API_KEY || "",
            Authorization: token || "",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to download report: ${response.status} ${response.statusText}`
        );
      }

      const contentDisposition = response.headers.get("content-disposition");
      const contentType = response.headers.get("content-type");
      const filename =
        contentDisposition?.match(/filename="?([^"]+)"?/)?.[1] || "report";
      const extensions: Record<string, string> = {
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          ".xlsx",
        "application/pdf": ".pdf",
        "text/csv": ".csv",
      };
      const extension = extensions[contentType || ""] || ".xlsx";

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
      console.error("Error downloading report:", (error as Error).message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      variant="outline"
      className="flex items-center gap-2"
    >
      {isDownloading ? (
        <span>Downloading</span>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download
        </>
      )}
    </Button>
  );
};

// Define Columns
export const columns: ColumnDef<Report>[] = [
  {
    accessorKey: "id",
    header: "Report ID",
  },
  {
    accessorKey: "report_type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("report_type") as string;
      return (
        <Badge variant="outline" className="bg-blue-600 text-white">
          {type
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const timestamp = row.getValue("created_at") as string;
      return timestamp
        ? format(new Date(timestamp), "yyyy-MM-dd HH:mm:ss")
        : "N/A";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const reportId = row.original.id ;
      return <DownloadCell reportId={reportId} />;
    },
  },
];

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface Meter {
  id: number;
  meter_id: string;
  installation_at: string;
  img_url?: string;
  gmsFlatId: number;
  status: string;
  gmsFlat: {
    flat_no: string;
  };
  updated_at: string;
  total_units: number;
}

interface MeterDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  meter: Meter | null;
}

const MeterDetails: React.FC<MeterDetailsProps> = ({
  isOpen,
  onClose,
  meter,
}) => {
  if (!meter) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[450px] p-4"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Meter Details
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Basic Information Section */}
          <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="font-semibold text-sm text-primary mb-3">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Meter ID</p>
                <p className="font-medium text-sm text-gray-900">
                  {meter.meter_id}
                </p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Flat No</p>
                <p className="font-medium text-sm text-gray-900">
                  {meter.gmsFlat.flat_no}
                </p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Status</p>
                <p className="font-medium text-sm text-gray-900">
                  {meter.status}
                </p>
              </div>
            </div>
          </div>

          {/* Installation Details Section */}
          <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="font-semibold text-sm text-primary mb-3">
              Installation Details
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Installation Date</p>
                <p className="font-medium text-sm text-gray-900">
                  {formatDate(meter.installation_at)}
                </p>
              </div>
              {/* {meter.img_url && (
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <p className="text-xs text-gray-500">Meter Image</p>
                    <img
                      src={meter.img_url}
                      alt="Meter Image"
                      className="w-full h-auto rounded-lg shadow-sm cursor-pointer"
                      onClick={() => setIsImagePreviewOpen(true)} // Open image preview on click
                    />
                  </div>
                )} */}
            </div>
          </div>

          {/* Update and Total Units Section */}
          <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="font-semibold text-sm text-primary mb-3">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Updated At</p>
                <p className="font-medium text-sm text-gray-900">
                  {formatDate(meter.updated_at)}
                </p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Total Units</p>
                <p className="font-medium text-sm text-gray-900">
                  {meter.total_units}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Close Button */}
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose} size="sm">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeterDetails;

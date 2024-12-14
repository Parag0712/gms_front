import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MeterLog } from "./user-table";

interface MeterDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  meter: MeterLog | null;
}

const MeterDetails: React.FC<MeterDetailsProps> = ({
  isOpen,
  onClose,
  meter,
}) => {
  if (!meter) return null;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
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
        <div className="space-y-4">
          {/* Meter Information Section */}
          <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="font-semibold text-sm text-primary mb-3">
              Meter Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Meter ID</p>
                <p className="font-medium text-sm text-gray-900">
                  {meter.meter_id}
                </p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Previous Reading</p>
                <p className="font-medium text-sm text-gray-900">
                  {meter.previous_reading}
                </p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Current Reading</p>
                <p className="font-medium text-sm text-gray-900">
                  {meter.current_reading}
                </p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Units Consumed</p>
                <p className="font-medium text-sm text-gray-900">
                  {meter.units_consumed}
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
          <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="font-semibold text-sm text-primary mb-3 flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Timestamps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Created At</p>
                <p className="font-medium text-sm text-gray-900">
                  {formatDate(meter.created_at)}
                </p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="font-medium text-sm text-gray-900">
                  {formatDate(meter.updated_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Meter Image Section */}
          {meter.image && (
            <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-sm text-primary mb-3">
                Meter Image
              </h3>
              <img
                src={meter.image}
                alt="Meter"
                className="w-full h-auto object-cover mt-2 rounded-md"
              />
            </div>
          )}
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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Tower } from "@/types";

interface TowerDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  tower: Tower | null;
}

const TowerDetails: React.FC<TowerDetailsProps> = ({
  isOpen,
  onClose,
  tower,
}) => {
  if (!tower) return null;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
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
            Tower Details
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Basic Information Section */}
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-semibold text-sm text-primary mb-3">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Tower Name</p>
                <p className="font-medium text-sm text-gray-900">
                  {tower.tower_name || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Project Name</p>
                <p className="font-medium text-sm text-gray-900">
                  {tower.project.project_name || "N/A"}
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
                  {formatDate(tower.created_at)}
                </p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="font-medium text-sm text-gray-900">
                  {formatDate(tower.updated_at)}
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

export default TowerDetails;

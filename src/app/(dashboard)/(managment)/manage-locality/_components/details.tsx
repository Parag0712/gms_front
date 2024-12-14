import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Locality } from "./columns"; // Ensure this is the correct type
import { Button } from "@/components/ui/button";

interface LocalityPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  locality: Locality | null;
}

const LocalityPreviewModal: React.FC<LocalityPreviewModalProps> = ({
  isOpen,
  onClose,
  locality,
}) => {
  if (!locality) return null;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] p-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {locality.area} Details
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Localities
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Area Name</p>
                      <p className="font-medium text-sm text-gray-900">
                        {locality.area}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Created At</p>
                      <p className="font-medium text-sm text-gray-900">
                        {formatDate(locality.created_at)}
                      </p>
                    </div>
                  </div>
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
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-500">Created At</p>
                  <p className="font-medium text-sm text-gray-900">
                    {formatDate(locality.created_at)}
                  </p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="font-medium text-sm text-gray-900">
                    {formatDate(locality.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose} size="sm">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocalityPreviewModal;

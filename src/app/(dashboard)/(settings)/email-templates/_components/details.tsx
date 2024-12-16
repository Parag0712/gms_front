import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Email } from "@/types";

interface PreviewTemplateProps {
  isOpen: boolean;
  onClose: () => void;
  template: Email | null;
}

const PreviewTemplate: React.FC<PreviewTemplateProps> = ({
  isOpen,
  onClose,
  template,
}) => {
  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Preview Template
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-sm text-primary mb-3">Subject</h3>
            <p className="font-medium text-sm text-gray-900">
              {template.subject}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-sm text-primary mb-3">Body</h3>
            <p className="font-medium text-sm text-gray-900">{template.body}</p>
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

export default PreviewTemplate;

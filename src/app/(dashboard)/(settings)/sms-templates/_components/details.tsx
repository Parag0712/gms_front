import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sms } from "@/types/index.d";

interface PreviewSmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sms: Sms | null;
}

const PreviewSmsModal: React.FC<PreviewSmsModalProps> = ({
  isOpen,
  onClose,
  sms,
}) => {
  if (!sms) return null;

  const renderPreviewMessage = (message: string, variables: string) => {
    let parsedVariables: { [key: string]: string } = {};

    try {
      // Try to parse the variables, or use empty object if parsing fails
      parsedVariables = JSON.parse(variables || "{}");
    } catch (error) {
      console.error("Error parsing variables:", error);
      parsedVariables = {};
    }

    let previewMessage = message;

    // Replace variables in the message
    Object.keys(parsedVariables).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      previewMessage = previewMessage.replace(regex, parsedVariables[key]);
    });

    return previewMessage;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] p-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            SMS Preview
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-white shadow-sm">
              <h3 className="font-semibold text-sm text-primary mb-3">
                SMS Content
              </h3>
              <p className="text-gray-700">
                {renderPreviewMessage(sms.message, sms.variables)}
              </p>
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

export default PreviewSmsModal;

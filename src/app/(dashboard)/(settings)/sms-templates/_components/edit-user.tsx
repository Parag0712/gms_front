"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  SMS_TEMPLATE_VARIABLES,
  SmsPayload,
  Sms,
  SMSTypeEnum,
} from "@/types/index.d";
import { useEditSmsTemplate } from "@/hooks/sms-templates/sms-templates";

const smsTemplateSchema = z.object({
  id: z.number().optional(),
  description: z.string().min(1, "Description is required"),
  message: z.string().min(1, "Message is required"),
  type: z.enum([
    "billing",
    "registration",
    "verification",
    "reminder",
    "payment",
    "other",
  ]),
  identifier: z.string(),
});

type FormInputs = z.infer<typeof smsTemplateSchema>;

interface EditTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  template: Sms | null;
}

const EditTemplateModal: React.FC<EditTemplateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  template,
}) => {
  const { mutate: editTemplate, isPending } = useEditSmsTemplate();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormInputs>({
    resolver: zodResolver(smsTemplateSchema),
  });

  useEffect(() => {
    if (template) {
      setValue("description", template.description);
      setValue("message", template.message);
      setValue("type", template.type);
      setValue("identifier", template.identifier);
    }
  }, [template, setValue]);

  const selectedType = watch("type");

  const onSubmit = (data: FormInputs) => {
    if (!template) return;

    const variables = SMS_TEMPLATE_VARIABLES[data.type].join(",");

    const templateData: SmsPayload = {
      ...data,
      type: data.type as SMSTypeEnum,
      variables,
    };

    editTemplate(
      { id: template.id, templateData },
      {
        onSuccess: (response) => {
          if (response.success) {
            onSuccess();
            reset();
            onClose();
          }
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[650px] w-full">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Edit SMS Template
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-sm font-semibold">
                Template Identifier
              </Label>
              <Input
                id="identifier"
                {...register("identifier")}
                disabled
                className="w-full h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description <span className="text-red-500">*</span>
              </Label>
              <Input
                id="description"
                {...register("description")}
                placeholder="Enter template description"
                className="w-full h-10"
              />
              {errors.description && (
                <p className="text-red-500 text-xs">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-semibold">
                Template Type <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Select template type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(SMS_TEMPLATE_VARIABLES).map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="cursor-pointer hover:bg-gray-100"
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-red-500 text-xs">{errors.type.message}</p>
              )}
            </div>
          </div>

          {selectedType && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Available Variables
              </Label>
              <div className="flex flex-wrap gap-2">
                {SMS_TEMPLATE_VARIABLES[selectedType].map((variable) => (
                  <span
                    key={variable}
                    className="px-2 py-1 bg-gray-100 rounded text-sm cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      const textarea = document.getElementById(
                        "message"
                      ) as HTMLTextAreaElement;
                      if (textarea) {
                        const start = textarea.selectionStart;
                        const value = textarea.value;
                        const newValue =
                          value.slice(0, start) +
                          `{{${variable}}}` +
                          value.slice(start);
                        setValue("message", newValue);
                        textarea.focus();
                        textarea.setSelectionRange(
                          start + variable.length + 4,
                          start + variable.length + 4
                        );
                      }
                    }}
                  >
                    {`{{${variable}}}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-semibold">
              Message Template <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              {...register("message")}
              placeholder="Enter message template using available variables"
              className="min-h-[120px] w-full"
            />
            {errors.message && (
              <p className="text-red-500 text-xs">{errors.message.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="px-6 bg-primary"
            >
              {isPending ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTemplateModal;

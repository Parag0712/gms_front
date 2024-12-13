import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { EmailPayload, EMAILTypeEnum } from "@/types/index.d";
import { useAddEmailTemplate } from "@/hooks/email-templates/email-templates";

const emailTemplateSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"),
  description: z.string().min(1, "Description is required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Plain text body is required"),
  htmlBody: z.string().min(1, "HTML body is required"),
  type: z.nativeEnum(EMAILTypeEnum, {
    required_error: "Template type is required",
  }),
});

type FormInputs = z.infer<typeof emailTemplateSchema>;

interface AddTemplateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EMAIL_VARIABLES: Record<EMAILTypeEnum, string[]> = {
  [EMAILTypeEnum.BILLING]: ["invoice_number", "amount", "due_date"],
  [EMAILTypeEnum.REGISTRATION]: ["username", "verification_link"],
  [EMAILTypeEnum.VERIFICATION]: ["verification_code", "expiry_time"],
  [EMAILTypeEnum.REMINDER]: ["event_name", "date", "time"],
  [EMAILTypeEnum.PAYMENT]: ["amount", "transaction_id", "date"],
  [EMAILTypeEnum.OTHER]: ["custom_message"],
  [EMAILTypeEnum.FORGOT_PASSWORD]: ["reset_link", "expiry_time"],
  [EMAILTypeEnum.RESET_PASSWORD]: ["first_name", "confirmation_link"],
};

const AddTemplate: React.FC<AddTemplateProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { mutate: addTemplate, isPending } = useAddEmailTemplate();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      identifier: "",
      description: "",
      subject: "",
      body: "",
      htmlBody: "",
      type: undefined,
    },
  });

  const selectedType = watch("type");
  const htmlBody = watch("htmlBody");

  const onSubmit = (data: FormInputs) => {
    if (!selectedType) return;

    const messageText = data.htmlBody;
    const variableMatches = messageText.match(/{{(.*?)}}/g) || [];
    const usedVariables = variableMatches.map((match) =>
      match.replace("{{", "").replace("}}", "")
    );

    const templateData: EmailPayload = {
      ...data,
      type: selectedType,
      variables: usedVariables.join(","),
    };

    addTemplate(templateData, {
      onSuccess: (response) => {
        if (response.success) {
          onSuccess();
          reset();
        }
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px] md:max-w-[750px] lg:max-w-[900px] w-full max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Add Email Template
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill in the details to create a new email template
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-sm font-semibold">
                  Template Identifier <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="identifier"
                  {...register("identifier")}
                  placeholder="Enter template identifier"
                />
                {errors.identifier && (
                  <p className="text-red-500 text-xs">
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="description"
                  {...register("description")}
                  placeholder="Enter template description"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-semibold">
                  Email Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subject"
                  {...register("subject")}
                  placeholder="Enter email subject"
                />
                {errors.subject && (
                  <p className="text-red-500 text-xs">
                    {errors.subject.message}
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select template type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(EMAILTypeEnum).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.replace(/_/g, " ").toLowerCase()}
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

              {selectedType && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Available Variables
                  </Label>
                  <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-md">
                    {EMAIL_VARIABLES[selectedType].map((variable) => (
                      <span
                        key={variable}
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors"
                        onClick={() => {
                          const textarea = document.getElementById(
                            "htmlBody"
                          ) as HTMLTextAreaElement;
                          if (textarea) {
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const currentValue = textarea.value;
                            const newValue = `${currentValue.substring(
                              0,
                              start
                            )}{{${variable}}}${currentValue.substring(end)}`;
                            textarea.value = newValue;
                            textarea.focus();
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
                <Label htmlFor="body" className="text-sm font-semibold">
                  Plain Text Body <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="body"
                  {...register("body")}
                  placeholder="Enter plain text version"
                  className="min-h-[120px]"
                />
                {errors.body && (
                  <p className="text-red-500 text-xs">{errors.body.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="htmlBody" className="text-sm font-semibold">
                  HTML Body <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="htmlBody"
                  {...register("htmlBody")}
                  placeholder="Enter HTML version"
                  className="min-h-[200px] font-mono"
                />
                {errors.htmlBody && (
                  <p className="text-red-500 text-xs">
                    {errors.htmlBody.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Email Preview</h2>
              <div className="border rounded-lg p-4 bg-white shadow-sm min-h-[200px]">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: htmlBody }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 mt-6">
            <Button type="button" onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding Template..." : "Add Template"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTemplate;

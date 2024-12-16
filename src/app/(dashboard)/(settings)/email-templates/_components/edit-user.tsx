import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import JoditEditor from "jodit-react";
import { Check, ChevronsUpDown } from "lucide-react";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Email, EmailPayload, EMAILTypeEnum, EMAIL_TEMPLATE_VARIABLES } from "@/types/index.d";
import { useEditEmailTemplate } from "@/hooks/email-templates/email-templates";

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

interface EditTemplateProps {
  isOpen: boolean;
  template: Email | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditTemplate: React.FC<EditTemplateProps> = ({
  isOpen,
  template,
  onClose,
  onSuccess,
}) => {
  const { mutate: updateTemplate, isPending } = useEditEmailTemplate();
  const [typeOpen, setTypeOpen] = useState(false);
  const editor = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      identifier: template?.identifier || "",
      description: template?.description || "",
      subject: template?.subject || "",
      body: template?.body || "",
      htmlBody: template?.htmlBody || "",
      type: template?.type,
    },
  });

  // Reset form when template changes
  React.useEffect(() => {
    reset({
      identifier: template?.identifier || "",
      description: template?.description || "",
      subject: template?.subject || "",
      body: template?.body || "",
      htmlBody: template?.htmlBody || "",
      type: template?.type,
    });
  }, [template, reset]);

  const selectedType = watch("type");
  const htmlBody = watch("htmlBody");

  const config = {
    readonly: false,
    height: 400,
    buttons: [
      'source', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'align', '|',
      'ul', 'ol', '|',
      'table', 'link', '|',
      'undo', 'redo', '|',
      'hr', 'eraser', 'fullsize',
    ],
    uploader: {
      insertImageAsBase64URI: true
    },
    removeButtons: ['image'],
  };

  const onSubmit = (data: FormInputs) => {
    if (!template?.id || !selectedType) return;

    const messageText = data.htmlBody;
    const variableMatches = messageText.match(/{{(.*?)}}/g) || [];
    const usedVariables = variableMatches.map((match) =>
      match.replace("{{", "").replace("}}", "")
    );

    const validVariables = EMAIL_TEMPLATE_VARIABLES[selectedType as keyof typeof EMAIL_TEMPLATE_VARIABLES];
    const allVariablesValid = usedVariables.every((variable) =>
      validVariables.includes(variable)
    );

    if (!allVariablesValid) {
      console.error("Invalid variables used in template");
      return;
    }

    const templateData: EmailPayload = {
      ...data,
      type: selectedType,
      variables: usedVariables.join(","),
    };

    updateTemplate(
      { id: template.id, templateData },
      {
        onSuccess: (response) => {
          if (response.success) {
            onSuccess();
            reset();
          }
        },
      }
    );
  };

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px] md:max-w-[750px] lg:max-w-[900px] w-full max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Edit Email Template
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Modify the details of the existing email template
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                <p className="text-red-500 text-xs">{errors.identifier.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-semibold">
                Template Type <span className="text-red-500">*</span>
              </Label>
              <Popover open={typeOpen} onOpenChange={setTypeOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={typeOpen}
                    className="w-full justify-between"
                  >
                    {selectedType
                      ? selectedType.replace(/_/g, " ").toLowerCase()
                      : "Select template type"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search template type..." />
                    <CommandList>
                      <CommandEmpty>No template type found.</CommandEmpty>
                      <CommandGroup>
                        {Object.values(EMAILTypeEnum).map((type) => (
                          <CommandItem
                            key={type}
                            value={type}
                            onSelect={() => {
                              setValue("type", type as EMAILTypeEnum);
                              setTypeOpen(false);
                            }}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedType === type ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {type.replace(/_/g, " ").toLowerCase()}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.type && (
                <p className="text-red-500 text-xs">{errors.type.message}</p>
              )}
            </div>
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
              <p className="text-red-500 text-xs">{errors.description.message}</p>
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
              <p className="text-red-500 text-xs">{errors.subject.message}</p>
            )}
          </div>

          {selectedType && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Available Variables
              </Label>
              <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-md">
                {EMAIL_TEMPLATE_VARIABLES[selectedType as keyof typeof EMAIL_TEMPLATE_VARIABLES].map((variable) => (
                  <span
                    key={variable}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors"
                    onClick={() => {
                      const editor = document.querySelector('.jodit-wysiwyg');
                      if (editor) {
                        const selection = window.getSelection();
                        const range = selection?.getRangeAt(0);
                        const node = document.createTextNode(`{{${variable}}}`);
                        range?.insertNode(node);
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
            <JoditEditor
              ref={editor}
              value={htmlBody}
              config={config}
              onBlur={(content) => setValue('htmlBody', content)}
              onChange={(content) => setValue('htmlBody', content)}
            />
            {errors.htmlBody && (
              <p className="text-red-500 text-xs">{errors.htmlBody.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6">
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
              {isPending ? "Updating Template..." : "Update Template"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTemplate;
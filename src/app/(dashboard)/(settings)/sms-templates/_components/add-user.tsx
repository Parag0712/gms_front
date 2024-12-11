import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { SMS_TEMPLATE_VARIABLES, SmsPayload, SMSTypeEnum } from '@/types/index.d';
import { useAddSmsTemplate } from '@/hooks/sms-templates/sms-templates';

const smsTemplateSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"),
  description: z.string().min(1, "Description is required"),
  message: z.string().min(1, "Message is required"),
  type: z.nativeEnum(SMSTypeEnum, {
    required_error: "Template type is required"
  })
});

type FormInputs = z.infer<typeof smsTemplateSchema>;

interface AddTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddTemplateModal: React.FC<AddTemplateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { mutate: addTemplate, isPending } = useAddSmsTemplate();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset
  } = useForm<FormInputs>({
    resolver: zodResolver(smsTemplateSchema),
    defaultValues: {
      identifier: '',
      description: '',
      message: '',
      type: undefined
    }
  });

  const selectedType = watch('type');

  const onSubmit = (data: FormInputs) => {
    if (!selectedType) return;

    // Extract variables used in the message
    const messageText = data.message;
    const variableMatches = messageText.match(/{{(.*?)}}/g) || [];
    const usedVariables = variableMatches.map(match =>
      match.replace('{{', '').replace('}}', '')
    );

    // Validate that all used variables are valid for the selected type
    const validVariables = SMS_TEMPLATE_VARIABLES[selectedType];
    const allVariablesValid = usedVariables.every(variable =>
      validVariables.includes(variable)
    );

    if (!allVariablesValid) {
      console.error('Invalid variables used in template');
      return;
    }

    const templateData: SmsPayload = {
      ...data,
      type: selectedType,
      variables: usedVariables.join(',')
    };

    addTemplate(templateData, {
      onSuccess: (response) => {
        if (response.success) {
          onSuccess();
          reset();
        }
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[650px] w-full">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Add SMS Template
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill out the form below to add a new template.
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
                {...register('identifier')}
                placeholder="Enter template identifier"
                className="w-full h-10"
              />
              {errors.identifier && (
                <p className="text-red-500 text-xs">{errors.identifier.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description <span className="text-red-500">*</span>
              </Label>
              <Input
                id="description"
                {...register('description')}
                placeholder="Enter template description"
                className="w-full h-10"
              />
              {errors.description && (
                <p className="text-red-500 text-xs">{errors.description.message}</p>
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
                        <SelectItem key={type} value={type} className="cursor-pointer hover:bg-gray-100">
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

            {selectedType && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Available Variables</Label>
                <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-md">
                  {SMS_TEMPLATE_VARIABLES[selectedType].map((variable) => (
                    <span
                      key={variable}
                      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors"
                      onClick={() => {
                        const textarea = document.getElementById('message') as HTMLTextAreaElement;
                        if (textarea) {
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const currentValue = textarea.value;
                          const newValue = `${currentValue.substring(0, start)}{{${variable}}}${currentValue.substring(end)}`;
                          textarea.value = newValue;
                          textarea.focus();
                          textarea.setSelectionRange(start + variable.length + 4, start + variable.length + 4);
                        }
                      }}
                    >
                      {`{{${variable}}}`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-semibold">
              Message Template <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              {...register('message')}
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
              {isPending ? "Adding Template..." : "Add Template"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTemplateModal;
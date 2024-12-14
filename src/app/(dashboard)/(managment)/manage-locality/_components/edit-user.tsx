import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEditLocality } from "@/hooks/management/manage-locality";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const localityEditSchema = z.object({
  area: z.string().min(1, "Area name is required"),
});

type FormInputs = z.infer<typeof localityEditSchema>;

interface Locality {
  id: number;
  area: string;
  city_id: number;
  city: {
    id: number;
    city: string;
  };
}

export const EditLocalityModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedLocality: Locality | null;
}> = ({ isOpen, onClose, onSuccess, selectedLocality }) => {
  const { mutate: editLocalityMutation, isPending } = useEditLocality();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormInputs>({
    resolver: zodResolver(localityEditSchema),
  });

  useEffect(() => {
    if (selectedLocality) {
      setValue("area", selectedLocality.area);
    }
  }, [selectedLocality, setValue]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!selectedLocality) return;

    const payload = {
      area: data.area,
      city_id: selectedLocality.city_id, // Keep city_id from selectedLocality
    };

    editLocalityMutation(
      { localityId: selectedLocality.id, localityData: payload },
      {
        onSuccess: (response) => {
          if (response.success) {
            onClose();
            onSuccess();
            reset();
          }
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Locality</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Update the locality details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="area" className="text-sm font-semibold">
              Area Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="area"
              {...register("area")}
              placeholder="Enter area name"
              className="w-full"
            />
            {errors.area && (
              <p className="text-red-500 text-xs">{errors.area.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

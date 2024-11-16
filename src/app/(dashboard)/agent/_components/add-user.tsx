"use client";

import React from "react";
import { useUsers } from "@/hooks/users/manage-users";
import { useCollectMoney } from "@/hooks/agent/agent";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { z } from "zod";
import { User } from "next-auth";

// Define the shape of our form inputs
type FormInputs = {
  agentId: string;
  amount: number;
};

const formSchema = z.object({
  agentId: z.string().min(1, "Agent selection is required"),
  amount: z.number().positive("Amount must be greater than 0")
});

// AddUserModal component for adding new users
const AddUserModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const { mutate: collectMoneyMutation } = useCollectMoney();
  const { data: users } = useUsers();

  const agentUsers = (users?.data as User[] || []).filter(user => user.role === "AGENT");

  const { handleSubmit, reset, control, formState: { errors } } = useForm<FormInputs>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      await collectMoneyMutation({
        agentId: data.agentId,
        amount: data.amount
      }, {
        onSuccess: () => {
          onSuccess();
          onClose();
          reset();
        }
      });
    } catch (error) {
      console.error("Error collecting money:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[650px] w-full">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">Collect Money</DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Select an agent and enter amount to collect.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Agent selection dropdown */}
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="agent" className="text-xs sm:text-sm font-medium">
              Select Agent <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="agentId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg border-gray-300 focus:ring-primary focus:border-primary">
                    <SelectValue placeholder="Select an agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agentUsers.map((agent: User) => (
                      <SelectItem key={agent.id} value={agent.id.toString()}>
                        {agent.first_name} {agent.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.agentId && (
              <p className="text-red-500 text-xs mt-1">{errors.agentId.message}</p>
            )}
          </div>

          {/* Amount Input */}
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="amount" className="text-xs sm:text-sm font-medium">
              Amount <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  placeholder="Enter amount"
                  className="w-full py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
            )}
          </div>

          {/* Form action buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button onClick={onClose} variant="outline" className="w-full sm:w-auto text-sm sm:text-base">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto text-sm sm:text-base">
              Collect Money
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;

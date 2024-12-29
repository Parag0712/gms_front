"use client";

import React, { useState } from "react";
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
  amount: z.number().positive("Amount must be greater than 0"),
});

// AddUserModal component for adding new users
const AddUserModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const { mutate: collectMoneyMutation } = useCollectMoney();
  const { data: users } = useUsers();
  const [loading, setLoading] = useState(false);

  const agentUsers = ((users?.data as User[]) || []).filter(
    (user) => user.role === "AGENT"
  );

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setLoading(true);
    collectMoneyMutation(
      {
        agentId: data.agentId,
        amount: data.amount,
      },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
          reset();
          setLoading(false);
        },
        onError: () => {
          setLoading(false);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[650px] w-full"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Add Wallet Balance
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Select an agent and enter amount to add to their wallet.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Agent selection dropdown */}
            <div className="space-y-2">
              <Label htmlFor="agent" className="text-sm font-semibold">
                Select Agent <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="agentId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Select an agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agentUsers.map((agent: User) => (
                        <SelectItem
                          key={agent.id}
                          value={agent.id.toString()}
                          className="cursor-pointer hover:bg-gray-100"
                        >
                          {agent.first_name} {agent.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.agentId && (
                <p className="text-red-500 text-xs">{errors.agentId.message}</p>
              )}
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-semibold">
                Amount <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full h-10"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              {errors.amount && (
                <p className="text-red-500 text-xs">{errors.amount.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="px-6"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 bg-primary"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Balance"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;

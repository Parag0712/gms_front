import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { agentService } from "@/services/agent/agent";
import {
  handleMutationSuccess,
  handleMutationError,
} from "@/lib/mutation-utils";
import { AddAgentPayload } from "@/types/index.d";

export const useCollectMoney = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: agentService.collectMoney,
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["agents"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useAddAgent = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AddAgentPayload }) =>
      agentService.selectAgent(id, data),
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["agents"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

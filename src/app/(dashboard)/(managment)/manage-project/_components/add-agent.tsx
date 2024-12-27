"use client";

import React, { useState, useEffect } from "react";
import { useUsers } from "@/hooks/users/manage-users";
import { useProjects } from "@/hooks/management/manage-project";
import { useAddAgent } from "@/hooks/agent/agent";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddAgentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  onSuccess: () => void;
}

const assignAgentSchema = z.object({
  agent_ids: z.array(
    z
      .number()
      .int("Agent ID must be an integer")
      .positive("Agent ID must be a positive number")
  ),
});

type FormData = z.infer<typeof assignAgentSchema>;

export const AddAgentDialog: React.FC<AddAgentDialogProps> = ({
  isOpen,
  onClose,
  projectId,
  onSuccess,
}) => {
  const { data: usersData } = useUsers();
  const { data: projectData } = useProjects();
  const addAgentMutation = useAddAgent();
  const [selectedAgents, setSelectedAgents] = useState<number[]>([]);

  const { handleSubmit, setValue } = useForm<FormData>({
    resolver: zodResolver(assignAgentSchema),
    defaultValues: { agent_ids: [] },
  });

  const agents = Array.isArray(usersData?.data)
    ? usersData.data.filter((user: { role: string }) => user.role === "AGENT")
    : [];
  const findProjectById = (projectId: number) => {
    if (!projectData?.data) return null;
    if (Array.isArray(projectData.data)) {
      for (const item of projectData.data) {
        if (item.data && Array.isArray(item.data)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const found = item.data.find((p: any) => p.id === projectId);
          if (found) return found;
        }
        if (item.id === projectId) return item;
      }
    }
    return null;
    return null;
  };
  const project = findProjectById(projectId);

  useEffect(() => {
    if (project?.assigned_service_person) {
      const assignedAgentIds = project.assigned_service_person.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (agent: { id: any }) => agent.id
      );
      setSelectedAgents(assignedAgentIds);
      setValue("agent_ids", assignedAgentIds);
    }
  }, [project, setValue]);

  const handleAgentToggle = (agentId: number) => {
    setSelectedAgents((prev) => {
      const newSelection = prev.includes(agentId)
        ? prev.filter((id) => id !== agentId)
        : [...prev, agentId];
      setValue("agent_ids", newSelection);
      return newSelection;
    });
  };

  const onSubmit = (data: FormData) => {
    addAgentMutation.mutate(
      { id: projectId, data: { agent_ids: data.agent_ids } },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
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
          <DialogTitle>Add Agents to Project</DialogTitle>
          <DialogDescription>
            Select the agents you want to assign to this project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ScrollArea className="h-[300px] w-full border rounded-md p-4">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center space-x-2 py-2">
                <Checkbox
                  id={`agent-${agent.id}`}
                  checked={selectedAgents.includes(agent.id)}
                  onCheckedChange={() => handleAgentToggle(agent.id)}
                />
                <label
                  htmlFor={`agent-${agent.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {agent.first_name} {agent.last_name}
                </label>
              </div>
            ))}
          </ScrollArea>
          <div className="mt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={addAgentMutation.isPending}>
              {addAgentMutation.isPending ? "Adding..." : "Add Agents"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

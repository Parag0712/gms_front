"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useUsers } from "@/hooks/users/manage-users";
import { useProjects } from "@/hooks/management/manage-project";
import { useAddAgent } from "@/hooks/agent/agent";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axiosInstance";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { UserPlus, UserMinus, Users } from "lucide-react";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  role: string;
}

interface Project {
  id: number;
  assigned_service_person: { id: number }[];
}

const assignAgentSchema = z.object({
  agent_ids: z.array(z.number()).min(1, "Please select at least one agent"),
});

type FormData = z.infer<typeof assignAgentSchema>;

interface AddAgentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  onSuccess: () => void;
}

export const AddAgentDialog: React.FC<AddAgentDialogProps> = ({
  isOpen,
  onClose,
  projectId,
  onSuccess,
}) => {
  const { data: usersData } = useUsers();
  const { data: projectData } = useProjects();
  const addAgentMutation = useAddAgent();
  const [assignedAgents, setAssignedAgents] = useState<User[]>([]);
  const [unassignedAgents, setUnassignedAgents] = useState<User[]>([]);
  const { toast } = useToast();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { handleSubmit, control, reset } = useForm<FormData>({
    resolver: zodResolver(assignAgentSchema),
    defaultValues: { agent_ids: [] },
  });

  const agents = useMemo(() => {
    return Array.isArray(usersData?.data)
      ? usersData.data.filter((user: User) => user.role === "AGENT")
      : [];
  }, [usersData]);

  const findProjectById = (projectId: number): Project | null => {
    if (!projectData?.data) return null;
    if (Array.isArray(projectData.data)) {
      return projectData.data.find((item) => item.id === projectId) || null;
    }
    return null;
  };

  const project = findProjectById(projectId);

  useEffect(() => {
    if (project?.assigned_service_person && agents.length > 0) {
      const assignedAgentIds = new Set(
        project.assigned_service_person.map((agent) => agent.id)
      );
      const assigned: User[] = [];
      const unassigned: User[] = [];

      agents.forEach((agent) => {
        if (assignedAgentIds.has(agent.id)) {
          assigned.push(agent);
        } else {
          unassigned.push(agent);
        }
      });

      setAssignedAgents(assigned);
      setUnassignedAgents(unassigned);
    }
  }, [project?.assigned_service_person, agents, project]);

  const handleRemoveAgent = useCallback(
    async (agentId: number) => {
      try {
        await axiosInstance.put(`/project/remove-agent/${projectId}`, {
          agent_id: agentId,
        });

        setAssignedAgents((prev) =>
          prev.filter((agent) => agent.id !== agentId)
        );
        setUnassignedAgents((prev) => [
          ...prev,
          agents.find((agent) => agent.id === agentId)!,
        ]);

        toast({
          title: "Agent removed",
          description: "The agent has been removed from the project.",
        });
      } catch (error) {
        console.error("Error removing agent:", error);
        toast({
          title: "Error",
          description: "Failed to remove the agent. Please try again.",
          variant: "destructive",
        });
      }
    },
    [projectId, agents, toast]
  );

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (!data.agent_ids.length) return;

      try {
        await addAgentMutation.mutateAsync({
          id: projectId,
          data: { agent_ids: data.agent_ids },
        });

        const addedAgents = agents.filter((agent) =>
          data.agent_ids.includes(agent.id)
        );
        setAssignedAgents((prev) => [...prev, ...addedAgents]);
        setUnassignedAgents((prev) =>
          prev.filter((agent) => !data.agent_ids.includes(agent.id))
        );

        reset({ agent_ids: [] });
        onSuccess();
        setIsDropdownOpen(false);

        toast({
          title: "Agents added",
          description: "The selected agents have been added to the project.",
        });
      } catch (error) {
        console.error("Error adding agents:", error);
        toast({
          title: "Error",
          description: "Failed to add the agents. Please try again.",
          variant: "destructive",
        });
      }
    },
    [projectId, agents, addAgentMutation, reset, onSuccess, toast]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[500px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            Manage Project Agents
          </DialogTitle>
          <DialogDescription>
            View assigned agents and manage team composition for this project.
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-4" />
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Badge variant="secondary" className="text-sm py-1">
                {assignedAgents.length}
              </Badge>
              Assigned Agents
            </h3>
            <ScrollArea className="h-[200px] w-full border rounded-md p-4">
              {assignedAgents.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  No agents assigned to this project yet.
                </p>
              ) : (
                assignedAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between py-2 group"
                  >
                    <span className="font-medium">
                      {agent.first_name} {agent.last_name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAgent(agent.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <UserMinus className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="agent-select"
                className="text-lg font-semibold block mb-2"
              >
                Add Agents
              </label>
              <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isDropdownOpen}
                    className="w-full justify-between"
                  >
                    {unassignedAgents.length > 0
                      ? "Select agents"
                      : "No available agents"}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <ScrollArea className="h-[250px] w-full p-4">
                    <Controller
                      name="agent_ids"
                      control={control}
                      render={({ field }) => (
                        <>
                          {unassignedAgents.map((agent) => (
                            <div
                              key={agent.id}
                              className="flex items-center space-x-2 py-2"
                            >
                              <Checkbox
                                id={`agent-${agent.id}`}
                                checked={field.value.includes(agent.id)}
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [...field.value, agent.id]
                                    : field.value.filter(
                                        (id) => id !== agent.id
                                      );
                                  field.onChange(updatedValue);
                                }}
                              />
                              <label
                                htmlFor={`agent-${agent.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {agent.first_name} {agent.last_name}
                              </label>
                            </div>
                          ))}
                        </>
                      )}
                    />
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addAgentMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {addAgentMutation.isPending ? (
                  "Adding..."
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Agents
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

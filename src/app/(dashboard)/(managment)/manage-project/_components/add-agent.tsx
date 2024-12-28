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
import { AlertCircle, Building2, ChevronDown, Loader2 } from "lucide-react";
import { useCustomToast } from "@/components/providers/toaster-provider";
import axiosInstance from "@/lib/axiosInstance";
import { Badge } from "@/components/ui/badge";
import { UserPlus, UserMinus, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRemovingAgentId, setIsRemovingAgentId] = useState<number | null>(
    null
  );
  const toast = useCustomToast();

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
        setIsRemovingAgentId(agentId);
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
        setIsRemovingAgentId(null);
        toast.success({
          message: "The agent has been removed from the project.",
        });
      } catch (error) {
        console.error("Error removing agent:", error);
        toast.error({
          message: "Failed to remove the agent. Please try again.",
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

        toast.success({
          message: "The selected agents have been added to the project.",
        });
      } catch (error) {
        console.error("Error adding agents:", error);
        toast.error({
          message: "Failed to add the agents. Please try again.",
        });
      }
    },
    [projectId, agents, addAgentMutation, reset, onSuccess, toast]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[650px] p-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="flex h-full">
          {/* Left Sidebar */}
          <div className="w-64 bg-gray-50 p-6 border-r">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Project Agents</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="h-6 w-6 rounded-full flex items-center justify-center p-0"
                >
                  {assignedAgents.length}
                </Badge>
                <span className="text-sm text-gray-600">Assigned Agents</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="h-6 w-6 rounded-full flex items-center justify-center p-0"
                >
                  {unassignedAgents.length}
                </Badge>
                <span className="text-sm text-gray-600">Available Agents</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-primary">
                <Users className="w-5 h-5" />
                Manage Agents
              </DialogTitle>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              {/* Assigned Agents Section */}
              <Card className="p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    Current Team
                    <Badge variant="secondary" className="text-xs">
                      {assignedAgents.length}
                    </Badge>
                  </span>
                </h3>
                <ScrollArea className="h-[200px] w-full rounded-md">
                  {assignedAgents.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">No agents assigned yet</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {assignedAgents.map((agent) => (
                        <div
                          key={agent.id}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {agent.first_name[0]}
                                {agent.last_name[0]}
                              </span>
                            </div>
                            <span className="text-sm font-medium">
                              {agent.first_name} {agent.last_name}
                            </span>
                          </div>
                          {isRemovingAgentId === agent.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveAgent(agent.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <UserMinus className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </Card>

              {/* Add Agents Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Card className="p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">
                    Add New Agents
                  </h3>
                  <Popover
                    open={isDropdownOpen}
                    onOpenChange={setIsDropdownOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isDropdownOpen}
                        className="w-full justify-between border-dashed"
                      >
                        <span className="flex items-center gap-2">
                          <UserPlus className="h-4 w-4 text-gray-500" />
                          {unassignedAgents.length > 0
                            ? "Select agents to add"
                            : "No available agents"}
                        </span>
                        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <ScrollArea className="h-[250px] w-full p-4">
                        <Controller
                          name="agent_ids"
                          control={control}
                          render={({ field }) => (
                            <div className="space-y-2">
                              {unassignedAgents.map((agent) => (
                                <div
                                  key={agent.id}
                                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-xl"
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
                                    className="data-[state=checked]:bg-primary"
                                  />
                                  <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                      <span className="text-xs font-medium text-gray-600">
                                        {agent.first_name[0]}
                                        {agent.last_name[0]}
                                      </span>
                                    </div>
                                    <label
                                      htmlFor={`agent-${agent.id}`}
                                      className="text-sm font-medium"
                                    >
                                      {agent.first_name} {agent.last_name}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        />
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                </Card>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="w-24"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={addAgentMutation.isPending}
                    className="w-32 bg-primary hover:bg-primary/90"
                  >
                    {addAgentMutation.isPending ? "Adding..." : <>Add Agents</>}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

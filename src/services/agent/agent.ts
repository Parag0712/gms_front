import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse, AddAgentPayload, AgentPayload } from "@/types/index.d";

const AGENT_API = {
  COLLECT_MONEY: "admin/collect-money-from-agent",
  SELECT_AGENT: (id: number) => `/project/assign-agent/${id}`,
} as const;

export const agentService = {
  collectMoney: (data: AgentPayload) =>
    fetchHandler<ApiResponse>(AGENT_API.COLLECT_MONEY, "POST", data),
  selectAgent: (id: number, data: AddAgentPayload) =>
    fetchHandler<ApiResponse>(AGENT_API.SELECT_AGENT(id), "PUT", data),
};

import { fetchHandler } from '@/lib/api-utils';
import { ApiResponse, AgentPayload } from '@/types/index.d';

const AGENT_API = {
    COLLECT_MONEY: 'admin/collect-money-from-agent'
} as const;

export const agentService = {
    collectMoney: (data: AgentPayload) =>
        fetchHandler<ApiResponse>(AGENT_API.COLLECT_MONEY, 'POST', data)
}; 




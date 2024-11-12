import { Customer } from "@/types/index.d";
import { Switch } from "@/components/ui/switch";
import { useApproveCustomer } from "@/hooks/customers/approve-customers";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const ApprovalSwitch = ({ customer }: { customer: Customer }) => {
    // Use the useApproveCustomer hook to get the mutation function and loading state
    const { mutate: approveCustomer, isPending } = useApproveCustomer();
    
    // Initialize the approval state based on whether the customer is already approved
    const [isApproved, setIsApproved] = useState(!!customer.approved_by);

    const handleApprovalChange = (checked: boolean) => {
        // Update the local state immediately for a responsive UI
        setIsApproved(checked);
        
        // Call the API to update the approval status
        approveCustomer(
            { id: customer.id, approve: checked },
            {
                onError: () => {
                    // Revert the switch state if the API call fails
                    setIsApproved(!checked);
                }
            }
        );
    };

    // Show a loading spinner while the approval status is being updated
    if (isPending) {
        return <Loader2 className="h-4 w-4 animate-spin" />;
    }

    return (
        <div className="flex items-center space-x-2">
            <Switch
                checked={isApproved}
                onCheckedChange={handleApprovalChange}
                disabled={isPending}
            />
            <span className="text-sm text-gray-500">
                {isApproved ? "Approved" : "Not Approved"}
            </span>
        </div>
    );
};

export default ApprovalSwitch;
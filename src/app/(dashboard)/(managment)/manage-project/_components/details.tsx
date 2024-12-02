import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Project } from '@/types/index.d';
import { Button } from "@/components/ui/button";

interface CostDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

const CostDetails: React.FC<CostDetailsProps> = ({ isOpen, onClose, project }) => {
  if (!project) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {project.project_name} Details
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-sm text-primary mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Project Details
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Project Type</p>
                      <p className="font-medium text-sm text-gray-900">{project.is_wing ? 'Wing' : 'Tower'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Locality</p>
                      <p className="font-medium text-sm text-gray-900">{project.locality.area}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-sm text-primary mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Timestamps
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-500">Created At</p>
                  <p className="font-medium text-sm text-gray-900">{formatDate(project.created_at)}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="font-medium text-sm text-gray-900">{formatDate(project.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-sm text-primary mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cost Configuration
              </h3>
              {project.cost_configuration ? (
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <p className="text-xs text-gray-500">Cost Name</p>
                    <p className="font-medium text-sm text-gray-900">{project.cost_configuration.cost_name}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">AMC Cost</p>
                      <p className="font-medium text-sm text-gray-900">{project.cost_configuration.amc_cost}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">App Charges</p>
                      <p className="font-medium text-sm text-gray-900">{project.cost_configuration.app_charges}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Gas Unit Rate</p>
                      <p className="font-medium text-sm text-gray-900">{project.cost_configuration.gas_unit_rate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Utility Tax</p>
                      <p className="font-medium text-sm text-gray-900">{project.cost_configuration.utility_tax}%</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <p className="text-xs text-gray-500">Bill Due Date</p>
                    <p className="font-medium text-sm text-gray-900">{formatDate(project.cost_configuration.bill_due_date)}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-sm text-gray-500">No cost configuration set</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose} size="sm">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CostDetails;
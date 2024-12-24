import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RevenueFilterProps {
  selectedRange: string;
  year: string | null;
  month: number | null;
  onRangeChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onMonthChange: (value: string) => void;
  onApplyFilter: () => void;
}

const RevenueFilter: React.FC<RevenueFilterProps> = ({
  selectedRange,
  year,
  month,
  onRangeChange,
  onYearChange,
  onMonthChange,
  onApplyFilter,
}) => {
  return (
    <div>
      <div>
        <Select onValueChange={onRangeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={selectedRange} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yearly">Yearly</SelectItem>
            <SelectItem value="Monthly">Monthly</SelectItem>
            <SelectItem value="Total">Total</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedRange === "Yearly" && (
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700">
            Select Year
          </label>
          <input
            type="number"
            value={year || ""}
            onChange={(e) => onYearChange(e.target.value)}
            min="2020"
            max="2024"
            placeholder="YYYY"
            className="mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
      )}

      {selectedRange === "Monthly" && (
        <div className="mb-5">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Year
              </label>
              <input
                type="number"
                value={year || ""}
                onChange={(e) => onYearChange(e.target.value)}
                min="2020"
                max="2024"
                placeholder="YYYY"
                className="mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Month
              </label>
              <input
                type="number"
                value={month || ""}
                onChange={(e) => onMonthChange(e.target.value)}
                min="1"
                max="12"
                placeholder="MM"
                className="mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      )}

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        onClick={onApplyFilter}
        disabled={!year || (selectedRange === "Monthly" && !month)}
      >
        Apply Filter
      </button>
    </div>
  );
};

export default RevenueFilter;

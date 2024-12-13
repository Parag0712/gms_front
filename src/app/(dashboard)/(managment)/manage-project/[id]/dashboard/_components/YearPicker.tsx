// YearPicker.tsx
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface YearPickerProps {
  value: string | null;
  onChange: (value: string) => void;
}

export const YearPicker: React.FC<YearPickerProps> = ({ value, onChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

  return (
    <div className="w-fit">
      <label className="block text-sm font-medium text-gray-700">
        Select Year
      </label>
      <Select value={value || ""} onValueChange={onChange}>
        <SelectTrigger className="mt-1 p-2 border border-gray-300 rounded-md">
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from 'lucide-react';

interface MonthPickerProps {
  value: number | null;
  onChange: (value: number) => void;
}

export const MonthPicker: React.FC<MonthPickerProps> = ({ value, onChange }) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Select Month
      </label>
      <Select
        value={value?.toString() || ""}
        onValueChange={(value) => onChange(Number(value))}
      >
        <SelectTrigger className="w-[180px] bg-background/50 backdrop-blur">
          <SelectValue placeholder="Select Month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month, index) => (
            <SelectItem key={index} value={(index + 1).toString()}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};


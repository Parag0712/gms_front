import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarClock } from 'lucide-react';

interface YearPickerProps {
  value: string | null;
  onChange: (value: string) => void;
}

export const YearPicker: React.FC<YearPickerProps> = ({ value, onChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <CalendarClock className="w-4 h-4" />
        Select Year
      </label>
      <Select value={value || ""} onValueChange={onChange}>
        <SelectTrigger className="w-[180px] bg-background/50 backdrop-blur">
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


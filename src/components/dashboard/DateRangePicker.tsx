"use client";

import * as React from "react";
import { CalendarIcon, X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { format, subMonths } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DateRangePicker({
  className,
  onSelect,
}: {
  className?: string;
  onSelect: (
    range: { from: Date | undefined; to: Date | undefined } | undefined
  ) => void;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>();

  React.useEffect(() => {
    date && onSelect({ from: date.from, to: date.to });
  }, [date, onSelect]);

  const resetDate = () => {
    setDate(undefined);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>All Time</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={subMonths(new Date(), 1)}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
          <div className="flex justify-end p-2">
            <Button variant="ghost" size="sm" onClick={resetDate}>
              <X className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

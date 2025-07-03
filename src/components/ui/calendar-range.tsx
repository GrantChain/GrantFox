"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import type { DateRange } from "react-day-picker";

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const parseInitialRange = (): DateRange | undefined => {
    const raw = searchParams.get("dateRange");
    if (!raw) return;
    const [start, end] = raw.split("_").map((d) => new Date(d));
    if (!start || isNaN(start.getTime())) return;
    return { from: start, to: end };
  };

  const [date, setDate] = React.useState<DateRange | undefined>(
    parseInitialRange,
  );

  const updateURL = (range: DateRange | undefined) => {
    if (!range?.from || !range?.to) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set(
      "dateRange",
      `${range.from.toISOString()}_${range.to.toISOString()}`,
    );
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={cn("w-full", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
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
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(range) => {
              setDate(range);
              updateURL(range);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

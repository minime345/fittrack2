"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
const Select = ({ children, ...props }: React.ComponentProps<"div">) => {
  return <div {...props}>{children}</div>;
};

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <PopoverTrigger asChild>
    <button
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </PopoverTrigger>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({ children }: { children?: React.ReactNode }) => {
  return <span>{children}</span>;
};

const SelectContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <PopoverContent className="p-0">
      <Command>
        <CommandInput placeholder="Търсене..." />
        <CommandEmpty>Няма резултати.</CommandEmpty>
        <CommandGroup>{children}</CommandGroup>
      </Command>
    </PopoverContent>
  );
};

const SelectItem = ({
  value,
  children,
  onSelect,
}: {
  value: string;
  children: React.ReactNode;
  onSelect?: (value: string) => void;
}) => {
  return (
    <CommandItem
      onSelect={() => {
        onSelect?.(value);
      }}
    >
      <Check className="mr-2 h-4 w-4 opacity-0" />
      {children}
    </CommandItem>
  );
};

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
};

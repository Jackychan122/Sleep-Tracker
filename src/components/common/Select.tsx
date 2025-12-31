import { forwardRef } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    { options, value, onValueChange, placeholder = "Select an option", label, error, disabled },
    ref
  ) => {
    return (
      <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        {label && <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>}
        <SelectPrimitive.Trigger
          ref={ref}
          className={cn(
            "inline-flex w-full items-center justify-between px-3 py-2",
            "rounded-lg border border-gray-300 bg-white shadow-sm",
            "focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500",
            "disabled:cursor-not-allowed disabled:bg-gray-100",
            "data-[placeholder]:text-gray-400",
            error && "border-red-500 focus:ring-red-500"
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className="z-50 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    "relative flex items-center rounded-md px-3 py-2 text-sm",
                    "focus:bg-blue-50 focus:outline-none",
                    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                    "cursor-pointer select-none"
                  )}
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-3">
                    <Check className="h-4 w-4 text-blue-600" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </SelectPrimitive.Root>
    );
  }
);

Select.displayName = "Select";

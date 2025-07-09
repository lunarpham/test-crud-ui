import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  anchor?: string;
  className?: string;
};

export default function Select({
  placeholder = "Select an option",
  options = [],
  value = "",
  onChange,
  disabled = false,
  anchor = "bottom left",
  className = "",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  // Find the selected option to display its label
  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <button
        type="button"
        className={`w-full flex items-center justify-between p-2 rounded bg-black/10 hover:bg-black/15 transition-colors ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } ${isOpen ? "ring-2 ring-blue-500" : ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span
          className={`text-sm ${
            !selectedOption ? "text-gray-500" : "text-gray-800"
          }`}
        >
          {displayValue}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && !disabled && (
        <div
          className={`absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto ${
            anchor.includes("top") ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {options.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">
              No options available
            </div>
          ) : (
            options.map((option) => (
              <div
                key={option.value}
                className={`p-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors ${
                  value === option.value
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-800"
                }`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

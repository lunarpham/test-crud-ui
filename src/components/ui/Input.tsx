import React, { InputHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import {
  Mail,
  Lock,
  Search,
  User,
  Calendar,
  Phone,
  Globe,
  AlertCircle,
} from "lucide-react";

type InputVariant =
  | "default"
  | "search"
  | "email"
  | "password"
  | "name"
  | "age"
  | "phone"
  | "url";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  variant?: InputVariant;
  label?: string;
  // Change this line to accept either a component type or ReactNode
  icon?: React.ComponentType<any> | ReactNode;
  error?: string;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "default",
      icon,
      className = "",
      containerClassName = "",
      label,
      error,
      id,
      name,
      ...props
    },
    ref
  ) => {
    // Determine input type based on variant
    const getInputType = (variant: InputVariant): string => {
      switch (variant) {
        case "email":
          return "email";
        case "password":
          return "password";
        case "age":
          return "number";
        case "phone":
          return "tel";
        case "url":
          return "url";
        case "search":
          return "search";
        default:
          return "text";
      }
    };

    // Determine default icon based on variant
    const getDefaultIcon = (variant: InputVariant): React.ReactNode => {
      const iconProps = { size: 20, className: "text-neutral-700" };

      switch (variant) {
        case "email":
          return <Mail {...iconProps} />;
        case "password":
          return <Lock {...iconProps} />;
        case "search":
          return <Search {...iconProps} />;
        case "name":
          return <User {...iconProps} />;
        case "age":
          return <Calendar {...iconProps} />;
        case "phone":
          return <Phone {...iconProps} />;
        case "url":
          return <Globe {...iconProps} />;
        default:
          return null;
      }
    };

    // Get default placeholder based on variant
    const getDefaultPlaceholder = (variant: InputVariant): string => {
      switch (variant) {
        case "email":
          return "Email";
        case "password":
          return "Password";
        case "search":
          return "Search...";
        case "name":
          return "Name";
        case "age":
          return "Age";
        case "phone":
          return "Phone number";
        case "url":
          return "Website URL";
        default:
          return "";
      }
    };

    // Properly handle the icon, whether it's a component or a pre-rendered element
    let iconToRender: ReactNode = null;
    if (icon) {
      if (typeof icon === "function") {
        const IconComponent = icon as React.ComponentType<any>;
        iconToRender = <IconComponent size={20} className="text-neutral-700" />;
      } else {
        iconToRender = icon;
      }
    } else {
      iconToRender = getDefaultIcon(variant);
    }

    // Generate input ID if not provided
    const inputId = id || name || `input-${variant}`;

    return (
      <div className={`${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}

        <div
          className={`grid grid-cols-12 items-center gap-6 bg-neutral-100 rounded-lg 
            border-2 border-violet-100 focus-within:border-2 focus-within:border-violet-300 
            ${error ? "border-red-300" : ""} ${containerClassName}`}
        >
          {iconToRender && (
            <div className="col-span-1 px-4 py-3">{iconToRender}</div>
          )}

          <div className={iconToRender ? "col-span-11" : "col-span-12"}>
            <input
              ref={ref}
              id={inputId}
              name={name}
              type={getInputType(variant)}
              placeholder={props.placeholder || getDefaultPlaceholder(variant)}
              className={`px-4 py-3 w-full h-full bg-transparent focus:outline-none ${className}`}
              {...props}
            />
          </div>
        </div>

        {error && (
          <div className="mt-1 flex items-center">
            <AlertCircle size={14} className="text-red-500 mr-1" />
            <span className="text-red-500 text-xs">{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

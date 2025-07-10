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

// Combined configuration type for each variant
type VariantConfig = {
  type: string;
  placeholder: string;
  icon: (props: { size: number; className: string }) => React.ReactNode;
};

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  variant?: InputVariant;
  label?: string;
  icon?: React.ComponentType<any> | ReactNode;
  error?: string;
  containerClassName?: string;
}

// Unified configuration map for all variants
const variantConfigs: Record<InputVariant, VariantConfig> = {
  default: {
    type: "text",
    placeholder: "",
    icon: () => null,
  },
  email: {
    type: "email",
    placeholder: "Email",
    icon: (props) => <Mail {...props} />,
  },
  password: {
    type: "password",
    placeholder: "Password",
    icon: (props) => <Lock {...props} />,
  },
  search: {
    type: "search",
    placeholder: "Search...",
    icon: (props) => <Search {...props} />,
  },
  name: {
    type: "text",
    placeholder: "Name",
    icon: (props) => <User {...props} />,
  },
  age: {
    type: "number",
    placeholder: "Age",
    icon: (props) => <Calendar {...props} />,
  },
  phone: {
    type: "tel",
    placeholder: "Phone number",
    icon: (props) => <Phone {...props} />,
  },
  url: {
    type: "url",
    placeholder: "Website URL",
    icon: (props) => <Globe {...props} />,
  },
};

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
    const config = variantConfigs[variant];

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
      // Use the icon from config
      const iconProps = { size: 20, className: "text-neutral-700" };
      iconToRender = config.icon(iconProps);
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
              type={config.type}
              placeholder={props.placeholder || config.placeholder}
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

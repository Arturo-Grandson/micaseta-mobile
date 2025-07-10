import { ReactNode, ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    primary: "bg-primary-600 text-white hover:bg-primary-700",
    secondary: "bg-secondary-200 text-secondary-900 hover:bg-secondary-300",
    outline: "border border-primary-600 text-primary-600 hover:bg-primary-50",
    ghost: "bg-transparent text-primary-600 hover:bg-primary-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizeClasses = {
    sm: "text-xs px-3 py-1.5 h-8",
    md: "text-sm px-4 py-2 h-10",
    lg: "text-base px-5 py-3 h-12",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const classes = twMerge(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClass,
    className
  );

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

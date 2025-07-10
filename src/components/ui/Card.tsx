import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  const classes = twMerge("bg-white shadow-md rounded-lg p-6", className);

  return <div className={classes}>{children}</div>;
};

export const CardHeader = ({ children, className }: CardProps) => {
  const classes = twMerge("mb-4", className);
  return <div className={classes}>{children}</div>;
};

export const CardTitle = ({ children, className }: CardProps) => {
  const classes = twMerge("text-xl font-bold text-gray-900", className);
  return <h3 className={classes}>{children}</h3>;
};

export const CardDescription = ({ children, className }: CardProps) => {
  const classes = twMerge("text-sm text-gray-500", className);
  return <p className={classes}>{children}</p>;
};

export const CardContent = ({ children, className }: CardProps) => {
  const classes = twMerge("", className);
  return <div className={classes}>{children}</div>;
};

export const CardFooter = ({ children, className }: CardProps) => {
  const classes = twMerge("mt-4 pt-4 border-t border-gray-200", className);
  return <div className={classes}>{children}</div>;
};

import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "md" | "lg" | "sm";

const base =
  "focus-ring inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-strong",
  secondary: "bg-tint-strong text-brown-900 hover:bg-brown-200",
  outline: "border border-primary text-brown-800 hover:bg-primary hover:text-on-primary",
  ghost: "text-brown-800 hover:bg-tint-strong",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className = "",
  href,
  children,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </Link>
  );
}

import type { LinkProps } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Link } from "@tanstack/react-router";

type NavItemProps = LinkProps & {
  active?: boolean;
  children: ReactNode;
};

export const NavItem = ({
  active = false,
  children,
  ...props
}: NavItemProps) => {
  return (
    <Link
      className={
        active
          ? "rounded-lg bg-black px-3 py-1 text-sm font-bold text-white"
          : "px-3 py-1 text-sm"
      }
      {...props}
    >
      {children}
    </Link>
  );
};

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavItem({ href, customClass, children }) {
  const pathName = usePathname();
  const linkPath = typeof href === "string" ? href : href.pathname;

  return (
    <Link
      href={href}
      className={`${pathName === linkPath ? "active" : ""} ${customClass}`}
    >
      {children}
    </Link>
  );
}

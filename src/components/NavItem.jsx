"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavItem({ href, customClass, children }) {
  const pathName = usePathname();

  return (
    <Link
      href={href}
      className={`${pathName === href ? "active" : ""} ${customClass}`}
    >
      {children}
    </Link>
  );
}

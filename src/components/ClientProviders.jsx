"use client";

import ShopContextProvider from "@/context/ShopContext";
import NetworkStatus from "@/components/NetworkStatus";
import RemoveInitialLoader from "@/components/RemoveInitialLoader";
import ToastProvider from "@/utils/ToastProvider";

export default function ClientProviders({ children }) {
  return (
    <ShopContextProvider>
      <ToastProvider />
      <RemoveInitialLoader />
      <NetworkStatus />
      {children}
    </ShopContextProvider>
  );
}

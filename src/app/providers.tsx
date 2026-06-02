"use client";

import { SessionProvider } from "next-auth/react";
// import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
// import { extractRouterConfig } from "uploadthing/server";
// import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {/* <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} /> */}
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111827",
            border: "1px solid #1e2d45",
            color: "#F0F4FF",
          },
        }}
      />
    </SessionProvider>
  );
}

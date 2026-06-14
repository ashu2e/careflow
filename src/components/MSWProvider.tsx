"use client";

import { useEffect, useState } from "react";

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    // Only enable MSW in development
    if (process.env.NODE_ENV === "development") {
      import("@/mocks/browser").then(({ worker }) => {
        worker.start({ onUnhandledRequest: "bypass" }).then(() => {
          setMswReady(true);
        });
      });
    } else {
      setMswReady(true);
    }
  }, []);

  if (!mswReady) {
    return null; // Or a simple loading state
  }

  return <>{children}</>;
}

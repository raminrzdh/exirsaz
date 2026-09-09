"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/utils/analytics";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    let eventName = "PAGE_VIEW";
    if (pathname.includes("/product/")) {
      eventName = "PRODUCT_VIEW";
    } else if (pathname.includes("/category/")) {
      eventName = "CATEGORY_VIEW";
    }
    
    // Defer slighty to let page render
    const timer = setTimeout(() => {
      trackEvent(eventName, { path: pathname });
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

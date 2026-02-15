/**
 * Dimension Route Layout
 *
 * Provides the DimensionNavigationProvider context for all dimension pages.
 * Enables swipe navigation, history tracking, and Claw AI context updates.
 */

import { ReactNode } from "react";
import { DimensionNavigationProvider } from "@/context/DimensionNavigationContext";

export const metadata = {
  title: "Dimensions | OpenClaw-OS",
  description: "Explore infinite dimensional views of your data",
};

export default function DimensionLayout({ children }: { children: ReactNode }) {
  return (
    <DimensionNavigationProvider>
      {children}
    </DimensionNavigationProvider>
  );
}

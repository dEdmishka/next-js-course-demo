import { orbitron } from "@/app/fonts";
import type { ReactNode } from "react";

export interface HeadingProps {
  children: ReactNode;
}

export default function Heading({ children }: HeadingProps) {
  return (
    // <h1 className={`font-bold pb-3 text-2xl ${orbitron.className}`}>
    <h1 className="font-bold font-orbitron pb-3 text-2xl">{children}</h1>
  );
}

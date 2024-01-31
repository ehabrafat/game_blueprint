"use client";

import * as React from "react";

import { useModalStore } from "@/store/useModalStore";
import { Button } from "./ui/button";

export function Searchbar() {
  const { onOpen, setVariant } = useModalStore();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setVariant("profiles");
        onOpen();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        size={"sm"}
        asChild
        onClick={() => {
          setVariant("profiles");
          onOpen();
        }}
      >
        <p className="text-sm px-10  bg-secondary dark:bg-[#252525] rounded-md p-2 dark:text-zinc-300/80 text-zinc-600 hover:bg-secondary/10 hover:dark:bg-secondary/10">
          Search for players{" "}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </p>
      </Button>
    </>
  );
}

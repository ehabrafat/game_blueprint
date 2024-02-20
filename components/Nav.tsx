"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { Searchbar } from "./Searchbar";

export const Nav = () => {
  return (
    <nav className="container flex justify-between items-center border-b border-b-foreground/10 h-16 py-2">
      <Link href={"/"}>
        <h2 className="bg-clip-text font-bold text-center text-4xl text-transparent bg-gradient-to-r  from-purple-500 via-pink-600 to-rose-600">
          XSPLASH
        </h2>
      </Link>
      <Searchbar />
      <div className="flex items-center gap-x-4">
        <ModeToggle />
        <UserButton />
      </div>
    </nav>
  );
};

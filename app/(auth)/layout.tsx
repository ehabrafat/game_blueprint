"use client";

import Link from "next/link";
import { MdArrowBackIosNew } from "react-icons/md";

interface AuthLayoutProbs {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProbs) => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
        <Link
          href="/"
          className="absolute left-8 top-8 py-2 gap-x-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
        >
          <MdArrowBackIosNew />
          Back
        </Link>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

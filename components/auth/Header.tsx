"use client";

import { XSplashLogo } from "../XSplashLogo";

export const Header = () => {
  return (
    <div className="w-full flex flex-col gap-y-4 justify-center items-center ">
      <XSplashLogo className="w-[124px] h-[124px]" />
      <h2 className="bg-clip-text font-bold text-center text-4xl text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500">
        XSPLASH
      </h2>
    </div>
  );
};

"use client";

import Logo from "@/components/Logo";
import Link from "next/link";
import { useRef } from "react";

type Props = {};

const Header = (props: Props) => {
  const menu = useRef<HTMLUListElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  const handleClickOpen = () => {
    menu.current?.classList.remove("translate-x-full");
    overlay.current?.classList.remove("hidden");
  };
  
  const handleClickClose = () => {
    menu.current?.classList.add("translate-x-full");
    overlay.current?.classList.add("hidden");
  };

  return (
    <header>
      <nav className="py-4 max-w-4xl w-full px-4 md:px-0 mx-auto flex justify-between items-center z-20">
        <Link href="/" className="flex gap-2 items-center">
          <Logo />
          <h1 className="text-xl font-bold">Subas.io</h1>
        </Link>

        <button onClick={handleClickOpen} className="flex relative flex-col gap-[3px] w-4 md:hidden">
          <div className="w-full h-[1.8px] rounded-full bg-gray-100"></div>
          <div className="w-full h-[1.8px] rounded-full bg-gray-100"></div>
          <div className="w-full h-[1.8px] rounded-full bg-gray-100"></div>
        </button>

        <ul ref={menu} className="flex gap-3 items-center fixed top-0 right-0 bottom-0 flex-col w-1/2 justify-center bg-slate-950 pr-0 translate-x-full transition-all duration-200 z-20 md:static md:flex-row md:bg-transparent md:w-fit md:translate-x-0">
          <li>
            <button onClick={handleClickClose} className="absolute top-0 right-0 m-4 md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </li>
          <li>
            <Link href="/about">¿Cómo funciona?</Link>
          </li>
          <li>
            <Link href="/blog">Blog</Link>
          </li>
          <li>
            <a href="https://github.com/alejooroncoy">@alejooroncoy</a>
          </li>
        </ul>
        <div onClick={handleClickClose}  ref={overlay} className="fixed hidden opacity-60 inset-0 bg-slate-900 z-10"></div>
      </nav>
    </header>
  );
};

export default Header;

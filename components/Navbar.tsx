"use client";
import React, { useEffect } from "react";
import { Logo } from "./Logo";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/lib/ThemeToggle";
import { UserButton, useUser } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import { DialogTitle } from "./ui/dialog";

export function Navbar() {
  const [hasUser, setHasUser] = React.useState(false);
  const userData = useUser();
  const pathname = usePathname();
  const [isOpenedMenu, setIsOpenedMenu] = React.useState(false);

  const linkItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Transactions",
      href: "/transactions",
    },
    {
      label: "Manage",
      href: "/manage",
    },
  ];

  useEffect(() => {
    setHasUser(!!userData.user);
  }, [userData]);
  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden border-separate border-b md:block  right-0 left-0 z-50  dark:bg-gray-950 bg-gray-300 fixed top-0">
        <div className=" max-w-5xl mx-auto  ">
          <nav className="glex items-center justify-between px-8">
            <div className="flex h-[65px] min-h-[60px] items-center gap-x-8">
              <Logo />

              {/* links on dashboard */}
              {pathname !== "/wizard" ? (
                <div className="flex w-full gap-4 items-center">
                  {hasUser &&
                    linkItems.map((data, index) => {
                      const isActive = pathname === data.href.toLowerCase();
                      return (
                        <Link
                          key={index}
                          href={data.href}
                          className={cn(
                            isActive
                              ? "font-bold dark:text-white text-black "
                              : "font-medium",
                            "relative hover:bg-gray-200  transition-all p-2 rounded-md  text-gray-700 dark:hover:text-black dark:text-gray-100 "
                          )}
                        >
                          <p className={cn()}>{data.label}</p>
                          <div
                            className={cn(
                              isActive &&
                                "border-b-1 dark:border-white border-black absolute top-[52px] left-1/2 -translate-1/2 bottom-0  w-[120%] z-10"
                            )}
                          ></div>
                        </Link>
                      );
                    })}
                </div>
              ) : (
                <div className="w-full"></div>
              )}

              <div className="flex items-center gap-4">
                <ThemeToggle />
                {hasUser && (
                  <div className="flex w-8 h-8 justify-center items-center dark:bg-gray-300 bg-gray-700 rounded-full">
                    <UserButton />
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="block    md:hidden  fixed top-0 left-0 right-0  dark:bg-gray-950 bg-gray-300">
        <nav className="flex  px-6 h-[60px] min-h-[60px] items-center justify-between w-full">
          <div className="flex justify-between items-center w-full">
            {/* links */}
            <div className="">
              <Sheet
                open={isOpenedMenu}
                onOpenChange={() => setIsOpenedMenu(!isOpenedMenu)}
              >
                <SheetTrigger
                  asChild
                  className="cursor-pointer w-5 h-5 flex justify-end items-center "
                >
                  {hasUser && (
                    <Menu
                      onClick={() => setIsOpenedMenu(!isOpenedMenu)}
                      className="w-5 h-5 "
                    />
                  )}
                </SheetTrigger>
                <SheetContent className="py-6 px-4" side="left">
                  <DialogTitle>Menu</DialogTitle>
                  <div className="flex items-center gap-2">
                    <p className="text-xs">Profile</p>
                    <div className="flex w-8 h-8 justify-center items-center dark:bg-gray-300 bg-gray-700 rounded-full">
                      <UserButton />
                    </div>
                  </div>
                  {linkItems.map((data, index) => {
                    const isActive = pathname === data.href.toLowerCase();
                    return (
                      <Link
                        key={index}
                        href={data.href}
                        className="relative"
                        onClick={() => setIsOpenedMenu(false)}
                      >
                        <p
                          className={cn(
                            isActive
                              ? "font-bold dark:text-white"
                              : "font-light text-gray-100",
                            "  text-gray-700 dark:text-gray-200 hover:text-primary"
                          )}
                        >
                          {data.label}
                        </p>
                      </Link>
                    );
                  })}
                  <div className="flex items-center gap-4">
                    <ThemeToggle />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <Logo />
            {!hasUser && <ThemeToggle />}
            {hasUser ? (
              <div className="flex w-8 h-8 justify-center items-center dark:bg-gray-300 bg-gray-700 rounded-full">
                <UserButton />
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}

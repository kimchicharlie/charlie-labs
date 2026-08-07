"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/shared/i18n";
import { Language } from "@/shared/types/language";
import LanguageToggle from "@/shared/ui/LanguageToggle";

const Navigation = (): React.JSX.Element => {
  const pathname = usePathname();
  const { language, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHomePage = pathname === "/";
  const homeSectionItems = [
    { href: "/#experience", label: t("nav.experience") },
    { href: "/#work", label: t("nav.work") },
    { href: "/#about", label: t("nav.about") },
  ];
  const destinationItems = [
    { href: "/resume/", label: t("nav.resume") },
    { href: "/pitch-game/", label: t("nav.pitchMatchingGame") },
  ];
  const mobileItems = [
    ...destinationItems,
    ...(isHomePage ? homeSectionItems : []),
  ];

  const isActiveDestination = (href: string): boolean =>
    (href === "/resume/" && pathname.startsWith("/resume")) ||
    (href === "/pitch-game/" && pathname.startsWith("/pitch-game"));

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[#e4e2dc] bg-[#f7f6f2]/95 backdrop-blur-md print:hidden">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            aria-current={isHomePage ? "page" : undefined}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`relative py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f6f2] ${
              isHomePage
                ? "text-[#1b1d21] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-primary-600 after:content-['']"
                : "text-[#62666d] hover:text-[#1b1d21]"
            }`}
          >
            {t("nav.home")}
          </Link>

          <nav
            className="hidden items-center gap-6 lg:flex"
            aria-label="Site destinations"
          >
            {destinationItems.map((item) => {
              const isActive = isActiveDestination(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative whitespace-nowrap py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f6f2] ${
                    isActive
                      ? "text-[#1b1d21] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-primary-600 after:content-['']"
                      : "text-[#62666d] hover:text-[#1b1d21]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden items-center gap-7 lg:flex">
          {isHomePage && (
            <nav
              className="flex items-center gap-6"
              aria-label="Homepage sections"
            >
              {homeSectionItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative whitespace-nowrap py-1 text-sm font-medium text-[#62666d] transition-colors hover:text-[#1b1d21] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f6f2]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
          <LanguageToggle />
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#35383e] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 lg:hidden"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isMobileMenuOpen && (
          <motion.div
            className="absolute left-0 right-0 top-full border-b border-[#e4e2dc] bg-[#f7f6f2] px-5 py-5 shadow-[0_18px_35px_rgba(27,29,33,0.08)] lg:hidden"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
          >
            <nav className="flex flex-col" aria-label="Mobile navigation">
              {mobileItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="border-b border-[#e4e2dc] py-3 text-base font-medium text-[#35383e] transition-colors last:border-b-0 hover:text-primary-700"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm text-[#62666d]">
                {language === Language.FR ? "Langue" : "Language"}
              </span>
              <LanguageToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;

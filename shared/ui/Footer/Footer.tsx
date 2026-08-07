"use client";

import React from "react";
import Link from "next/link";
import Container from "@/shared/ui/Container";
import { portfolioData } from "@/features/resume/data";
import { useLanguage } from "@/shared/i18n";
import { Language } from "@/shared/types/language";

const Footer = (): React.JSX.Element => {
  const { language } = useLanguage();
  const isFrench = language === Language.FR;

  return (
    <footer className="border-t border-[#e4e2dc] bg-[#f7f6f2] py-8 print:hidden">
      <Container className="flex flex-col gap-4 text-sm text-[#656970] sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Charlie Henin · {isFrench ? "Montréal" : "Montreal"}, Canada</p>
        <div className="flex items-center gap-5">
          <a className="transition-colors hover:text-[#1b1d21]" href={`mailto:${portfolioData.contact.email}`}>
            {isFrench ? "Courriel" : "Email"}
          </a>
          <a
            className="transition-colors hover:text-[#1b1d21]"
            href={`https://www.linkedin.com/in/${portfolioData.contact.linkedin}/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <Link className="transition-colors hover:text-[#1b1d21]" href="/resume/">
            {isFrench ? "CV" : "Resume"}
          </Link>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

// Mock Data


export default function ResultsSection() {
  const t = useTranslations("HomeResults");

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <div className="mb-10">
        <h2 className="text-3xl text-center font-bold tracking-tight mb-2">
          {t("title")}
        </h2>
        <p className="text-muted-foreground text-lg text-center">
          {t("subtitle")}
        </p>
      </div>

      <div className="mt-8 rounded-lg border shadow-sm max-w-7xl mx-auto overflow-hidden">
        <Image
          src="/example.png"
          alt="Example Result"
          width={1200}
          height={800}
          className="w-full h-auto"
        />
      </div>
    </section>
  );
}

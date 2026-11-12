import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-[#f7faf9] px-6 py-24">
      <div className="text-center">
        <p className="font-display text-7xl font-extrabold text-teal">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-deep sm:text-3xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mx-auto mt-3 max-w-md text-ink-2">
          The page may have moved, or the link may be out of date.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </section>
  );
}

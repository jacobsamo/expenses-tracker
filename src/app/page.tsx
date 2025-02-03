import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default async function Home() {
  return (
    <main>
      <h1>Welcome to a simple expense tracker</h1>
      <p>Built for my roadtrip</p>
      <Link href="/sign-in" className={buttonVariants()}>
        Login
      </Link>
    </main>
  );
}

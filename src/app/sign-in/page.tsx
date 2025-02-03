"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import React from "react";

export default function SignInPage() {
  const signIn = async () => {
    console.log("signing in");
    const data = await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-1/2 rounded-md">
        <Button onClick={() => signIn()}>Continue with Google</Button>
      </div>
    </div>
  );
}

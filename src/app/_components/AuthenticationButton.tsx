"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthShowcase() {
  const { data: sessionData } = useSession();

  return (
    <button
      className="flex w-3/6 items-center justify-center rounded-lg bg-[#b372f0] px-5 py-3 font-semibold text-white no-underline transition hover:bg-[#cdacec]"
      onClick={sessionData ? () => void signOut() : () => void signIn("google")}
    >
      {sessionData ? "Sign out" : "Sign in"}
    </button>
  );
}

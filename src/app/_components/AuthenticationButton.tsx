"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Button from "@/app/_components/Button";

export type Size = "small" | "normal" | "large"

export default function AuthButton({ size }: { size: Size}) {
  const { data: sessionData } = useSession();

  return (
    <Button
      data-cy="auth-button"
      intent={sessionData ? "singout" : "singin"}
      size={`${size}`}
      onClick={sessionData ? () => void signOut() : () => void signIn("google")}
    >{sessionData ? "sign out" : "Sign in"}</Button>
  );
}

"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Button from "@/app/_components/Button";

export type Size = "small" | "normal" | "large"

export default function AuthButton({ size }: { size: Size }) {
  const { data: sessionData } = useSession();

  return (
    <Button
      data-cy="auth-button"
      intent={sessionData ? "signout" : "signin"}
      size={`${size}`}
      onClick={sessionData ? () => void signOut() : () => void signIn("google")}
    >{sessionData ? "Sign out" : "Sign in"}</Button>
  );
}

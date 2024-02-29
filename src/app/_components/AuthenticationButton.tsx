"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Button from "@/app/_components/Button";

export default function AuthShowcase() {
  const { data: sessionData } = useSession();

  return (
    <Button
      text={sessionData ? "Sign out" : "Sign in"}
      intent={"primary"}
      size={"large"}
      onClick={sessionData ? () => void signOut() : () => void signIn("google")}
    />
  );
}

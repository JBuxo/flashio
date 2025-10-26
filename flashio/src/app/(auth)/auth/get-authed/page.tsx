"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { MailIcon } from "lucide-react";
import { loginWithEmail } from "@/supabase/auth/magic-link";
import BrandedText from "@/components/ui/branded-text";

export default function Login() {
  const [emailAddress, setEmailAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await loginWithEmail(emailAddress);
      setMessage("Magic link sent! Check your email.");
    } catch (err) {
      setMessage((err as Error)?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm w-full">
      <BrandedText className="text-7xl leading-none tracking-wide text-pink-500 text-center -mt-8">
        Flashio
      </BrandedText>
      <div
        className="mt-8 p-6 border-3 border-black space-y-6 bg-pink-500 text-white"
        style={{
          boxShadow: "12px 12px 0px rgba(0,0,0,1)",
        }}
      >
        <BrandedText className="text-4xl tracking-wider">
          Let's get To Work
        </BrandedText>
        <div className="leading-tight">
          Use your email to log in. If you don&apos;t have an account,
          you&apos;ll be registered automatically after confirming your email.
        </div>

        <form onSubmit={handleSubmit}>
          <InputGroup className="rounded-none bg-white border-3 border-black">
            <InputGroupInput
              type="email"
              placeholder="Enter your email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              required
            />
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
          </InputGroup>
          <Button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-none lg:hover:shadow-[4px_4px_0_rgba(0,0,0,1)] border-3 border-black text-black flex-1 bg-pink-300 lg:hover:bg-pink-200 transition-all"
          >
            {loading ? "Sending..." : "Log In"}
          </Button>
        </form>

        {message && (
          <p className="mt-3 text-sm text-center text-white">{message}</p>
        )}
      </div>
    </div>
  );
}

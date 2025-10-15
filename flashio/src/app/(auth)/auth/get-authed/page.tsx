"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { MailIcon } from "lucide-react";
import { loginWithEmail } from "@/supabase/auth/magic-link";
import Image from "next/image";

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
    } catch (err: any) {
      setMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm w-full">
      <Image
        src={"/images/flashio-logo.svg"}
        alt={""}
        width={300}
        height={200}
        className="mx-auto"
      />
      <Card className=" mt-8">
        <CardHeader>
          <CardTitle>Get Authed so we can get to work</CardTitle>
          <CardDescription>
            Use your email to log in. If you don&apos;t have an account,
            you&apos;ll be registered automatically after confirming your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <InputGroup>
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
            <Button type="submit" disabled={loading} className="mt-3 w-full">
              {loading ? "Sending..." : "Log In"}
            </Button>
          </form>

          {message && (
            <p className="mt-3 text-sm text-center text-muted-foreground">
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

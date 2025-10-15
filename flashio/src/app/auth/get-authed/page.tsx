"use client";

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
import { loginWithEmail } from "@/supabase/auth/magic-link";
import { MailIcon } from "lucide-react";
import { useState } from "react";

export default function Login() {
  const [emailAddress, setEmailAddress] = useState("");
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Get Authed so we can get to work</CardTitle>
        <CardDescription>
          If you already have an account, use your email to log in. If you
          don't, also use your email and you will be automatically registered
          after confirming your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={() => loginWithEmail(emailAddress)}>
          <InputGroup>
            <InputGroupInput
              type="email"
              placeholder="Enter your email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
            />
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
          </InputGroup>
          <Button>Log In</Button>
        </form>
      </CardContent>
    </Card>
  );
}

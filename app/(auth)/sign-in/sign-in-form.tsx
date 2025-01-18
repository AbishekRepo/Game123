"use client";

import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { signInDefaultValues } from "@/lib/constants";

const SignInForm = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <form className="text-center space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Phone Number</Label>
        <Input
          id="email"
          name="email"
          type="text"
          required
          defaultValue={signInDefaultValues.email}
          autoComplete="tel"
          className="text-center"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="text"
          required
          defaultValue={signInDefaultValues.password}
          autoComplete="password"
          className="text-center"
        />
      </div>
      <div>
        <Button className="w-full" variant="default">
          Login
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" target="_self" className="text-blue-500">
          Sign Up
        </Link>
      </div>
    </form>
  );
};

export default SignInForm;

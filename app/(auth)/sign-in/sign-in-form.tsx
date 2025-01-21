"use client";

import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignInForm = () => {
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(""); // Reset error on submit
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        // Store token securely in cookies (suggested implementation)
        document.cookie = `token=${data.token}; Path=/; Secure; HttpOnly`;
        router.push("/"); // Redirect to Games
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <form className="text-center space-y-4" onSubmit={handleSubmit}>
      {error && <div className="text-red-500">{error}</div>}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="text-center"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="text-center"
        />
      </div>
      <div>
        <Button
          className="w-full"
          variant="default"
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
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

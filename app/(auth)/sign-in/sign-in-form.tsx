"use client";

import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {} from "lucide-react";
import { Mail } from "lucide-react";

const SignInForm = () => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  // Redirect the user once they are authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/games"); // Redirect to your main page (e.g., games)
    }
  }, [status, router]);

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google");
  };

  return (
    <div className="flex justify-center items-center">
      <div className="space-y-4">
        <div>
          <Button
            className="w-full"
            variant="default"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <Mail />
            {loading ? "Loading..." : "Sign in with Google"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;

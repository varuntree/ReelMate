"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGoogle } from "@tabler/icons-react";
import { signInWithGoogle, signInWithEmail } from "@/app/api/Firebase/authService";
import { useRouter } from "next/navigation";

export function SignupFormDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { user, error } = await signInWithEmail(email, password);
      if (error) {
        setError(error);
        return;
      }
      if (user) {
        router.push("/"); // Redirect to home page after successful sign in
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, error } = await signInWithGoogle();
      if (error) {
        setError(error);
        return;
      }
      if (user) {
        router.push("/"); // Redirect to home page after successful sign in
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-md mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input",
        "bg-background text-text"
      )}
    >
      <h2 className="font-bold text-xl">Welcome to ReelMate</h2>
      <p className="text-sm max-w-sm mt-2">
        Sign in to continue to your account
      </p>

      {error && (
        <div className="mt-4 p-2 text-sm text-red-500 bg-red-50 rounded">
          {error}
        </div>
      )}

      <form className="my-8" onSubmit={handleEmailSignIn}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background"
            required
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-background"
            required
          />
        </LabelInputContainer>

        <button
          className="bg-primary hover:bg-secondary text-accent w-full rounded-md h-10 font-medium"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in →"}
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <button
            className="flex space-x-2 items-center justify-center px-4 w-full text-text rounded-md h-10 font-medium shadow-input bg-accent"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <IconBrandGoogle className="h-4 w-4" />
            <span className="text-sm">Continue with Google</span>
          </button>
        </div>
      </form>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
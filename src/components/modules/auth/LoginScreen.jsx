"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { HospitalIcon } from "@/components/icons";

export function LoginScreen({ redirectTo = "/" }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setErrors(result?.errors ?? {});
        if (result?.errors?.form) showToast(result.errors.form);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      showToast("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
            <HospitalIcon className="h-6 w-6" />
          </div>
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Promethean Rehabilitation
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <TextField
            label="Username"
            autoComplete="username"
            autoFocus
            required
            error={errors.username}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            error={errors.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}

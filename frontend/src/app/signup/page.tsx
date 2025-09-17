"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) return setError("Email and password required");
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
  } catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Something went wrong");
  }
}

  };

  return (
    <div className="min-h-[calc(100vh-56px)] grid place-items-center p-4 bg-gradient-to-b from-white to-zinc-50">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Create your account</h1>
        <p className="text-sm text-gray-600 mb-4">Join to start building product tours.</p>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full border rounded p-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full border rounded p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full border rounded p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full bg-black text-white rounded p-2">Sign up</button>
        </form>
        <p className="text-sm mt-3">Have an account? <Link className="underline" href="/login">Log in</Link></p>
      </motion.div>
    </div>
  );
}



"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-50 via-white to-zinc-50">
      <div className="max-w-3xl text-center space-y-6">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-5xl md:text-6xl font-extrabold tracking-tight">
          Build interactive product tours in minutes
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} className="text-gray-600 text-lg">
          Upload screenshots, record your screen, and publish a step-by-step demo with a shareable link.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="flex items-center justify-center gap-3">
          <Link href="/signup" className="px-5 py-3 bg-black text-white rounded-md">Get started</Link>
          <Link href="/login" className="px-5 py-3 border rounded-md">Log in</Link>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-10">
          <div className="mx-auto h-64 md:h-80 max-w-4xl rounded-xl border bg-white shadow-sm flex items-center justify-center text-gray-500">
            Landing preview area
          </div>
        </motion.div>
      </div>
    </main>
  );
}

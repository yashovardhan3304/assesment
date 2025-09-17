"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Tour = {
  id: string;
  title: string;
  createdAt: string;
  isPublic: boolean;
  shareId: string;
};

export default function DashboardPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("token");
    if (raw === "dev-bypass-token") {
      localStorage.removeItem("token");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // ✅ proper redirect
      return;
    }

    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/tours", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => (r.ok ? r.json() : Promise.reject(await r.json())))
      .then(setTours)
      .catch((e) => setError(e.error || "Failed to load"));
  }, [router]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Tours</h1>
        <Link
          className="px-3 py-2 bg-black text-white rounded"
          href="/editor"
        >
          New Tour
        </Link>
      </div>
      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="border rounded p-3">
          <div className="text-sm text-gray-600">Total Tours</div>
          <div className="text-2xl font-bold">{tours.length}</div>
        </div>
        <div className="border rounded p-3">
          <div className="text-sm text-gray-600">Public</div>
          <div className="text-2xl font-bold">
            {tours.filter((t) => t.isPublic).length}
          </div>
        </div>
        <div className="border rounded p-3">
          <div className="text-sm text-gray-600">Views (mock)</div>
          <div className="text-2xl font-bold">{tours.length * 42}</div>
        </div>
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      <ul className="mt-6 space-y-3">
        {tours.map((t) => (
          <li
            key={t.id}
            className="border p-3 rounded flex items-center justify-between"
          >
            <div>
              <div className="font-medium">{t.title}</div>
              <div className="text-xs text-gray-500">
                {new Date(t.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="space-x-2">
              <Link className="underline" href={`/editor/${t.id}`}>
                Edit
              </Link>
              {t.isPublic && (
                <Link className="underline" href={`/p/${t.shareId}`}>
                  Public link
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}




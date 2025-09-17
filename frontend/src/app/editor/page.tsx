"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Tour = {
  id: string;
  title: string;
  createdAt: string;
  isPublic: boolean;
  shareId: string;
};

export default function EditorPage() {
  const { id } = useParams();
  const [tour, setTour] = useState<Tour | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("token");
    if (raw === "dev-bypass-token") {
      localStorage.removeItem("token");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      // ✅ Don’t return — just redirect
      window.location.href = "/login";
      return;
    }

    if (!process.env.NEXT_PUBLIC_API_URL) {
      setError("API URL not configured");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tours/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => (r.ok ? r.json() : Promise.reject(await r.json())))
      .then(setTour)
      .catch((e) => setError(e.error || "Failed to load tour"));
  }, [id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!tour) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Editing: {tour.title}</h1>
      {/* 👇 You can put your editor UI here (steps, recorder, uploader etc.) */}
    </div>
  );
}



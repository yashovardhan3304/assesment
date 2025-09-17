"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ScreenRecorder from "@/components/ScreenRecorder";
import ImageUploader from "@/components/ImageUploader";

type Step = {
  order: number;
  imageUrl?: string;
  videoUrl?: string;
  text?: string;
};

export default function EditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ✅ Check token on mount
  useEffect(() => {
    const checkToken = () => {
      const raw = localStorage.getItem("token");
      if (raw === "dev-bypass-token") localStorage.removeItem("token");

      const token = localStorage.getItem("token");
      if (!token) {
        void router.push("/login"); // SPA-safe redirect, void ensures useEffect returns void
      }
    };

    checkToken();
  }, [router]);

  // Add a new step
  const addStep = () =>
    setSteps((s) => [...s, { order: s.length }]);

  // Remove a step and reorder remaining steps
  const removeStep = (index: number) =>
    setSteps((s) =>
      s
        .filter((_, i) => i !== index)
        .map((st, i) => ({ ...st, order: i }))
    );

  // Create tour
  const onCreate = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      void router.push("/login");
      return;
    }

    if (!process.env.NEXT_PUBLIC_API_URL) {
      alert("API URL not configured");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tours`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, steps }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to create tour");
        return;
      }

      void router.push("/dashboard");
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Create Tour</h1>

      <input
        className="w-full border rounded p-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full border rounded p-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Steps</h2>
          <button
            onClick={addStep}
            className="px-2 py-1 bg-black text-white rounded"
          >
            Add step
          </button>
        </div>

        <AnimatePresence>
          {steps.map((step, idx) => (
            <motion.div
              key={step.order}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="border rounded p-3 mb-2"
            >
              <div className="flex gap-2">
                <input
                  className="flex-1 border rounded p-2"
                  placeholder="Image URL (or use Upload)"
                  value={step.imageUrl || ""}
                  onChange={(e) =>
                    setSteps((arr) =>
                      arr.map((s, i) =>
                        i === idx ? { ...s, imageUrl: e.target.value } : s
                      )
                    )
                  }
                />
                <input
                  className="flex-1 border rounded p-2"
                  placeholder="Video URL (optional)"
                  value={step.videoUrl || ""}
                  onChange={(e) =>
                    setSteps((arr) =>
                      arr.map((s, i) =>
                        i === idx ? { ...s, videoUrl: e.target.value } : s
                      )
                    )
                  }
                />
              </div>

              <div className="flex gap-2 mt-2">
                <ImageUploader
                  onUploaded={(url) =>
                    setSteps((arr) =>
                      arr.map((s, i) => (i === idx ? { ...s, imageUrl: url } : s))
                    )
                  }
                />
                <ScreenRecorder
                  onUploaded={(url) =>
                    setSteps((arr) =>
                      arr.map((s, i) => (i === idx ? { ...s, videoUrl: url } : s))
                    )
                  }
                />
              </div>

              <textarea
                className="w-full border rounded p-2 mt-2"
                placeholder="Annotation / Text"
                value={step.text || ""}
                onChange={(e) =>
                  setSteps((arr) =>
                    arr.map((s, i) => (i === idx ? { ...s, text: e.target.value } : s))
                  )
                }
              />

              <div className="flex justify-end mt-2">
                <button
                  onClick={() => removeStep(idx)}
                  className="text-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onCreate}
          className="px-3 py-2 bg-black text-white rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
}





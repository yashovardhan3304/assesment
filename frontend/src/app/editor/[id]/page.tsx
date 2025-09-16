"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ScreenRecorder from "@/components/ScreenRecorder";
import ImageUploader from "@/components/ImageUploader";

type Step = { id?: string; order: number; imageUrl?: string; videoUrl?: string; text?: string };

export default function EditTourPage() {
  const params = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("token");
    if (raw === 'dev-bypass-token') {
      localStorage.removeItem('token');
    }
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/login");
    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/tours/" + params.id, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => (r.ok ? r.json() : Promise.reject(await r.json())))
      .then((t) => {
        setTitle(t.title);
        setDescription(t.description || "");
        setSteps(t.steps || []);
      })
      .catch((e) => setError(e.error || "Failed to load"));
  }, [params.id]);

  const addStep = () => setSteps((s) => [...s, { order: s.length }]);
  const removeStep = (i: number) => setSteps((s) => s.filter((_, idx) => idx !== i).map((st, idx) => ({ ...st, order: idx })));

  const onSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/login");
    if (process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true') {
      alert('Auth disabled: simulating save.');
      return;
    }
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/tours/" + params.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, description, steps }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return alert((data as any).error || "Failed");
    alert("Saved");
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Tour</h1>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} /> Public
        </label>
      </div>
      <input className="w-full border rounded p-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="w-full border rounded p-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Steps</h2>
          <button onClick={addStep} className="px-2 py-1 bg-black text-white rounded">Add step</button>
        </div>
        <AnimatePresence>
          {steps.map((s, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="border rounded p-3 mb-2">
              <div className="flex gap-2">
                <input className="flex-1 border rounded p-2" placeholder="Image URL" value={s.imageUrl || ""} onChange={(e) => setSteps((arr) => arr.map((it, i) => i === idx ? { ...it, imageUrl: e.target.value } : it))} />
                <input className="flex-1 border rounded p-2" placeholder="Video URL" value={s.videoUrl || ""} onChange={(e) => setSteps((arr) => arr.map((it, i) => i === idx ? { ...it, videoUrl: e.target.value } : it))} />
              </div>
              <div className="flex gap-2 mt-2">
                <ImageUploader onUploaded={(url) => setSteps((arr) => arr.map((it, i) => i === idx ? { ...it, imageUrl: url } : it))} />
                <ScreenRecorder onUploaded={(url) => setSteps((arr) => arr.map((it, i) => i === idx ? { ...it, videoUrl: url } : it))} />
              </div>
              <textarea className="w-full border rounded p-2 mt-2" placeholder="Annotation / Text" value={s.text || ""} onChange={(e) => setSteps((arr) => arr.map((it, i) => i === idx ? { ...it, text: e.target.value } : it))} />
              <div className="mt-2">
                <ScreenRecorder onUploaded={(url) => setSteps((arr) => arr.map((it, i) => i === idx ? { ...it, videoUrl: url } : it))} />
              </div>
              <div className="flex justify-end mt-2">
                <button onClick={() => removeStep(idx)} className="text-red-600 text-sm">Remove</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex justify-end">
        <button onClick={onSave} className="px-3 py-2 bg-black text-white rounded">Save</button>
      </div>
    </div>
  );
}



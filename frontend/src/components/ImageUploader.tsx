"use client";
import { useRef, useState } from "react";

export default function ImageUploader({ onUploaded }: { onUploaded: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const onPick = () => inputRef.current?.click();

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem('token') || '';
      const form = new FormData();
      form.append('file', file);
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL as string) + '/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      if (res.ok && data.url) onUploaded((process.env.NEXT_PUBLIC_API_URL as string) + data.url);
      else alert(data.error || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
      <button onClick={onPick} className="px-2 py-1 border rounded" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload image'}
      </button>
    </div>
  );
}



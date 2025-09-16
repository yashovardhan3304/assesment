"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  onUploaded?: (url: string) => void;
};

export default function ScreenRecorder({ onUploaded }: Props) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const start = async () => {
    const stream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true, audio: true });
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    chunksRef.current = [];
    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'video/webm' });
      const token = localStorage.getItem('token');
      const form = new FormData();
      form.append('file', file);
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL as string) + '/api/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form,
      });
      const data = await res.json();
      if (res.ok && data.url && onUploaded) onUploaded((process.env.NEXT_PUBLIC_API_URL as string) + data.url);
    };
    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setRecording(true);
  };

  const stop = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    setRecording(false);
  };

  return (
    <div className="border rounded p-3 space-y-2">
      <div className="flex gap-2">
        {!recording ? (
          <button onClick={start} className="px-3 py-1 bg-black text-white rounded">Start recording</button>
        ) : (
          <button onClick={stop} className="px-3 py-1 bg-red-600 text-white rounded">Stop</button>
        )}
      </div>
      {previewUrl && (
        <video className="w-full" src={previewUrl} controls />
      )}
    </div>
  );
}



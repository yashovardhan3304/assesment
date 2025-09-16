import { Suspense } from "react";

async function getTour(shareId: string) {
  const res = await fetch((process.env.NEXT_PUBLIC_API_URL as string) + `/api/tours/public/share/${shareId}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function PublicTourPage({ params }: { params: { shareId: string } }) {
  const tour = await getTour(params.shareId);
  if (!tour) return <div className="p-6">Not found</div>;
  return (
    <Suspense>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">{tour.title}</h1>
        <p className="text-gray-600">{tour.description}</p>
        <div className="mt-4 space-y-3">
          {tour.steps.map((s: any) => (
            <div key={s.id} className="border rounded p-3">
              {s.imageUrl ? <img src={s.imageUrl} alt="step" className="w-full rounded" /> : <div className="bg-gray-100 h-40 rounded" />}
              {s.text && <p className="mt-2 text-sm">{s.text}</p>}
            </div>
          ))}
        </div>
      </div>
    </Suspense>
  );
}



"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavBar() {
	const [isAuthed, setIsAuthed] = useState(false);
	useEffect(() => {
		setIsAuthed(Boolean(localStorage.getItem("token")) || process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true');
	}, []);

	return (
		<header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b">
			<nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
				<Link href="/" className="font-extrabold text-xl">Tourify</Link>
				<div className="flex items-center gap-3">
					<Link href="/" className="text-sm hover:underline">Home</Link>
					<Link href="/p/demo" className="text-sm hover:underline">Demo</Link>
					<Link href="/dashboard" className="text-sm hover:underline">Dashboard</Link>
					{isAuthed ? (
						<Link href="/editor" className="px-3 py-1 rounded bg-black text-white text-sm">New Tour</Link>
					) : (
						<Link href="/login" className="px-3 py-1 rounded border text-sm">Log in</Link>
					)}
				</div>
			</nav>
		</header>
	);
}



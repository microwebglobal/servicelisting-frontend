"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "./ui/progress";

export function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const expiresStr = `expires=${expires.toUTCString()}`;
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; ${expiresStr}; path=/`;
}

export default function LocationInitializer() {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const detectCity = async () => {
      try {
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 10;
          });
        }, 100);

        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const city = data?.city || "Unknown";

        setCookie("current-location", city, 30);

        router.refresh();
      } catch (e) {
        console.error("Failed to detect city", e);
        setProgress(100);
      }
    };

    detectCity();
  }, [router]);

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <span className="text-4xl font-bold text-[#5f61b9] mb-10">QProz</span>
      <Progress value={progress} className="w-64 h-2.5" />
    </div>
  );
}

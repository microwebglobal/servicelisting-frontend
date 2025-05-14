"use client";

import { useEffect, useState } from "react";
import { Progress } from "./ui/progress";

// Cookie helper
export function setCookie(name, value) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
}

export default function LocationInitializer() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const detectCity = async () => {
      let interval = null;
      // Progress
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? prev : prev + 10));
      }, 100);

      try {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            if (!latitude || !longitude) {
              console.error("No coordinates available.");
              setProgress(100);
              clearInterval(interval);
              setCookie("current-location", "Unknown");
              return;
            }

            const res = await fetch(
              `/api/location?latitude=${latitude}&longitude=${longitude}`
            );

            if (!res.ok) {
              console.error("Failed to fetch location from server.");
              setProgress(100);
              clearInterval(interval);
              setCookie("current-location", "Unknown");
              return;
            }

            const data = await res.json();
            const city = data.city || "Unknown";

            setProgress(100);
            clearInterval(interval);

            setCookie("current-location", city);
            setTimeout(() => {
              window.location.reload();
            }, 500);
          },
          (error) => {
            console.warn("Geolocation failed, defaulting to 'Unknown'", error);
            setProgress(100);
            clearInterval(interval);
            setCookie("current-location", "Unknown");
            setTimeout(() => {
              window.location.reload();
            }, 500);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } catch (error) {
        console.error("Unexpected error:", error);
        setProgress(100);
        clearInterval(interval);
        setCookie("current-location", "Unknown");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    };

    detectCity();
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <span className="text-4xl font-bold text-[#5f61b9] mb-10">QProz</span>
      <Progress value={progress} className="w-64 h-2.5" />
    </div>
  );
}

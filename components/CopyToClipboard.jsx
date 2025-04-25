"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyToClipboard({ value, className = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <input
        type="text"
        readOnly
        value={value}
        className="w-full px-4 py-2 pr-10 border rounded-md text-sm text-gray-700 bg-gray-100 cursor-default"
      />
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-2 p-1 text-gray-500 hover:text-gray-800"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <Check size={18} className="text-green-500" />
        ) : (
          <Copy size={18} />
        )}
      </button>
    </div>
  );
}

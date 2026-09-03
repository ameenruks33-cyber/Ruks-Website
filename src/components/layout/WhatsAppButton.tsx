"use client";

import { MessageCircle } from "lucide-react";
import { useSettingsStore } from "@/store/settings-store";

export function WhatsAppButton() {
  const { whatsappUrl, storeName } = useSettingsStore();

  const handleClick = () => {
    const message = encodeURIComponent(`Hi ${storeName}! I have a question about your products.`);
    const url = whatsappUrl.includes("wa.me")
      ? `${whatsappUrl}?text=${message}`
      : whatsappUrl;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-20 lg:bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#20BD5A] transition-all hover:scale-105 flex items-center gap-2 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={24} fill="white" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-medium">
        Chat with us
      </span>
    </button>
  );
}

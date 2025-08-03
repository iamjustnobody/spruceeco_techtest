import { X } from "lucide-react";
import React, { type JSX } from "react";
import clsx from "clsx";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  onClose: () => void;
  className?: string;
}

const iconMap: Record<ToastType, JSX.Element> = {
  success: <span className="text-green-400">✅</span>,
  error: <span className="text-red-400">❌</span>,
  info: <span className="text-blue-400">ℹ️</span>,
};

export const Toast: React.FC<ToastProps> = ({
  // id,
  message,
  type = "info",
  onClose,
  className,
}) => {
  return (
    <div
      className={clsx(
        "flex items-start gap-3 p-4 bg-gray-800 text-white rounded shadow-lg transition-all duration-500 opacity-100",
        "w-[280px]",
        className
      )}
    >
      <div>{iconMap[type]}</div>
      <div className="flex-1">{message}</div>
      <button onClick={onClose} className="ml-2 hover:text-gray-400">
        <X size={16} />
      </button>
    </div>
  );
};

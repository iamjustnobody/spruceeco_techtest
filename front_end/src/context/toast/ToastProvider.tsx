import { Toast } from "@/shared/ui/toast/Toast";
import React, { createContext, useContext, useState, useCallback } from "react";
import { createPortal } from "react-dom";

export type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  className?: string;
  [k: string]: any;
}

interface ToastContextType {
  addToast: (
    message: string,
    type?: ToastType,
    addOns?: { className?: string; [k: string]: any }
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    (
      message: string,
      type: ToastType = "info",
      addOns?: { className?: string }
    ) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [
        ...prev,
        // { id, message, type, className: addOns?.className },
        { id, message, type, ...addOns },
      ]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {createPortal(
        <div className="fixed top-4 right-4 flex flex-col gap-3 z-50">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
              className={toast.className}
            />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context)
    throw new Error("useToastContext must be used within ToastProvider");
  return context;
};

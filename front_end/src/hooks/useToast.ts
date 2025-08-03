import { useToastContext, type ToastType } from "@/context/toast/ToastProvider";

export const useToast = () => {
  const { addToast } = useToastContext();
  //   return addToast;
  return (
    message: string,
    type: ToastType = "info",
    addOns?: { className?: string }
  ) => {
    addToast(message, type, addOns);
  };
};

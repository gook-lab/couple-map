import { toast as hotToast } from "react-hot-toast";
import { createElement } from "react";
import CustomToast from "@/components/ui/custom-toast";

type ToastType = "success" | "error" | "warning";

interface ToastOptions {
  title?: string;
  message: string;
  duration?: number;
  id?: string;
}

function show(type: ToastType, { title, message, duration = 2500, id }: ToastOptions) {
  if (id) hotToast.dismiss(id);

  return hotToast.custom(
    (t) => createElement(CustomToast, { t, type, title, message }),
    { duration, id: id || undefined }
  );
}

const toast = {
  success: (opts: ToastOptions) => show("success", opts),
  error: (opts: ToastOptions) => show("error", opts),
  info: (opts: ToastOptions) => show("warning", opts),
};

export default toast;

import { toast } from "sonner";

export const showSuccessToast = (message: string) =>
  toast.success(message, {
    classNames: {
      toast: "bg-green-600 text-white",
      title: "text-white",
      description: "text-white/90",
    },
  });

export const showErrorToast = (message: string) =>
  toast.error(message, {
    classNames: {
      toast: "bg-red-700 text-white",
      title: "text-white",
      description: "text-white/90",
    },
  });

export const showWarnToast = (message: string) =>
  toast.warning(message, {
    classNames: {
      toast: "bg-yellow-700 text-black",
      title: "text-black",
      description: "text-black/90",
    },
  });

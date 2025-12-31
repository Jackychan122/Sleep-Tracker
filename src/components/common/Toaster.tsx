import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import type { Toast } from "../../types";
import { useToastStore } from "../../stores";

export function Toaster() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          container: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
          icon: "text-green-600 dark:text-green-400",
          title: "text-green-900 dark:text-green-100",
          message: "text-green-700 dark:text-green-300",
        };
      case "error":
        return {
          container: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
          icon: "text-red-600 dark:text-red-400",
          title: "text-red-900 dark:text-red-100",
          message: "text-red-700 dark:text-red-300",
        };
      case "warning":
        return {
          container: "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800",
          icon: "text-yellow-600 dark:text-yellow-400",
          title: "text-yellow-900 dark:text-yellow-100",
          message: "text-yellow-700 dark:text-yellow-300",
        };
      case "info":
      default:
        return {
          container: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
          icon: "text-blue-600 dark:text-blue-400",
          title: "text-blue-900 dark:text-blue-100",
          message: "text-blue-700 dark:text-blue-300",
        };
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "error":
        return <AlertCircle className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "info":
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className={`${styles.container} animate-in slide-in-from-right pointer-events-auto flex min-w-[300px] max-w-md items-start space-x-3 rounded-lg border p-4 shadow-lg`}
      role="alert"
      aria-live="polite"
    >
      <div className={`${styles.icon} mt-0.5 flex-shrink-0`}>{getIcon()}</div>

      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium ${styles.title}`}>{toast.title}</p>
        {toast.message && <p className={`mt-1 text-sm ${styles.message}`}>{toast.message}</p>}
      </div>

      <button
        onClick={onClose}
        className={`flex-shrink-0 ${styles.icon} transition-opacity hover:opacity-70`}
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

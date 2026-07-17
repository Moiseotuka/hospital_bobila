import { toast } from "sonner"

export { toast }

export function useToast() {
  return {
    toast,
    dismiss: toast.dismiss,
    error: toast.error,
    success: toast.success,
    info: toast.info,
    warning: toast.warning,
    loading: toast.loading,
    promise: toast.promise,
    custom: toast.custom,
  }
}

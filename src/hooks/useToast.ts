import { toast as sonnerToast } from 'sonner'

type ToastMessage = string | React.ReactNode

const toast = {
  success: (message: ToastMessage) => sonnerToast.success(message),
  error: (message: ToastMessage) => sonnerToast.error(message),
  info: (message: ToastMessage) => sonnerToast(message),
  warning: (message: ToastMessage) => sonnerToast(message),
  raw: (message: ToastMessage) => sonnerToast(message),
  loading: (message: ToastMessage) => sonnerToast.loading(message),
}

export default function useToast() {
  return { toast, sonnerToast }
}

export { toast, sonnerToast }

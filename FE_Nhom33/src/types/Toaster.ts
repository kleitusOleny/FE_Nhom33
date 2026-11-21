export type ToastType = "success" | "error" | "warning" | "info" | "reconnect";

export interface Toaster {
  id?: string;
  message: string;
  icon?: ToastType | string;
}

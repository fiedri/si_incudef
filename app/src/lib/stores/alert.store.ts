import { writable } from "svelte/store";

export type AlertVariant = 'success' | 'error' | 'info'

export interface AlertData {
  variant: AlertVariant,
  message: string
}

function createAlertStore(){
  const {subscribe, set} = writable<AlertData | null>(null)
  let timer: ReturnType<typeof setTimeout> | undefined
  return {
    subscribe,
    show(data: AlertData, duration = 4000) {
      if (timer) clearTimeout(timer)
      set(data)
      timer = setTimeout(() => set(null), duration)
    },
    clear() {
      if (timer) clearTimeout(timer)
      set(null)
    }
  }
}

export const alert = createAlertStore()

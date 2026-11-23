import { writable } from "svelte/store";

export enum DialogType {
  logout = "logout",
}

export interface UiState {
  activeDialog: DialogType | null;
  dialogPayload: unknown;
}

const initialState: UiState = {
  activeDialog: null,
  dialogPayload: null
};

function createUiStore() {
  const { subscribe, set, update } = writable<UiState>(initialState);

  function openDialog(type: DialogType, payload: unknown = null) {
    update((state) => ({
      activeDialog: type,
      dialogPayload: payload
    }));

    if (typeof window !== "undefined") {
      window.history.pushState({ dialog: true }, "");
    }
  }

  function closeDialog() {
    update((state) => ({
      activeDialog: null,
      dialogPayload: null
    }));
  }

  function toggleDialog(type: DialogType) {
    update((state) => ({
      activeDialog: state.activeDialog === type ? null : type,
      dialogPayload: state.activeDialog === type ? null : state.dialogPayload
    }));
  }

  return {
    subscribe,
    set,
    update,
    openDialog,
    closeDialog,
    toggleDialog,
  };
}

export const ui = createUiStore();

<script>
  import DialogWrapper from "./dialogWrapper.svelte";
  import { ui } from "$lib/stores/ui.store";
  import { enhance } from "$app/forms";
  let isSubmitting = false;
</script>

<DialogWrapper>
  <form
    action="/auth/logout"
    method="POST"
    use:enhance={() => {
      isSubmitting = true;

      return async ({ update }) => {
        isSubmitting = false;
        ui.closeDialog();
        // update() ejecutará la redirección o actualizará el estado/datos de la página actual
        await update();
      };
    }}
  >
    <div
      class="border-b border-outline-variant bg-surface-container-low px-gutter-lg py-gutter-md"
    >
      <h2 class="text-title-lg text-on-surface">Cerrar sesión</h2>
    </div>

    <div class="px-gutter-lg py-gutter-lg">
      <p class="text-body-md text-on-surface-variant">
        ¿Está seguro de que desea cerrar la sesión? Deberá volver a iniciarla
        para continuar.
      </p>
    </div>

    <div
      class="flex flex-col-reverse gap-gutter-sm border-t border-outline-variant bg-surface-container-low px-gutter-lg py-gutter-md sm:flex-row sm:justify-end"
    >
      <button
        type="button"
        class="inline-flex items-center justify-center rounded border border-outline bg-surface-container px-gutter-md py-gutter-sm text-label-lg text-on-surface transition duration-150 ease-state hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container"
        on:click={() => ui.closeDialog()}
      >
        Cancelar
      </button>

      <button
        type="submit"
        class="inline-flex items-center justify-center rounded bg-error px-gutter-md py-gutter-sm text-label-lg text-white transition duration-150 ease-state hover:bg-error/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container"
      >
        Cerrar sesión
      </button>
    </div>
  </form>
</DialogWrapper>

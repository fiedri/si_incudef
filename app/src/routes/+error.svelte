<script lang="ts">
  import { page } from '$app/stores'

  $: isForbidden = $page.status === 403
  $: isNotFound = $page.status === 404

  $: title = isForbidden
    ? 'Acceso denegado'
    : isNotFound
      ? 'Página no encontrada'
      : 'Error inesperado'

  $: message = isForbidden
    ? 'Su usuario no tiene permisos para acceder a esta sección. Si considera que se trata de un error, comuníquese con el administrador del sistema.'
    : isNotFound
      ? 'La página solicitada no existe o fue movida.'
      : $page.error?.message ?? 'No fue posible completar la solicitud.'
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<section class="min-h-screen flex items-center justify-center bg-surface px-gutter-md py-gutter-xl">
  <div
    class="w-full max-w-xl rounded-lg border border-outline-variant bg-surface-container shadow-lg overflow-hidden"
  >
    <div
      class="flex flex-col items-start gap-gutter-sm border-b border-outline-variant bg-surface-container-low px-gutter-xl py-gutter-lg"
    >
      <h1 class="font-serif text-headline-md text-primary">{title}</h1>
      <p class="text-label-md text-muted-foreground">Código de estado: {$page.status}</p>
    </div>

    <div class="px-gutter-lg py-gutter-lg sm:px-gutter-xl">
      <p class="text-body-md text-on-surface-variant">{message}</p>
    </div>

    <div
      class="flex justify-end border-t border-outline-variant bg-surface-container-low px-gutter-lg py-gutter-md sm:px-gutter-xl"
    >
      <a href="/app" class="btn-primary">Volver al inicio</a>
    </div>
  </div>
</section>

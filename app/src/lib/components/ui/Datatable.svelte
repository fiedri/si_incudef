<script lang="ts">
  import { onDestroy, tick } from "svelte";
  import { enhance } from "$app/forms";
  import { Plus } from "lucide-svelte";
  import Button from "./Button.svelte";
  import "datatables.net-dt/css/dataTables.dataTables.min.css";
  import DataTable from "datatables.net-dt";

  export let elements: Record<string, unknown>[] = [];
  export let title = "";
  export let createLabel = "Nuevo registro";
  export let entityName = "registro";
  export let columnLabels: Record<string, string> = {};
  export let keyField = "id";
  export let onCreate: () => void = () => {};
  export let onEdit: (row: Record<string, unknown>) => void = () => {};
  export let removeAction = "remove";
  export let onRemoveSuccess: () => void | Promise<void> = () => {};
  export let getRowActions: (row: Record<string, unknown>) => {
    edit?: boolean;
    remove?: boolean;
    reason?: string;
  } = () => ({});

  const pencilIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.17 6.81a1 1 0 0 0-3.99-3.98L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/><path d="m15 5 4 4"/></svg>`;
  const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`;

  let tableEl: HTMLTableElement;
  let removeForm: HTMLFormElement;
  let dt: InstanceType<typeof DataTable> | null = null;
  let pendingRemove: { id: unknown } | null = null;
  let lastElements: unknown;

  $: columns = elements?.length
    ? Object.keys(elements[0]).filter((column) => column !== keyField)
    : [];
  $: rows = elements ?? [];
  $: labelFor = (column: string) => columnLabels[column] ?? column;

  function escapeHtml(value: unknown) {
    return String(value).replace(/[&<>"']/g, (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]!)
    );
  }

  function actionsHtml(row: Record<string, unknown>) {
    const id = escapeHtml(row[keyField]);
    const state = getRowActions(row);
    const reason = escapeHtml(state.reason ?? "Acción no disponible");
    const editDisabled = state.edit === false;
    const removeDisabled = state.remove === false;

    return `
      <div class="flex items-center gap-gutter-sm" ${editDisabled || removeDisabled ? `title="${reason}"` : ""}>
        <button type="button" data-action="edit" data-id="${id}" aria-label="Editar" title="${editDisabled ? reason : "Editar"}" ${editDisabled ? "disabled" : ""} class="cursor-pointer rounded-sm p-gutter-xs text-primary transition duration-150 ease-state hover:bg-surface-container hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${editDisabled ? "opacity-40 cursor-not-allowed" : ""}">${pencilIcon}</button>
        <button type="button" data-action="remove" data-id="${id}" aria-label="Eliminar" title="${removeDisabled ? reason : "Eliminar"}" ${removeDisabled ? "disabled" : ""} class="cursor-pointer rounded-sm p-gutter-xs text-error transition duration-150 ease-state hover:bg-surface-container hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/40 ${removeDisabled ? "opacity-40 cursor-not-allowed" : ""}">${trashIcon}</button>
      </div>`;
  }

  function buildColumns() {
    return [
      ...columns.map((column) => ({ data: column })),
      {
        data: null,
        orderable: false,
        searchable: false,
        render: (_value: unknown, type: string, row: Record<string, unknown>) =>
          type === "display" ? actionsHtml(row) : "",
      },
    ] as any;
  }

  function init() {
    if (!tableEl || dt) return;
    if (!tableEl.id) {
      tableEl.id = `datatable-${Math.random().toString(36).slice(2)}`;
    }

    dt = new DataTable(tableEl, {
      data: rows,
      columns: buildColumns(),
      pageLength: 10,
      language: {
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ registros",
        info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
        paginate: {
          first: "Primero",
          last: "Último",
          next: "Siguiente",
          previous: "Anterior",
        },
        emptyTable: "No hay datos disponibles",
      },
    });
    lastElements = elements;
  }

  $: if (tableEl && !dt) {
    void tick().then(init);
  }

  $: if (dt && elements !== lastElements) {
    lastElements = elements;
    dt.clear().rows.add(rows).draw(false);
  }

  onDestroy(() => {
    dt?.destroy();
    dt = null;
  });

  function handleRowAction(event: MouseEvent) {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
      "button[data-action]"
    );
    if (!button || button.disabled) return;
    const row = rows.find((item) => String(item[keyField]) === button.dataset.id);
    if (!row) return;

    if (button.dataset.action === "edit") onEdit(row);
    if (button.dataset.action === "remove") pendingRemove = { id: row[keyField] };
  }

  function confirmRemove() {
    if (!pendingRemove || !removeForm) return;
    const input = removeForm.elements.namedItem(keyField) as HTMLInputElement;
    input.value = String(pendingRemove.id);
    pendingRemove = null;
    removeForm.requestSubmit();
  }
</script>

<div
  class="dt-wrap w-full overflow-hidden rounded-lg border border-outline bg-surface-container-low shadow-sm"
>
  <div
    class="flex flex-wrap items-center justify-between gap-gutter-sm border-b border-outline-variant px-gutter-md py-gutter-sm"
  >
    <span class="text-title-md text-on-surface">{title}</span>
    <Button variant="primary" type="button" on:click={onCreate}>
      <Plus size={16} />
      {createLabel}
    </Button>
  </div>

  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <table class="display w-full" bind:this={tableEl} on:click={handleRowAction}>
    <thead>
      <tr>
        {#each columns as column}
          <th>{labelFor(column)}</th>
        {/each}
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
</div>

<form
  method="POST"
  action={`?/${removeAction}`}
  bind:this={removeForm}
  class="hidden"
  use:enhance={() => async ({ result, update }) => {
    await update({ invalidateAll: false });
    if (result.type === "success") await onRemoveSuccess();
  }}
>
  <input type="hidden" name={keyField} />
</form>

{#if pendingRemove}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="datatable-remove-title"
      class="w-full max-w-md rounded-lg border border-outline-variant bg-surface-container p-gutter-lg shadow-lg"
    >
      <h2 id="datatable-remove-title" class="font-serif text-title-lg text-primary">
        Confirmar eliminación
      </h2>
      <p class="mt-gutter-sm text-body-md text-muted-foreground">
        ¿Está seguro de que desea eliminar este {entityName}? Esta acción no se
        puede deshacer.
      </p>
      <div class="mt-gutter-lg flex justify-end gap-gutter-sm">
        <Button
          type="button"
          variant="primary"
          className="border border-outline bg-transparent text-on-surface hover:bg-surface-container-low"
          on:click={() => (pendingRemove = null)}
        >
          Cancelar
        </Button>
        <Button type="button" variant="destructive" on:click={confirmRemove}>
          Eliminar
        </Button>
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">
  /* DataTables 3 exponen sus estilos como variables: las mapeamos a los tokens
     del design system para que el tema claro y el oscuro funcionen solos. */
  .dt-wrap {
    --dt-header_border: 1px solid rgb(var(--color-outline-variant) / 1);
    --dt-body_border: 1px solid rgb(var(--color-outline-variant) / 1);
    --dt-header_padding: 0.75rem 1rem;
    --dt-body_padding: 0.75rem 1rem;
    --dt-footer_padding: 0.75rem 1rem;

    --dt-input_border: 1px solid rgb(var(--color-outline) / 1);
    --dt-input_border-radius: 4px;
    --dt-input_padding: 0.5rem 0.75rem;
    --dt-input_background: rgb(var(--color-surface-container) / 1);
    --dt-input_color: rgb(var(--color-on-surface) / 1);

    --dt-row_alpha-stripe: 0.04;
    --dt-row_alpha-hover: 0.06;

    --dt-order-arrow_color: rgb(var(--color-outline) / 1);
    --dt-order-arrow_color-current: rgb(var(--color-primary) / 1);

    --dt-paging-button_padding: 0.5rem 0.75rem;
    --dt-paging-button_margin-left: 2px;
    --dt-paging-button_border-radius: 4px;
    --dt-paging-button_border: 1px solid transparent;
    --dt-paging-button_background: transparent;
    --dt-paging-button_color: rgb(var(--color-on-surface-variant) / 1);
    --dt-paging-button_background-hover: rgb(
      var(--color-surface-container-low) / 1
    );
    --dt-paging-button_border-hover: 1px solid rgb(var(--color-outline) / 1);
    --dt-paging-button_color-hover: rgb(var(--color-primary) / 1);
    --dt-paging-button_background-current: rgb(var(--color-primary) / 1);
    --dt-paging-button_border-current: 1px solid rgb(var(--color-primary) / 1);
    --dt-paging-button_color-current: rgb(var(--color-on-primary) / 1);
    --dt-paging-button_background-current-hover: rgb(
      var(--color-primary) / 0.9
    );
    --dt-paging-button_border-current-hover: 1px solid
      rgb(var(--color-primary) / 0.9);
    --dt-paging-button_color-current-hover: rgb(var(--color-on-primary) / 1);
  }

  .dt-wrap :global(.dt-container) {
    @apply font-sans text-body-md text-on-surface;
  }

  .dt-wrap :global(.dt-layout-row) {
    @apply m-0 px-gutter-md py-gutter-sm;
  }

  .dt-wrap :global(.dt-layout-cell) {
    @apply gap-gutter-md;
  }

  .dt-wrap :global(.dt-search label),
  .dt-wrap :global(.dt-length label),
  .dt-wrap :global(.dt-info) {
    @apply text-body-sm text-muted-foreground;
  }

  .dt-wrap :global(.dt-input),
  .dt-wrap :global(.dt-select) {
    @apply rounded border border-outline bg-surface-container px-gutter-sm py-gutter-sm text-body-md text-on-surface;
    @apply transition duration-150 ease-state focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20;
  }

  .dt-wrap :global(table.dataTable thead th) {
    @apply border-b border-outline bg-surface text-label-md uppercase tracking-wide text-on-surface-variant;
  }

  .dt-wrap :global(table.dataTable tbody td) {
    @apply text-body-md text-on-surface;
  }

  .dt-wrap :global(table.dataTable tbody tr) {
    @apply transition-colors duration-150 ease-state;
  }
</style>

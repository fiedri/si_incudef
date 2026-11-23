<script lang="ts">
  import { fly } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'
  import { CircleCheck, CircleAlert, Info, X } from 'lucide-svelte'
  import { alert } from '$lib/stores/alert.store';
  import { cn } from '$lib/utils/cn'

  const icons = {
    success: CircleCheck,
    error: CircleAlert,
    info: Info
  }

  const variants = {
    success: 'border-success bg-success text-white',
    error: 'border-error bg-error text-white',
    info: 'border-primary text-on-primary'
  }
</script>

{#if $alert}
  {@const current = $alert}

  <div
    role="status"
    aria-live="polite"
    transition:fly={{ y: -16, duration: 250, easing: cubicOut }}
    class={cn(
      'fixed bottom-gutter-lg right-gutter-lg z-toast flex items-center justify-center w-full max-w-sm  gap-gutter-sm rounded border-l-4 px-gutter-md py-gutter-sm shadow-lg',
      variants[current.variant]
    )}
  >
    <svelte:component
      this={icons[current.variant]}
      size={20}
      class="mt-0.5 shrink-0"
    />
    <span class="flex-1 text-body-md">{current.message}</span>

    <button
      type="button"
      aria-label="Cerrar aviso"
      class="cursor-pointer rounded-sm transition duration-150 ease-state hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
      on:click={alert.clear}
    >
      <X size={18} />
    </button>
  </div>
{/if}

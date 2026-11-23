<script>
import { ui} from "$lib/stores/ui.store";
</script>

<div
  class="fixed inset-0 z-50 backdrop-contrast-75 flex items-center justify-center p-4"
  on:click={()=>ui.closeDialog()}
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div
    on:click|stopPropagation
    class="w-full max-w-lg rounded-lg max-h-[90vh] bg-surface-container overflow-y-hidden flex flex-col shadow-[0_0_15px_rgba(0,0,0,0.15)] shadow-primary/30 border border-primary/30 relative text-left"
  >
<slot/>
  </div>
</div>

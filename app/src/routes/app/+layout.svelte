<script lang="ts">
import { ui, DialogType } from "$lib/stores/ui.store";
  import Sidebar from "$lib/components/ui/Sidebar.svelte";
  import { onMount } from "svelte";
import Logout from "$lib/components/dialogs/Logout.svelte";
  export let data;
onMount(() => {
  const onPopState = () => {
    if ($ui.activeDialog) {
      ui.closeDialog();
    }
  };
  window.addEventListener("popstate", onPopState);
  return () => window.removeEventListener("popstate", onPopState);
});
</script>

<section class="h-screen flex flex-row w-full overflow-hidden text-slate-100">
  
    <Sidebar user={data.user} />
    <main class="w-full text-foreground flex flex-col">
     <slot />
    </main>
</section>

{#if $ui.activeDialog === DialogType.logout}
<Logout/>
{/if}

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Search, UserPlus } from "lucide-svelte";
  import Button from "./Button.svelte";

  export let searchValue: string = "";
  export let searchPlaceholder: string = "Buscar...";
  export let showSearch: boolean = true;

  export let actionLabel: string = "Nuevo Usuario";
  export let showAction: boolean = true;

  export let userName: string = "Usuario";
  export let userRole: string = "Rol";
  export let userInitials: string = "U";


  const dispatch = createEventDispatcher<{
    action: void;
    search: string;
  }>();

  function handleSearchInput(event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    searchValue = target.value;
    dispatch("search", searchValue);
  }
</script>

<header
  class="h-14 shadow-md shadow-black/5 w-full flex flex-row items-center justify-between gap-4 px-6 bg-white"
>
  {#if showSearch}
    <div class="relative flex items-center w-full md:w-[50%] lg:w-[60%]">
      <span
        class="absolute left-3 flex items-center pointer-events-none text-muted-foreground"
      >
        <Search class="w-5 h-5" />
      </span>

      <input
        type="text"
        value={searchValue}
        on:input={handleSearchInput}
        class="field pl-10 w-full"
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
      />
    </div>
  {:else}
    <div class="flex-1" />
  {/if}


  {#if showAction}
    <Button
      type="button"
      variant="accent"
      className="font-bold flex gap-2 h-9 text-xs lg:text-sm shrink-0"
      on:click={() => dispatch("action")}
    >
      <slot name="action-icon">
        <UserPlus size={18} />
      </slot>
      <span>{actionLabel}</span>
    </Button>
    
  <div class="h-[60%] w-[1px] bg-gray-300 shrink-0" />
  {/if}



  <div class="flex flex-row gap-2.5 items-center justify-center shrink-0">
    <div
      class="rounded-full h-9 w-9 bg-primary text-slate-100 font-bold text-sm flex items-center justify-center uppercase"
    >
      {userInitials}
    </div>
    <div class="flex flex-col gap-0.5 justify-center leading-none">
      <span class="font-bold text-sm">{userName}</span>
      <span class="font-light text-xs text-muted-foreground capitalize">
        {userRole}
      </span>
    </div>
  </div>
</header>

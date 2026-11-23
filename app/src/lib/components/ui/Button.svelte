<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { cn } from "$lib/utils/cn";
  type Variant = "primary" | "accent" | "destructive";

  export let variant: Variant = "primary";
  export let className: string = "";

  const baseClasses =
    "inline-flex cursor-pointer items-center justify-center rounded px-gutter-md py-gutter-sm text-label-lg transition duration-150 ease-state focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container font-bold";

  const variants: Record<Variant, string> = {
    primary:
      "bg-primary text-on-primary hover:bg-primary/90 focus-visible:ring-primary/40",
    accent:
      "bg-accent text-on-accent hover:bg-accent/90 focus-visible:ring-accent/40",
    destructive: "bg-error text-on-error hover:bg-error/90 focus-visible:ring-error/40 text-slate-100"
    
  };

  $: ({ class: restClass, ...restProps } = $$restProps as HTMLButtonAttributes);
</script>

<button
  {...restProps}
  on:click
  class={cn(baseClasses, variants[variant], className, restClass)}
>
  <slot />
</button>

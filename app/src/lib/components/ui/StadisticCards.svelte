<script>
  export let title;
  export let number;
  export let icon;
</script>

<div
  class="shadow-[0_0_5px_rgba(0,0,0,0.15)] shadow-primary/20 rounded-lg h-24 w-[200px] flex flex-row items-center justify-between p-5"
>
  <div class="flex flex-col">
    <span class="font-extralight text-muted-foreground">{title}</span>
    <span class="text-2xl font-extrabold">{number}</span>
  </div>
  <div class="bg-primary/10 p-2 rounded-md">
  <svelte:component this={icon} size={20} class="text-primary"/>
  </div>
</div>

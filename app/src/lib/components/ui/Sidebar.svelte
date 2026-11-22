<script lang="ts">
  import { House, Drama, Clipboard, Settings, User, SquareArrowRightExit } from "lucide-svelte";
  import { ui, DialogType } from "$lib/stores/ui.store";
  import { page } from "$app/stores";

  export let user: { role: 'administrador' | 'operador' };

  let pages = [
    {
      name: "Cultores",
      link: "/app/cultores",
      icon: Drama,
      adminOnly: false
    },
    {
      name: "Reportes",
      link: "/app/reportes",
      icon: Clipboard,
      adminOnly: false
    },
    {
      name: "Usuarios",
      link: "/app/users",
      icon: User,
      adminOnly: true
    }
  ];

  $: visiblePages = pages.filter(
    (item) => !item.adminOnly || user.role === 'administrador'
  );
  $: isActive = (link: string) => {
    const currentPath = $page.url.pathname;
    if (link === "/app") {
      return currentPath === "/app";
    }

    return (
      currentPath === link ||
      currentPath.startsWith(link)
    );
  };
</script>

<aside
  class="bg-primary h-full min-w-[270px] w-[270px] text text-slate-100 font-serif flex flex-col"
>
  <div class="h-[65px]">logo incudef</div>

  <div
    class="w-full h-[2px] bg-gradient-to-r from-transparent via-slate-100/50 to-transparent mx-auto"
  ></div>
  <ul class="p-4 flex-1">
    <li>
      <a
        href="/app"
        class="inline-block w-full h-5 hover:bg-[#292976] p-5 rounded-sm text-md flex items-center font-sans capitalize font-bold gap-3 transition-all duration-300 ease-in-out {isActive(
          '/app',
        )
          ? 'bg-[#292976]'
          : ''}"
      >
        <House size={20} />
        Inicio
      </a>
    </li>
    {#each visiblePages as page}
      {@const active = isActive(page.link)}
      <li class="mt-1.5">
        <a
          href={page.link}
          class="inline-block w-full h-5 hover:bg-[#292976] p-5 rounded-sm text-md flex items-center font-sans capitalize font-bold gap-3 transition-all duration-300 ease-in-out {active
            ? 'bg-[#292976]'
            : ''}"
        >
          <svelte:component this={page.icon} size={20} />
          {page.name}
        </a>
      </li>
    {/each}
  </ul>
 <hr class="border-muted-foreground border" > 
  <ul class="p-4">
    {#if user.role === 'administrador'}
      <li>
        <a
          href="/app/configuraciones"
          class="inline-block w-full h-5 hover:bg-[#292976] p-5 rounded-sm text-md flex items-center font-sans capitalize font-bold gap-3 transition-all duration-300 ease-in-out {isActive("/app/configuraciones")
            ? 'bg-[#292976]'
            : ''}"
        >
          <Settings size={20} />
          Configuración
        </a>
      </li>
    {/if}
 <li>
        <button
          class="inline-block w-full h-5 hover:bg-error p-5 rounded-sm text-md flex items-center font-sans capitalize font-bold gap-3 transition-all duration-300 ease-in-out" 
          on:click={()=>ui.openDialog(DialogType.logout)}
        >
          <SquareArrowRightExit size={20} />
          Cerrar sesión
        </button>
      </li>
  </ul>
</aside>

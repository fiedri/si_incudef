<script lang="ts">
  import { User, Lock, Eye, EyeOff } from "lucide-svelte";
  let showPassword = false;

  function togglePassword() {
    showPassword = !showPassword;
  }
</script>

<div class="flex flex-col items-center w-full">
  <form
    action=""
    class="w-full max-w-xl rounded-lg border border-outline-variant bg-surface-container overflow-hidden flex flex-col shadow-[0_0_15px_rgba(0,0,0,0.15)] shadow-primary/30 border border-primary/30"
  >
    <div
      class="px-gutter-xl pt-gutter-lg pb-gutter-md flex flex-col items-start gap-gutter-sm bg-surface-container-low border-b border-outline-variant"
    >
      <h2 class="font-serif text-headline-md text-primary">Iniciar Sesión</h2>
      <p class="text-body-md text-muted-foreground">
        Ingresa tus credenciales para acceder al panel de administración.
      </p>
    </div>

    <div class="px-gutter-lg sm:px-gutter-xl py-gutter-lg flex flex-col gap-gutter-lg">
      <div class="flex flex-col gap-gutter-md">
        <div>
          <label
            for="username"
            class="block text-label-lg text-on-surface mb-gutter-xs"
            >Nombre de usuario</label
          >
          <div class="relative flex items-center w-full">
            <span
              class="absolute left-3 flex items-center pointer-events-none text-muted-foreground"
            >
              <User class="w-5 h-5" />
            </span>

            <input
              id="username"
              name="username"
              type="text"
              class="field pl-10"
              placeholder="username"
            />
          </div>
        </div>
        <div>
          <div class="flex flex-row justify-between items-center gap-gutter-sm mb-gutter-xs">
            <label for="password" class="block text-label-lg text-on-surface"
              >Contraseña</label
            >
            <a
              class="rounded-sm text-label-lg text-accent underline decoration-accent/40 underline-offset-2 transition duration-150 ease-state hover:text-primary hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              href="/auth/recovery"
              >¿Olvidaste tu contraseña?</a
            >
          </div>
          <div class="relative flex items-center w-full">
            <span
              class="absolute left-3 flex items-center pointer-events-none text-muted-foreground"
            >
              <Lock class="w-5 h-5" />
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              class="field pl-10 pr-10"
              placeholder="••••••••"
            />

            <button
              type="button"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              class="absolute right-3 flex items-center rounded-sm text-muted-foreground transition duration-150 ease-state hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer"
              on:click={togglePassword}
            >
              {#if showPassword}
                <EyeOff class="w-5 h-5" />
              {:else}
                <Eye class="w-5 h-5" />
              {/if}
            </button>
          </div>
        </div>
      </div>

      <button type="submit" class="btn-primary w-full">Iniciar Sesión</button>
    </div>
  </form>

  <p
    data-design-text-token="body-sm"
    class="text-body-sm text-muted-foreground mt-gutter-md text-center"
  >
    © {new Date().getFullYear()} Incudef · Acceso exclusivo para personal autorizado.
  </p>
</div>

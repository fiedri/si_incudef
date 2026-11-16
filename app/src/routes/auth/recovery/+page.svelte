<script lang="ts">
  import { User } from "lucide-svelte";
  let step: "identify" | "questions" | "reset" | "success" = "identify";
  let stepCount = 1;

  let questions = [
    {
      id: "childhood_nickname",
      question: "¿Cuál era tu apodo o sobrenombre en la infancia?",
      placeholder: "Ej: Titi, Nano...",
    },
    {
      id: "first_pet",
      question: "¿Cuál fue el nombre de tu primera mascota?",
      placeholder: "Ej: Toby, Luna...",
    },
    {
      id: "mother_maiden_city",
      question: "¿En qué ciudad se conocieron tus padres?",
      placeholder: "Ej: Coro, Caracas...",
    },
    {
      id: "elementary_school",
      question: "¿Cómo se llamaba tu primera escuela o colegio?",
      placeholder: "Ej: Escuela Básica...",
    },
    {
      id: "favorite_childhood_food",
      question: "¿Cuál era tu comida o plato favorito cuando eras niño?",
      placeholder: "Ej: Arroz con pollo, arepas...",
    },
  ];

  function nextStep(next: "identify" | "questions" | "reset" | "success") {
    step = next;
    stepCount++;
  }
</script>

<!-- Contenedor general centrado en la pantalla -->
<div class="flex flex-col items-center w-full">
  <div
    class="border border-outline-variant w-full max-w-xl rounded-lg flex flex-col bg-surface-container min-h-[50vh] max-h-[80vh] overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.15)] shadow-primary/30 border border-primary/30"
  >
    <div
      class="px-gutter-xl pt-gutter-lg pb-gutter-md flex flex-col items-start gap-gutter-sm bg-surface-container-low border-b border-outline-variant"
    >
      <h2 class="font-serif text-headline-md text-primary">Recuperar Contraseña</h2>
      <p
        class="inline-flex w-fit items-center rounded-full bg-accent px-gutter-sm py-gutter-xs text-label-sm text-on-accent"
      >
        Paso {stepCount} de 4
      </p>
    </div>

    <div class="overflow-y-auto px-gutter-lg sm:px-gutter-xl py-gutter-lg flex flex-col gap-gutter-lg">
      {#if step == "identify"}
        <form
          on:submit|preventDefault={() => nextStep("questions")}
          class="flex flex-col gap-gutter-lg"
        >
          <p class="text-body-md text-muted-foreground">
            Ingresa tu nombre de usuario para verificar tu identidad mediante
            tus preguntas de seguridad.
          </p>
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
                type="text"
                class="field pl-10"
                placeholder="username"
                required
              />
            </div>
          </div>

          <div class="flex flex-row justify-end items-center">
            <button type="submit" class="btn-primary">Continuar</button>
          </div>
        </form>
      {:else if step == "questions"}
        <form
          on:submit|preventDefault={() => nextStep("reset")}
          class="flex flex-col gap-gutter-lg"
        >
          <div>
            <h3 class="font-sans text-title-lg text-primary">
              Verificación de seguridad
            </h3>
            <p class="text-body-md text-muted-foreground">
              Responde las siguientes preguntas que configuraste al crear tu
              cuenta.
            </p>
          </div>

          <div class="flex flex-col gap-gutter-md">
            {#each questions as question}
              <div class="flex flex-col gap-gutter-xs">
                <label
                  for={question.id}
                  class="block text-label-lg text-on-surface"
                  >{question.question}</label
                >
                <input
                  id={question.id}
                  type="text"
                  class="field"
                  placeholder={question.placeholder}
                  required
                />
              </div>
            {/each}
          </div>

          <div class="flex flex-row justify-end items-center">
            <button type="submit" class="btn-primary">
              Verificar respuestas
            </button>
          </div>
        </form>
      {:else if step == "reset"}
        <form
          on:submit|preventDefault={() => nextStep("success")}
          class="flex flex-col gap-gutter-lg"
        >
          <div>
            <h3 class="font-sans text-title-lg text-primary">
              Crea una nueva contraseña
            </h3>
            <p class="text-body-md text-muted-foreground">
              Tu identidad ha sido verificada. Establece una clave segura para
              tu cuenta.
            </p>
          </div>

          <div class="flex flex-col gap-gutter-md">
            <div class="flex flex-col gap-gutter-xs">
              <label
                for="new-password"
                class="block text-label-lg text-on-surface"
                >Nueva Contraseña</label
              >
              <input id="new-password" type="text" class="field" required />
            </div>
            <div class="flex flex-col gap-gutter-xs">
              <label
                for="confirm-password"
                class="block text-label-lg text-on-surface"
                >Confirmar Contraseña</label
              >
              <input id="confirm-password" type="text" class="field" required />
            </div>
          </div>
          <div class="ml-gutter-md">
          <!-- ponerle un condicional si cumple los requisitos text-primary-->
            <ul class="list-disc list-inside space-y-gutter-xs text-body-sm text-muted-foreground">
              <li>Mínimo 8 caracteres</li>
              <li>Al menos una letra mayúscula y un número</li>
            </ul>
          </div>

          <div class="flex flex-row justify-end items-center">
            <button type="submit" class="btn-primary">
              Actualizar contraseña
            </button>
          </div>
          <!--
<p>Verificar respuestas</p>
          -->
        </form>
        {:else if step == "success"}
        <div>
            <h3 class="font-sans text-title-lg text-primary">
              ¡Contraseña actualizada!
            </h3>
            <p class="text-body-md text-muted-foreground">
             Tu clave se ha restablecido correctamente. Ya puedes ingresar al panel con tus nuevas credenciales. 
            </p>
 
        </div>
      {/if}

      <div class="pt-gutter-md border-t border-outline-variant mt-auto">
        <a
          href="/auth/login"
          class="rounded-sm text-label-lg text-muted-foreground underline decoration-outline underline-offset-2 transition duration-150 ease-state hover:text-primary hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          &larr; Volver al inicio de sesión
        </a>
      </div>
    </div>
  </div>
  <p
  data-design-text-token="body-sm"
  class="text-body-sm text-muted-foreground mt-gutter-md text-center"
>
  © {new Date().getFullYear()} Incudef · Acceso exclusivo para personal autorizado.
</p>
</div>

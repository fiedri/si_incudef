<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import Header from "$lib/components/ui/Header.svelte";
  import StadisticCards from "$lib/components/ui/StadisticCards.svelte";
  import Datatable from "$lib/components/ui/Datatable.svelte";
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";
  import {
    Plus,
    UserRound,
    ShieldUser,
    X,
    User,
    Eye,
    EyeOff,
    Lock,
  } from "lucide-svelte";
  import { alert } from "$lib/stores/alert.store.js";

  export let data;
  export let form;

  type UserRole = "operador" | "administrador";
  type EditingUser = { id: number; username: string; rol: UserRole };

  let showPassword = false;
  let filtro = "";
  let selectedRole: UserRole = "operador";
  let editingUser: EditingUser | null = null;
  let modalVisible = false;

  $: isEditing = Boolean(editingUser);
  $: adminCount =
    data.allUsers?.filter((user) => user.Role === "administrador").length ?? 0;

  function getRowActions(row: Record<string, unknown>) {
    const isSelf = Number(row.id) === Number(data.user.id);
    const isLastAdmin = row.Role === "administrador" && adminCount <= 1;
    if (!isSelf && !isLastAdmin) return {};

    return {
      edit: false,
      remove: false,
      reason: isSelf
        ? "No puede modificar su propio usuario"
        : "No puede modificar al último administrador",
    };
  }

  let lastForm: unknown;
  $: if (form && form !== lastForm) {
    lastForm = form;
    if (form.success) {
      closeModal();
      alert.show({ variant: "success", message: form.notification });
    }
  }

  function openCreateModal() {
    editingUser = null;
    selectedRole = "operador";
    modalVisible = true;
  }

  function openEditModal(row: Record<string, unknown>) {
    editingUser = {
      id: Number(row.id),
      username: String(row["Nombre de usuario"]),
      rol: row.Role as UserRole,
    };
    selectedRole = editingUser.rol;
    modalVisible = true;
  }

  function closeModal() {
    modalVisible = false;
    editingUser = null;
  }

  function togglePassword() {
    showPassword = !showPassword;
  }

  function buscarCultores(event: CustomEvent<string>) {
    console.log("Buscando:", event.detail);
  }

  $: estadisticas = [
    {
      title: "Total de usuarios",
      number: data.allUsers?.length,
      icon: UserRound,
    },
    {
      title: "Administradores",
      number: data.allUsers?.filter((item) => item.Role == "administrador")
        .length,
      icon: ShieldUser,
    },
    {
      title: "Operadores",
      number: data.allUsers?.filter((item) => item.Role == "operador").length,
      icon: UserRound,
    },
  ];

  const roleInfo = {
    operador: {
      title: "Operador",
      summary:
        "Puede gestionar operaciones diarias y consultar registros, sin acceso a configuración del sistema.",
      permissions: [
        "Ver y crear registros operativos",
        "Editar datos asignados",
        "Sin acceso a usuarios ni ajustes",
      ],
    },
    administrador: {
      title: "Administrador",
      summary:
        "Control total sobre usuarios, roles, permisos y configuración general de la plataforma.",
      permissions: [
        "Crear, editar y desactivar usuarios",
        "Asignar roles",
        "Configurar ajustes del sistema",
      ],
    },
  };
</script>

<Header
  bind:searchValue={filtro}
  searchPlaceholder="Buscar usuario..."
  showAction={false}
  userName={data.user.username}
  userRole={data.user.role}
  userInitials={data.user.username.slice(0, 2)}
  on:search={buscarCultores}
>
  <Plus slot="action-icon" size={18} />
</Header>

<section class="px-10 py-6 overflow-y-auto">
  <div class="flex flex-row justify-between items-center">
    <div>
      <h2 class="text-primary capitalize text-4xl">
        Directorio de usuarios del sistema
      </h2>
      <p class="font-sans font-light text-sm">
        Control de acceso, roles y permisos.
      </p>
    </div>
  </div>
  <div class="my-3 mx-auto flex flex-row flex-wrap gap-10">
    {#each estadisticas as estadistica}
      <StadisticCards
        title={estadistica.title}
        number={estadistica.number}
        icon={estadistica.icon}
      />
    {/each}
  </div>
  <Datatable
    elements={data.allUsers}
    title="Usuarios registrados"
    entityName="usuario"
    createLabel="Agregar usuario"
    keyField="id"
    columnLabels={{ "Nombre de usuario": "Nombre de usuario", Role: "Rol" }}
    onCreate={openCreateModal}
    onEdit={openEditModal}
    removeAction="remove"
    onRemoveSuccess={() => invalidate("app:users")}
    getRowActions={getRowActions}
  />
</section>

{#if modalVisible}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40"
  >
    <form
      method="POST"
      action={isEditing ? "?/update" : "?/save"}
      class="w-full max-w-lg rounded-lg max-h-[90vh] bg-surface-container overflow-y-hidden flex flex-col shadow-lg border border-primary/30 relative text-left"
      use:enhance={() =>
        async ({ result, update }) => {
          await update({ invalidateAll: false });
          if (result.type === "success") await invalidate("app:users");
        }}
    >
      {#if editingUser}
        <input type="hidden" name="id" value={editingUser.id} />
      {/if}

      <div
        class="px-gutter-xl pt-gutter-lg pb-gutter-md flex flex-row justify-between items-start gap-gutter-sm bg-surface-container-low border-b border-outline-variant"
      >
        <div>
          <h2 class="font-serif text-headline-md text-primary capitalize">
            {isEditing ? "Editar usuario" : "Registrar nuevo usuario."}
          </h2>
          <p class="text-body-md text-muted-foreground">
            {isEditing
              ? "Actualice el rol asignado al usuario."
              : "Asigna credenciales y roles."}
          </p>
        </div>
        <button
          type="button"
          aria-label="Cerrar modal"
          class="text-primary top-5"
          on:click={closeModal}
        >
          <X />
        </button>
      </div>

      <div class="overflow-y-auto">
        <div class="flex flex-col gap-gutter-md p-5">
          <div>
            <label
              for="username"
              class="block text-label-lg text-on-surface mb-gutter-xs"
            >
              Nombre de usuario
            </label>
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
                class="field pl-10 w-full"
                placeholder="username"
                value={editingUser ? editingUser.username : ""}
                readonly={isEditing}
                required
              />
            </div>
          </div>

          <fieldset class="flex flex-col gap-2">
            <legend class="text-label-lg text-on-surface mb-1">Rol:</legend>

            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="operador"
                name="role"
                checked={selectedRole === "operador"}
                on:change={() => (selectedRole = "operador")}
                required
              />
              <span>Operador</span>
            </label>

            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="administrador"
                name="role"
                checked={selectedRole === "administrador"}
                on:change={() => (selectedRole = "administrador")}
                required
              />
              <span>Administrador</span>
            </label>

            {#if roleInfo[selectedRole]}
              <div
                class="mt-2 p-3 rounded-md bg-surface-container-low border border-outline-variant text-body-sm"
              >
                <p class="font-medium text-on-surface">
                  Qué puede hacer el rol {roleInfo[selectedRole].title}:
                </p>
                <p class="text-muted-foreground mt-1">
                  {roleInfo[selectedRole].summary}
                </p>
                <ul
                  class="mt-2 space-y-1 text-xs text-on-surface/80 list-disc list-inside"
                >
                  {#each roleInfo[selectedRole].permissions as perm}
                    <li>{perm}</li>
                  {/each}
                </ul>
              </div>
            {/if}
          </fieldset>

          {#if !isEditing}
            <fieldset class="flex flex-col gap-gutter-md">
              <label class="ml-1" for="password"
                >Establece una contraseña temporal:</label
              >
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
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"}
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
              <div
                class="p-3 rounded-md bg-surface-container-low border border-outline-variant text-body-sm"
              >
                <p class="font-medium text-on-surface">
                  Sobre la contraseña temporal:
                </p>
                <p class="text-muted-foreground mt-1">
                  Esta clave sirve únicamente para el primer acceso del usuario.
                  Al iniciar sesión por primera vez, el sistema le pedirá
                  obligatoriamente que cree su propia contraseña definitiva.
                </p>
              </div>
            </fieldset>
          {/if}

          {#if form?.error}
            {@const errorList = Object.values(form.error)
              .flat()
              .filter(Boolean)}
            {#if errorList.length > 0}
              <ul
                class="bg-error/30 p-2 pl-10 text-error text-sm rounded-md flex flex-col list-disc"
              >
                {#each errorList as message}
                  <li class="font-bold">{message}</li>
                {/each}
              </ul>
            {/if}
          {/if}

          <div class="block ml-auto">
            <Button variant="destructive" type="button" on:click={closeModal}
              >Cancelar</Button
            >
            <Button type="submit">Guardar</Button>
          </div>
        </div>
      </div>
    </form>
  </div>
{/if}

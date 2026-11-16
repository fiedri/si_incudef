El flujo de recuperación de contraseña mediante **preguntas de seguridad** (a veces llamadas preguntas frecuentes o secretas) se diseña de forma secuencial para validar la identidad del usuario sin exponer información sensible ni abrumarlo en una sola pantalla.

El recorrido estándar de la interfaz consta de **4 pasos principales**:

### Paso 1: Identificación del usuario

Antes de mostrar las preguntas, el sistema debe saber quién intenta recuperar la cuenta.

* **Elementos UI:** Un campo de texto para el nombre de usuario o correo electrónico y un botón principal (*"Continuar"*).
* **Validación:** Al enviar, el backend verifica si el usuario existe. *(Nota de seguridad: Si el usuario no tiene preguntas configuradas, se debe redirigir a otro método o mostrar un aviso genérico).*

### Paso 2: Verificación con preguntas de seguridad

Una vez localizado el usuario, se cargan las preguntas que configuró previamente.

* **Elementos UI:**
* Se muestran las preguntas en texto plano (1 a 3 preguntas, según la política del sistema).
* Un campo de respuesta por cada pregunta.
* Un indicador de progreso (ej. *"Paso 2 de 3"*).
* Un botón de acción (*"Verificar respuestas"*) y un enlace secundario para regresar o probar otro método.


* **Consideración UX/Seguridad:**
* Es buena práctica no indicar *cuál* respuesta específica falló si hay varias, sino mostrar un mensaje general (*"Una o más respuestas no coinciden"*), evitando así que un atacante adivine por descarte.
* Limitar el número de intentos fallidos (ej. bloqueo temporal tras 3 intentos).



### Paso 3: Creación de nueva contraseña

Si las respuestas son correctas, el sistema genera un token temporal de sesión y habilita el formulario de restablecimiento.

* **Elementos UI:**
* Input para *"Nueva contraseña"* (con el botón del ojito para mostrar/ocultar).
* Input para *"Confirmar nueva contraseña"*.
* Lista de requisitos de seguridad en tiempo real (ej. mínimo 8 caracteres, una mayúscula, un número) que cambian de color a medida que se cumplen.
* Botón *"Guardar contraseña"*.



### Paso 4: Confirmación y redirección

* **Elementos UI:** Una pantalla o estado visual de éxito con un icono de verificación, un mensaje claro (*"Tu contraseña ha sido actualizada"*) y un botón para volver al **Iniciar Sesión** (o redirección automática tras unos segundos).

---

### Estructura recomendada en SvelteKit / Frontend

Para mantener una interfaz limpia y fluida, puedes manejar todo esto dentro de la misma ruta (`/auth/recovery`) usando una variable de estado para controlar la vista actual sin recargar la página:

```svelte
<script lang="ts">
  // Controla en qué paso está el usuario
  let step: 'identify' | 'questions' | 'reset' | 'success' = 'identify';
  
  let username = '';
  let questions: string[] = []; // Se llenan tras consultar el usuario en el Paso 1
  let answers: string[] = [];
</script>

<div class="w-full max-w-md p-8 border border-primary/10 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.08)]">
  {#if step === 'identify'}
    <!-- Formulario Paso 1: Pedir usuario -->
  {:else if step === 'questions'}
    <!-- Formulario Paso 2: Renderizar {#each questions as q, i} con su input -->
  {:else if step === 'reset'}
    <!-- Formulario Paso 3: Nueva contraseña y confirmación -->
  {:else if step === 'success'}
    <!-- Vista Paso 4: Mensaje de éxito y botón al login -->
  {/if}
</div>

```

¿Vas a implementar esto con un número fijo de preguntas (por ejemplo, 2 o 3) o te gustaría ver cómo manejar el estado y la validación de ese formulario en Svelte?


Para mantener coherencia con el tono profesional y directo de tu pantalla de inicio de sesión (*"Ingresa tus credenciales para acceder al panel de administración."*), aquí tienes la propuesta de textos (microcopy) listos para copiar y pegar en cada paso:

### Paso 1: Identificación del usuario

* **Título:** Recuperar contraseña
* **Subtítulo:** Ingresa tu nombre de usuario para verificar tu identidad mediante tus preguntas de seguridad.
* **Etiqueta del campo (Label):** Nombre de usuario
* **Placeholder:** `ej. jperez` o `username`
* **Botón principal:** Continuar
* **Enlace secundario:** Volver al inicio de sesión
* **Mensaje de error (si no existe):** No encontramos una cuenta asociada a este usuario. Verifica los datos e intenta nuevamente.

---

### Paso 2: Preguntas de seguridad

* **Indicador de progreso (opcional):** Paso 2 de 3
* **Título:** Verificación de seguridad
* **Subtítulo:** Responde las siguientes preguntas que configuraste al crear tu cuenta.
* **Etiqueta de cada campo (Label):** *[Aquí va la pregunta dinámica, ej. ¿Cuál es el nombre de tu primera mascota?]*
* **Placeholder:** Escribe tu respuesta
* **Nota de ayuda (opcional, debajo de los campos):** *No se distinguen mayúsculas de minúsculas.*
* **Botón principal:** Verificar respuestas
* **Enlace secundario:** Usar otro usuario
* **Mensaje de error (si fallan):** Una o más respuestas no coinciden con nuestros registros. Inténtalo de nuevo.

---

### Paso 3: Nueva contraseña

* **Indicador de progreso (opcional):** Paso 3 de 3
* **Título:** Crea una nueva contraseña
* **Subtítulo:** Tu identidad ha sido verificada. Establece una clave segura para tu cuenta.
* **Etiqueta campo 1:** Nueva contraseña
* **Etiqueta campo 2:** Confirmar contraseña
* **Lista de requisitos (texto pequeño):**
* Mínimo 8 caracteres
* Al menos una letra mayúscula y un número


* **Botón principal:** Actualizar contraseña
* **Mensaje de error (si no coinciden):** Las contraseñas no coinciden.

---

### Paso 4: Confirmación de éxito

* **Título:** ¡Contraseña actualizada!
* **Subtítulo:** Tu clave se ha restablecido correctamente. Ya puedes ingresar al panel con tus nuevas credenciales.
* **Botón principal:** Ir a Iniciar Sesión

---

### Ejemplo de estructura en tu vista Svelte

Si quieres mantener el mismo estilo visual de tu login (`text-3xl text-primary` y `font-extralight text-muted-foreground`), la cabecera de cada bloque te quedaría así:

```svelte
<div>
  <h2 class="text-3xl text-primary">Recuperar contraseña</h2>
  <p class="font-extralight leading-snug text-muted-foreground mt-1">
    Ingresa tu nombre de usuario para verificar tu identidad mediante tus preguntas de seguridad.
  </p>
</div>

```

*(Nota: Usé `leading-snug` en lugar de `leading-none` para que, si el subtítulo ocupa dos líneas en pantallas pequeñas, las letras no queden tan pegadas verticalmente).*

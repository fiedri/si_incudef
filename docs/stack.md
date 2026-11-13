# Stack Tecnológico y Decisiones de Arquitectura
El sistema está diseñado bajo un enfoque de **despliegue local sin dependencias externas (Zero-Config)**, optimizado para ejecutarse de forma nativa en estaciones de trabajo con **Windows 8.1** y hardware limitado.

* **Runtime — Node.js v16 (LTS):** Última rama con soporte oficial y compatibilidad binaria nativa para Windows 8.1 (versiones 18+ requieren Windows 10/Server 2012 R2).
* **Framework — SvelteKit 1 (Svelte 4):** Compila a JavaScript nativo sin *Virtual DOM*, reduciendo el consumo de RAM y CPU en equipos antiguos. Unifica backend (*Form Actions*, sesiones por cookies) y frontend en un solo proyecto, acelerando el desarrollo al aprovechar la experiencia previa del equipo en el stack.
* **Base de Datos — SQLite (`better-sqlite3`):** Motor embebido ACID almacenado en un único archivo local. Elimina la sobrecarga de instalar, configurar y mantener servicios cliente-servidor (PostgreSQL/MySQL) en un entorno monousuario, además de simplificar los respaldos manuales.
* **ORM — Drizzle ORM:** Capa de acceso a datos *SQL-like* con tipado estático y mínima huella en memoria, evitando la penalización de arranque y abstracción excesiva de ORMs tradicionales.
* **Estilos — Tailwind CSS v3:** Genera únicamente el CSS estático utilizado en compilación, asegurando tiempos de carga mínimos y consistencia visual entre navegadores sin librerías de componentes pesadas.

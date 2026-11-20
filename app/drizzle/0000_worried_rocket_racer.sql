CREATE TABLE `agrupaciones` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cultor` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tipo_cedula` text NOT NULL,
	`cedula` text NOT NULL,
	`nombres` text NOT NULL,
	`apellidos` text NOT NULL,
	`sexo` text NOT NULL,
	`fecha_nacimiento` text NOT NULL,
	`lugar_nacimiento` text NOT NULL,
	`direccion` text NOT NULL,
	`parroquia_id` integer NOT NULL,
	`telefono` text NOT NULL,
	`email` text,
	`carnet_patria` text,
	`disciplina_id` integer NOT NULL,
	`trayectoria` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s','now')) NOT NULL,
	`created_by` integer NOT NULL,
	`estado_cultor` text DEFAULT 'activo' NOT NULL,
	FOREIGN KEY (`parroquia_id`) REFERENCES `parroquia`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`disciplina_id`) REFERENCES `disciplina`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`created_by`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT cultor_tipo_cedula_check CHECK (`tipo_cedula` in ('V', 'E')),
	CONSTRAINT cultor_cedula_check CHECK (`cedula` <> '' and `cedula` not glob '*[^0-9]*'),
	CONSTRAINT cultor_sexo_check CHECK (`sexo` in ('M', 'F')),
	CONSTRAINT cultor_fecha_nacimiento_check CHECK (`fecha_nacimiento` like '____-__-__'),
	CONSTRAINT cultor_estado_cultor_check CHECK (`estado_cultor` in ('activo', 'inactivo', 'fallecido'))
);
--> statement-breakpoint
CREATE TABLE `cultor_agrupacion` (
	`id_cultor` integer NOT NULL,
	`id_agrupacion` integer NOT NULL,
	`rol` text NOT NULL,
	PRIMARY KEY(`id_agrupacion`, `id_cultor`),
	FOREIGN KEY (`id_cultor`) REFERENCES `cultor`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`id_agrupacion`) REFERENCES `agrupaciones`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT cultor_agrupacion_rol_check CHECK (`rol` in ('lider', 'miembro'))
);
--> statement-breakpoint
CREATE TABLE `disciplina` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `estado` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `municipio` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`estado_id` integer NOT NULL,
	FOREIGN KEY (`estado_id`) REFERENCES `estado`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `parroquia` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`municipio_id` integer NOT NULL,
	FOREIGN KEY (`municipio_id`) REFERENCES `municipio`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `preguntas_recuperacion` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pregunta` text NOT NULL,
	`placeholder` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `proteccion_social` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`id_cultor` integer NOT NULL,
	`patologias` text,
	`necesidad_financiamiento` text,
	`condicion_habitacional` text,
	`requerimiento_subsidio` text,
	`observaciones` text,
	`updated_at` integer DEFAULT (strftime('%s','now')) NOT NULL,
	FOREIGN KEY (`id_cultor`) REFERENCES `cultor`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `question_answer` (
	`id_usuario` integer NOT NULL,
	`id_pregunta` integer NOT NULL,
	`respuesta_hash` text NOT NULL,
	PRIMARY KEY(`id_pregunta`, `id_usuario`),
	FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas_recuperacion`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`rol` text NOT NULL,
	`intentos_fallidos` integer DEFAULT 0 NOT NULL,
	`bloqueado_hasta` integer,
	`must_change_password` integer DEFAULT true NOT NULL,
	CONSTRAINT usuarios_rol_check CHECK (`rol` in ('administrador', 'operador')),
	CONSTRAINT usuarios_intentos_check CHECK (`intentos_fallidos` >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `agrupaciones_nombre_unique` ON `agrupaciones` (`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `cultor_email_unique` ON `cultor` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `cultor_carnet_patria_unique` ON `cultor` (`carnet_patria`);--> statement-breakpoint
CREATE UNIQUE INDEX `cultor_tipo_cedula_cedula_unique` ON `cultor` (`tipo_cedula`,`cedula`);--> statement-breakpoint
CREATE UNIQUE INDEX `disciplina_nombre_unique` ON `disciplina` (`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `estado_nombre_unique` ON `estado` (`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `municipio_estado_nombre_unique` ON `municipio` (`estado_id`,`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `parroquia_municipio_nombre_unique` ON `parroquia` (`municipio_id`,`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `proteccion_social_id_cultor_unique` ON `proteccion_social` (`id_cultor`);--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_username_unique` ON `usuarios` (`username`);
import { sql } from 'drizzle-orm';
import {
	check,
	integer,
	primaryKey,
	sqliteTable,
	text,
	uniqueIndex
} from 'drizzle-orm/sqlite-core';

export const usuarios = sqliteTable(
	'usuarios',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		username: text('username').notNull().unique(),
		passwordHash: text('password_hash').notNull(),
		rol: text('rol', { enum: ['administrador', 'operador'] }).notNull(),
		intentosFallidos: integer('intentos_fallidos').notNull().default(0),
		bloqueadoHasta: integer('bloqueado_hasta'),
    mustChangePassword: integer('must_change_password', { mode: 'boolean' })
    .notNull()
    .default(true),
	},
	(t) => ({
		rolCheck: check('usuarios_rol_check', sql`${t.rol} in ('administrador', 'operador')`),
		intentosCheck: check('usuarios_intentos_check', sql`${t.intentosFallidos} >= 0`)
	})
);

export const preguntasRecuperacion = sqliteTable('preguntas_recuperacion', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	pregunta: text('pregunta').notNull(),
	placeholder: text('placeholder').notNull()
});

export const questionAnswer = sqliteTable(
	'question_answer',
	{
		idUsuario: integer('id_usuario')
			.notNull()
			.references(() => usuarios.id, { onDelete: 'cascade' }),
		idPregunta: integer('id_pregunta')
			.notNull()
			.references(() => preguntasRecuperacion.id, { onDelete: 'restrict' }),
		// Hash de la respuesta, nunca el texto plano.
		respuestaHash: text('respuesta_hash').notNull()
	},
	(t) => ({
		pk: primaryKey({ columns: [t.idUsuario, t.idPregunta] })
	})
);

export const disciplina = sqliteTable('disciplina', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	nombre: text('nombre').notNull().unique()
});

export const agrupaciones = sqliteTable('agrupaciones', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	nombre: text('nombre').notNull().unique(),
	descripcion: text('descripcion').notNull()
});

export const estado = sqliteTable('estado', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	nombre: text('nombre').notNull().unique()
});

export const municipio = sqliteTable(
	'municipio',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		nombre: text('nombre').notNull(),
		estadoId: integer('estado_id')
			.notNull()
			.references(() => estado.id, { onDelete: 'restrict' })
	},
	(t) => ({
		estadoNombreUnique: uniqueIndex('municipio_estado_nombre_unique').on(t.estadoId, t.nombre)
	})
);

export const parroquia = sqliteTable(
	'parroquia',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		nombre: text('nombre').notNull(),
		municipioId: integer('municipio_id')
			.notNull()
			.references(() => municipio.id, { onDelete: 'restrict' })
	},
	(t) => ({
		municipioNombreUnique: uniqueIndex('parroquia_municipio_nombre_unique').on(
			t.municipioId,
			t.nombre
		)
	})
);


export const cultor = sqliteTable(
	'cultor',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		tipoCedula: text('tipo_cedula', { enum: ['V', 'E'] }).notNull(),
		cedula: text('cedula').notNull(),
		nombres: text('nombres').notNull(),
		apellidos: text('apellidos').notNull(),
		sexo: text('sexo', { enum: ['M', 'F'] }).notNull(),
		// ISO YYYY-MM-DD.
		fechaNacimiento: text('fecha_nacimiento').notNull(),
		lugarNacimiento: text('lugar_nacimiento').notNull(),
		direccion: text('direccion').notNull(),
		// Solo la parroquia: municipio y estado se derivan por join.
		parroquiaId: integer('parroquia_id')
			.notNull()
			.references(() => parroquia.id, { onDelete: 'restrict' }),
		telefono: text('telefono').notNull(),
		// Opcionales y únicos: sin dato se guarda NULL.
		email: text('email').unique(),
		carnetPatria: text('carnet_patria').unique(),
		disciplinaId: integer('disciplina_id')
			.notNull()
			.references(() => disciplina.id, { onDelete: 'restrict' }),
		trayectoria: text('trayectoria').notNull(),
		// Segundos unix.
		createdAt: integer('created_at').notNull().default(sql`(strftime('%s','now'))`),
		updatedAt: integer('updated_at').notNull().default(sql`(strftime('%s','now'))`),
		createdBy: integer('created_by')
			.notNull()
			.references(() => usuarios.id, { onDelete: 'restrict' }),
		estadoCultor: text('estado_cultor', { enum: ['activo', 'inactivo', 'fallecido'] })
			.notNull()
			.default('activo')
	},
	(t) => ({
		cedulaUnique: uniqueIndex('cultor_tipo_cedula_cedula_unique').on(t.tipoCedula, t.cedula),
		tipoCedulaCheck: check('cultor_tipo_cedula_check', sql`${t.tipoCedula} in ('V', 'E')`),
		cedulaCheck: check(
			'cultor_cedula_check',
			sql`${t.cedula} <> '' and ${t.cedula} not glob '*[^0-9]*'`
		),
		sexoCheck: check('cultor_sexo_check', sql`${t.sexo} in ('M', 'F')`),
		fechaNacimientoCheck: check(
			'cultor_fecha_nacimiento_check',
			sql`${t.fechaNacimiento} like '____-__-__'`
		),
		estadoCultorCheck: check(
			'cultor_estado_cultor_check',
			sql`${t.estadoCultor} in ('activo', 'inactivo', 'fallecido')`
		)
	})
);

export const cultorAgrupacion = sqliteTable(
	'cultor_agrupacion',
	{
		idCultor: integer('id_cultor')
			.notNull()
			.references(() => cultor.id, { onDelete: 'cascade' }),
		idAgrupacion: integer('id_agrupacion')
			.notNull()
			.references(() => agrupaciones.id, { onDelete: 'cascade' }),
		rol: text('rol', { enum: ['lider', 'miembro'] }).notNull()
	},
	(t) => ({
		pk: primaryKey({ columns: [t.idCultor, t.idAgrupacion] }),
		rolCheck: check('cultor_agrupacion_rol_check', sql`${t.rol} in ('lider', 'miembro')`)
	})
);

export const proteccionSocial = sqliteTable(
	'proteccion_social',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		idCultor: integer('id_cultor')
			.notNull()
			.unique()
			.references(() => cultor.id, { onDelete: 'cascade' }),
		patologias: text('patologias'),
		necesidadFinanciamiento: text('necesidad_financiamiento'),
		condicionHabitacional: text('condicion_habitacional'),
		requerimientoSubsidio: text('requerimiento_subsidio'),
		observaciones: text('observaciones'),
		// Segundos unix.
		updatedAt: integer('updated_at').notNull().default(sql`(strftime('%s','now'))`)
	}
);

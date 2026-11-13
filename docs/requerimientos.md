# Sistema de Registro de Cultores

**Proyecto:** Registro de Cultores (Atención Ciudadana) | **Versión:** 1.0 | **Módulo:** Requerimientos del Sistema

*Este documento define los requerimientos funcionales y no funcionales para el desarrollo del sistema de información institucional, sirviendo como base técnica y metodológica.*

---

## 1. Requerimientos Funcionales (RF)

Definen las funciones específicas y capacidades operativas que el sistema debe ejecutar de forma explícita para solventar los cuellos de botella detectados en la institución.

| Código | Nombre | Descripción Detallada | Prioridad |
| :--- | :--- | :--- | :--- |
| **RF-01** | **Gestión de Cultores (CRUD)** | El sistema debe permitir registrar, consultar, actualizar y dar de baja registros de cultores y artistas.<br><br>• **Campos obligatorios:** Cédula de Identidad, Nombres y Apellidos, Sexo, Edad, Lugar de Nacimiento, Dirección, Estado, Municipio, Parroquia, Código Postal, Teléfono, Correo Electrónico, Carnet de la Patria, Disciplina Artística (artesanos, artes gráficas, teatro, música, danza, pintura, literatura, entre otros), Trayectoria Artística y Organización Social/Agrupación.<br>• La cédula de identidad debe ser única en la base de datos. | **ALTA** |
| **RF-02** | **Gestión de Entidades Colectivas (Agrupaciones)** | El sistema debe permitir asociar múltiples cultores a una organización social o agrupación cultural, designando un rol de *"Director o Jefe de Agrupación"* como enlace principal de comunicación institucional. | **MEDIA** |
| **RF-03** | **Motor de Filtros y Búsqueda Avanzada** | El sistema debe incorporar búsquedas indexadas y filtros multivariables que permitan segmentar ágilmente los registros por disciplina artística, municipios y parroquias, eliminando la necesidad de búsquedas lineales manuales. | **ALTA** |
| **RF-04** | **Módulo de Protección Social y Vulnerabilidad** | El sistema debe registrar y asociar variables críticas de asistencia socioeconómica del cultor (patologías de salud, necesidades de financiamiento, condiciones habitacionales y requerimientos de subsidios) para facilitar la canalización de ayudas humanitarias. | **ALTA** |
| **RF-05** | **Protocolo de Supervivencia y Estado del Cultor** | El sistema debe gestionar el ciclo de vida del dato mediante un protocolo de actualización de estatus, permitiendo clasificar y actualizar periódicamente los registros en estados como **Activo, Inactivo o Fallecido**. | **MEDIA** |
| **RF-06** | **Generación de Reportes y Exportación** | El sistema debe permitir exportar reportes institucionales consolidados y registros mensuales estructurados directamente en formato **PDF** para la toma de decisiones gerenciales. | **MEDIA** |

---

## 2. Requerimientos No Funcionales (RNF)

Establecen los criterios de calidad, restricciones técnicas, seguridad y rendimiento bajo los cuales operará la plataforma informática.

| Código | Atributo | Criterio de Aceptación / Restricción | Prioridad |
| :--- | :--- | :--- | :--- |
| **RNF-01** | **Rendimiento y Escalabilidad** | El tiempo de respuesta para las consultas, filtrados y renderizado de tablas de datos (*data tables*) no debe superar los 2 segundos, soportando eficientemente un volumen estimado inicial de hasta 5,000 registros culturales. | **ALTA** |
| **RNF-02** | **Seguridad y Control de Acceso** | El sistema requerirá autenticación por credenciales con control de acceso basado en roles:<br><br>• **Administrador:** Acceso total a la configuración, reportes y gestión de usuarios.<br>• **Operador/Usuario:** Permisos operativos para el registro, consulta y actualización de datos de cultores (configurado inicialmente para un esquema operativo de 2 usuarios y 1 administrador con permisos delimitados). | **ALTA** |
| **RNF-03** | **Restricciones de Infraestructura y Despliegue** | El sistema debe estar optimizado para ejecutarse eficientemente en entornos locales o equipos institucionales con recursos estándar (compatibles con arquitecturas ligeras bajo entornos Windows sin requerir una infraestructura de servidores complejos en la nube). | **MEDIA** |
| **RNF-04** | **Usabilidad y Diseño de Interfaz** | La interfaz web debe ser intuitiva, responsiva y apoyarse en librerías de tablas de datos (*scripts de data tables*) que garanticen una navegación ágil y simplificada para los operadores de la Oficina de Atención Ciudadana. | **MEDIA** |

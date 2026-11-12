# Sistema de Información

## Instalación
### Requisitos previos
- Node.js v16.20.2 (LTS)
- Chrome 109
```bash
# 1. Clonar el repositorio
git clone [https://github.com/](https://github.com/)<usuario>/si-incudef.git

# 2. Entrar al directorio del proyecto
cd si-incudef

# 3. Instalar el gestor de paquetes (Yarn Classic)
npm install -g yarn@1.22.22 --engine-strict=false

# 4. Instalar dependencias respetando las versiones exactas del lockfile
yarn install --frozen-lockfile --ignore-engines
```

> [!NOTE]
> Las banderas `--engine-strict=false` e `--ignore-engines` omiten las advertencias declarativas de versión (`node >=18`) en subdependencias secundarias, permitiendo instalar y ejecutar el árbol de paquetes de forma segura bajo **Node.js v16** (requerido para compatibilidad con Windows 8.1).


### Entorno de desarrollo
```bash
# Inicia el servidor local 
yarn dev
```

# FreshControl (SIGI)

Sistema de Gestion de Inventarios para restaurantes con estrategia **FEFO**
(First Expired, First Out) y motor de alertas con margen de **72 horas**.

Arquitectura hibrida: **React (Vite)** para la UI y **JavaScript puro (Clases ES6)**
para la capa de dominio, con los patrones de diseno implementados como POO pura
en la carpeta `/core`. React solo instancia y ejecuta; no contiene logica de patrones.

## Ejecutar

```bash
npm install
npm run dev
```

Abre http://localhost:5173

### Cuentas de prueba (sembradas automaticamente)

| Correo               | Contrasena | Rol      | Estado    |
|----------------------|-----------|----------|-----------|
| admin@sigi.com       | 123456    | admin    | activo    |
| operador@sigi.com    | 123456    | operador | activo    |
| suspendido@sigi.com  | 123456    | operador | inactivo  |  (prueba ValidarEstado)

## Patrones de diseno (carpeta /core, POO pura)

| Patron | Ubicacion | Que hace |
|--------|-----------|----------|
| **Factory Method** | `core/models/` + `core/factories/AlimentoFactory.js` | Clase abstracta `Alimento` y subclases (`ProductoCarnico`, `ProductoSeco` con validacion de humedad maxima, etc.). `crearAlimento(categoria, datos)` crea y valida. |
| **Chain of Responsibility** | `core/auth/` | `ManejadorBase` + `ValidarFormato` -> `ValidarCredenciales` -> `ValidarEstado` -> `ValidarRol`. El Login solo pasa los datos al primer eslabon. |
| **Adapter** | `core/adapters/` | `FuenteAlimentos` (base) y `AdaptadorCatalogoCSV` que normaliza columnas crudas y entrega objetos para el Factory. |
| **Observer** | `core/observers/` | `InventarioSubject` (`attach`/`detach`/`notify`) con `WebNotificationObserver` (API del navegador) y `UIObserver` (puente hacia React). |

## Persistencia preparada para backend

`core/persistence/LocalStorageGateway.js` expone una API **asincrona** (`async/await`).
El dia que se integre Node.js + MySQL, se crea un `ApiGateway.js` con la misma firma
(`obtener`, `guardar`, `eliminar`) y **ninguna clase de patron ni componente React cambia**.

## Paleta institucional

Definida en `tailwind.config.js`:
- Fondo `#07130F` · Paneles `#122B22` · Inputs `#1A3A2E` · Primario `#52B788`
- Texto `#E8F1ED` · Muted `#8AA69B`
- Alertas: Critico `#E63946` · Urgente `#F4A261` · Preventivo `#E9C46A`

## Estructura

```
src/
├── core/              CAPA DE DOMINIO (POO pura, sin React)
│   ├── models/        Factory Method (Alimento + subclases)
│   ├── factories/     AlimentoFactory
│   ├── auth/          Chain of Responsibility
│   ├── adapters/      Adapter (CSV)
│   ├── observers/     Observer (alertas)
│   ├── services/      MotorFEFO, RepositorioInventario, SeedData
│   ├── persistence/   LocalStorageGateway (async)
│   └── enums/
├── components/        CAPA DE PRESENTACION (React UI)
│   ├── auth/ layout/ inventory/ alerts/ common/
├── pages/             Login, Dashboard, Inventory
├── context/           SessionContext (solo usuario logueado, sin logica)
├── App.jsx  main.jsx  styles/index.css
```

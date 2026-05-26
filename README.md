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



## Patrones de diseno (carpeta /core, POO pura)

| Patron | Ubicacion | Que hace |
|--------|-----------|----------|
| **Factory Method** | `core/models/` + `core/factories/AlimentoFactory.js` | Clase abstracta `Alimento` y subclases (`ProductoCarnico`, `ProductoSeco` con validacion de humedad maxima, etc.). `crearAlimento(categoria, datos)` crea y valida. |
| **Chain of Responsibility** | `core/auth/` | `ManejadorBase` + `ValidarFormato` -> `ValidarCredenciales` -> `ValidarEstado` -> `ValidarRol`. El Login solo pasa los datos al primer eslabon. |
| **Adapter** | `core/adapters/` | `FuenteAlimentos` (base) y `AdaptadorCatalogoCSV` que normaliza columnas crudas y entrega objetos para el Factory. |
| **Observer** | `core/observers/` | `InventarioSubject` (`attach`/`detach`/`notify`) con `WebNotificationObserver` (API del navegador) y `UIObserver` (puente hacia React). |

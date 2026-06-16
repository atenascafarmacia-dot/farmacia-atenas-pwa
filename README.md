# Farmacia — PWA

Aplicación web progresiva (PWA) _mobile-first_ para una farmacia: el cliente arma un
pedido desde el catálogo, recibe un **código + QR**, y el **operador** recupera el
pedido (tecleando el código o escaneando el QR) y lo marca como completado.

## Stack

| Capa            | Tecnología                                              |
| --------------- | ------------------------------------------------------- |
| Framework       | Next.js 16 (App Router, Server Components/Actions)      |
| UI              | React 19, Tailwind CSS v4, Atomic Design                |
| Estado cliente  | Zustand 5 (carrito, persistido en `localStorage`)       |
| Validación      | Zod 4 (en el servidor)                                  |
| ORM / BD        | Prisma 7 + SQLite (adapter `better-sqlite3`)            |
| PWA             | `@ducanh2912/next-pwa` (service worker + manifest)      |
| Gestor paquetes | pnpm                                                    |

## Requisitos

- **Node.js ≥ 20** (probado con Node 24)
- **pnpm ≥ 9** — instalar con `npm i -g pnpm` si no lo tienes

## Instalación

```bash
# 1. Dependencias
pnpm install

# 2. Variables de entorno
cp .env.example .env
# Edita .env (ver "Variables de entorno" más abajo)

# 3. Base de datos: aplica las migraciones y genera el cliente Prisma
pnpm prisma migrate dev

# 4. Datos de ejemplo (productos, un usuario y pedidos de demo)
pnpm db:seed
```

### Variables de entorno

| Variable              | Obligatoria   | Descripción                                                                                                            |
| --------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`        | sí            | Conexión SQLite. Por defecto `file:./dev.db`.                                                                           |
| `NEXT_PUBLIC_APP_URL` | recomendada   | Base absoluta para el QR. En local con teléfono usa tu **IP LAN**, p. ej. `http://192.168.1.222:3000` (no `localhost`). |
| `OPERATOR_PHONE`      | sí (operador) | Teléfono del único usuario con acceso a `/operador`. El seed crea un usuario con `+503 7890-1234`.                      |

## Seed

```bash
pnpm db:seed     # equivale a `prisma db seed` → tsx prisma/seed.ts
pnpm db:reset    # recrea la BD desde cero y vuelve a sembrar
```

El seed inserta 12 productos, el usuario **José Antonio García** (`+503 7890-1234`)
y dos pedidos de ejemplo (`FAR-2024-001` completado, `FAR-2024-002` pendiente).
Para probar el rol operador, pon ese teléfono en `OPERATOR_PHONE`.

## Ejecución

```bash
# Desarrollo
pnpm dev                  # http://localhost:3000
pnpm dev -H 0.0.0.0       # accesible desde el teléfono por la IP LAN

# Producción (necesario para que el Service Worker se active)
pnpm build && pnpm start
pnpm preview:network      # build + start escuchando en 0.0.0.0
```

> El service worker de `next-pwa` se **desactiva en desarrollo**. Para verificar la
> instalabilidad de la PWA hay que correr un build de producción (`pnpm build && pnpm start`).

### Flujo de la app

```
/                 Identificación (nombre + teléfono)
/catalogo         Catálogo + "Comprados frecuentemente"
/carrito          Carrito → "Proceder al pago"
/pedido/[codigo]  Comprobante con QR  (lo escanea el operador)
/operador         Recuperar pedido por código y marcarlo COMPLETADA  (gate por OPERATOR_PHONE)
```

## Verificar que la PWA es instalable (en el navegador)

1. `pnpm build && pnpm start` y abre `http://localhost:3000` en **Chrome**.
2. **DevTools → Application (Aplicación)**:
   - **Manifest**: debe listar nombre, `theme_color`, `start_url` y los íconos 192/512 sin errores.
   - **Service Workers**: debe aparecer uno **activated and running**.
   - **Icons**: sin advertencias de tamaño faltante.
3. En la barra de direcciones aparece el icono **Instalar** (⊕), o **⋮ → Instalar Farmacia…**.
4. **Lighthouse → categoría _Progressive Web App_**: ejecútala; debe pasar "installable".
5. En móvil (Android/Chrome): menú **⋮ → Añadir a pantalla de inicio**.

> Nota: los íconos son SVG (192×192 y 512×512, `purpose: any maskable`). Si algún
> navegador exige PNG para la instalación, exporta los SVG a PNG y actualiza
> `public/manifest.json`.

## Gestión de productos (operador)

En `/operador/productos` el operador puede **crear, editar y eliminar** productos.
La eliminación es **soft-delete** por defecto (`isActive=false`) para preservar el
historial de pedidos; solo se borra físicamente un producto si **ninguna orden lo
referencia**. El catálogo y las recomendaciones solo muestran productos con
`isActive: true`.

> ⚠️ **Seguridad en producción:** como el MVP no tiene autenticación real, esta área
> solo está protegida por el mismo _gate_ de `OPERATOR_PHONE` que `/operador` (vía
> `app/operador/productos/layout.tsx`). **Antes de ir a producción debe protegerse con
> autenticación/autorización reales** (sesión de servidor, rol de operador), ya que
> permite mutar el catálogo.

## Arquitectura por capas

Regla de oro: **solo los repositorios importan Prisma**. Ninguna página o componente
toca la BD directamente; el total del pedido y los precios se recalculan en el servidor.

```
┌──────────────────────────────────────────────────────────────┐
│  UI  (Server Components + Client Components, Atomic Design)    │
│  src/components/{atoms,molecules,organisms,templates}          │
│  src/app/**/page.tsx · loading.tsx · error.tsx · not-found     │
└───────────────┬───────────────────────────┬──────────────────┘
                │ render (lee datos)         │ muta
                ▼                            ▼
        ┌───────────────┐          ┌────────────────────────┐
        │   Services    │          │   Server Actions       │
        │  (negocio,    │◀─────────│  'use server'          │
        │  Strategy)    │  llaman  │  Zod → { ok, error }   │
        └───────┬───────┘          │  revalidatePath()      │
                │                  └───────────┬────────────┘
                │ usan                         │ usan
                ▼                              ▼
        ┌──────────────────────────────────────────────────┐
        │              Repositories                         │
        │   (ÚNICO lugar que importa Prisma; usan `select`, │
        │    transacciones, DTOs — no filtran campos)       │
        └───────────────────────┬──────────────────────────┘
                                │ Prisma Client (singleton)
                                ▼
                        ┌───────────────┐
                        │   SQLite DB   │
                        └───────────────┘

Transversal:
  src/lib/strings.ts     Textos de UI en español (centralizados)
  src/lib/code.ts        Factory: código FARM-XXXXX + QR (Data URL)
  src/lib/prisma.ts      Singleton de PrismaClient
  src/lib/rate-limit.ts  Rate limit en memoria (búsqueda del operador)
  src/store/cart.ts      Zustand (carrito)
```

### Patrones aplicados

- **Repository** — acceso a datos aislado por entidad.
- **Service Layer** — lógica de negocio (`order.service`, `recommendation.service`, …).
- **Strategy** — recomendaciones: `FrequentByUser` (historial) vs `TopSellers` (fallback).
- **Factory** — generación de código + QR del pedido.
- **Singleton** — `PrismaClient`.
- **DTO / Mapper** — los repos proyectan con `select` y no exponen campos internos.

## Scripts útiles

```bash
pnpm lint            # ESLint
npx tsc --noEmit     # chequeo de tipos
pnpm format          # Prettier
pnpm db:reset        # recrear + sembrar la BD
```

## Convenciones

- **Idioma**: código/identificadores en inglés; **textos de usuario en español**,
  centralizados en `src/lib/strings.ts`.
- **Imports**: alias `@/*` → `src/*`.
- **Mobile-first**: ancho máximo 430px; áreas táctiles ≥ 44px.

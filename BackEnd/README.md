# Noctua Owls BE

Backend monolito con una estructura por dominios y Supabase como proveedor principal.

## Estructura

```txt
BE/
  src/
    config/
      env.js
      supabaseClient.js
    middlewares/
      errorHandler.js
    modules/
      auth/
        auth.controller.js
        auth.routes.js
        auth.service.js
      bd/
        bd.controller.js
        bd.routes.js
        bd.service.js
    routes/
      main.routes.js
    utils/
      handleAsync.js
    main.js
```

## Configuración

1. Instala dependencias:

```bash
npm install
```

2. Crea tu `.env` a partir de `.env.example`:

```bash
cp .env.example .env
```

3. Completa tus variables:

- `PORT`
- `SUPABASE_URL`
- `SUPABASE_KEY`

## Ejecutar

```bash
npm run dev
```

## Directorio de llamados disponibles

Cuando el servidor esté activo:

- `GET /api` devuelve el catálogo completo de endpoints.
- `GET /api/docs` devuelve el swagger para un mejor entendimiento de la api.
- `GET /api/health` verifica salud del servicio.

## Endpoints

### BD (Gestión de datos)

- `GET /api/bd/juegos`: Obtener catálogo de juegos/disciplinas. Soporta query params (ej. `?estado=true`).
- `GET /api/bd/users`: Obtener listado de usuarios y staff. Soporta query params (ej. `?juegos=[juego1,juego2]&cargos=[cargo1,cargo2]`).

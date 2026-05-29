# 🦊 CypherFox

**CypherFox** es una plataforma educativa interactiva diseñada para cerrar la brecha entre la teoría matemática abstracta y la implementación práctica de algoritmos criptográficos. Orientada a estudiantes de ingeniería y entusiastas de la seguridad, la plataforma ofrece un entorno inmersivo para dominar el arte de proteger la información.

🚀 **Explora el proyecto en vivo:** [https://cypherfox.vercel.app](https://cypherfox.vercel.app)

---

## 📝 Resumen
En el contexto actual de transformación digital, la enseñanza de la criptografía presenta desafíos significativos debido a la complejidad matemática y la naturaleza abstracta de sus algoritmos. CypherFox utiliza un modelo desacoplado (React/Node.js/Supabase) para facilitar el dominio de la disciplina mediante visualizaciones dinámicas orquestadas con **GSAP** y un motor de evaluación automática que valida el código del usuario contra vectores de prueba estandarizados.

## ✨ Características Principales

- **Aprendizaje Activo:** Lecciones interactivas que combinan teoría profunda con simulaciones en tiempo real.
- **Misiones y Desafíos:** Sistema de misiones basado en `util/missions.js` para validar la comprensión conceptual antes de la implementación.
- **Laboratorio de Implementación:** Entorno de desarrollo integrado (IDE) basado en **Monaco Editor** para programar algoritmos criptográficos.
- **Evaluación Automatizada:** Motor en el backend (`evaluate.service.js`) que califica funcionalmente el código enviado.
- **Seguridad Robusta:** Protocolo de comunicación que cifra los payloads mediante **AES-256-GCM** y derivación de claves con **SHA-256**.
- **Gestión Académica:** Uso de **PostgreSQL RLS** (Row Level Security) para separar la privacidad de notas entre estudiantes y docentes.

## 🛠️ Stack Tecnológico

### Frontend
- **React + Vite:** Interfaz reactiva y modular.
- **GSAP:** Animaciones de alto rendimiento para visualizar flujos de datos (S-Boxes, State Arrays, etc.).
- **Monaco Editor:** Experiencia de codificación profesional en el navegador.

### Backend
- **Node.js & Express:** Servidor asíncrono para lógica de evaluación.
- **Web Crypto API:** Implementación de seguridad en la capa de aplicación.

### Persistencia
- **Supabase (PostgreSQL):** Gestión de perfiles, test cases y persistencia de resultados con lógica de negocio vía Triggers y PL/pgSQL.

## 📚 Módulos y Alcance Algorítmico

1. **Criptografía Clásica:** Sustitución (César, Vigenère, Playfair, Hill, Homofónico), Transposición (Turning Grille) y Seguridad Perfecta (One-Time Pad).
2. **Estándares Simétricos:** DES (Redes de Feistel) y AES (Transformaciones en State Array).
3. **Clave Pública:** RSA (Factorización) y ElGamal (Logaritmo Discreto).

## 🏗️ Estructura del Proyecto

### Backend (`/BackEnd`)
```txt
│   .env.example             # Plantilla de variables de entorno
│   .gitignore               # Archivos ignorados por Git
│   package.json             # Dependencias y scripts del servidor
│   swagger.yaml             # Documentación de la API (OpenAPI)
│
└───src
    │   main.js              # Punto de entrada de la aplicación Express
    │
    ├───config
    │       env.js           # Validación de variables de entorno
    │       supabase.js      # Cliente configurado de Supabase
    │
    ├───middlewares
    │       checkRole.js     # Validador de permisos (Student/Teacher)
    │       errorHandler.js  # Gestor centralizado de errores
    │       requireAuth.js   # Validador de sesión JWT
    │
    ├───modules
    │   ├───admin
    │   │       admin.controller.js # Lógica de gestión para profesores
    │   │       admin.routes.js     # Endpoints administrativos
    │   │
    │   ├───auth
    │   │       auth.controller.js  # Control de flujo de autenticación
    │   │       auth.routes.js      # Rutas de login/registro
    │   │       auth.service.js     # Lógica de negocio de usuarios
    │   │
    │   └───evaluate
    │           evaluate.controller.js # Receptor de soluciones de laboratorio
    │           evaluate.routes.js     # Endpoints de evaluación
    │           evaluate.service.js    # Motor de ejecución y validación
    │           evaluate.test_cases.js # Definición de vectores de prueba
    │
    ├───routes
    │       main.routes.js   # Agregador principal de rutas
    │
    └───utils
            crypto.js        # Utilidades de descifrado (AES-GCM)
            handleAsync.js   # Wrapper para promesas en rutas
            profileGrades.js # Procesador de promedios y notas
```

### Frontend (`/FrontEnd`)
```txt
│   .env.example             # Plantilla de variables de entorno
│   .gitignore               # Archivos ignorados por Git
│   index.html               # Plantilla HTML principal (entry point del navegador)
│   package.json             # Dependencias de React, GSAP y scripts de Vite
│   vercel.json              # Configuración de despliegue para Vercel
│   vite.config.js           # Configuración del bundler Vite
│
├───public
│   └───favicon_io           # Iconos y recursos estáticos de marca
│           ...
│
└───src
    │   App.jsx              # Definición de rutas (React Router) y Layout global
    │   main.jsx             # Punto de montaje de la aplicación React
    │
    ├───assets               # Activos visuales
    │       ...
    │
    ├───components
    │   ├───bg               # Fondos animados
    │   │       ...
    │   │
    │   ├───cards
    │   │       CodeBlock.jsx # Visualizador de código con resaltado sintáctico
    │   │       LabEditor.jsx # Editor de código (Monaco) para los laboratorios
    │   │       ...
    │   │       Stack.jsx     # Galería de libros interactiva en 3D
    │   │
    │   ├───others
    │   │       Footer.jsx    # Pie de página con créditos rápidos
    │   │       Navbar.jsx    # Navegación principal con detección de sesión
    │   │
    │   └───text              # Componentes animados para textos
    │           ...
    │
    ├───context
    │       AuthContext.jsx   # Proveedor de estado global para la sesión (Supabase)
    │
    ├───routes
    │   │   Home.jsx          # Landing page con Hero interactivo
    │   │
    │   ├───Auth
    │   │       Admin.jsx     # Panel de control para el rol 'teacher'
    │   │       Login.jsx     # Interfaz de acceso de usuarios
    │   │       Profile.jsx   # Dashboard de progreso y notas del estudiante
    │   │       ProtectedRoute.jsx # HOC para restringir rutas según auth/rol
    │   │
    │   ├───Methods
    │   │   │   Lab.jsx       # Interface principal del laboratorio de código
    │   │   │   Metodos.jsx   # Catálogo visual de algoritmos criptográficos
    │   │   │
    │   │   └───Lecciones     # Módulo interactivo sobre cada lección criptografica
    │   │           ...
    │   │
    │   └───Others
    │           Creditos.jsx  # Sección de bibliografía y equipo de desarrollo
    │           NotFound.jsx  # Página de error 404 personalizada
    │
    └───util
            api.js            # Cliente API centralizado (Axios)
            auth.js           # Utilidades para gestión de sesión con Supabase
            crypto.js         # Implementación de cifrado para envíos seguros (AES-GCM)
            formatCode.js     # Utilidades para el formateo de código fuente
            index.js          # Punto de exportación central de utilidades
            metodos.js        # Configuración técnica y metadatos de algoritmos
            missions.js       # Definición de misiones y retos conceptuales
```

---

## 🚀 Instalación y Configuración

Para poner en marcha CypherFox localmente, es necesario configurar y ejecutar tanto el servidor como la interfaz de usuario.

### Requisitos Previos
- **Node.js** (v18 o superior)
- **Cuenta en Supabase** con un proyecto activo (PostgreSQL + Auth).

### 1. Clonar el repositorio
```bash
git clone https://github.com/StoryChara/CypherFox.git
cd CypherFox
```

### 2. Configuración del Backend (`/BackEnd`)
Navega a la carpeta del servidor, instala las dependencias y configura el entorno:
```bash
cd BackEnd
npm install
```
Crea un archivo `.env` en esta carpeta basándote en `.env.example` con las siguientes variables:
- `PORT`: Puerto del servidor (ej. `4000`).
- `ENCRYPTION_SECRET`: Una clave segura y larga. **Debe ser idéntica a la del Frontend.**
- `SUPABASE_URL`: URL de tu proyecto Supabase.
- `SUPABASE_ANON_KEY`: Clave anónima de Supabase.

Inicia el servidor en modo desarrollo:
```bash
npm run dev
```

### 3. Configuración del Frontend (`/FrontEnd`)
En una nueva terminal, navega a la carpeta de la interfaz:
```bash
cd FrontEnd
npm install
```
Crea un archivo `.env` en esta carpeta basándote en `.env.example` con las siguientes variables:
- `VITE_API_URL`: URL completa del backend (ej. `http://localhost:4000/api`).
- `VITE_ENCRYPTION_SECRET`: **Debe coincidir exactamente con el del Backend.**
- `VITE_SUPABASE_URL`: URL de tu proyecto Supabase.
- `VITE_SUPABASE_ANON_KEY`: Clave anónima de Supabase.

Inicia la aplicación en modo desarrollo:
```bash
npm run dev
```

---

## 📖 Referencias Bibliográficas
Este proyecto se fundamenta en los estándares y literatura de:
* [1] A. J. Menezes, P. C. van Oorschot, y S. A. Vanstone, Handbook of Applied Cryptography. Boca Raton, FL, USA: CRC Press, 1996.
* [2] D. Boneh y V. Shoup, A Graduate Course in Applied Cryptography. v. 0.6, 2023. [En línea]. Disponible en: http://toc.cryptobook.us/
* [3] H. Delfs y H. Knebl, Introduction to Cryptography: Principles and Applications, 3ra ed. Berlin, Alemania: Springer, 2015.
* [4] J. A. Buchmann, Introduction to Cryptography, 2da ed. New York, NY, USA: Springer, 2004.
* [5] T. H. Cormen, C. E. Leiserson, R. L. Rivest, y C. Stein, Introduction to Algorithms, 3ra ed. Cambridge, MA, USA: MIT Press, 2009.
* [6] G. M. Ordóñez, La estructura de los números. España: Autores Editores, 2020.
* [7] J. Katz y Y. Lindell, Introduction to Modern Cryptography, 3ra ed. Boca Raton, FL, USA: CRC Press, 2020.
* [8] C. Paar y J. Pelzl, Understanding Cryptography: A Textbook for Students and Practitioners. Berlin, Alemania: Springer, 2010.
* [9] Y. Pinzón, Introducción a la criptografía y a la seguridad de la información. Bogotá, Colombia: Universidad Nacional de Colombia, 2022.


---

## 👥 Equipo
- **María José Jara** - Desarrolladora Full Stack
- **Jorge Eliecer Camargo** - Director de Proyecto
- **Laura Camila Pinzón** - Artista

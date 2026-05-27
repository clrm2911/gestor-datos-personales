# Gestor de Datos Personales

## Requisitos
- Docker y Docker Compose instalados
- Node.js 20+

## Cómo correr el proyecto
1. Copiar .env.example a .env y completar los valores
2. docker compose up

## Estructura
- frontend/        → Interfaz React
- gateway/         → Configuración nginx
- ms-auth/         → Microservicio autenticación
- ms-crear/        → Microservicio crear persona
- ms-modificar/    → Microservicio modificar persona
- ms-borrar/       → Microservicio borrar persona
- ms-consultar/    → Microservicio consultar persona
- ms-log/          → Microservicio consultar log
- database/        → Scripts SQL iniciales
- n8n/             → Workflow de lenguaje natural
 
## Ramas
- main       → código estable, no trabajar aquí directamente
- develop    → integración, fusionar aquí cuando algo esté listo
- feature/X  → tu rama de trabajo, créala desde develop

## Estructura de cada microservicio

Todos los microservicios siguen la misma estructura:

ms-nombre/
├── src/
│   ├── index.js          # Punto de entrada
│   ├── routes/           # Define las rutas
│   ├── controllers/      # Lógica de cada ruta
│   ├── validators/       # Validaciones de campos (crear y modificar)
│   └── middleware/       # Extrae el usuario del header
├── prisma/
│   └── schema.prisma     # Esquema de la base de datos
├── Dockerfile
└── package.json

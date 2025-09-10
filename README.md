# InmoMax - Plataforma Inmobiliaria

Sistema completo de gestión inmobiliaria desarrollado con **Next.js** (frontend) y **FastAPI** (backend), con base de datos **PostgreSQL**.

## 🏠 Características Principales

- **Catálogo de Propiedades**: Búsqueda avanzada con filtros múltiples
- **Sistema de Favoritos**: Guarda propiedades de interés
- **Chatbot Inteligente**: Asistente virtual para consultas
- **Panel de Agentes**: Gestión completa de propiedades
- **Responsive Design**: Optimizado para móviles y escritorio
- **SEO Optimizado**: Meta tags y estructura semántica
- **Geolocalización**: Integración con mapas y coordenadas

## 🚀 Tecnologías Utilizadas

### Frontend
- **Next.js 14** - Framework React con SSR
- **Tailwind CSS** - Framework de estilos utility-first
- **Lucide React** - Íconos modernos y livianos
- **Framer Motion** - Animaciones fluidas

### Backend
- **FastAPI** - Framework Python moderno y rápido
- **PostgreSQL** - Base de datos relacional con PostGIS
- **SQLAlchemy** - ORM para Python
- **Pydantic** - Validación de datos

### DevOps
- **Docker & Docker Compose** - Containerización
- **Nginx** - Reverse proxy (producción)
- **Redis** - Cache y sesiones

## 📦 Estructura del Proyecto

```
inmobiliaria/
│
├── frontend/ (Next.js)
│   ├── pages/
│   │   ├── index.js          # Página principal
│   │   ├── propiedades/      # Catálogo y detalle
│   │   ├── nosotros.js       # Información empresa
│   │   ├── servicios.js      # Servicios ofrecidos
│   │   ├── contacto.js       # Formulario contacto
│   │   └── api/              # API routes (opcional)
│   ├── components/           # Componentes reutilizables
│   ├── styles/               # Estilos Tailwind
│   └── package.json
│
├── backend/ (FastAPI)
│   ├── routes/
│   │   ├── propiedades.py    # CRUD propiedades
│   │   └── chatbot.py        # Lógica del chatbot
│   ├── models.py             # Modelos Pydantic
│   ├── main.py              # Aplicación principal
│   └── requirements.txt
│
├── db/
│   └── schema.sql           # Esquema de base de datos
│
├── docker-compose.yml       # Configuración Docker
└── README.md
```

## 🛠️ Instalación y Configuración

### Opción 1: Con Docker (Recomendado)

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/inmomax.git
cd inmomax
```

2. **Iniciar servicios con Docker**
```bash
# Desarrollo
docker-compose up -d

# Con Adminer para gestión de DB
docker-compose --profile development up -d
```

3. **Acceder a la aplicación**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Documentación API: http://localhost:8000/docs
- Adminer (DB): http://localhost:8080

### Opción 2: Instalación Manual

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Base de Datos
```bash
# Crear base de datos
createdb inmomax_db

# Ejecutar schema
psql -d inmomax_db -f db/schema.sql
```

## 🔧 Configuración de Entorno

### Variables de Entorno - Backend

Crear archivo `.env` en `/backend/`:

```env
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/inmomax_db
SECRET_KEY=tu_clave_secreta_muy_segura_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=development

# Opcional: Integración con servicios externos
OPENAI_API_KEY=tu_clave_openai
GOOGLE_MAPS_API_KEY=tu_clave_google_maps
EMAIL_SERVICE_API_KEY=tu_clave_email
```

### Variables de Entorno - Frontend

Crear archivo `.env.local` en `/frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_clave_google_maps
```

## 📖 Uso de la API

### Endpoints Principales

#### Propiedades
```http
GET    /api/propiedades          # Listar con filtros
GET    /api/propiedades/{id}     # Detalle de propiedad
POST   /api/propiedades          # Crear propiedad
PUT    /api/propiedades/{id}     # Actualizar propiedad
DELETE /api/propiedades/{id}     # Eliminar propiedad
```

#### Chatbot
```http
POST /api/chatbot/mensaje        # Enviar mensaje al bot
GET  /api/chatbot/sugerencias    # Obtener sugerencias
```

### Ejemplos de Uso

**Buscar propiedades:**
```bash
curl "http://localhost:8000/api/propiedades?tipo=casa&operacion=venta&precio_max=300000"
```

**Enviar mensaje al chatbot:**
```bash
curl -X POST "http://localhost:8000/api/chatbot/mensaje" \
  -H "Content-Type: application/json" \
  -d '{"mensaje": "Hola, busco una casa en Las Lomas"}'
```

## 🎨 Componentes Principales

### Frontend Components

- **`Navbar`**: Navegación principal responsive
- **`PropiedadCard`**: Card de propiedad con info esencial
- **`Filtros`**: Panel de filtros avanzados
- **`ChatbotWidget`**: Widget flotante del chatbot
- **`Footer`**: Footer con links y contacto

### Backend Models

- **`Propiedad`**: Modelo principal de propiedades
- **`Usuario`**: Modelo de usuarios/agentes
- **`Consulta`**: Modelo para contactos/consultas
- **`MensajeChatbot`**: Modelo para interacciones del bot

## 🗄️ Base de Datos

### Tablas Principales

- **`propiedades`**: Información de propiedades
- **`usuarios`**: Agentes y administradores
- **`caracteristicas_propiedad`**: Features de cada propiedad
- **`imagenes_propiedad`**: Galería de imágenes
- **`favoritos`**: Propiedades favoritas por usuario
- **`consultas`**: Contactos y consultas
- **`conversaciones_chatbot`**: Historial del chatbot

## 🤖 Chatbot

El chatbot incluye:

- **Detección de intenciones** basada en patrones
- **Respuestas contextuales** según el tipo de consulta
- **Sugerencias automáticas** de seguimiento
- **Métricas de uso** para análisis

### Intenciones Soportadas

- Saludo y presentación
- Consultas sobre propiedades
- Información de precios
- Alquileres y ventas
- Ubicaciones disponibles
- Datos de contacto
- Horarios de atención
- Servicios ofrecidos

## 📱 Características del Frontend

### Páginas Principales

1. **Home (`/`)**: Hero, búsqueda rápida, propiedades destacadas
2. **Catálogo (`/propiedades`)**: Listado con filtros avanzados
3. **Detalle (`/propiedades/[id]`)**: Info completa + contacto
4. **Nosotros (`/nosotros`)**: Historia y equipo
5. **Servicios (`/servicios`)**: Servicios ofrecidos
6. **Contacto (`/contacto`)**: Formulario y datos

### Funcionalidades

- **Búsqueda avanzada** con múltiples filtros
- **Sistema de favoritos** (localStorage)
- **Compartir propiedades** via Web Share API
- **Calculadora de crédito** básica
- **Chatbot flotante** siempre disponible
- **Responsive design** mobile-first

## 🚀 Despliegue en Producción

### Con Docker

```bash
# Clonar y configurar
git clone https://github.com/tu-usuario/inmomax.git
cd inmomax

# Variables de producción
cp .env.example .env
# Editar variables de producción

# Desplegar con nginx
docker-compose --profile production up -d
```

### Variables Importantes para Producción

```env
ENVIRONMENT=production
DATABASE_URL=postgresql://user:password@db:5432/inmomax_db
SECRET_KEY=clave_super_segura_de_32_caracteres_min
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

## 🔒 Seguridad

- **Validación de datos** con Pydantic
- **Sanitización de inputs** en frontend y backend
- **Rate limiting** en endpoints críticos
- **CORS configurado** correctamente
- **Headers de seguridad** en Nginx
- **Passwords hasheados** con bcrypt

## 🧪 Testing

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm run test
```

## 📈 Monitoreo y Analytics

- **Métricas de propiedades**: vistas, consultas, favoritos
- **Analytics del chatbot**: intenciones, satisfacción
- **Logs estructurados** con timestamps
- **Health checks** para servicios

## 🤝 Contribuciones

1. Fork del repositorio
2. Crear feature branch: `git checkout -b feature/nueva-funcionalidad`
3. Commit changes: `git commit -am 'Agregar nueva funcionalidad'`
4. Push branch: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte
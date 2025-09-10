-- Crear base de datos
-- CREATE DATABASE inmomax_db;

-- Usar la base de datos
-- \c inmomax_db;

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Tabla de usuarios/agentes
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) DEFAULT 'cliente' CHECK (tipo IN ('cliente', 'agente', 'admin')),
    avatar TEXT,
    activo BOOLEAN DEFAULT true,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de propiedades
CREATE TABLE propiedades (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(12,2) NOT NULL CHECK (precio > 0),
    ubicacion VARCHAR(200) NOT NULL,
    direccion VARCHAR(300),
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('casa', 'departamento', 'local', 'terreno', 'oficina', 'quinta')),
    operacion VARCHAR(20) NOT NULL CHECK (operacion IN ('venta', 'alquiler', 'alquiler-temporal')),
    habitaciones INTEGER DEFAULT 0 CHECK (habitaciones >= 0),
    banos INTEGER DEFAULT 0 CHECK (banos >= 0),
    metros DECIMAL(8,2) NOT NULL CHECK (metros > 0),
    metros_terreno DECIMAL(8,2) CHECK (metros_terreno > 0),
    antiguedad INTEGER CHECK (antiguedad >= 0),
    expensas DECIMAL(10,2) CHECK (expensas >= 0),
    estado VARCHAR(20) DEFAULT 'disponible' CHECK (estado IN ('disponible', 'reservada', 'vendida', 'alquilada', 'inactiva')),
    destacada BOOLEAN DEFAULT false,
    coordenadas POINT, -- Para PostGIS
    agente_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vistas INTEGER DEFAULT 0
);

-- Tabla de características de propiedades
CREATE TABLE caracteristicas_propiedad (
    id SERIAL PRIMARY KEY,
    propiedad_id INTEGER REFERENCES propiedades(id) ON DELETE CASCADE,
    caracteristica TEXT NOT NULL
);

-- Tabla de servicios de propiedades
CREATE TABLE servicios_propiedad (
    id SERIAL PRIMARY KEY,
    propiedad_id INTEGER REFERENCES propiedades(id) ON DELETE CASCADE,
    servicio VARCHAR(100) NOT NULL
);

-- Tabla de imágenes de propiedades
CREATE TABLE imagenes_propiedad (
    id SERIAL PRIMARY KEY,
    propiedad_id INTEGER REFERENCES propiedades(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    orden INTEGER DEFAULT 0,
    descripcion VARCHAR(200)
);

-- Tabla de favoritos
CREATE TABLE favoritos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    propiedad_id INTEGER REFERENCES propiedades(id) ON DELETE CASCADE,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, propiedad_id)
);

-- Tabla de consultas/contactos
CREATE TABLE consultas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    mensaje TEXT NOT NULL,
    propiedad_id INTEGER REFERENCES propiedades(id) ON DELETE SET NULL,
    tipo_consulta VARCHAR(20) DEFAULT 'general' CHECK (tipo_consulta IN ('general', 'propiedad', 'visita', 'financiacion')),
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'respondida', 'cerrada')),
    agente_asignado_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha_consulta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta TIMESTAMP
);

-- Tabla de visitas programadas
CREATE TABLE visitas (
    id SERIAL PRIMARY KEY,
    propiedad_id INTEGER REFERENCES propiedades(id) ON DELETE CASCADE,
    cliente_nombre VARCHAR(100) NOT NULL,
    cliente_email VARCHAR(150) NOT NULL,
    cliente_telefono VARCHAR(20),
    fecha_visita TIMESTAMP NOT NULL,
    estado VARCHAR(20) DEFAULT 'programada' CHECK (estado IN ('programada', 'realizada', 'cancelada', 'reprogramada')),
    agente_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    notas TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de métricas/analytics
CREATE TABLE metricas_propiedades (
    id SERIAL PRIMARY KEY,
    propiedad_id INTEGER REFERENCES propiedades(id) ON DELETE CASCADE,
    fecha DATE DEFAULT CURRENT_DATE,
    vistas_diarias INTEGER DEFAULT 0,
    consultas_diarias INTEGER DEFAULT 0,
    favoritos_diarios INTEGER DEFAULT 0,
    compartidas_diarias INTEGER DEFAULT 0,
    UNIQUE(propiedad_id, fecha)
);

-- Tabla de conversaciones del chatbot
CREATE TABLE conversaciones_chatbot (
    id SERIAL PRIMARY KEY,
    usuario_id VARCHAR(100), -- ID temporal o de sesión
    mensaje_usuario TEXT NOT NULL,
    respuesta_bot TEXT NOT NULL,
    intencion_detectada VARCHAR(50),
    confianza DECIMAL(3,2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    satisfaccion INTEGER CHECK (satisfaccion BETWEEN 1 AND 5)
);

-- Tabla de configuración del sistema
CREATE TABLE configuracion (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    descripcion TEXT,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX idx_propiedades_tipo_operacion ON propiedades(tipo, operacion);
CREATE INDEX idx_propiedades_precio ON propiedades(precio);
CREATE INDEX idx_propiedades_ubicacion ON propiedades USING gin(to_tsvector('spanish', ubicacion));
CREATE INDEX idx_propiedades_estado ON propiedades(estado);
CREATE INDEX idx_propiedades_destacada ON propiedades(destacada) WHERE destacada = true;
CREATE INDEX idx_propiedades_fecha_publicacion ON propiedades(fecha_publicacion DESC);
CREATE INDEX idx_propiedades_coordenadas ON propiedades USING GIST(coordenadas);

CREATE INDEX idx_favoritos_usuario ON favoritos(usuario_id);
CREATE INDEX idx_consultas_estado ON consultas(estado);
CREATE INDEX idx_visitas_fecha ON visitas(fecha_visita);
CREATE INDEX idx_metricas_fecha ON metricas_propiedades(fecha DESC);

-- Triggers para actualizar fecha_actualizacion
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$ language 'plpgsql';

CREATE TRIGGER trigger_propiedades_fecha_actualizacion
    BEFORE UPDATE ON propiedades
    FOR EACH ROW
    EXECUTE PROCEDURE actualizar_fecha_modificacion();

CREATE TRIGGER trigger_usuarios_fecha_actualizacion
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE PROCEDURE actualizar_fecha_modificacion();

-- Función para incrementar vistas
CREATE OR REPLACE FUNCTION incrementar_vistas(propiedad_id_param INTEGER)
RETURNS VOID AS $
BEGIN
    UPDATE propiedades 
    SET vistas = vistas + 1 
    WHERE id = propiedad_id_param;
    
    -- Actualizar métricas diarias
    INSERT INTO metricas_propiedades (propiedad_id, vistas_diarias) 
    VALUES (propiedad_id_param, 1)
    ON CONFLICT (propiedad_id, fecha) 
    DO UPDATE SET vistas_diarias = metricas_propiedades.vistas_diarias + 1;
END;
$ LANGUAGE plpgsql;

-- Función para búsqueda full-text
CREATE OR REPLACE FUNCTION buscar_propiedades(termino TEXT)
RETURNS TABLE(
    id INTEGER,
    titulo VARCHAR(200),
    descripcion TEXT,
    precio DECIMAL(12,2),
    ubicacion VARCHAR(200),
    tipo VARCHAR(20),
    operacion VARCHAR(20),
    ranking REAL
) AS $
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.titulo,
        p.descripcion,
        p.precio,
        p.ubicacion,
        p.tipo,
        p.operacion,
        ts_rank(
            to_tsvector('spanish', p.titulo || ' ' || p.descripcion || ' ' || p.ubicacion),
            plainto_tsquery('spanish', termino)
        ) as ranking
    FROM propiedades p
    WHERE p.estado = 'disponible'
    AND to_tsvector('spanish', p.titulo || ' ' || p.descripcion || ' ' || p.ubicacion) 
        @@ plainto_tsquery('spanish', termino)
    ORDER BY ranking DESC;
END;
$ LANGUAGE plpgsql;

-- Vista para propiedades con información completa
CREATE VIEW vista_propiedades_completas AS
SELECT 
    p.*,
    u.nombre as agente_nombre,
    u.email as agente_email,
    u.telefono as agente_telefono,
    u.avatar as agente_avatar,
    COALESCE(array_agg(DISTINCT cp.caracteristica) FILTER (WHERE cp.caracteristica IS NOT NULL), '{}') as caracteristicas,
    COALESCE(array_agg(DISTINCT sp.servicio) FILTER (WHERE sp.servicio IS NOT NULL), '{}') as servicios,
    COALESCE(array_agg(DISTINCT ip.url ORDER BY ip.orden) FILTER (WHERE ip.url IS NOT NULL), '{}') as imagenes
FROM propiedades p
LEFT JOIN usuarios u ON p.agente_id = u.id
LEFT JOIN caracteristicas_propiedad cp ON p.id = cp.propiedad_id
LEFT JOIN servicios_propiedad sp ON p.id = sp.propiedad_id
LEFT JOIN imagenes_propiedad ip ON p.id = ip.propiedad_id
GROUP BY p.id, u.id;

-- Insertar datos de configuración inicial
INSERT INTO configuracion (clave, valor, descripcion) VALUES
('empresa_nombre', 'InmoMax', 'Nombre de la empresa'),
('empresa_telefono', '+54 341 123-4567', 'Teléfono principal'),
('empresa_email', 'info@inmomax.com', 'Email principal'),
('empresa_direccion', 'Córdoba 1234, Rosario, Santa Fe', 'Dirección física'),
('empresa_horarios', 'L-V: 9:00-18:00, S: 9:00-13:00', 'Horarios de atención'),
('chatbot_activado', 'true', 'Estado del chatbot'),
('destacadas_max', '6', 'Máximo de propiedades destacadas en home'),
('precio_tasacion', '15000', 'Precio base de tasación');

-- Insertar usuario administrador inicial (password: admin123)
INSERT INTO usuarios (nombre, email, telefono, password_hash, tipo, activo) VALUES
('Administrador', 'admin@inmomax.com', '+54 341 123-4567', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewfBNdnkhMhOF7u2', 'admin', true);

-- Insertar agente de ejemplo
INSERT INTO usuarios (nombre, email, telefono, password_hash, tipo, activo) VALUES
('María González', 'maria@inmomax.com', '+54 341 123-4567', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewfBNdnkhMhOF7u2', 'agente', true);

-- Insertar propiedades de ejemplo
INSERT INTO propiedades (titulo, descripcion, precio, ubicacion, direccion, tipo, operacion, habitaciones, banos, metros, metros_terreno, antiguedad, expensas, destacada, coordenadas, agente_id) VALUES
(
    'Casa moderna en Las Lomas',
    'Hermosa casa moderna ubicada en el prestigioso barrio de Las Lomas. La propiedad cuenta con amplios espacios, excelente luminosidad y un diseño contemporáneo que combina funcionalidad y estética.',
    350000.00,
    'Las Lomas, Rosario',
    'Av. Las Lomas 1234',
    'casa',
    'venta',
    3,
    2,
    120.00,
    200.00,
    5,
    NULL,
    true,
    POINT(-60.6505, -32.9442),
    2
),
(
    'Departamento céntrico con balcón',
    'Excelente departamento de 2 ambientes en pleno centro de Rosario. Ubicado en un edificio con portero las 24 horas, cuenta con todas las comodidades.',
    180000.00,
    'Centro, Rosario',
    'San Martín 856, Piso 4°',
    'departamento',
    'venta',
    2,
    1,
    65.00,
    NULL,
    15,
    12000.00,
    true,
    POINT(-60.6385, -32.9520),
    2
),
(
    'Casa en Fisherton con jardín',
    'Acogedora casa familiar en el tranquilo barrio de Fisherton. Perfecta para familias que buscan tranquilidad sin alejarse de la ciudad.',
    45000.00,
    'Fisherton, Rosario',
    'Los Álamos 789',
    'casa',
    'alquiler',
    3,
    2,
    110.00,
    180.00,
    20,
    NULL,
    false,
    POINT(-60.6650, -32.9380),
    2
);

-- Insertar características de las propiedades
INSERT INTO caracteristicas_propiedad (propiedad_id, caracteristica) VALUES
(1, 'Cocina integrada con mesada de granito'),
(1, 'Living comedor con ventanal al jardín'),
(1, 'Suite principal con vestidor'),
(1, 'Parrilla cubierta'),
(1, 'Cochera para 2 autos'),
(1, 'Sistema de alarma'),
(2, 'Balcón con vista a la ciudad'),
(2, 'Cocina separada'),
(2, 'Portero 24 horas'),
(3, 'Jardín delantero y trasero'),
(3, 'Cochera cubierta'),
(3, 'Parrilla');

-- Insertar servicios
INSERT INTO servicios_propiedad (propiedad_id, servicio) VALUES
(1, 'Gas natural'),
(1, 'Agua corriente'),
(1, 'Cloacas'),
(1, 'Electricidad'),
(1, 'Internet fibra óptica'),
(2, 'Gas natural'),
(2, 'Agua corriente'),
(2, 'Electricidad'),
(3, 'Gas natural'),
(3, 'Agua corriente'),
(3, 'Electricidad');

-- Insertar imágenes de ejemplo
INSERT INTO imagenes_propiedad (propiedad_id, url, orden, descripcion) VALUES
(1, '/images/casa1-1.jpg', 1, 'Frente de la propiedad'),
(1, '/images/casa1-2.jpg', 2, 'Living principal'),
(1, '/images/casa1-3.jpg', 3, 'Cocina integrada'),
(2, '/images/depto1-1.jpg', 1, 'Vista del balcón'),
(2, '/images/depto1-2.jpg', 2, 'Dormitorio principal'),
(3, '/images/casa2-1.jpg', 1, 'Frente con jardín'),
(3, '/images/casa2-2.jpg', 2, 'Patio trasero');

-- Comentarios útiles para el desarrollo
/*
-- Para conectarse a la base de datos:
psql -h localhost -U postgres -d inmomax_db

-- Para hacer backup:
pg_dump -h localhost -U postgres inmomax_db > backup.sql

-- Para restaurar backup:
psql -h localhost -U postgres -d inmomax_db < backup.sql

-- Consultas útiles para desarrollo:

-- Ver todas las propiedades con agente
SELECT p.titulo, p.precio, u.nombre as agente 
FROM propiedades p 
JOIN usuarios u ON p.agente_id = u.id;

-- Buscar propiedades por texto
SELECT * FROM buscar_propiedades('casa rosario');

-- Ver propiedades más vistas
SELECT titulo, vistas FROM propiedades ORDER BY vistas DESC LIMIT 10;

-- Ver estadísticas por tipo
SELECT tipo, COUNT(*) as cantidad, AVG(precio) as precio_promedio 
FROM propiedades 
WHERE estado = 'disponible' 
GROUP BY tipo;
*/
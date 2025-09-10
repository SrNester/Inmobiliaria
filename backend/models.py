from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum

class TipoPropiedad(str, Enum):
    CASA = "casa"
    DEPARTAMENTO = "departamento"
    LOCAL = "local"
    TERRENO = "terreno"
    OFICINA = "oficina"
    QUINTA = "quinta"

class TipoOperacion(str, Enum):
    VENTA = "venta"
    ALQUILER = "alquiler"
    ALQUILER_TEMPORAL = "alquiler-temporal"

class EstadoPropiedad(str, Enum):
    DISPONIBLE = "disponible"
    RESERVADA = "reservada"
    VENDIDA = "vendida"
    ALQUILADA = "alquilada"

# Modelo para coordenadas geográficas
class Coordenadas(BaseModel):
    lat: float = Field(..., ge=-90, le=90, description="Latitud")
    lng: float = Field(..., ge=-180, le=180, description="Longitud")

# Modelo para el agente inmobiliario
class Agente(BaseModel):
    id: int
    nombre: str
    email: str
    telefono: str
    avatar: Optional[str] = None

# Modelo base para propiedades
class PropiedadBase(BaseModel):
    titulo: str = Field(..., min_length=10, max_length=200)
    descripcion: str = Field(..., min_length=50, max_length=2000)
    precio: float = Field(..., gt=0)
    ubicacion: str = Field(..., min_length=5, max_length=200)
    direccion: Optional[str] = Field(None, max_length=300)
    tipo: TipoPropiedad
    operacion: TipoOperacion
    habitaciones: int = Field(..., ge=0, le=20)
    banos: int = Field(..., ge=0, le=10)
    metros: float = Field(..., gt=0, le=10000)
    metros_terreno: Optional[float] = Field(None, gt=0, le=50000)
    antiguedad: Optional[int] = Field(None, ge=0, le=200)
    expensas: Optional[float] = Field(None, ge=0)

    @validator('precio')
    def validar_precio(cls, v):
        if v <= 0:
            raise ValueError('El precio debe ser mayor a 0')
        return v

    @validator('metros')
    def validar_metros(cls, v):
        if v <= 0:
            raise ValueError('Los metros cuadrados deben ser mayor a 0')
        return v

# Modelo para crear propiedades
class PropiedadCreate(PropiedadBase):
    caracteristicas: List[str] = []
    servicios: List[str] = []
    imagenes: List[str] = []
    coordenadas: Optional[Coordenadas] = None
    agente_id: int

# Modelo completo de propiedad (respuesta)
class Propiedad(PropiedadBase):
    id: int
    caracteristicas: List[str] = []
    servicios: List[str] = []
    imagenes: List[str] = []
    coordenadas: Optional[Coordenadas] = None
    estado: EstadoPropiedad = EstadoPropiedad.DISPONIBLE
    destacada: bool = False
    fecha_publicacion: datetime
    fecha_actualizacion: Optional[datetime] = None
    agente: Agente
    vistas: int = 0

    class Config:
        from_attributes = True

# Modelo para filtros de búsqueda
class FiltrosPropiedad(BaseModel):
    tipo: Optional[TipoPropiedad] = None
    operacion: Optional[TipoOperacion] = None
    ubicacion: Optional[str] = None
    precio_min: Optional[float] = Field(None, ge=0)
    precio_max: Optional[float] = Field(None, ge=0)
    habitaciones: Optional[int] = Field(None, ge=0)
    banos: Optional[int] = Field(None, ge=0)
    metros_min: Optional[float] = Field(None, ge=0)
    metros_max: Optional[float] = Field(None, ge=0)
    featured: Optional[bool] = None
    pagina: int = Field(1, ge=1)
    limite: int = Field(10, ge=1, le=100)
    orden: str = Field("recientes", regex="^(recientes|precio-asc|precio-desc|metros-desc)$")

# Modelo de respuesta para listado
class PropiedadListResponse(BaseModel):
    propiedades: List[Propiedad]
    total: int
    pagina: int
    limite: int
    total_paginas: int

# Modelo para el chatbot
class MensajeChatbot(BaseModel):
    mensaje: str = Field(..., min_length=1, max_length=500)
    usuario_id: Optional[str] = None
    contexto: Optional[dict] = {}

class RespuestaChatbot(BaseModel):
    respuesta: str
    timestamp: datetime
    confianza: Optional[float] = None
    sugerencias: Optional[List[str]] = []

# Modelo para contacto/consulta
class Consulta(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., regex=r'^[^@]+@[^@]+\.[^@]+$')
    telefono: Optional[str] = Field(None, regex=r'^\+?[\d\s-()]+$')
    mensaje: str = Field(..., min_length=10, max_length=1000)
    propiedad_id: Optional[int] = None
    tipo_consulta: str = Field("general", regex="^(general|propiedad|visita|financiacion)$")

class ConsultaResponse(BaseModel):
    id: int
    mensaje: str
    fecha: datetime

# Modelo para estadísticas
class EstadisticasPropiedad(BaseModel):
    total_propiedades: int
    por_tipo: dict
    por_operacion: dict
    precio_promedio: float
    propiedades_destacadas: int

# Modelo de usuario (para futuras implementaciones)
class Usuario(BaseModel):
    id: int
    nombre: str
    email: str
    telefono: Optional[str] = None
    tipo: str = Field("cliente", regex="^(cliente|agente|admin)$")
    fecha_registro: datetime
    activo: bool = True

# Modelos para autenticación (futuro)
class UsuarioLogin(BaseModel):
    email: str
    password: str

class UsuarioCreate(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., regex=r'^[^@]+@[^@]+\.[^@]+$')
    password: str = Field(..., min_length=6)
    telefono: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

# Modelo para métricas y análisis
class MetricasPropiedad(BaseModel):
    propiedad_id: int
    vistas: int
    consultas: int
    favoritos: int
    compartidas: int
    fecha_ultima_vista: Optional[datetime] = None
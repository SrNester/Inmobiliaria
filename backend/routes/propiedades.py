from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional, List
from datetime import datetime
import math

from models import (
    Propiedad, PropiedadCreate, PropiedadListResponse, 
    FiltrosPropiedad, TipoPropiedad, TipoOperacion, 
    Agente, Coordenadas, EstadisticasPropiedad
)

router = APIRouter()

# Mock data - En producción esto vendría de la base de datos
mock_agente = Agente(
    id=1,
    nombre="María González",
    email="maria@inmomax.com",
    telefono="+54 341 123-4567",
    avatar="/images/agente1.jpg"
)

mock_propiedades = [
    {
        "id": 1,
        "titulo": "Casa moderna en Las Lomas",
        "descripcion": "Hermosa casa moderna ubicada en el prestigioso barrio de Las Lomas. La propiedad cuenta con amplios espacios, excelente luminosidad y un diseño contemporáneo que combina funcionalidad y estética. El jardín ofrece un espacio ideal para el disfrute familiar.",
        "precio": 350000.0,
        "ubicacion": "Las Lomas, Rosario",
        "direccion": "Av. Las Lomas 1234",
        "tipo": TipoPropiedad.CASA,
        "operacion": TipoOperacion.VENTA,
        "habitaciones": 3,
        "banos": 2,
        "metros": 120.0,
        "metros_terreno": 200.0,
        "antiguedad": 5,
        "expensas": None,
        "caracteristicas": [
            "Cocina integrada con mesada de granito",
            "Living comedor con ventanal al jardín",
            "Suite principal con vestidor",
            "Parrilla cubierta",
            "Cochera para 2 autos",
            "Sistema de alarma",
            "Portón automatizado",
            "Piscina climatizada"
        ],
        "servicios": [
            "Gas natural", "Agua corriente", "Cloacas", 
            "Electricidad", "Internet fibra óptica", "Cable"
        ],
        "imagenes": [
            "/images/casa1-1.jpg", "/images/casa1-2.jpg",
            "/images/casa1-3.jpg", "/images/casa1-4.jpg"
        ],
        "coordenadas": {"lat": -32.9442, "lng": -60.6505},
        "estado": "disponible",
        "destacada": True,
        "fecha_publicacion": datetime.now(),
        "agente": mock_agente,
        "vistas": 145
    },
    {
        "id": 2,
        "titulo": "Departamento céntrico con balcón",
        "descripcion": "Excelente departamento de 2 ambientes en pleno centro de Rosario. Ubicado en un edificio con portero las 24 horas, cuenta con todas las comodidades para una vida urbana plena. A pasos de comercios, bancos y transporte público.",
        "precio": 180000.0,
        "ubicacion": "Centro, Rosario",
        "direccion": "San Martín 856, Piso 4°",
        "tipo": TipoPropiedad.DEPARTAMENTO,
        "operacion": TipoOperacion.VENTA,
        "habitaciones": 2,
        "banos": 1,
        "metros": 65.0,
        "metros_terreno": None,
        "antiguedad": 15,
        "expensas": 12000.0,
        "caracteristicas": [
            "Balcón con vista a la ciudad",
            "Cocina separada",
            "Dormitorio principal con placard",
            "Baño completo con ducha",
            "Living comedor integrado",
            "Portero 24 horas"
        ],
        "servicios": [
            "Gas natural", "Agua corriente", "Cloacas",
            "Electricidad", "Internet", "Cable"
        ],
        "imagenes": [
            "/images/depto1-1.jpg", "/images/depto1-2.jpg",
            "/images/depto1-3.jpg"
        ],
        "coordenadas": {"lat": -32.9520, "lng": -60.6385},
        "estado": "disponible",
        "destacada": True,
        "fecha_publicacion": datetime.now(),
        "agente": mock_agente,
        "vistas": 89
    },
    {
        "id": 3,
        "titulo": "Casa en Fisherton con jardín",
        "descripcion": "Acogedora casa familiar en el tranquilo barrio de Fisherton. Perfecta para familias que buscan tranquilidad sin alejarse de la ciudad. Cuenta con amplio jardín, ideal para niños y mascotas.",
        "precio": 45000.0,
        "ubicacion": "Fisherton, Rosario",
        "direccion": "Los Álamos 789",
        "tipo": TipoPropiedad.CASA,
        "operacion": TipoOperacion.ALQUILER,
        "habitaciones": 3,
        "banos": 2,
        "metros": 110.0,
        "metros_terreno": 180.0,
        "antiguedad": 20,
        "expensas": None,
        "caracteristicas": [
            "Jardín delantero y trasero",
            "Cochera cubierta",
            "Parrilla",
            "Lavadero independiente",
            "3 dormitorios con placards",
            "Baño principal y toilette"
        ],
        "servicios": [
            "Gas natural", "Agua corriente", "Cloacas",
            "Electricidad"
        ],
        "imagenes": [
            "/images/casa2-1.jpg", "/images/casa2-2.jpg"
        ],
        "coordenadas": {"lat": -32.9380, "lng": -60.6650},
        "estado": "disponible",
        "destacada": False,
        "fecha_publicacion": datetime.now(),
        "agente": mock_agente,
        "vistas": 67
    },
    {
        "id": 4,
        "titulo": "Local comercial sobre avenida",
        "descripcion": "Excelente local comercial ubicado sobre avenida Pellegrini, una de las arterias más importantes de Rosario. Ideal para cualquier tipo de comercio con alta visibilidad y flujo peatonal constante.",
        "precio": 280000.0,
        "ubicacion": "Pellegrini, Rosario",
        "direccion": "Av. Pellegrini 2456",
        "tipo": TipoPropiedad.LOCAL,
        "operacion": TipoOperacion.VENTA,
        "habitaciones": 0,
        "banos": 1,
        "metros": 80.0,
        "metros_terreno": None,
        "antiguedad": 10,
        "expensas": 8000.0,
        "caracteristicas": [
            "Frente sobre avenida principal",
            "Vidriera de 4 metros",
            "Depósito en subsuelo",
            "Baño para empleados",
            "Instalación eléctrica trifásica",
            "Aire acondicionado"
        ],
        "servicios": [
            "Gas natural", "Agua corriente", "Cloacas",
            "Electricidad", "Internet"
        ],
        "imagenes": [
            "/images/local1-1.jpg", "/images/local1-2.jpg"
        ],
        "coordenadas": {"lat": -32.9510, "lng": -60.6420},
        "estado": "disponible",
        "destacada": True,
        "fecha_publicacion": datetime.now(),
        "agente": mock_agente,
        "vistas": 203
    },
    {
        "id": 5,
        "titulo": "Departamento nuevo en Pichincha",
        "descripcion": "Monoambiente a estrenar en el barrio Pichincha. Ideal para estudiantes o profesionales jóvenes. Edificio con todas las comodidades modernas y excelente conectividad con el centro.",
        "precio": 32000.0,
        "ubicacion": "Pichincha, Rosario",
        "direccion": "Tucumán 1567, Piso 2°",
        "tipo": TipoPropiedad.DEPARTAMENTO,
        "operacion": TipoOperacion.ALQUILER,
        "habitaciones": 1,
        "banos": 1,
        "metros": 45.0,
        "metros_terreno": None,
        "antiguedad": 0,
        "expensas": 8500.0,
        "caracteristicas": [
            "A estrenar",
            "Cocina integrada",
            "Baño completo",
            "Balcón",
            "Placard empotrado",
            "Ventanas DVH"
        ],
        "servicios": [
            "Gas natural", "Agua corriente", "Cloacas",
            "Electricidad", "Internet fibra óptica"
        ],
        "imagenes": [
            "/images/depto2-1.jpg", "/images/depto2-2.jpg"
        ],
        "coordenadas": {"lat": -32.9480, "lng": -60.6450},
        "estado": "disponible",
        "destacada": False,
        "fecha_publicacion": datetime.now(),
        "agente": mock_agente,
        "vistas": 34
    },
    {
        "id": 6,
        "titulo": "Casa quinta en Funes",
        "descripcion": "Espectacular casa quinta ubicada en Funes, ideal para quienes buscan tranquilidad y contacto con la naturaleza sin alejarse demasiado de la ciudad. Amplio parque con piscina y quincho para disfrutar en familia.",
        "precio": 420000.0,
        "ubicacion": "Funes, Santa Fe",
        "direccion": "Los Robles 345",
        "tipo": TipoPropiedad.QUINTA,
        "operacion": TipoOperacion.VENTA,
        "habitaciones": 4,
        "banos": 3,
        "metros": 180.0,
        "metros_terreno": 800.0,
        "antiguedad": 8,
        "expensas": None,
        "caracteristicas": [
            "Piscina climatizada",
            "Quincho con parrilla",
            "Cancha de tenis",
            "Casa de huéspedes",
            "Cochera para 3 autos",
            "Sistema de riego automático",
            "Alarma perimetral",
            "Parque con árboles frutales"
        ],
        "servicios": [
            "Agua corriente", "Electricidad", "Gas envasado",
            "Internet satelital", "Cloacas"
        ],
        "imagenes": [
            "/images/quinta1-1.jpg", "/images/quinta1-2.jpg",
            "/images/quinta1-3.jpg", "/images/quinta1-4.jpg"
        ],
        "coordenadas": {"lat": -32.9150, "lng": -60.8200},
        "estado": "disponible",
        "destacada": True,
        "fecha_publicacion": datetime.now(),
        "agente": mock_agente,
        "vistas": 178
    }
]

def filtrar_propiedades(propiedades: List[dict], filtros: FiltrosPropiedad) -> List[dict]:
    """Aplica filtros a la lista de propiedades"""
    resultado = propiedades.copy()
    
    if filtros.tipo:
        resultado = [p for p in resultado if p["tipo"] == filtros.tipo]
    
    if filtros.operacion:
        resultado = [p for p in resultado if p["operacion"] == filtros.operacion]
    
    if filtros.ubicacion:
        resultado = [p for p in resultado if filtros.ubicacion.lower() in p["ubicacion"].lower()]
    
    if filtros.precio_min:
        resultado = [p for p in resultado if p["precio"] >= filtros.precio_min]
    
    if filtros.precio_max:
        resultado = [p for p in resultado if p["precio"] <= filtros.precio_max]
    
    if filtros.habitaciones:
        resultado = [p for p in resultado if p["habitaciones"] >= filtros.habitaciones]
    
    if filtros.banos:
        resultado = [p for p in resultado if p["banos"] >= filtros.banos]
    
    if filtros.metros_min:
        resultado = [p for p in resultado if p["metros"] >= filtros.metros_min]
    
    if filtros.metros_max:
        resultado = [p for p in resultado if p["metros"] <= filtros.metros_max]
    
    if filtros.featured is not None:
        resultado = [p for p in resultado if p["destacada"] == filtros.featured]
    
    return resultado

def ordenar_propiedades(propiedades: List[dict], orden: str) -> List[dict]:
    """Ordena las propiedades según el criterio especificado"""
    if orden == "precio-asc":
        return sorted(propiedades, key=lambda x: x["precio"])
    elif orden == "precio-desc":
        return sorted(propiedades, key=lambda x: x["precio"], reverse=True)
    elif orden == "metros-desc":
        return sorted(propiedades, key=lambda x: x["metros"], reverse=True)
    else:  # recientes (default)
        return sorted(propiedades, key=lambda x: x["fecha_publicacion"], reverse=True)

@router.get("/", response_model=PropiedadListResponse)
async def listar_propiedades(
    tipo: Optional[TipoPropiedad] = Query(None, description="Tipo de propiedad"),
    operacion: Optional[TipoOperacion] = Query(None, description="Tipo de operación"),
    ubicacion: Optional[str] = Query(None, description="Ubicación o barrio"),
    precio_min: Optional[float] = Query(None, ge=0, description="Precio mínimo"),
    precio_max: Optional[float] = Query(None, ge=0, description="Precio máximo"),
    habitaciones: Optional[int] = Query(None, ge=0, description="Número mínimo de habitaciones"),
    banos: Optional[int] = Query(None, ge=0, description="Número mínimo de baños"),
    metros_min: Optional[float] = Query(None, ge=0, description="Superficie mínima"),
    metros_max: Optional[float] = Query(None, ge=0, description="Superficie máxima"),
    featured: Optional[bool] = Query(None, description="Solo propiedades destacadas"),
    pagina: int = Query(1, ge=1, description="Número de página"),
    limite: int = Query(10, ge=1, le=100, description="Elementos por página"),
    orden: str = Query("recientes", regex="^(recientes|precio-asc|precio-desc|metros-desc)$", description="Criterio de ordenamiento")
):
    """
    Obtiene la lista de propiedades con filtros opcionales
    """
    # Crear objeto de filtros
    filtros = FiltrosPropiedad(
        tipo=tipo,
        operacion=operacion,
        ubicacion=ubicacion,
        precio_min=precio_min,
        precio_max=precio_max,
        habitaciones=habitaciones,
        banos=banos,
        metros_min=metros_min,
        metros_max=metros_max,
        featured=featured,
        pagina=pagina,
        limite=limite,
        orden=orden
    )
    
    # Aplicar filtros
    propiedades_filtradas = filtrar_propiedades(mock_propiedades, filtros)
    
    # Ordenar
    propiedades_ordenadas = ordenar_propiedades(propiedades_filtradas, orden)
    
    # Paginación
    total = len(propiedades_ordenadas)
    inicio = (pagina - 1) * limite
    fin = inicio + limite
    propiedades_pagina = propiedades_ordenadas[inicio:fin]
    
    # Convertir a objetos Propiedad
    propiedades_response = []
    for prop_data in propiedades_pagina:
        prop_data_copy = prop_data.copy()
        prop_data_copy["coordenadas"] = Coordenadas(**prop_data_copy["coordenadas"]) if prop_data_copy["coordenadas"] else None
        propiedades_response.append(Propiedad(**prop_data_copy))
    
    return PropiedadListResponse(
        propiedades=propiedades_response,
        total=total,
        pagina=pagina,
        limite=limite,
        total_paginas=math.ceil(total / limite) if total > 0 else 0
    )

@router.get("/{propiedad_id}", response_model=Propiedad)
async def obtener_propiedad(propiedad_id: int):
    """
    Obtiene los detalles de una propiedad específica por ID
    """
    # Buscar la propiedad
    propiedad_data = next((p for p in mock_propiedades if p["id"] == propiedad_id), None)
    
    if not propiedad_data:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    
    # Incrementar contador de vistas (en producción esto se haría en DB)
    propiedad_data["vistas"] += 1
    
    # Convertir coordenadas si existen
    propiedad_data_copy = propiedad_data.copy()
    if propiedad_data_copy["coordenadas"]:
        propiedad_data_copy["coordenadas"] = Coordenadas(**propiedad_data_copy["coordenadas"])
    
    return Propiedad(**propiedad_data_copy)

@router.post("/", response_model=Propiedad)
async def crear_propiedad(propiedad: PropiedadCreate):
    """
    Crea una nueva propiedad (requiere autenticación de agente)
    """
    # En producción: verificar autenticación y permisos
    
    nuevo_id = max([p["id"] for p in mock_propiedades]) + 1
    
    nueva_propiedad = {
        "id": nuevo_id,
        **propiedad.dict(exclude={"agente_id"}),
        "estado": "disponible",
        "destacada": False,
        "fecha_publicacion": datetime.now(),
        "agente": mock_agente,
        "vistas": 0
    }
    
    mock_propiedades.append(nueva_propiedad)
    
    # Convertir coordenadas si existen
    if nueva_propiedad["coordenadas"]:
        nueva_propiedad["coordenadas"] = Coordenadas(**nueva_propiedad["coordenadas"])
    
    return Propiedad(**nueva_propiedad)

@router.put("/{propiedad_id}", response_model=Propiedad)
async def actualizar_propiedad(propiedad_id: int, propiedad_actualizada: PropiedadCreate):
    """
    Actualiza una propiedad existente
    """
    # Buscar la propiedad
    propiedad_index = next((i for i, p in enumerate(mock_propiedades) if p["id"] == propiedad_id), None)
    
    if propiedad_index is None:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    
    # Actualizar datos
    propiedad_data = mock_propiedades[propiedad_index]
    propiedad_data.update({
        **propiedad_actualizada.dict(exclude={"agente_id"}),
        "fecha_actualizacion": datetime.now()
    })
    
    # Convertir coordenadas si existen
    if propiedad_data["coordenadas"]:
        propiedad_data["coordenadas"] = Coordenadas(**propiedad_data["coordenadas"])
    
    return Propiedad(**propiedad_data)

@router.delete("/{propiedad_id}")
async def eliminar_propiedad(propiedad_id: int):
    """
    Elimina una propiedad (soft delete - cambia estado a inactiva)
    """
    # Buscar la propiedad
    propiedad_index = next((i for i, p in enumerate(mock_propiedades) if p["id"] == propiedad_id), None)
    
    if propiedad_index is None:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    
    # En lugar de eliminar, cambiar estado (soft delete)
    mock_propiedades[propiedad_index]["estado"] = "inactiva"
    mock_propiedades[propiedad_index]["fecha_actualizacion"] = datetime.now()
    
    return {"message": "Propiedad eliminada correctamente"}

@router.get("/{propiedad_id}/similares", response_model=List[Propiedad])
async def obtener_propiedades_similares(propiedad_id: int, limite: int = Query(4, ge=1, le=10)):
    """
    Obtiene propiedades similares basadas en tipo, operación y rango de precio
    """
    # Buscar la propiedad base
    propiedad_base = next((p for p in mock_propiedades if p["id"] == propiedad_id), None)
    
    if not propiedad_base:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    
    # Filtrar propiedades similares
    rango_precio = propiedad_base["precio"] * 0.3  # ±30% del precio
    precio_min = propiedad_base["precio"] - rango_precio
    precio_max = propiedad_base["precio"] + rango_precio
    
    similares = [
        p for p in mock_propiedades 
        if p["id"] != propiedad_id
        and p["tipo"] == propiedad_base["tipo"]
        and p["operacion"] == propiedad_base["operacion"]
        and precio_min <= p["precio"] <= precio_max
        and p["estado"] == "disponible"
    ]
    
    # Limitar resultados y convertir
    similares = similares[:limite]
    propiedades_response = []
    
    for prop_data in similares:
        prop_data_copy = prop_data.copy()
        if prop_data_copy["coordenadas"]:
            prop_data_copy["coordenadas"] = Coordenadas(**prop_data_copy["coordenadas"])
        propiedades_response.append(Propiedad(**prop_data_copy))
    
    return propiedades_response

@router.post("/{propiedad_id}/favorito")
async def toggle_favorito(propiedad_id: int, usuario_id: str = Query(..., description="ID del usuario")):
    """
    Agrega o quita una propiedad de favoritos del usuario
    """
    # En producción: esto se manejaría con una tabla de favoritos en la DB
    # y autenticación del usuario
    
    propiedad = next((p for p in mock_propiedades if p["id"] == propiedad_id), None)
    if not propiedad:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    
    # Mock response
    return {
        "message": "Propiedad agregada/removida de favoritos",
        "propiedad_id": propiedad_id,
        "usuario_id": usuario_id,
        "es_favorito": True  # En producción: verificar estado real
    }

@router.get("/estadisticas/generales", response_model=EstadisticasPropiedad)
async def obtener_estadisticas():
    """
    Obtiene estadísticas generales de las propiedades
    """
    propiedades_activas = [p for p in mock_propiedades if p["estado"] == "disponible"]
    
    # Contar por tipo
    por_tipo = {}
    for prop in propiedades_activas:
        tipo = prop["tipo"].value
        por_tipo[tipo] = por_tipo.get(tipo, 0) + 1
    
    # Contar por operación
    por_operacion = {}
    for prop in propiedades_activas:
        operacion = prop["operacion"].value
        por_operacion[operacion] = por_operacion.get(operacion, 0) + 1
    
    # Precio promedio
    precios = [p["precio"] for p in propiedades_activas]
    precio_promedio = sum(precios) / len(precios) if precios else 0
    
    # Destacadas
    destacadas = len([p for p in propiedades_activas if p["destacada"]])
    
    return EstadisticasPropiedad(
        total_propiedades=len(propiedades_activas),
        por_tipo=por_tipo,
        por_operacion=por_operacion,
        precio_promedio=precio_promedio,
        propiedades_destacadas=destacadas
    )
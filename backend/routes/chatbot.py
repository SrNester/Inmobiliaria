from fastapi import APIRouter, HTTPException
from datetime import datetime
import re
import random
from typing import List, Optional

from models import MensajeChatbot, RespuestaChatbot

router = APIRouter()

# Base de conocimientos para el chatbot
RESPUESTAS_BASE = {
    "saludo": [
        "¡Hola! Bienvenido a InmoMax. ¿En qué puedo ayudarte hoy?",
        "¡Hola! Soy el asistente virtual de InmoMax. ¿Cómo te puedo ayudar?",
        "¡Hola! ¿Estás buscando alguna propiedad en particular?"
    ],
    "propiedades": [
        "Tenemos una gran variedad de propiedades disponibles. ¿Buscas casa, departamento, local comercial o terreno?",
        "Contamos con propiedades en venta y alquiler en toda la zona de Rosario. ¿Qué tipo te interesa?",
        "Manejamos más de 500 propiedades activas. ¿Te interesa alguna zona en particular?"
    ],
    "precios": [
        "Los precios varían según la ubicación, tipo y características. ¿Te interesa alguna zona específica?",
        "Tenemos opciones para todos los presupuestos. ¿Podrías contarme qué rango de precio manejas?",
        "Los precios dependen de muchos factores. ¿Qué tipo de propiedad te interesa y en qué zona?"
    ],
    "alquiler": [
        "Manejamos alquileres tradicionales y temporales. ¿Para cuánto tiempo necesitas la propiedad?",
        "Tenemos excelentes opciones en alquiler. ¿Buscas casa o departamento?",
        "Para alquileres trabajamos con garantía propietaria o seguro de caución. ¿Qué modalidad prefieres?"
    ],
    "venta": [
        "¿Estás buscando comprar o vender una propiedad?",
        "Para ventas ofrecemos asesoramiento integral. ¿Ya tienes una propiedad en mente?",
        "Contamos con financiación y asesoramiento legal. ¿Qué tipo de propiedad te interesa comprar?"
    ],
    "ubicacion": [
        "Trabajamos en Rosario y zona metropolitana: Las Lomas, Centro, Fisherton, Pichincha, Funes y más.",
        "Cubrimos toda la ciudad de Rosario y alrededores. ¿Hay algún barrio que te interese particularmente?",
        "Tenemos propiedades en las mejores zonas de Rosario. ¿Qué barrio prefieres?"
    ],
    "contacto": [
        "Puedes contactarnos al +54 341 123-4567 o por email a info@inmomax.com",
        "Nuestro teléfono es +54 341 123-4567 y también puedes escribirnos a info@inmomax.com",
        "Para contacto directo: +54 341 123-4567 o agenda una cita desde nuestra web"
    ],
    "horarios": [
        "Atendemos de lunes a viernes de 9:00 a 18:00 y sábados de 9:00 a 13:00",
        "Nuestros horarios son: L-V 9:00-18:00, Sábados 9:00-13:00, Domingos cerrado",
        "Estamos disponibles de lunes a viernes todo el día y sábados por la mañana"
    ],
    "servicios": [
        "Ofrecemos: compra-venta, alquileres, tasaciones, administración de propiedades y asesoramiento legal",
        "Nuestros servicios incluyen gestión integral inmobiliaria: ventas, alquileres, tasaciones y más",
        "Brindamos asesoramiento completo: desde la búsqueda hasta la escrituración"
    ],
    "financiacion": [
        "Trabajamos con todos los bancos para créditos hipotecarios. ¿Necesitas info sobre financiación?",
        "Ofrecemos asesoramiento para créditos UVA, tradicionales y planes gubernamentales",
        "Podemos ayudarte con la gestión de créditos hipotecarios. ¿Ya pre-calificaste en algún banco?"
    ],
    "tasacion": [
        "Realizamos tasaciones oficiales para compra, venta, sucesiones y trámites bancarios",
        "Nuestras tasaciones están avaladas por el Colegio de Martilleros. ¿Para qué la necesitas?",
        "Hacemos tasaciones en 48-72 horas. El costo varía según el tipo de propiedad"
    ],
    "despedida": [
        "¡Gracias por contactarte con InmoMax! Espero haberte ayudado",
        "¡Hasta luego! No dudes en escribirme si necesitas más información",
        "¡Que tengas un excelente día! Aquí estaré si necesitas ayuda"
    ],
    "default": [
        "Entiendo tu consulta. Para una atención más personalizada, te sugiero contactar a uno de nuestros agentes",
        "Para brindarte la mejor información, te recomiendo hablar directamente con nuestro equipo",
        "Tu consulta es muy específica. ¿Te parece si coordinas una llamada con uno de nuestros especialistas?"
    ]
}

# Patrones para identificar intenciones
PATRONES_INTENCION = {
    "saludo": [
        r"hola", r"buenos? d[ií]as?", r"buenas? tardes?", r"buenas? noches?",
        r"saludos", r"qu[eé] tal", r"c[oó]mo est[aá]s?", r"hola.*"
    ],
    "propiedades": [
        r"propiedades?", r"inmuebles?", r"casas?", r"departamentos?", 
        r"locales?", r"terrenos?", r"quintas?", r"qu[eé] tienen",
        r"opciones", r"disponibles?", r"catálogo"
    ],
    "precios": [
        r"precios?", r"costo", r"valor", r"cu[aá]nto", r"precio",
        r"barato", r"caro", r"económico", r"accesible"
    ],
    "alquiler": [
        r"alquiler", r"alquilar", r"rentar", r"arrendar",
        r"temporal", r"inquilino"
    ],
    "venta": [
        r"venta", r"vender", r"comprar", r"compra",
        r"adquirir", r"escriturar"
    ],
    "ubicacion": [
        r"ubicaci[oó]n", r"zona", r"barrio", r"d[oó]nde",
        r"lugar", r"[aá]rea", r"sector", r"rosario",
        r"centro", r"las lomas", r"fisherton", r"pichincha", r"funes"
    ],
    "contacto": [
        r"contacto", r"tel[eé]fono", r"llamar", r"comunicar",
        r"email", r"mail", r"direcci[oó]n", r"whatsapp"
    ],
    "horarios": [
        r"horarios?", r"atienden", r"abren", r"cierran",
        r"cu[aá]ndo", r"d[ií]as?", r"s[aá]bados?", r"domingos?"
    ],
    "servicios": [
        r"servicios?", r"qu[eé] hacen", r"qu[eé] ofrecen",
        r"administraci[oó]n", r"gesti[oó]n"
    ],
    "financiacion": [
        r"financiaci[oó]n", r"cr[eé]dito", r"hipoteca", r"banco",
        r"cuotas", r"financiar", r"uva", r"pr[eé]stamo"
    ],
    "tasacion": [
        r"tasaci[oó]n", r"tasar", r"avaluar", r"valor",
        r"cu[aá]nto vale", r"tasador"
    ],
    "despedida": [
        r"gracias", r"chau", r"adi[oó]s", r"hasta luego",
        r"nos vemos", r"bye", r"hasta pronto"
    ]
}

def detectar_intencion(mensaje: str) -> str:
    """
    Detecta la intención del usuario basándose en patrones de texto
    """
    mensaje_lower = mensaje.lower()
    
    for intencion, patrones in PATRONES_INTENCION.items():
        for patron in patrones:
            if re.search(patron, mensaje_lower):
                return intencion
    
    return "default"

def generar_respuesta(intencion: str, mensaje: str) -> dict:
    """
    Genera una respuesta basada en la intención detectada
    """
    respuestas = RESPUESTAS_BASE.get(intencion, RESPUESTAS_BASE["default"])
    respuesta_texto = random.choice(respuestas)
    
    # Calcular confianza basada en la coincidencia de patrones
    confianza = 0.9 if intencion != "default" else 0.3
    
    # Generar sugerencias contextuales
    sugerencias = generar_sugerencias(intencion)
    
    return {
        "respuesta": respuesta_texto,
        "confianza": confianza,
        "sugerencias": sugerencias,
        "intencion_detectada": intencion
    }

def generar_sugerencias(intencion: str) -> List[str]:
    """
    Genera sugerencias de seguimiento basadas en la intención
    """
    sugerencias_por_intencion = {
        "saludo": [
            "¿Buscas alguna propiedad en particular?",
            "¿Te interesa comprar o alquilar?",
            "¿En qué zona estás buscando?"
        ],
        "propiedades": [
            "¿Qué tipo de propiedad te interesa?",
            "¿Tienes algún presupuesto en mente?",
            "¿Hay alguna zona que prefieras?"
        ],
        "precios": [
            "¿Qué tipo de propiedad te interesa?",
            "¿En qué zona estás buscando?",
            "¿Necesitas información sobre financiación?"
        ],
        "alquiler": [
            "¿Para cuánto tiempo necesitas la propiedad?",
            "¿Qué zona prefieres?",
            "¿Tienes garantía propietaria?"
        ],
        "venta": [
            "¿Ya tienes una propiedad en mente?",
            "¿Necesitas asesoramiento para financiación?",
            "¿Qué zona te interesa?"
        ],
        "ubicacion": [
            "¿Qué tipo de propiedad buscas en esa zona?",
            "¿Para compra o alquiler?",
            "¿Tienes algún presupuesto definido?"
        ],
        "contacto": [
            "¿Quieres agendar una visita?",
            "¿Prefieres que te llamemos?",
            "¿Hay alguna propiedad específica que te interese?"
        ],
        "default": [
            "¿Puedes contarme más detalles?",
            "¿Te interesa alguna zona en particular?",
            "¿Prefieres hablar con uno de nuestros agentes?"
        ]
    }
    
    return sugerencias_por_intencion.get(intencion, sugerencias_por_intencion["default"])

@router.post("/mensaje", response_model=RespuestaChatbot)
async def procesar_mensaje(mensaje_data: MensajeChatbot):
    """
    Procesa un mensaje del usuario y devuelve una respuesta del chatbot
    """
    try:
        # Validar que el mensaje no esté vacío
        if not mensaje_data.mensaje.strip():
            raise HTTPException(status_code=400, detail="El mensaje no puede estar vacío")
        
        # Detectar intención
        intencion = detectar_intencion(mensaje_data.mensaje)
        
        # Generar respuesta
        resultado = generar_respuesta(intencion, mensaje_data.mensaje)
        
        # Crear respuesta
        respuesta = RespuestaChatbot(
            respuesta=resultado["respuesta"],
            timestamp=datetime.now(),
            confianza=resultado["confianza"],
            sugerencias=resultado["sugerencias"]
        )
        
        # Log para análisis (en producción esto iría a un sistema de logging)
        print(f"Usuario: {mensaje_data.mensaje}")
        print(f"Intención detectada: {intencion}")
        print(f"Respuesta: {respuesta.respuesta}")
        print(f"Confianza: {respuesta.confianza}")
        
        return respuesta
        
    except Exception as e:
        # En caso de error, devolver respuesta genérica
        return RespuestaChatbot(
            respuesta="Disculpa, ha ocurrido un error. ¿Podrías reformular tu pregunta?",
            timestamp=datetime.now(),
            confianza=0.1,
            sugerencias=["¿Puedes intentar de otra manera?", "¿Te ayudo con otra consulta?"]
        )

@router.get("/sugerencias", response_model=List[str])
async def obtener_sugerencias_frecuentes():
    """
    Devuelve una lista de preguntas frecuentes para mostrar al usuario
    """
    return [
        "¿Qué propiedades tienen disponibles?",
        "¿Cuáles son sus horarios de atención?",
        "¿Cómo puedo contactarlos?",
        "¿En qué zonas trabajan?",
        "¿Ofrecen financiación?",
        "¿Hacen tasaciones?",
        "¿Qué servicios brindan?",
        "¿Tienen propiedades en alquiler temporal?"
    ]

@router.get("/estadisticas")
async def obtener_estadisticas_chatbot():
    """
    Devuelve estadísticas del uso del chatbot (para análisis interno)
    """
    # En producción esto vendría de una base de datos
    return {
        "mensajes_procesados": 1247,
        "intenciones_mas_frecuentes": [
            {"intencion": "propiedades", "cantidad": 312},
            {"intencion": "precios", "cantidad": 198},
            {"intencion": "contacto", "cantidad": 156},
            {"intencion": "ubicacion", "cantidad": 134},
            {"intencion": "alquiler", "cantidad": 98}
        ],
        "satisfaccion_promedio": 4.2,
        "tiempo_promedio_respuesta": 0.8  # segundos
    }
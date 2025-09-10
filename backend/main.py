from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
import uvicorn
from datetime import datetime

# Importar rutas
from routes.propiedades import router as propiedades_router
from routes.chatbot import router as chatbot_router

# Crear la aplicación FastAPI
app = FastAPI(
    title="InmoMax API",
    description="API para la plataforma inmobiliaria InmoMax",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(propiedades_router, prefix="/api/propiedades", tags=["propiedades"])
app.include_router(chatbot_router, prefix="/api/chatbot", tags=["chatbot"])

# Endpoint de salud
@app.get("/")
async def root():
    return {
        "message": "InmoMax API - Sistema de gestión inmobiliaria",
        "version": "1.0.0",
        "status": "active",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "database": "connected",
            "api": "running"
        }
    }

# Manejo de errores globales
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {
        "error": "Recurso no encontrado",
        "message": "El endpoint solicitado no existe",
        "status_code": 404
    }

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return {
        "error": "Error interno del servidor",
        "message": "Ha ocurrido un error inesperado",
        "status_code": 500
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )
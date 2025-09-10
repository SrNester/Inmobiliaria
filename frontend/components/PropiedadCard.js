import Link from 'next/link';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';
import { useState } from 'react';

export default function PropiedadCard({ propiedad }) {
    const [favorito, setFavorito] = useState(false);
    const [imagenError, setImagenError] = useState(false);

    const formatearPrecio = (precio) => {
        if (precio >= 1000000) {
        return `$${(precio / 1000000).toFixed(1)}M`;
        } else if (precio >= 1000) {
        return `$${(precio / 1000).toFixed(0)}K`;
        } else {
        return `$${precio.toLocaleString()}`;
        }
    };

    const handleFavorito = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setFavorito(!favorito);
    };

    return (
        <Link href={`/propiedades/${propiedad.id}`}>
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden">
            {/* Imagen */}
            <div className="relative h-48 overflow-hidden">
            <img 
                src={imagenError ? '/images/placeholder.jpg' : (propiedad.imagen || '/images/placeholder.jpg')}
                alt={propiedad.titulo}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                onError={() => setImagenError(true)}
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3">
                <span className="bg-primary-600 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                {propiedad.operacion || 'Venta'}
                </span>
            </div>

            {propiedad.destacada && (
                <div className="absolute top-3 right-12">
                <span className="bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                    Destacada
                </span>
                </div>
            )}

            {/* Botón favorito */}
            <button 
                onClick={handleFavorito}
                className={`absolute top-3 right-3 p-2 rounded-full ${
                favorito 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/80 text-gray-600 hover:bg-white'
                } transition-all duration-200 hover:scale-110`}
            >
                <Heart className={`w-4 h-4 ${favorito ? 'fill-current' : ''}`} />
            </button>
            </div>

            {/* Contenido */}
            <div className="p-5">
            {/* Precio */}
            <div className="text-2xl font-bold text-primary-600 mb-2">
                {formatearPrecio(propiedad.precio)}
            </div>

            {/* Título */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 leading-tight">
                {propiedad.titulo}
            </h3>

            {/* Ubicación */}
            <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="text-sm truncate">{propiedad.ubicacion}</span>
            </div>

            {/* Características */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                {propiedad.habitaciones > 0 && (
                <div className="flex items-center space-x-1">
                    <Bed className="w-4 h-4" />
                    <span>{propiedad.habitaciones}</span>
                </div>
                )}
                
                {propiedad.banos > 0 && (
                <div className="flex items-center space-x-1">
                    <Bath className="w-4 h-4" />
                    <span>{propiedad.banos}</span>
                </div>
                )}
                
                {propiedad.metros && (
                <div className="flex items-center space-x-1">
                    <Square className="w-4 h-4" />
                    <span>{propiedad.metros}m²</span>
                </div>
                )}
            </div>

            {/* Tipo de propiedad */}
            <div className="flex justify-between items-center">
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                {propiedad.tipo}
                </span>
                
                {/* Indicador de disponibilidad */}
                <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">Disponible</span>
                </div>
            </div>
            </div>
        </div>
        </Link>
    );
}
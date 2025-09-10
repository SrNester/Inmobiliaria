import { useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

export default function Filtros({ filtros, onAplicarFiltros }) {
    const [filtrosLocales, setFiltrosLocales] = useState(filtros);
    const [mostrarAvanzados, setMostrarAvanzados] = useState(false);

    const handleInputChange = (campo, valor) => {
        setFiltrosLocales({
        ...filtrosLocales,
        [campo]: valor
        });
    };

    const aplicarFiltros = () => {
        onAplicarFiltros(filtrosLocales);
    };

    const limpiarFiltros = () => {
        const filtrosVacios = {
        tipo: '',
        operacion: '',
        ubicacion: '',
        precioMin: '',
        precioMax: '',
        habitaciones: '',
        orden: 'recientes'
        };
        setFiltrosLocales(filtrosVacios);
        onAplicarFiltros(filtrosVacios);
    };

    const hayFiltrosActivos = Object.values(filtrosLocales).some(value => 
        value && value !== 'recientes'
    );

    return (
        <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Filtros</h2>
            {hayFiltrosActivos && (
            <button 
                onClick={limpiarFiltros}
                className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
            >
                <X className="w-4 h-4" />
                <span>Limpiar</span>
            </button>
            )}
        </div>

        {/* Filtros básicos */}
        <div className="space-y-4">
            {/* Tipo de operación */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Operación
            </label>
            <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={filtrosLocales.operacion}
                onChange={(e) => handleInputChange('operacion', e.target.value)}
            >
                <option value="">Todas</option>
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
                <option value="alquiler-temporal">Alquiler temporal</option>
            </select>
            </div>

            {/* Tipo de propiedad */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de propiedad
            </label>
            <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={filtrosLocales.tipo}
                onChange={(e) => handleInputChange('tipo', e.target.value)}
            >
                <option value="">Todos los tipos</option>
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="local">Local comercial</option>
                <option value="terreno">Terreno</option>
                <option value="oficina">Oficina</option>
                <option value="quinta">Quinta</option>
            </select>
            </div>

            {/* Ubicación */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación
            </label>
            <div className="relative">
                <input 
                type="text" 
                placeholder="Barrio, zona o dirección"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={filtrosLocales.ubicacion}
                onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            </div>

            {/* Rango de precio */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio
            </label>
            <div className="grid grid-cols-2 gap-2">
                <input 
                type="number" 
                placeholder="Mín."
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={filtrosLocales.precioMin}
                onChange={(e) => handleInputChange('precioMin', e.target.value)}
                />
                <input 
                type="number" 
                placeholder="Máx."
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={filtrosLocales.precioMax}
                onChange={(e) => handleInputChange('precioMax', e.target.value)}
                />
            </div>
            </div>
        </div>

        {/* Filtros avanzados */}
        <div>
            <button 
            onClick={() => setMostrarAvanzados(!mostrarAvanzados)}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
            >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtros avanzados</span>
            </button>

            {mostrarAvanzados && (
            <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
                {/* Habitaciones */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Habitaciones
                </label>
                <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(num => (
                    <button
                        key={num}
                        onClick={() => handleInputChange('habitaciones', 
                        filtrosLocales.habitaciones === num.toString() ? '' : num.toString()
                        )}
                        className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                        filtrosLocales.habitaciones === num.toString()
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {num}
                    </button>
                    ))}
                </div>
                <button
                    onClick={() => handleInputChange('habitaciones', 
                    filtrosLocales.habitaciones === '5+' ? '' : '5+'
                    )}
                    className={`mt-2 w-full py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    filtrosLocales.habitaciones === '5+'
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    5 o más
                </button>
                </div>

                {/* Superficie */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Superficie (m²)
                </label>
                <div className="grid grid-cols-2 gap-2">
                    <input 
                    type="number" 
                    placeholder="Mín. m²"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filtrosLocales.superficieMin || ''}
                    onChange={(e) => handleInputChange('superficieMin', e.target.value)}
                    />
                    <input 
                    type="number" 
                    placeholder="Máx. m²"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filtrosLocales.superficieMax || ''}
                    onChange={(e) => handleInputChange('superficieMax', e.target.value)}
                    />
                </div>
                </div>

                {/* Antigüedad */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Antigüedad
                </label>
                <select 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filtrosLocales.antiguedad || ''}
                    onChange={(e) => handleInputChange('antiguedad', e.target.value)}
                >
                    <option value="">Cualquiera</option>
                    <option value="nueva">A estrenar</option>
                    <option value="0-5">Hasta 5 años</option>
                    <option value="5-10">5 a 10 años</option>
                    <option value="10-20">10 a 20 años</option>
                    <option value="20+">Más de 20 años</option>
                </select>
                </div>

                {/* Características especiales */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Características
                </label>
                <div className="space-y-2">
                    {[
                    { key: 'cochera', label: 'Cochera' },
                    { key: 'jardin', label: 'Jardín' },
                    { key: 'parrilla', label: 'Parrilla' },
                    { key: 'piscina', label: 'Piscina' },
                    { key: 'balcon', label: 'Balcón' },
                    { key: 'terraza', label: 'Terraza' }
                    ].map(caracteristica => (
                    <label key={caracteristica.key} className="flex items-center">
                        <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={filtrosLocales[caracteristica.key] || false}
                        onChange={(e) => handleInputChange(caracteristica.key, e.target.checked)}
                        />
                        <span className="ml-2 text-sm text-gray-700">{caracteristica.label}</span>
                    </label>
                    ))}
                </div>
                </div>
            </div>
            )}
        </div>

        {/* Botones de acción */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
            <button 
            onClick={aplicarFiltros}
            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center space-x-2"
            >
            <Search className="w-4 h-4" />
            <span>Aplicar Filtros</span>
            </button>
            
            {hayFiltrosActivos && (
            <button 
                onClick={limpiarFiltros}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
                Limpiar todos los filtros
            </button>
            )}
        </div>
        </div>
    );
}
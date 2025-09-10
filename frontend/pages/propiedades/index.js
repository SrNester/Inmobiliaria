import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PropiedadCard from '../../components/PropiedadCard';
import Filtros from '../../components/Filtros';

export default function Propiedades() {
    const router = useRouter();
    const [propiedades, setPropiedades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState({
        tipo: router.query.tipo || '',
        operacion: router.query.operacion || '',
        ubicacion: router.query.ubicacion || '',
        precioMin: router.query.precioMin || '',
        precioMax: router.query.precioMax || '',
        habitaciones: router.query.habitaciones || '',
        orden: router.query.orden || 'recientes'
    });
    const [totalPropiedades, setTotalPropiedades] = useState(0);
    const [paginaActual, setPaginaActual] = useState(1);
    const propiedadesPorPagina = 12;

    useEffect(() => {
        // Actualizar filtros cuando cambien los query params
        const newFiltros = {
        tipo: router.query.tipo || '',
        operacion: router.query.operacion || '',
        ubicacion: router.query.ubicacion || '',
        precioMin: router.query.precioMin || '',
        precioMax: router.query.precioMax || '',
        habitaciones: router.query.habitaciones || '',
        orden: router.query.orden || 'recientes'
        };
        setFiltros(newFiltros);
        fetchPropiedades(newFiltros);
    }, [router.query]);

    const fetchPropiedades = async (filtrosActuales = filtros) => {
        setLoading(true);
        try {
        const query = new URLSearchParams({
            ...filtrosActuales,
            pagina: paginaActual,
            limite: propiedadesPorPagina
        }).toString();
        
        const response = await fetch(`/api/propiedades?${query}`);
        const data = await response.json();
        
        setPropiedades(data.propiedades || []);
        setTotalPropiedades(data.total || 0);
        } catch (error) {
        console.error('Error al cargar propiedades:', error);
        // Mock data para desarrollo
        const mockPropiedades = [
            {
            id: 1,
            titulo: 'Casa moderna en Las Lomas',
            precio: 350000,
            ubicacion: 'Las Lomas, Rosario',
            tipo: 'Casa',
            operacion: 'Venta',
            habitaciones: 3,
            banos: 2,
            metros: 120,
            imagen: '/images/casa1.jpg',
            destacada: true
            },
            {
            id: 2,
            titulo: 'Departamento céntrico con balcón',
            precio: 180000,
            ubicacion: 'Centro, Rosario',
            tipo: 'Departamento',
            operacion: 'Venta',
            habitaciones: 2,
            banos: 1,
            metros: 65,
            imagen: '/images/depto1.jpg'
            },
            {
            id: 3,
            titulo: 'Casa en Fisherton con jardín',
            precio: 45000,
            ubicacion: 'Fisherton, Rosario',
            tipo: 'Casa',
            operacion: 'Alquiler',
            habitaciones: 3,
            banos: 2,
            metros: 110,
            imagen: '/images/casa2.jpg'
            },
            {
            id: 4,
            titulo: 'Local comercial sobre avenida',
            precio: 280000,
            ubicacion: 'Pellegrini, Rosario',
            tipo: 'Local',
            operacion: 'Venta',
            habitaciones: 0,
            banos: 1,
            metros: 80,
            imagen: '/images/local1.jpg'
            },
            {
            id: 5,
            titulo: 'Departamento nuevo en Pichincha',
            precio: 32000,
            ubicacion: 'Pichincha, Rosario',
            tipo: 'Departamento',
            operacion: 'Alquiler',
            habitaciones: 1,
            banos: 1,
            metros: 45,
            imagen: '/images/depto2.jpg'
            },
            {
            id: 6,
            titulo: 'Casa quinta en Funes',
            precio: 420000,
            ubicacion: 'Funes, Santa Fe',
            tipo: 'Casa',
            operacion: 'Venta',
            habitaciones: 4,
            banos: 3,
            metros: 180,
            imagen: '/images/quinta1.jpg'
            }
        ];
        
        // Aplicar filtros mock
        let propiedadesFiltradas = mockPropiedades;
        
        if (filtrosActuales.tipo) {
            propiedadesFiltradas = propiedadesFiltradas.filter(p => 
            p.tipo.toLowerCase().includes(filtrosActuales.tipo.toLowerCase())
            );
        }
        
        if (filtrosActuales.operacion) {
            propiedadesFiltradas = propiedadesFiltradas.filter(p => 
            p.operacion.toLowerCase() === filtrosActuales.operacion.toLowerCase()
            );
        }
        
        if (filtrosActuales.ubicacion) {
            propiedadesFiltradas = propiedadesFiltradas.filter(p => 
            p.ubicacion.toLowerCase().includes(filtrosActuales.ubicacion.toLowerCase())
            );
        }

        setPropiedades(propiedadesFiltradas);
        setTotalPropiedades(propiedadesFiltradas.length);
        } finally {
        setLoading(false);
        }
    };

    const aplicarFiltros = (nuevosFiltros) => {
        setFiltros(nuevosFiltros);
        setPaginaActual(1);
        
        // Actualizar URL
        const query = Object.keys(nuevosFiltros)
        .filter(key => nuevosFiltros[key])
        .reduce((obj, key) => {
            obj[key] = nuevosFiltros[key];
            return obj;
        }, {});
        
        router.push({
        pathname: '/propiedades',
        query
        }, undefined, { shallow: true });
    };

    const totalPaginas = Math.ceil(totalPropiedades / propiedadesPorPagina);

    return (
        <>
        <Head>
            <title>Propiedades - InmoMax</title>
            <meta name="description" content="Explora todas nuestras propiedades disponibles. Casas, departamentos y locales comerciales en Rosario y zona." />
        </Head>

        <Navbar />

        <main className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="bg-white py-12 shadow-sm">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Propiedades Disponibles
                </h1>
                <p className="text-xl text-gray-600">
                {totalPropiedades} propiedades encontradas
                </p>
            </div>
            </section>

            <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filtros */}
                <aside className="lg:w-1/4">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                    <Filtros 
                    filtros={filtros} 
                    onAplicarFiltros={aplicarFiltros}
                    />
                </div>
                </aside>

                {/* Lista de Propiedades */}
                <div className="lg:w-3/4">
                {/* Ordenamiento */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                    <span className="text-gray-600 mb-2 sm:mb-0">
                        Mostrando {propiedades.length} de {totalPropiedades} propiedades
                    </span>
                    <select 
                        className="border border-gray-300 rounded-lg px-4 py-2"
                        value={filtros.orden}
                        onChange={(e) => aplicarFiltros({...filtros, orden: e.target.value})}
                    >
                        <option value="recientes">Más recientes</option>
                        <option value="precio-asc">Precio: menor a mayor</option>
                        <option value="precio-desc">Precio: mayor a menor</option>
                        <option value="metros-desc">Mayor superficie</option>
                    </select>
                    </div>
                </div>

                {/* Grid de Propiedades */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-md animate-pulse">
                        <div className="h-48 bg-gray-300 rounded-t-xl"></div>
                        <div className="p-6">
                            <div className="h-6 bg-gray-300 rounded mb-3"></div>
                            <div className="h-4 bg-gray-300 rounded mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                        </div>
                        </div>
                    ))}
                    </div>
                ) : propiedades.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No se encontraron propiedades
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Intenta ajustar tus filtros de búsqueda
                    </p>
                    <button 
                        onClick={() => aplicarFiltros({
                        tipo: '', operacion: '', ubicacion: '', precioMin: '', 
                        precioMax: '', habitaciones: '', orden: 'recientes'
                        })}
                        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Limpiar filtros
                    </button>
                    </div>
                ) : (
                    <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                        {propiedades.map(propiedad => (
                        <PropiedadCard key={propiedad.id} propiedad={propiedad} />
                        ))}
                    </div>

                    {/* Paginación */}
                    {totalPaginas > 1 && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-center">
                            <nav className="flex space-x-2">
                            {[...Array(totalPaginas)].map((_, i) => (
                                <button
                                key={i + 1}
                                onClick={() => setPaginaActual(i + 1)}
                                className={`px-4 py-2 rounded-lg ${
                                    paginaActual === i + 1
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                >
                                {i + 1}
                                </button>
                            ))}
                            </nav>
                        </div>
                        </div>
                    )}
                    </>
                )}
                </div>
            </div>
            </div>
        </main>
        <Footer />
        </>
    );
}
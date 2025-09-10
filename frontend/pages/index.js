import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PropiedadCard from '../components/PropiedadCard';
import ChatbotWidget from '../components/ChatbotWidget';

export default function Home() {
    const [propiedadesFeatured, setPropiedadesFeatured] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState({
        tipo: '',
        operacion: '',
        ubicacion: ''
    });

    useEffect(() => {
        fetchFeaturedProperties();
    }, []);

    const fetchFeaturedProperties = async () => {
        try {
        const response = await fetch('/api/propiedades?featured=true&limit=6');
        const data = await response.json();
        setPropiedadesFeatured(data);
        } catch (error) {
        console.error('Error al cargar propiedades:', error);
        // Mock data para desarrollo
        setPropiedadesFeatured([
            {
            id: 1,
            titulo: 'Casa moderna en Las Lomas',
            precio: 350000,
            ubicacion: 'Las Lomas, Rosario',
            tipo: 'Casa',
            habitaciones: 3,
            banos: 2,
            metros: 120,
            imagen: '/images/casa1.jpg'
            },
            {
            id: 2,
            titulo: 'Departamento céntrico',
            precio: 180000,
            ubicacion: 'Centro, Rosario',
            tipo: 'Departamento',
            habitaciones: 2,
            banos: 1,
            metros: 65,
            imagen: '/images/depto1.jpg'
            }
        ]);
        } finally {
        setLoading(false);
        }
    };

    const handleBuscar = () => {
        const query = new URLSearchParams(filtros).toString();
        window.location.href = `/propiedades?${query}`;
    };

    return (
        <>
        <Head>
            <title>InmoMax - Tu hogar ideal te está esperando</title>
            <meta name="description" content="Encuentra la propiedad perfecta con InmoMax. Casas, departamentos y locales comerciales en Rosario." />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Navbar />

        <main>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white min-h-[70vh] flex items-center">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative container mx-auto px-4">
                <div className="max-w-3xl">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                    Tu hogar ideal te está esperando
                </h1>
                <p className="text-xl mb-8 leading-relaxed">
                    Encuentra la propiedad perfecta con la ayuda de nuestros expertos. 
                    Miles de opciones para comprar, vender o alquilar en Rosario y zona.
                </p>
                <Link 
                    href="/propiedades" 
                    className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
                >
                    Explorar Propiedades
                </Link>
                </div>
            </div>
            </section>

            {/* Búsqueda Rápida */}
            <section className="bg-white py-8 shadow-xl -mt-10 relative z-10 mx-4 rounded-lg">
            <div className="container mx-auto px-6">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Búsqueda Rápida
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select 
                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filtros.tipo}
                    onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
                >
                    <option value="">Tipo de propiedad</option>
                    <option value="casa">Casa</option>
                    <option value="departamento">Departamento</option>
                    <option value="local">Local comercial</option>
                    <option value="terreno">Terreno</option>
                </select>
                <select 
                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filtros.operacion}
                    onChange={(e) => setFiltros({...filtros, operacion: e.target.value})}
                >
                    <option value="">Operación</option>
                    <option value="venta">Venta</option>
                    <option value="alquiler">Alquiler</option>
                    <option value="alquiler-temporal">Alquiler temporal</option>
                </select>
                <input 
                    type="text" 
                    placeholder="Ubicación (ej: Centro, Las Lomas)"
                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filtros.ubicacion}
                    onChange={(e) => setFiltros({...filtros, ubicacion: e.target.value})}
                />
                <button 
                    onClick={handleBuscar}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                    Buscar Propiedades
                </button>
                </div>
            </div>
            </section>

            {/* Propiedades Destacadas */}
            <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                    Propiedades Destacadas
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Descubre nuestras mejores opciones seleccionadas especialmente para ti
                </p>
                </div>

                {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {propiedadesFeatured.map(propiedad => (
                    <PropiedadCard key={propiedad.id} propiedad={propiedad} />
                    ))}
                </div>
                )}

                <div className="text-center mt-12">
                <Link 
                    href="/propiedades"
                    className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-all transform hover:scale-105 font-semibold text-lg"
                >
                    Ver Todas las Propiedades
                </Link>
                </div>
            </div>
            </section>

            {/* Servicios */}
            <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                    Nuestros Servicios
                </h2>
                <p className="text-xl text-gray-600">
                    Te acompañamos en cada paso del proceso
                </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-8 rounded-xl hover:shadow-lg transition-shadow">
                    <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-4">Compra y Venta</h3>
                    <p className="text-gray-600">
                    Te ayudamos a encontrar el hogar perfecto o vender tu propiedad al mejor precio.
                    </p>
                </div>

                <div className="text-center p-8 rounded-xl hover:shadow-lg transition-shadow">
                    <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-4">Alquileres</h3>
                    <p className="text-gray-600">
                    Gestión completa de alquileres con garantías y asesoramiento legal.
                    </p>
                </div>

                <div className="text-center p-8 rounded-xl hover:shadow-lg transition-shadow">
                    <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-4">Asesoramiento</h3>
                    <p className="text-gray-600">
                    Consultoría especializada en inversiones inmobiliarias y tasaciones.
                    </p>
                </div>
                </div>
            </div>
            </section>
        </main>

        <Footer />
        <ChatbotWidget />
        </>
    );
}
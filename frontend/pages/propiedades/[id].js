import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ArrowLeft, MapPin, Bed, Bath, Square, Heart, Share2, Phone, Mail, Calendar } from 'lucide-react';

export default function PropiedadDetalle() {
    const router = useRouter();
    const { id } = router.query;
    const [propiedad, setPropiedad] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imagenActual, setImagenActual] = useState(0);
    const [favorito, setFavorito] = useState(false);
    const [mostrarContacto, setMostrarContacto] = useState(false);

    useEffect(() => {
        if (id) {
        fetchPropiedad();
        }
    }, [id]);

    const fetchPropiedad = async () => {
        try {
        const response = await fetch(`/api/propiedades/${id}`);
        const data = await response.json();
        setPropiedad(data);
        } catch (error) {
        console.error('Error al cargar propiedad:', error);
        // Mock data para desarrollo
        setPropiedad({
            id: 1,
            titulo: 'Casa moderna en Las Lomas',
            precio: 350000,
            ubicacion: 'Las Lomas, Rosario',
            direccion: 'Av. Las Lomas 1234',
            tipo: 'Casa',
            operacion: 'Venta',
            habitaciones: 3,
            banos: 2,
            metros: 120,
            metrosTerreno: 200,
            antiguedad: 5,
            expensas: null,
            descripcion: 'Hermosa casa moderna ubicada en el prestigioso barrio de Las Lomas. La propiedad cuenta con amplios espacios, excelente luminosidad y un diseño contemporáneo que combina funcionalidad y estética. El jardín ofrece un espacio ideal para el disfrute familiar.',
            caracteristicas: [
            'Cocina integrada con mesada de granito',
            'Living comedor con ventanal al jardín',
            'Suite principal con vestidor',
            'Parrilla cubierta',
            'Cochera para 2 autos',
            'Sistema de alarma',
            'Portón automatizado',
            'Piscina climatizada'
            ],
            servicios: [
            'Gas natural',
            'Agua corriente',
            'Cloacas',
            'Electricidad',
            'Internet fibra óptica',
            'Cable'
            ],
            imagenes: [
            '/images/casa1-1.jpg',
            '/images/casa1-2.jpg',
            '/images/casa1-3.jpg',
            '/images/casa1-4.jpg',
            '/images/casa1-5.jpg'
            ],
            agente: {
            nombre: 'María González',
            telefono: '+54 341 123-4567',
            email: 'maria@inmomax.com',
            avatar: '/images/agente1.jpg'
            },
            fechaPublicacion: '2024-01-15',
            destacada: true,
            coordenadas: {
            lat: -32.9442,
            lng: -60.6505
            }
        });
        } finally {
        setLoading(false);
        }
    };

    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
        }).format(precio);
    };

    const compartir = async () => {
        if (navigator.share) {
        try {
            await navigator.share({
            title: propiedad.titulo,
            text: `Mirá esta propiedad: ${propiedad.titulo}`,
            url: window.location.href,
            });
        } catch (error) {
            console.log('Error al compartir:', error);
        }
        } else {
        // Fallback: copiar URL al portapapeles
        navigator.clipboard.writeText(window.location.href);
        alert('URL copiada al portapapeles');
        }
    };

    if (loading) {
        return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
            <Footer />
        </>
        );
    }

    if (!propiedad) {
        return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Propiedad no encontrada</h1>
                <Link href="/propiedades" className="text-primary-600 hover:text-primary-700">
                Volver al listado
                </Link>
            </div>
            </div>
            <Footer />
        </>
        );
    }

    return (
        <>
        <Head>
            <title>{propiedad.titulo} - InmoMax</title>
            <meta name="description" content={propiedad.descripcion} />
            <meta property="og:title" content={propiedad.titulo} />
            <meta property="og:description" content={propiedad.descripcion} />
            <meta property="og:image" content={propiedad.imagenes[0]} />
        </Head>

        <Navbar />

        <main className="min-h-screen bg-gray-50">
            {/* Breadcrumb y acciones */}
            <div className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Link href="/" className="hover:text-primary-600">Inicio</Link>
                    <span>/</span>
                    <Link href="/propiedades" className="hover:text-primary-600">Propiedades</Link>
                    <span>/</span>
                    <span className="text-gray-800">{propiedad.titulo}</span>
                </div>
                <div className="flex space-x-2">
                    <button 
                    onClick={() => setFavorito(!favorito)}
                    className={`p-2 rounded-lg ${favorito ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-100'} hover:scale-105 transition-all`}
                    >
                    <Heart className={`w-5 h-5 ${favorito ? 'fill-current' : ''}`} />
                    </button>
                    <button 
                    onClick={compartir}
                    className="p-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 hover:scale-105 transition-all"
                    >
                    <Share2 className="w-5 h-5" />
                    </button>
                </div>
                </div>
            </div>
            </div>

            {/* Galería de imágenes */}
            <section className="bg-white">
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Imagen principal */}
                <div className="lg:col-span-2">
                    <div className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden">
                    <img 
                        src={propiedad.imagenes[imagenActual] || '/images/placeholder.jpg'} 
                        alt={propiedad.titulo}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                        {propiedad.operacion}
                    </div>
                    {propiedad.destacada && (
                        <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                        Destacada
                        </div>
                    )}
                    </div>
                </div>

                {/* Miniaturas */}
                <div className="space-y-2">
                    {propiedad.imagenes.slice(0, 4).map((imagen, index) => (
                    <div 
                        key={index}
                        className={`relative h-24 rounded-lg overflow-hidden cursor-pointer ${
                        imagenActual === index ? 'ring-2 ring-primary-600' : ''
                        }`}
                        onClick={() => setImagenActual(index)}
                    >
                        <img 
                        src={imagen || '/images/placeholder.jpg'} 
                        alt={`Vista ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                    </div>
                    ))}
                    {propiedad.imagenes.length > 4 && (
                    <div className="h-24 rounded-lg bg-gray-800 text-white flex items-center justify-center cursor-pointer">
                        <span className="text-sm">+{propiedad.imagenes.length - 4} más</span>
                    </div>
                    )}
                </div>
                </div>
            </div>
            </section>

            <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Información principal */}
                <div className="lg:col-span-2 space-y-6">
                {/* Título y precio */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{propiedad.titulo}</h1>
                    <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{propiedad.ubicacion}</span>
                    </div>
                    <div className="text-4xl font-bold text-primary-600 mb-4">
                    {formatearPrecio(propiedad.precio)}
                    </div>
                    
                    {/* Características principales */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                        <Bed className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">{propiedad.habitaciones} hab.</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Bath className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">{propiedad.banos} baños</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Square className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">{propiedad.metros} m²</span>
                    </div>
                    {propiedad.metrosTerreno && (
                        <div className="flex items-center space-x-2">
                        <Square className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">{propiedad.metrosTerreno} m² terreno</span>
                        </div>
                    )}
                    </div>
                </div>

                {/* Descripción */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Descripción</h2>
                    <p className="text-gray-700 leading-relaxed">{propiedad.descripcion}</p>
                </div>

                {/* Características */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Características</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {propiedad.caracteristicas.map((caracteristica, index) => (
                        <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        <span className="text-gray-700">{caracteristica}</span>
                        </div>
                    ))}
                    </div>
                </div>

                {/* Servicios */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Servicios</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {propiedad.servicios.map((servicio, index) => (
                        <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-gray-700">{servicio}</span>
                        </div>
                    ))}
                    </div>
                </div>

                {/* Detalles adicionales */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Detalles</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-500">Tipo:</span>
                        <span className="ml-2 text-gray-800">{propiedad.tipo}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Operación:</span>
                        <span className="ml-2 text-gray-800">{propiedad.operacion}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Antigüedad:</span>
                        <span className="ml-2 text-gray-800">{propiedad.antiguedad} años</span>
                    </div>
                    {propiedad.expensas && (
                        <div>
                        <span className="text-gray-500">Expensas:</span>
                        <span className="ml-2 text-gray-800">${propiedad.expensas}</span>
                        </div>
                    )}
                    <div>
                        <span className="text-gray-500">Publicado:</span>
                        <span className="ml-2 text-gray-800">
                        {new Date(propiedad.fechaPublicacion).toLocaleDateString('es-AR')}
                        </span>
                    </div>
                    </div>
                </div>
                </div>

                {/* Panel de contacto */}
                <div className="space-y-6">
                {/* Agente */}
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
                    <div className="flex items-center mb-4">
                    <img 
                        src={propiedad.agente.avatar || '/images/avatar-default.jpg'} 
                        alt={propiedad.agente.nombre}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                        <h3 className="font-bold text-gray-800">{propiedad.agente.nombre}</h3>
                        <p className="text-gray-600 text-sm">Agente inmobiliario</p>
                    </div>
                    </div>

                    <div className="space-y-3">
                    <button 
                        onClick={() => setMostrarContacto(!mostrarContacto)}
                        className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                    >
                        {mostrarContacto ? 'Ocultar Contacto' : 'Ver Contacto'}
                    </button>

                    {mostrarContacto && (
                        <div className="space-y-2 pt-2 border-t">
                        <a 
                            href={`tel:${propiedad.agente.telefono}`}
                            className="flex items-center justify-center w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Phone className="w-4 h-4 mr-2" />
                            Llamar
                        </a>
                        <a 
                            href={`mailto:${propiedad.agente.email}`}
                            className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                        </a>
                        <button className="flex items-center justify-center w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors">
                            <Calendar className="w-4 h-4 mr-2" />
                            Agendar visita
                        </button>
                        </div>
                    )}
                    </div>
                </div>

                {/* Calculadora de crédito */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Simulador de Crédito</h3>
                    <div className="space-y-3">
                    <input 
                        type="number" 
                        placeholder="Precio de la propiedad"
                        defaultValue={propiedad.precio}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <input 
                        type="number" 
                        placeholder="Anticipo (%)"
                        defaultValue="20"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option value="10">10 años</option>
                        <option value="15">15 años</option>
                        <option value="20">20 años</option>
                        <option value="30">30 años</option>
                    </select>
                    <button className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors">
                        Calcular Cuota
                    </button>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </main>

        <Footer />
        </>
    );
}
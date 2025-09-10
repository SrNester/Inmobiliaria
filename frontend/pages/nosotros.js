import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Users, Award, Home, TrendingUp, Heart, Shield } from 'lucide-react';

export default function Nosotros() {
    const equipo = [
        {
        id: 1,
        nombre: 'María González',
        cargo: 'Directora General',
        experiencia: '15 años',
        especialidad: 'Gestión comercial y desarrollo de negocios',
        imagen: '/images/team/maria.jpg',
        email: 'maria@inmomax.com',
        telefono: '+54 341 123-4567'
        },
        {
        id: 2,
        nombre: 'Carlos Rodríguez',
        cargo: 'Agente Senior',
        experiencia: '12 años',
        especialidad: 'Propiedades residenciales de alto valor',
        imagen: '/images/team/carlos.jpg',
        email: 'carlos@inmomax.com',
        telefono: '+54 341 123-4568'
        },
        {
        id: 3,
        nombre: 'Ana Martínez',
        cargo: 'Especialista en Alquileres',
        experiencia: '8 años',
        especialidad: 'Alquileres corporativos y temporales',
        imagen: '/images/team/ana.jpg',
        email: 'ana@inmomax.com',
        telefono: '+54 341 123-4569'
        },
        {
        id: 4,
        nombre: 'Roberto Silva',
        cargo: 'Tasador Oficial',
        experiencia: '20 años',
        especialidad: 'Tasaciones comerciales y residenciales',
        imagen: '/images/team/roberto.jpg',
        email: 'roberto@inmomax.com',
        telefono: '+54 341 123-4570'
        }
    ];

    const valores = [
        {
        icono: Heart,
        titulo: 'Compromiso',
        descripcion: 'Nos comprometemos con cada cliente para encontrar la solución perfecta a sus necesidades inmobiliarias.'
        },
        {
        icono: Shield,
        titulo: 'Confianza',
        descripcion: 'Construimos relaciones duraderas basadas en la transparencia, honestidad y profesionalismo.'
        },
        {
        icono: Award,
        titulo: 'Excelencia',
        descripcion: 'Buscamos la excelencia en cada transacción, brindando un servicio de calidad superior.'
        },
        {
        icono: Users,
        titulo: 'Equipo',
        descripcion: 'Nuestro equipo altamente capacitado trabaja en conjunto para superar las expectativas.'
        }
    ];

    const logros = [
        { numero: '500+', descripcion: 'Propiedades vendidas' },
        { numero: '1200+', descripcion: 'Familias satisfechas' },
        { numero: '15+', descripcion: 'Años de experiencia' },
        { numero: '98%', descripcion: 'Clientes satisfechos' }
    ];

    return (
        <>
        <Head>
            <title>Nosotros - InmoMax | Conoce nuestro equipo</title>
            <meta name="description" content="Conoce al equipo de InmoMax. Más de 15 años de experiencia ayudando a las familias de Rosario a encontrar su hogar ideal." />
            <meta name="keywords" content="inmobiliaria rosario, equipo, experiencia, agentes inmobiliarios" />
        </Head>

        <Navbar />

        <main>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-5xl font-bold mb-6">Nosotros</h1>
                <p className="text-xl max-w-3xl mx-auto leading-relaxed">
                Somos una empresa familiar con más de 15 años de experiencia, 
                dedicada a conectar personas con su hogar ideal en Rosario y zona metropolitana.
                </p>
            </div>
            </section>

            {/* Historia */}
            <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">Nuestra Historia</h2>
                    <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                    <p>
                        <strong className="text-primary-600">InmoMax</strong> nació en 2008 con un sueño simple pero ambicioso: 
                        revolucionar el mercado inmobiliario de Rosario brindando un servicio personalizado, 
                        transparente y orientado completamente al cliente.
                    </p>
                    <p>
                        Comenzamos como una pequeña oficina en el centro de la ciudad, y gracias a la confianza 
                        de nuestros clientes y nuestro compromiso con la excelencia, hemos crecido hasta convertirnos 
                        en una de las inmobiliarias más reconocidas de la región.
                    </p>
                    <p>
                        A lo largo de estos años hemos acompañado a más de 1200 familias en la búsqueda 
                        de su hogar ideal, siempre manteniendo nuestros valores fundamentales: 
                        <strong> honestidad, profesionalismo y compromiso.</strong>
                    </p>
                    </div>
                </div>
                <div className="relative">
                    <img 
                    src="/images/oficina-inmomax.jpg" 
                    alt="Oficina InmoMax"
                    className="rounded-xl shadow-2xl w-full"
                    onError={(e) => {
                        e.target.src = '/images/placeholder-office.jpg';
                    }}
                    />
                    <div className="absolute -bottom-6 -right-6 bg-primary-600 text-white p-6 rounded-xl">
                    <div className="text-center">
                        <div className="text-3xl font-bold">15+</div>
                        <div className="text-sm">Años de experiencia</div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </section>

            {/* Logros */}
            <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Nuestros Logros</h2>
                <p className="text-xl text-gray-600">Números que reflejan nuestro compromiso y experiencia</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {logros.map((logro, index) => (
                    <div key={index} className="text-center">
                    <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="text-4xl font-bold text-primary-600 mb-2">{logro.numero}</div>
                        <div className="text-gray-700 font-medium">{logro.descripcion}</div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </section>

            {/* Valores */}
            <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Nuestros Valores</h2>
                <p className="text-xl text-gray-600">Los principios que guían cada una de nuestras acciones</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {valores.map((valor, index) => (
                    <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                    <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <valor.icono className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{valor.titulo}</h3>
                    <p className="text-gray-600 leading-relaxed">{valor.descripcion}</p>
                    </div>
                ))}
                </div>
            </div>
            </section>

            {/* Equipo */}
            <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Nuestro Equipo</h2>
                <p className="text-xl text-gray-600">
                    Profesionales altamente capacitados, listos para ayudarte
                </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {equipo.map((miembro) => (
                    <div key={miembro.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative">
                        <img 
                        src={miembro.imagen} 
                        alt={miembro.nombre}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                            e.target.src = '/images/avatar-default.jpg';
                        }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-xl font-bold">{miembro.nombre}</h3>
                        <p className="text-sm opacity-90">{miembro.cargo}</p>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="flex items-center text-primary-600 font-semibold mb-3">
                        <Award className="w-4 h-4 mr-2" />
                        <span>{miembro.experiencia} de experiencia</span>
                        </div>
                        
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        {miembro.especialidad}
                        </p>
                        
                        <div className="space-y-2 text-sm">
                        <a 
                            href={`mailto:${miembro.email}`} 
                            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
                        >
                            <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                            {miembro.email}
                        </a>
                        <a 
                            href={`tel:${miembro.telefono}`} 
                            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
                        >
                            <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                            {miembro.telefono}
                        </a>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </section>

            {/* Misión y Visión */}
            <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Misión */}
                <div className="bg-primary-50 rounded-2xl p-8 lg:p-12">
                    <div className="flex items-center mb-6">
                    <div className="bg-primary-600 text-white p-3 rounded-lg mr-4">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Nuestra Misión</h2>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed">
                    Conectar personas con espacios que transformen sus vidas, brindando un servicio 
                    excepcional basado en la confianza, la transparencia y el conocimiento profundo 
                    del mercado inmobiliario local. Nos comprometemos a acompañar a nuestros clientes 
                    en cada paso del proceso, desde la primera consulta hasta la entrega de llaves.
                    </p>
                </div>

                {/* Visión */}
                <div className="bg-gray-50 rounded-2xl p-8 lg:p-12">
                    <div className="flex items-center mb-6">
                    <div className="bg-gray-600 text-white p-3 rounded-lg mr-4">
                        <Home className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Nuestra Visión</h2>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed">
                    Ser la inmobiliaria de referencia en Rosario y zona metropolitana, reconocida por 
                    nuestra innovación tecnológica, excelencia en el servicio y compromiso con el desarrollo 
                    sustentable de la comunidad. Aspiramos a liderar la transformación digital del sector 
                    inmobiliario, manteniendo siempre el toque humano que nos caracteriza.
                    </p>
                </div>
                </div>
            </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold mb-6">¿Listo para encontrar tu hogar ideal?</h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto">
                Nuestro equipo de expertos está aquí para ayudarte en cada paso del camino
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                    href="/contacto" 
                    className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                >
                    <Users className="w-5 h-5 mr-2" />
                    Contactar Equipo
                </a>
                <a 
                    href="/propiedades" 
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center"
                >
                    <Home className="w-5 h-5 mr-2" />
                    Ver Propiedades
                </a>
                </div>
            </div>
            </section>
        </main>

        <Footer />
        </>
    );
}
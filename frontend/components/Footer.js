import Link from 'next/link';
import { Home, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo y descripción */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                <div className="bg-primary-600 text-white p-2 rounded-lg">
                    <Home className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold">InmoMax</span>
                </div>
                <p className="text-gray-300 leading-relaxed">
                Tu socio de confianza en el mercado inmobiliario. 
                Más de 10 años ayudando a las familias a encontrar su hogar ideal.
                </p>
                <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    <Linkedin className="w-5 h-5" />
                </a>
                </div>
            </div>

            {/* Enlaces rápidos */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
                <ul className="space-y-2">
                <li>
                    <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                    Inicio
                    </Link>
                </li>
                <li>
                    <Link href="/propiedades" className="text-gray-300 hover:text-white transition-colors">
                    Propiedades
                    </Link>
                </li>
                <li>
                    <Link href="/nosotros" className="text-gray-300 hover:text-white transition-colors">
                    Nosotros
                    </Link>
                </li>
                <li>
                    <Link href="/servicios" className="text-gray-300 hover:text-white transition-colors">
                    Servicios
                    </Link>
                </li>
                <li>
                    <Link href="/contacto" className="text-gray-300 hover:text-white transition-colors">
                    Contacto
                    </Link>
                </li>
                </ul>
            </div>

            {/* Servicios */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Servicios</h3>
                <ul className="space-y-2">
                <li>
                    <Link href="/servicios#compra-venta" className="text-gray-300 hover:text-white transition-colors">
                    Compra y Venta
                    </Link>
                </li>
                <li>
                    <Link href="/servicios#alquileres" className="text-gray-300 hover:text-white transition-colors">
                    Alquileres
                    </Link>
                </li>
                <li>
                    <Link href="/servicios#tasaciones" className="text-gray-300 hover:text-white transition-colors">
                    Tasaciones
                    </Link>
                </li>
                <li>
                    <Link href="/servicios#administracion" className="text-gray-300 hover:text-white transition-colors">
                    Administración
                    </Link>
                </li>
                <li>
                    <Link href="/servicios#inversiones" className="text-gray-300 hover:text-white transition-colors">
                    Asesoramiento
                    </Link>
                </li>
                </ul>
            </div>

            {/* Contacto */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Contacto</h3>
                <div className="space-y-3">
                <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0" />
                    <span className="text-gray-300">
                    Córdoba 1234, Rosario<br />
                    Santa Fe, Argentina
                    </span>
                </div>
                <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                    <a href="tel:+543411234567" className="text-gray-300 hover:text-white transition-colors">
                    +54 341 123-4567
                    </a>
                </div>
                <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                    <a href="mailto:info@inmomax.com" className="text-gray-300 hover:text-white transition-colors">
                    info@inmomax.com
                    </a>
                </div>
                </div>

                {/* Horarios */}
                <div className="mt-4">
                <h4 className="font-semibold mb-2">Horarios de Atención</h4>
                <div className="text-sm text-gray-300">
                    <p>Lun - Vie: 9:00 - 18:00</p>
                    <p>Sáb: 9:00 - 13:00</p>
                    <p>Dom: Cerrado</p>
                </div>
                </div>
            </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-gray-300 text-sm mb-4 md:mb-0">
                © 2024 InmoMax. Todos los derechos reservados.
                </div>
                <div className="flex space-x-6 text-sm">
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                    Política de Privacidad
                </Link>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                    Términos y Condiciones
                </Link>
                </div>
            </div>
            </div>
        </div>
        </footer>
    );
}
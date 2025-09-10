import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Home, Search, Users, Briefcase, Phone } from 'lucide-react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        { href: '/', label: 'Inicio', icon: Home },
        { href: '/propiedades', label: 'Propiedades', icon: Search },
        { href: '/nosotros', label: 'Nosotros', icon: Users },
        { href: '/servicios', label: 'Servicios', icon: Briefcase },
        { href: '/contacto', label: 'Contacto', icon: Phone },
    ];

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
                <div className="bg-primary-600 text-white p-2 rounded-lg">
                <Home className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold text-gray-800">InmoMax</span>
            </Link>

            {/* Menu desktop */}
            <div className="hidden md:flex space-x-8">
                {menuItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className="text-gray-700 hover:text-primary-600 transition-colors font-medium flex items-center space-x-1"
                >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                </Link>
                ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
                <Link
                href="/contacto"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                Contactar
                </Link>
            </div>

            {/* Mobile menu button */}
            <button
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
                <div className="space-y-2">
                {menuItems.map((item) => (
                    <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                    >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    </Link>
                ))}
                <Link
                    href="/contacto"
                    className="block mx-4 mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-center font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                >
                    Contactar
                </Link>
                </div>
            </div>
            )}
        </div>
        </nav>
    );
}
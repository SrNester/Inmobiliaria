import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
        id: 1,
        text: '¡Hola! Soy el asistente virtual de InmoMax. ¿En qué puedo ayudarte hoy?',
        sender: 'bot',
        timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
        inputRef.current.focus();
        }
    }, [isOpen]);

    const respuestasAutomaticas = {
        'hola': '¡Hola! ¿Cómo estás? ¿En qué te puedo ayudar hoy?',
        'propiedades': 'Tenemos una gran variedad de propiedades disponibles. ¿Buscas algo específico? Puedo ayudarte con casas, departamentos, locales comerciales o terrenos.',
        'precio': 'Los precios varían según la ubicación, tipo y características de la propiedad. ¿Te interesa alguna zona en particular?',
        'alquiler': 'Manejamos alquileres tradicionales y temporales. ¿Qué tipo de propiedad necesitas y por cuánto tiempo?',
        'venta': '¿Estás buscando comprar o vender una propiedad? Puedo orientarte en ambos casos.',
        'ubicacion': 'Trabajamos principalmente en Rosario y zona metropolitana. ¿Hay algún barrio que te interese?',
        'contacto': 'Puedes contactarnos al +54 341 123-4567 o por email a info@inmomax.com. También puedes agendar una cita desde nuestra página.',
        'horarios': 'Nuestros horarios son: Lunes a Viernes de 9:00 a 18:00, Sábados de 9:00 a 13:00. Los domingos estamos cerrados.',
        'gracias': '¡De nada! Es un placer ayudarte. ¿Hay algo más en lo que pueda asistirte?',
        'adios': '¡Hasta luego! Si necesitas ayuda, no dudes en escribirme. ¡Que tengas un excelente día!',
        'default': 'Entiendo tu consulta. Para brindarte la mejor atención, te sugiero que te comuniques directamente con uno de nuestros agentes al +54 341 123-4567 o agenda una cita desde nuestra página.'
    };

    const getResponse = (message) => {
        const msgLower = message.toLowerCase();
        
        // Buscar coincidencias de palabras clave
        for (const [key, response] of Object.entries(respuestasAutomaticas)) {
        if (key !== 'default' && msgLower.includes(key)) {
            return response;
        }
        }
        
        // Si no hay coincidencias, usar respuesta por defecto
        return respuestasAutomaticas.default;
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
        id: messages.length + 1,
        text: inputMessage,
        sender: 'user',
        timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        // Simular tiempo de respuesta del bot
        setTimeout(() => {
        const botResponse = {
            id: messages.length + 2,
            text: getResponse(inputMessage),
            sender: 'bot',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
        }, 1000 + Math.random() * 1000); // 1-2 segundos
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('es-AR', { 
        hour: '2-digit', 
        minute: '2-digit' 
        });
    };

    const quickReplies = [
        '¿Tienen propiedades en alquiler?',
        '¿Cuáles son sus horarios?',
        '¿Cómo puedo contactarlos?',
        '¿Qué zonas cubren?'
    ];

    return (
        <>
        {/* Widget cerrado */}
        {!isOpen && (
            <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-all z-50 hover:scale-110"
            >
            <MessageCircle className="w-6 h-6" />
            </button>
        )}

        {/* Widget abierto */}
        {isOpen && (
            <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
            {/* Header */}
            <div className="bg-primary-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-1 rounded-full">
                    <Bot className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-semibold">Asistente InmoMax</h3>
                    <p className="text-xs opacity-90">En línea</p>
                </div>
                </div>
                <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                >
                <X className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                    <div className={`p-2 rounded-full ${
                        message.sender === 'user' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                        {message.sender === 'user' ? (
                        <User className="w-3 h-3" />
                        ) : (
                        <Bot className="w-3 h-3" />
                        )}
                    </div>
                    <div>
                        <div className={`p-3 rounded-lg ${
                        message.sender === 'user'
                            ? 'bg-primary-600 text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                        }`}>
                        <p className="text-sm">{message.text}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                        {formatTime(message.timestamp)}
                        </p>
                    </div>
                    </div>
                </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                <div className="flex justify-start">
                    <div className="flex items-start space-x-2 max-w-[80%]">
                    <div className="bg-gray-200 text-gray-600 p-2 rounded-full">
                        <Bot className="w-3 h-3" />
                    </div>
                    <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-sm">
                        <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                    </div>
                    </div>
                </div>
                )}

                {/* Quick replies */}
                {messages.length === 1 && !isTyping && (
                <div className="space-y-2">
                    <p className="text-xs text-gray-500 text-center">Preguntas frecuentes:</p>
                    {quickReplies.map((reply, index) => (
                    <button
                        key={index}
                        onClick={() => {
                        setInputMessage(reply);
                        setTimeout(() => handleSendMessage(), 100);
                        }}
                        className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
                    >
                        {reply}
                    </button>
                    ))}
                </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
                <div className="flex space-x-2">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isTyping}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send className="w-4 h-4" />
                </button>
                </div>
            </div>
            </div>
        )}
        </>
    );
}
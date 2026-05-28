export const items = [
    {
        label: 'Sobre Nosotros',
        bgColor: '#06040E',
        textColor: '#F9F4F4',
        links: [
            { label: 'Inicio', href: '/' },
            { label: 'Créditos', href: '/creditos' },
            { label: 'Terminos y Condiciones', href: '/terminos' }
        ]
    },
    {
        label: 'Métodos',
        bgColor: '#0A0A13',
        textColor: '#F9F4F4',
        links: [
            { label: 'OTP', href: '/metodos/one-time-pad' },
            { label: 'Playfair', href: '/metodos/playfair' },
            { label: 'Caesar', href: '/metodos/caesar' },
            { label: 'Más Métodos', href: '/metodos' }
        ]
    },
    {
        label: 'Mi Perfil',
        bgColor: '#13824522',
        textColor: '#F9F4F4',
        links: [
            { label: 'Mi Perfil', href: '/perfil' }
        ]
    }
];

export const buttons = [
    {
        label: 'Iniciar Sesión',
        href: '/login',
        state: "unknown"
    },
    {
        label: 'Perfil',
        href: '/perfil',
        state: "logged-in"
    }
];
export const items = [
    {
        label: 'Sobre Nosotros',
        bgColor: '#06040E',
        textColor: '#F9F4F4',
        links: [
            { label: 'Inicio', href: '/' },
            { label: 'FAQ', href: '/faq' },
            { label: 'Créditos', href: '/creditos' },
            { label: 'Terminos y Condiciones', href: '/terminos' }
        ]
    },
    {
        label: 'Métodos',
        bgColor: '#0A0A13',
        textColor: '#F9F4F4',
        links: [
            { label: 'OTP', href: '/metodos/otp' },
            { label: 'Playfair', href: '/metodos/playfair' },
            { label: 'Caesar', href: '/metodos/caesar' },
            { label: 'Más Métodos', href: '/metodos' }
        ]
    },
    {
        label: 'Ranking',
        bgColor: '#13824522',
        textColor: '#F9F4F4',
        links: [
            { label: 'Ranking Global', href: '/ranking/global' },
            { label: 'Mis Puntajes', href: '/profile/mis-notas' }
        ]
    }
];

export const buttons = [
    {
        label: 'Iniciar Sesión / Crear Cuenta',
        href: '/log-in',
        state: "uknown"
    },
    {
        label: 'Perfil',
        href: '/profile',
        state: "logged-in"
    }
];
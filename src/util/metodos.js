export const metodos = [
    {
        nombre: 'One-Time Pad',  
        descripcion_corta: 'Cifra un mensaje con una clave aleatoria y secreta.',
        descripcion: 'Sistema simétrico que usa una clave aleatoria tan larga como el mensaje y emplea operaciones XOR. Si la clave es verdaderamente aleatoria, secreta y se usa solo una vez, ofrece seguridad matemática perfecta e imposible de romper por fuerza bruta.',
        href: '/metodos/one-time-pad',
        icono: 'fa-solid fa-key'
    },
    {
        nombre: 'Playfair',  
        descripcion_corta: 'Cifrado con una matriz de 5x5.',
        descripcion: 'Cifrado de sustitución por pares de letras usando una matriz de 5x5 construida con una palabra clave. Aplica reglas según filas, columnas o rectángulos para transformar los dígitos. Fue utilizado históricamente en comunicaciones militares y diplomáticas.',
        href: '/metodos/playfair',
        icono: 'fa-solid fa-table-cells'
    },
    {
        nombre: 'Caesar',  
        descripcion_corta: 'Cifrado de sustitución simple con desplazamiento fijo.',
        descripcion: 'Cifrado de sustitución simple donde cada letra del mensaje se reemplaza por otra desplazada un número fijo de posiciones en el alfabeto. Atribuido a Julio César, es fácil de implementar pero muy vulnerable al análisis de frecuencias y fuerza bruta.',
        href: '/metodos/caesar',
        icono: 'fa-solid fa-arrow-right-arrow-left'
    },
    {
        nombre: 'Vigenère',  
        descripcion_corta: 'Cifra un texto usando una palabra clave.',
        descripcion: 'Cifrado polialfabético que usa una palabra clave repetida para determinar desplazamientos distintos sobre el alfabeto. Durante siglos se consideró casi indescifrable. Permite que la misma letra en claro se cifre de múltiples formas, ocultando patrones simples.',
        href: '/metodos/vigenere',
        icono: 'fa-solid fa-layer-group'
    },
    {
        nombre: 'Hill',  
        descripcion_corta: 'Cifrado por sustitución que usa matrices.',
        descripcion: 'Cifrado por bloques que aplica álgebra lineal sobre grupos de letras. Representa el texto como vectores y usa una matriz clave invertible módulo un número asociado al alfabeto. Fue uno de los primeros cifrados en usar formalmente matrices y operaciones matemáticas.',
        href: '/metodos/hill',
        icono: 'fa-solid fa-table-list'
    },
    {
        nombre: 'Homophonic',  
        descripcion_corta: 'Cifrado que sustituye letras por símbolos para ocultar frecuencias.',
        descripcion: 'Cifrado de sustitución que asigna varios símbolos posibles a cada letra, según su frecuencia en el idioma. Busca aplanar la distribución estadística del texto cifrado y dificultar el análisis de frecuencia. Se utilizó en servicios de inteligencia.',
        href: '/metodos/homophonic',
        icono: 'fa-solid fa-arrow-down-a-z'
    },
    {
        nombre: 'Turning Grille',  
        descripcion_corta: 'Cifrado de transposición que emplea una rejilla.',
        descripcion: 'Cifrado por transposición que emplea una rejilla perforada colocada sobre una matriz. El mensaje se escribe en los huecos visibles, se gira la rejilla en posiciones predefinidas y se continúa llenando. El texto cifrado se obtiene leyendo la matriz en un orden específico.',
        href: '/metodos/turning-grille',
        icono: 'fa-solid fa-square-check'
    },
    {
        nombre: 'Hayhanen',  
        descripcion_corta: 'Sistema de cifrado que usa un tablero de ajedrez.',
        descripcion: 'Cifrado asociado a comunicaciones de espías, donde letras se sustituyen por secuencias numéricas. Los números se camuflan como datos cotidianos. Su fuerza radica en pasar desapercibido más que en la complejidad matemática.',
        href: '/metodos/hayhanen',
        icono: 'fa-solid fa-shuffle'
    },
    {
        nombre: 'DES/3DES',  
        descripcion_corta: 'Estándar de Encriptación de Datos.',
        descripcion: 'Cifrado simétrico de bloque que opera sobre 64 bits con claves efectivas de 56 bits. Fue estándar durante décadas, pero hoy se considera vulnerable frente a ataques de fuerza bruta. Variantes como 2DES y 3DES aplican múltiples rondas para ampliar la seguridad y la vida útil.',
        href: '/metodos/des-3des',
        icono: 'fa-solid fa-cubes'
    },
    {
        nombre: 'AES',  
        descripcion_corta: 'Estándar de Encriptación Avanzada.',
        descripcion: 'Estándar moderno de cifrado simétrico usado en HTTPS, VPNs y cifrado de discos. Opera sobre bloques de 128 bits con claves de 128, 192 o 256 bits, aplicando rondas de sustitución, permutación y mezcla de bytes. Ofrece alta seguridad y buen rendimiento en hardware y software.',
        href: '/metodos/aes',
        icono: 'fa-solid fa-shield-halved'
    },
    {
        nombre: 'RSA',
        descripcion_corta: 'Sistema criptográfico de clave pública.',
        descripcion: 'Cifrado de clave pública basado en la dificultad de factorizar enteros grandes. Cada usuario posee una clave pública para cifrar y una clave privada para descifrar. Aunque es lento para grandes volúmenes, se usa ampliamente para intercambio seguro de claves y firmas.',
        href: '/metodos/rsa',
        icono: 'fa-solid fa-table-cells-row-lock'
    },
    {
        nombre: 'Gamal',
        descripcion_corta: 'Algoritmo usa la resolución de logaritmos discretos.',
        descripcion: 'Esquema de clave pública basado en el problema del logaritmo discreto. Produce cifrados probabilísticos: el mismo mensaje genera salidas distintas gracias a valores aleatorios. Sirve como base para sistemas de cifrado y firma.',
        href: '/metodos/gamal',
        icono: 'fa-solid fa-dice'
    }
]
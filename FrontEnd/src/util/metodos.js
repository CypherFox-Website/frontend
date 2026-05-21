// utils/metodos.js
export const metodos = {
    'one-time-pad': {
        nombre: 'One-Time Pad',
        clave: 'one_time_pad',
        descripcion_corta: 'Cifra un mensaje con una clave aleatoria y secreta.',
        descripcion: 'Sistema simétrico que usa una clave aleatoria tan larga como el mensaje y emplea operaciones XOR. Si la clave es verdaderamente aleatoria, secreta y se usa solo una vez, ofrece seguridad matemática perfecta e imposible de romper por fuerza bruta.',
        href: '/metodos/one-time-pad',
        icono: 'fa-solid fa-key',
        lab_cifrado: {
            descripcion: "Dado un mensaje y una clave del mismo tamaño, cifra el mensaje usando One-Time Pad.",
            parametros: [
                ["mensaje", "str"],
                ["clave", "str"],
            ],
            salida: "str",
            ejemplos: [
                { parametros: ["HELLO", "XMCKL"], resultados: "EQNVZ" },
                { parametros: ["ONE TIME PAD", "SECRETSECRET"], resultados: "GZX DVQQ ZTL" },
                { parametros: ["ABC", "XYZ"], resultados: "XZB" },
                { parametros: ["CRYPTO", "RANDOM"], resultados: "TYMWFD" },
                { parametros: ["ATTACK AT DAWN", "LEMONLEMONLE"], resultados: "LXFOPV EF RNHR" }
            ]
        },
        lab_descifrado: {
            descripcion: "Dado un mensaje cifrado en letras y la misma clave, recupera el original usando One-Time Pad.",
            parametros: [
                ["cifrado", "str"],
                ["clave", "str"],
            ],
            salida: "str",
            ejemplos: [
                { parametros: ["EQNVZ", "XMCKL"], resultados: "HELLO" },
                { parametros: ["GZX DVQQ ZTL", "SECRETSECRET"], resultados: "ONE TIME PAD" },
                { parametros: ["XZB", "XYZ"], resultados: "ABC" },
                { parametros: ["TYMWFD", "RANDOM"], resultados: "CRYPTO" },
                { parametros: ["LXFOPV EF RNHR", "LEMONLEMONLE"], resultados: "ATTACK AT DAWN" }
            ]
        }
    },
    'playfair': {
        nombre: 'Playfair',
        clave: 'playfair',
        descripcion_corta: 'Cifrado con una matriz de 5x5.',
        descripcion: 'Cifrado de sustitución por pares de letras usando una matriz de 5×5 construida a partir de una palabra clave. Antes de cifrar se preparan los dígrafos (J→I, insertar X entre letras iguales en un par y añadir X si queda una letra suelta). Se aplican reglas distintas según si las letras comparten fila, columna o forman un rectángulo.',
        href: '/metodos/playfair',
        icono: 'fa-solid fa-table-cells',
        lab_cifrado: {
            descripcion: "Dado un mensaje y una clave del mismo tamaño, cifra el mensaje usando Playfair.",
            parametros: [
                ["mensaje", "str"],
                ["clave", "str"]
            ],
            salida: "str",
            ejemplos: [
                { parametros: ["HELLO", "PLAYFAIR"], resultados: "KGYVRV" },
                { parametros: ["LA", "PLAYFAIR"], resultados: "AY" },
                { parametros: ["PI", "PLAYFAIR"], resultados: "IE" },
                { parametros: ["BALLOON", "PLAYFAIR"], resultados: "HBYVRVQO" },
                { parametros: ["JAVA", "PLAYFAIR"], resultados: "BPWL" }
            ]
        },
        lab_descifrado: {
            descripcion: "Dado un mensaje cifrado en letras y la misma clave, recupera el original usando Playfair.",
            parametros: [
                ["cifrado", "str"],
                ["clave", "str"]
            ],
            salida: "str",
            ejemplos: [
                { parametros: ["KGYVRV", "PLAYFAIR"], resultados: "HELXLO" },
                { parametros: ["AY", "PLAYFAIR"], resultados: "LA" },
                { parametros: ["IE", "PLAYFAIR"], resultados: "PI" },
                { parametros: ["HBYVRVQO", "PLAYFAIR"], resultados: "BALXLOON" },
                { parametros: ["BPWL", "PLAYFAIR"], resultados: "IAVA" }
            ]
        }
    },
    'caesar': {
        nombre: 'Caesar',
        clave: 'caesar',
        descripcion_corta: 'Cifrado de sustitución simple con desplazamiento fijo.',
        descripcion: 'Cifrado de sustitución simple donde cada letra del mensaje se reemplaza por otra desplazada un número fijo de posiciones en el alfabeto. Atribuido a Julio César, es fácil de implementar pero muy vulnerable al análisis de frecuencias y fuerza bruta.',
        href: '/metodos/caesar',
        icono: 'fa-solid fa-arrow-right-arrow-left',
        lab_cifrado: {
            descripcion: "Dada una clave k, cifra el texto desplazando k caracteres.",
            parametros: [
                ["k", "int"],
                ["mensaje", "str"],
            ],
            salida: "str",
            ejemplos: [
                { parametros: [14, "CAESAR"], resultados: "QOSGOF" },
                { parametros: [3, "HOLA MUNDO"], resultados: "KROD PXQGR" },
                { parametros: [1, "XYZ"], resultados: "YZA" },
                { parametros: [25, "B"], resultados: "A" },
                { parametros: [5, "FOX"], resultados: "KTC" }
            ]
        },
        lab_descifrado: {
            descripcion: "Dada una clave k, descifra el texto retrocediendo k caracteres.",
            parametros: [
                ["k", "int"],
                ["cifrado", "str"],
            ],
            salida: "str",
            ejemplos: [
                { parametros: [14, "QOSGOF"], resultados: "CAESAR" },
                { parametros: [3, "KROD PXQGR"], resultados: "HOLA MUNDO" },
                { parametros: [1, "YZA"], resultados: "XYZ" },
                { parametros: [25, "A"], resultados: "B" },
                { parametros: [5, "KTC"], resultados: "FOX" }
            ]
        }
    },
    'vigenere': {
        nombre: 'Vigenere',
        clave: 'vigenere',
        descripcion_corta: 'Cifra un texto usando una palabra clave.',
        descripcion: 'Cifrado polialfabético que usa una palabra clave repetida para determinar desplazamientos distintos sobre el alfabeto. Durante siglos se consideró casi indescifrable. Permite que la misma letra en claro se cifre de múltiples formas, ocultando patrones simples.',
        href: '/metodos/vigenere',
        icono: 'fa-solid fa-layer-group',
        lab_cifrado: {
            descripcion: "Dado un mensaje y una clave, cifra el mensaje usando el cifrado de Vigenère.",
            parametros: [
                ["mensaje", "str"],
                ["clave", "str"],
            ],
            salida: "str",
            ejemplos: [
                { parametros: ["ATAQUE", "LIMON"], resultados: "LBMEHP" },
                { parametros: ["HOLA MUNDO", "CLAVE"], resultados: "JZLV QWYDJ" },
                { parametros: ["HELLO WORLD", "KEY"], resultados: "RIJVS UYVJN" },
                { parametros: ["CIFRADO", "VIGENERE"], resultados: "XQLVNHF" },
                { parametros: ["SECRETO", "CLAVE"], resultados: "UPCMIVZ" }
            ]
        },
        lab_descifrado: {
            descripcion: "Dado un mensaje cifrado y la misma clave, recupera el mensaje original usando el cifrado de Vigenère.",
            parametros: [
                ["cifrado", "str"],
                ["clave", "str"],
            ],
            salida: "str",
            ejemplos: [
                { parametros: ["LBMEHP", "LIMON"], resultados: "ATAQUE" },
                { parametros: ["JZLV QWYDJ", "CLAVE"], resultados: "HOLA MUNDO" },
                { parametros: ["RIJVS UYVJN", "KEY"], resultados: "HELLO WORLD" },
                { parametros: ["XQLVNHF", "VIGENERE"], resultados: "CIFRADO" },
                { parametros: ["UPCMIVZ", "CLAVE"], resultados: "SECRETO" }
            ]
        }
    },
    'hill': {
        nombre: 'Hill',
        clave: 'hill',
        descripcion_corta: 'Cifrado por sustitución que usa matrices.',
        descripcion: 'Cifrado por bloques que aplica álgebra lineal sobre grupos de letras. Representa bloques de texto como matrices y los multiplica por una matriz clave invertible en módulo 26. Fue el primer sistema criptográfico en usar álgebra lineal formalmente, propuesto por Lester S. Hill en 1929.',
        href: '/metodos/hill',
        icono: 'fa-solid fa-table-list',
        lab_cifrado: {
            descripcion: "Dado un mensaje y una clave del mismo tamaño, cifra el mensaje usando Hill.",
            parametros: [
                ["mensaje", "str"],
                ["clave", "str"],
            ],
            salida: "str",
            ejemplos: [
                { parametros: ["JULY", "LIDH"], resultados: "DELW" },
                { parametros: ["HELP", "GYBN"], resultados: "HKEB" },
                { parametros: ["ATTACK", "GYBN"], resultados: "HKEBUD" },
                { parametros: ["MATH", "DCBA"], resultados: "CAXS" },
                { parametros: ["HELLO", "LIDH"], resultados: "DEBPXX" }
            ]
        },
        lab_descifrado: {
            descripcion: "Dado un mensaje cifrado en letras y la misma clave, recupera el original usando Hill.",
            parametros: [
                ["cifrado", "str"],
                ["clave", "str"],
            ],
            salida: "str",
            ejemplos: [
                { parametros: ["DELW", "LIDH"], resultados: "JULY" },
                { parametros: ["HKEB", "GYBN"], resultados: "HELP" },
                { parametros: ["HKEBUD", "GYBN"], resultados: "ATTACK" },
                { parametros: ["CAXS", "DCBA"], resultados: "MATH" },
                { parametros: ["DEBPXX", "LIDH"], resultados: "HELLOXX" }
            ]
        }
    },
    'homophonic': {
        nombre: 'Homophonic',
        clave: 'homophonic',
        descripcion_corta: 'Cifrado que sustituye letras por símbolos para ocultar frecuencias.',
        descripcion: 'Cifrado de sustitución que asigna varios símbolos posibles a cada letra, según su frecuencia en el idioma. Busca aplanar la distribución estadística del texto cifrado y dificultar el análisis de frecuencia. Se utilizó en servicios de inteligencia.',
        href: '/metodos/homophonic',
        icono: 'fa-solid fa-arrow-down-a-z',
        config: `import random
# Alfabeto homofonico: cada letra tiene un pool de números asignados
# segun su frecuencia en inglés. Los pools son DISJUNTOS (0-99).
alfabeto = {
    'A': [9, 12, 33, 47, 53, 67, 78, 92],
    'B': [48, 81],
    'C': [13, 41, 62],
    'D': [1, 3, 45, 79],
    'E': [14, 16, 24, 44, 46, 55, 57, 64, 74, 82, 87, 98],
    'F': [10, 31],
    'G': [6, 25],
    'H': [23, 39, 50, 56, 65, 68],
    'I': [32, 70, 73, 83, 88, 93],
    'J': [15],
    'K': [4],
    'L': [26, 37, 51, 84],
    'M': [22, 27],
    'N': [18, 58, 59, 66, 71, 91],
    'O': [0, 5, 7, 54, 72, 90, 99],
    'P': [38, 95],
    'Q': [94],
    'R': [29, 35, 40, 42, 77, 80],
    'S': [11, 19, 36, 76, 86, 96],
    'T': [17, 20, 30, 43, 49, 69, 75, 85, 97],
    'U': [8, 61, 63],
    'V': [34],
    'W': [60, 89],
    'X': [28],
    'Y': [21, 52],
    'Z': [2],
}
# Semilla fija para reproducibilidad en la evaluacion automatica
random.seed(2153)
`,
        lab_cifrado: {
            descripcion: "Dado un mensaje y el diccionario de homófonos (clave), cifra el mensaje eligiendo aleatoriamente un número del pool de cada letra. Usa random.seed(2153) antes de llamar a la función.",
            parametros: [
                ["mensaje", "str"],
                ["clave", "dict"],
            ],
            salida: "list",
            ejemplos: [
                { parametros: ["CRYPTOISFUN", "alfabeto"], resultados: [13, 29, 21, 38, 17, 0, 19, 10, 8, 18] },
                { parametros: ["HELLO", "alfabeto"], resultados: [65, 14, 26, 26, 99] },
                { parametros: ["FOX", "alfabeto"], resultados: [31, 99, 28] },
                { parametros: ["SECRET", "alfabeto"], resultados: [19, 16, 13, 29, 16, 20] },
                { parametros: ["KEY", "alfabeto"], resultados: [4, 14, 52] },
            ]
        },
        lab_descifrado: {
            descripcion: "Dado un mensaje cifrado como lista de enteros y el mismo diccionario (clave), recupera el texto original usando el mapa inverso.",
            parametros: [
                ["cifrado", "list"],
                ["clave", "dict"],
            ],
            salida: "str",
            ejemplos: [
                { parametros: [[13, 29, 21, 38, 17, 0, 19, 10, 8, 18], "alfabeto"], resultados: "CRYPTOISFUN" },
                { parametros: [[65, 14, 26, 26, 99], "alfabeto"], resultados: "HELLO" },
                { parametros: [[31, 99, 28], "alfabeto"], resultados: "FOX" },
                { parametros: [[19, 16, 13, 29, 16, 20], "alfabeto"], resultados: "SECRET" },
                { parametros: [[4, 14, 52], "alfabeto"], resultados: "KEY" },
            ]
        },
    },
    'turning-grille': {
        nombre: 'Turning Grille',
        clave: 'turning-grille',
        descripcion_corta: 'Cifrado de transposición que emplea una rejilla.',
        descripcion: 'Cifrado por transposición que emplea una rejilla perforada colocada sobre una matriz. El mensaje se escribe en los huecos visibles, se gira la rejilla en posiciones predefinidas y se continúa llenando. El texto cifrado se obtiene leyendo la matriz por filas.',
        href: '/metodos/turning-grille',
        icono: 'fa-solid fa-square-check',
        config: `grilla = [(0, 0), (2, 1), (2, 3), (3, 2)] \n`,
        lab_cifrado: {
            descripcion: "Dado el tamaño de la retícula, el sentido de giro, la lista de agujeros y un mensaje, cifra el texto escribiendo letra por letra en los agujeros visibles durante 4 rotaciones. El resultado final debe leerse por filas y devolverse agrupado por el tamaño de la retícula.",
            parametros: [
                ["reticula", "int"],
                ["sentido", "bool"],
                ["agujeros", "list[tuple]"],
                ["mensaje", "str"],
            ],
            salida: "str",
            ejemplos: [
                { parametros: [4, true, "grilla", "JIMA TTAC KSAT DAWN"], resultados: "JKTD SAAT WIAM CNAT" },
                { parametros: [4, true, "grilla", "HELLO"], resultados: "HXOX XXXX XEXL XXLX" },
                { parametros: [4, true, "grilla", "ATTACKATDAWN"], resultados: "ADCX AXWK XTAT TXAN" },
                { parametros: [4, true, "grilla", "TURN"], resultados: "TXXX XXXX XUXR XXNX" },
                { parametros: [4, true, "grilla", "GRID"], resultados: "GXXX XXXX XRXI XXDX" },
            ]
        },
        lab_descifrado: {
            descripcion: "Dado el tamaño de la retícula, el sentido de giro, la lista de agujeros y un texto cifrado leído por filas, recupera el mensaje original extrayendo las letras visibles en los agujeros a lo largo de las 4 rotaciones. Devuelve el resultado agrupado por el tamaño de la retícula.",
            parametros: [
                ["reticula", "int"],
                ["sentido", "bool"],
                ["agujeros", "list[tuple]"],
                ["clave", "str"],
            ],
            salida: "str",
            ejemplos: [
                { parametros: [4, true, "grilla", "JKTD SAAT WIAM CNAT"], resultados: "JIMA TTAC KSAT DAWN" },
                { parametros: [4, true, "grilla", "HXOX XXXX XEXL XXLX"], resultados: "HELL OXXX XXXX XXXX" },
                { parametros: [4, true, "grilla", "ADCX AXWK XTAT TXAN"], resultados: "ATTA CKAT DAWN XXXX" },
                { parametros: [4, true, "grilla", "TXXX XXXX XUXR XXNX"], resultados: "TURN XXXX XXXX XXXX" },
                { parametros: [4, true, "grilla", "GXXX XXXX XRXI XXDX"], resultados: "GRID XXXX XXXX XXXX" },
            ]
        },
    },
    'des': {
        nombre: 'DES',
        clave: 'des',
        descripcion_corta: 'Estándar de Encriptación de Datos.',
        descripcion: 'Cifrado simétrico de bloque que opera sobre bloques de 64 bits y usa una clave efectiva de 56 bits (más bits de paridad). Aplica una permutación inicial, 16 rondas de Feistel y una permutación final. Aunque fue un estándar histórico muy importante, hoy se considera inseguro frente a fuerza bruta.',
        href: '/metodos/des',
        icono: 'fa-solid fa-cubes',
        lab_cifrado: {
            descripcion: "Dado un bloque de texto plano en hexadecimal y una clave hexadecimal, cifra el bloque usando DES. Tanto el mensaje como la clave deben representarse con 16 caracteres hexadecimales.",
            parametros: [
                ["mensaje", "hex"],
                ["clave", "hex"],
            ],
            salida: "hex",
            ejemplos: [
                {
                    parametros: ["0123456789ABCDEF", "133457799BBCDFF1"],
                    resultados: "85E813540F0AB405"
                },
                {
                    parametros: ["8000000000000000", "0101010101010101"],
                    resultados: "95F8A5E5DD31D900"
                },
                {
                    parametros: ["4000000000000000", "0101010101010101"],
                    resultados: "DD7F121CA5015619"
                },
                {
                    parametros: ["2000000000000000", "0101010101010101"],
                    resultados: "2E8653104F3834EA"
                },
                {
                    parametros: ["1000000000000000", "0101010101010101"],
                    resultados: "4BD388FF6CD81D4F"
                }
            ]
        },
        lab_descifrado: {
            descripcion: "Dado un bloque cifrado en hexadecimal y la misma clave hexadecimal, recupera el bloque original usando DES. Tanto el cifrado como la clave deben representarse con 16 caracteres hexadecimales.",
            parametros: [
                ["cifrado", "hex"],
                ["clave", "hex"],
            ],
            salida: "hex",
            ejemplos: [
                {
                    parametros: ["85E813540F0AB405", "133457799BBCDFF1"],
                    resultados: "0123456789ABCDEF"
                },
                {
                    parametros: ["95F8A5E5DD31D900", "0101010101010101"],
                    resultados: "8000000000000000"
                },
                {
                    parametros: ["DD7F121CA5015619", "0101010101010101"],
                    resultados: "4000000000000000"
                },
                {
                    parametros: ["2E8653104F3834EA", "0101010101010101"],
                    resultados: "2000000000000000"
                },
                {
                    parametros: ["4BD388FF6CD81D4F", "0101010101010101"],
                    resultados: "1000000000000000"
                }
            ]
        }
    },
    'aes': {
        nombre: 'AES',
        clave: 'aes',
        descripcion_corta: 'Estándar de Encriptación Avanzada.',
        descripcion: 'Estándar moderno de cifrado simétrico usado en HTTPS, VPNs y cifrado de discos. Opera sobre bloques de 128 bits con claves de 128, 192 o 256 bits, aplicando rondas de sustitución, permutación y mezcla de bytes. Ofrece alta seguridad y buen rendimiento en hardware y software.',
        href: '/metodos/aes',
        icono: 'fa-solid fa-shield-halved',
        lab_cifrado: {
            descripcion: "Dado un bloque de texto plano en hexadecimal y una clave hexadecimal, cifra el bloque usando AES. El bloque debe representarse con 32 caracteres hexadecimales (128 bits). La clave puede tener 32, 48 o 64 caracteres hexadecimales, correspondientes a AES-128, AES-192 y AES-256 respectivamente.",
            parametros: [
                ["mensaje", "hex"],
                ["clave", "hex"],
            ],
            salida: "hex",
            ejemplos: [
                {
                    parametros: ["414553206573206D757920666163696C", "2B7E151628AED2A6ABF7158809CF4F3C"],
                    resultados: "E448E574A374D90CC33C22AF9B8EAB7F"
                },
                {
                    parametros: ["00112233445566778899AABBCCDDEEFF", "000102030405060708090A0B0C0D0E0F"],
                    resultados: "69C4E0D86A7B0430D8CDB78070B4C55A"
                },
                {
                    parametros: ["00112233445566778899AABBCCDDEEFF", "000102030405060708090A0B0C0D0E0F1011121314151617"],
                    resultados: "DDA97CA4864CDFE06EAF70A0EC0D7191"
                },
                {
                    parametros: ["00112233445566778899AABBCCDDEEFF", "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F"],
                    resultados: "8EA2B7CA516745BFEAFC49904B496089"
                },
                {
                    parametros: ["6BC1BEE22E409F96E93D7E117393172A", "2B7E151628AED2A6ABF7158809CF4F3C"],
                    resultados: "3AD77BB40D7A3660A89ECAF32466EF97"
                }
            ]
        },
        lab_descifrado: {
            descripcion: "Dado un bloque cifrado en hexadecimal y la misma clave hexadecimal, recupera el bloque original usando AES. El bloque cifrado debe representarse con 32 caracteres hexadecimales (128 bits). La clave puede tener 32, 48 o 64 caracteres hexadecimales, correspondientes a AES-128, AES-192 y AES-256 respectivamente.",
            parametros: [
                ["cifrado", "hex"],
                ["clave", "hex"],
            ],
            salida: "hex",
            ejemplos: [
                {
                    parametros: ["E448E574A374D90CC33C22AF9B8EAB7F", "2B7E151628AED2A6ABF7158809CF4F3C"],
                    resultados: "414553206573206D757920666163696C"
                },
                {
                    parametros: ["69C4E0D86A7B0430D8CDB78070B4C55A", "000102030405060708090A0B0C0D0E0F"],
                    resultados: "00112233445566778899AABBCCDDEEFF"
                },
                {
                    parametros: ["DDA97CA4864CDFE06EAF70A0EC0D7191", "000102030405060708090A0B0C0D0E0F1011121314151617"],
                    resultados: "00112233445566778899AABBCCDDEEFF"
                },
                {
                    parametros: ["8EA2B7CA516745BFEAFC49904B496089", "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F"],
                    resultados: "00112233445566778899AABBCCDDEEFF"
                },
                {
                    parametros: ["3AD77BB40D7A3660A89ECAF32466EF97", "2B7E151628AED2A6ABF7158809CF4F3C"],
                    resultados: "6BC1BEE22E409F96E93D7E117393172A"
                }
            ]
        }
    },
    'rsa': {
        nombre: 'RSA',
        descripcion_corta: 'Sistema criptográfico de clave pública.',
        descripcion: 'Cifrado de clave pública basado en la dificultad de factorizar enteros grandes. Cada usuario posee una clave pública para cifrar y una clave privada para descifrar. Aunque es lento para grandes volúmenes, se usa ampliamente para intercambio seguro de claves y firmas.',
        href: '/metodos/rsa',
        icono: 'fa-solid fa-table-cells-row-lock'
    },
    'gamal': {
        nombre: 'Gamal',
        descripcion_corta: 'Algoritmo usa la resolución de logaritmos discretos.',
        descripcion: 'Esquema de clave pública basado en el problema del logaritmo discreto. Produce cifrados probabilísticos: el mismo mensaje genera salidas distintas gracias a valores aleatorios. Sirve como base para sistemas de cifrado y firma.',
        href: '/metodos/gamal',
        icono: 'fa-solid fa-dice'
    }
};

export const metodosLista = Object.values(metodos);
export const TEST_CASES = {
    caesar: {
        encrypt: [
            { k: 14, mensaje: "CAESAR", esperado: "QOSGOF" },
            { k: 3, mensaje: "HOLA MUNDO", esperado: "KROD PXQGR" },
            { k: 1, mensaje: "XYZ", esperado: "YZA" },
            { k: 25, mensaje: "B", esperado: "A" },
            { k: 5, mensaje: "FOX", esperado: "KTC" },
        ],
        decrypt: [
            { k: 14, cifrado: "QOSGOF", esperado: "CAESAR" },
            { k: 3, cifrado: "KROD PXQGR", esperado: "HOLA MUNDO" },
            { k: 1, cifrado: "YZA", esperado: "XYZ" },
            { k: 25, cifrado: "A", esperado: "B" },
            { k: 5, cifrado: "KTC", esperado: "FOX" },
        ],
    },

    vigenere: {
        encrypt: [
            { mensaje: "ATAQUE", clave: "LIMON", esperado: "LBMEHP" },
            { mensaje: "HOLA MUNDO", clave: "CLAVE", esperado: "JZLV QWYDJ" },
            { mensaje: "HELLO WORLD", clave: "KEY", esperado: "RIJVS UYVJN" },
            { mensaje: "CIFRADO", clave: "VIGENERE", esperado: "XQLVNHF" },
            { mensaje: "SECRETO", clave: "CLAVE", esperado: "UPCMIVZ" },
        ],
        decrypt: [
            { cifrado: "LBMEHP", clave: "LIMON", esperado: "ATAQUE" },
            { cifrado: "JZLV QWYDJ", clave: "CLAVE", esperado: "HOLA MUNDO" },
            { cifrado: "RIJVS UYVJN", clave: "KEY", esperado: "HELLO WORLD" },
            { cifrado: "XQLVNHF", clave: "VIGENERE", esperado: "CIFRADO" },
            { cifrado: "UPCMIVZ", clave: "CLAVE", esperado: "SECRETO" },
        ],
    },

    "one-time-pad": {
        encrypt: [
            { mensaje: "HELLO", clave: "XMCKL", esperado: "EQNVZ" },
            { mensaje: "ONE TIME PAD", clave: "SECRETSECRET", esperado: "GZX DVQQ ZTL" },
            { mensaje: "ABC", clave: "XYZ", esperado: "XZB" },
            { mensaje: "CRYPTO", clave: "RANDOM", esperado: "TYMWFD" },
            { mensaje: "ATTACK AT DAWN", clave: "LEMONLEMONLE", esperado: "LXFOPV EF RNHR" },
        ],
        decrypt: [
            { cifrado: "EQNVZ", clave: "XMCKL", esperado: "HELLO" },
            { cifrado: "GZX DVQQ ZTL", clave: "SECRETSECRET", esperado: "ONE TIME PAD" },
            { cifrado: "XZB", clave: "XYZ", esperado: "ABC" },
            { cifrado: "TYMWFD", clave: "RANDOM", esperado: "CRYPTO" },
            { cifrado: "LXFOPV EF RNHR", clave: "LEMONLEMONLE", esperado: "ATTACK AT DAWN" },
        ],
    },

    playfair: {
        encrypt: [
            { mensaje: "HELLO", clave: "PLAYFAIR", esperado: "KGYVRV" },
            { mensaje: "LA", clave: "PLAYFAIR", esperado: "AY" },
            { mensaje: "PI", clave: "PLAYFAIR", esperado: "IE" },
            { mensaje: "BALLOON", clave: "PLAYFAIR", esperado: "HBYVRVQO" },
            { mensaje: "JAVA", clave: "PLAYFAIR", esperado: "BPWL" },
        ],
        decrypt: [
            { cifrado: "KGYVRV", clave: "PLAYFAIR", esperado: "HELXLO" },
            { cifrado: "AY", clave: "PLAYFAIR", esperado: "LA" },
            { cifrado: "IE", clave: "PLAYFAIR", esperado: "PI" },
            { cifrado: "HBYVRVQO", clave: "PLAYFAIR", esperado: "BALXLOON" },
            { cifrado: "BPWL", clave: "PLAYFAIR", esperado: "IAVA" },
        ],
    },

    hill: {
        encrypt: [
            { mensaje: "JULY", clave: "LIDH", esperado: "DELW" },
            { mensaje: "HELP", clave: "GYBN", esperado: "HKEB" },
            { mensaje: "ATTACK", clave: "GYBN", esperado: "HKEBUD" },
            { mensaje: "MATH", clave: "DCBA", esperado: "CAXS" },
            { mensaje: "HELLO", clave: "LIDH", esperado: "DEBPXX" },
        ],
        decrypt: [
            { cifrado: "DELW", clave: "LIDH", esperado: "JULY" },
            { cifrado: "HKEB", clave: "GYBN", esperado: "HELP" },
            { cifrado: "HKEBUD", clave: "GYBN", esperado: "ATTACK" },
            { cifrado: "CAXS", clave: "DCBA", esperado: "MATH" },
            { cifrado: "DEBPXX", clave: "LIDH", esperado: "HELLOXX" },
        ],
    },
};
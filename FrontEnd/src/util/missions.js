const missions_one_time_pad = [
    {
        id: 1,
        title: "Misión 1 · XOR bit a bit",
        description:
            "Cifra en binario usando One-Time Pad. Si M = 1011 y K = 0110, ¿cuál es el cifrado C = M ⊕ K?",
        answer: "1101",
        hint:
            "Aplica XOR bit a bit: 1⊕0, 0⊕1, 1⊕1, 1⊕0. Recuerda la tabla: 0⊕0=0, 0⊕1=1, 1⊕0=1, 1⊕1=0."
    },
    {
        id: 2,
        title: "Misión 2 · Recupera el mensaje",
        description:
            "Sabemos que se cifró con OTP binario y que la clave era K = 1001. Si el cifrado es C = 0110, ¿cuál era el mensaje M original?",
        answer: "1111",
        hint:
            "En OTP, descifrar también es XOR: M = C ⊕ K. Aplica XOR bit a bit entre 0 1 1 0 y 1 0 0 1."
    },
    {
        id: 3,
        title: "Misión 3 · OTP con letras",
        description:
            "Usamos el alfabeto inglés y un One-Time Pad en letras. Si el mensaje es HELLO y la clave es XMCKL, ¿qué cifrado obtienes? Escribe la respuesta en mayúsculas.",
        answer: "EQNVZ",
        hint:
            "Convierte cada letra a número, suma mensaje+clave módulo 26 y vuelve a letras. Por ejemplo H=7, X=23, 7+23=30≡4 → E."
    },
    {
        id: 4,
        title: "Misión 4 · ¿Qué tan larga debe ser la clave?",
        description:
            "Quieres cifrar un mensaje de 20 letras con One-Time Pad alfabético. ¿Cuántas letras debe tener como mínimo la clave K para que el sistema sea realmente un \"pad de un solo uso\"?",
        answer: "20",
        hint:
            "En OTP la clave debe ser al menos tan larga como el mensaje, porque cada posición del mensaje usa una posición distinta de K."
    },
    {
        id: 5,
        title: "Misión 5 · ¿Qué hace tan especial al OTP?",
        description:
            "Responde con una palabra: ¿cómo se llama el tipo de seguridad que tiene el One-Time Pad cuando se usa con una clave realmente aleatoria, tan larga como el mensaje y de un solo uso?",
        answer: "perfecta",
        hint:
            "Shannon demostró que el OTP tiene seguridad \"informacionalmente perfecta\". Busca la palabra clave: seguridad ______."
    }
];

const missions_playfair = [
    {
        id: 1,
        title: "Misión 1 · Preparación del texto",
        description:
            "Antes de cifrar, el texto debe dividirse en pares de letras. Si dos letras iguales quedan juntas en un par, se inserta una X entre ellas. Si al final queda una letra sola, también se añade una X. ¿Cuál es el texto preparado de HELLO?",
        answer: "HELXLO",
        hint:
            "Revisa la regla de preparación del texto en la lección: ¿qué ocurre exactamente cuando dos letras iguales forman un par?",
    },
    {
        id: 2,
        title: "Misión 2 · Construir la matriz",
        description:
            "La clave define el orden de la matriz 5×5. Se escribe la clave sin repetir letras (tratando J como I) y luego se completa con el resto del alfabeto. Con la clave CRYPTO, ¿qué letra ocupa la fila 2, columna 3?",
        answer: "B",
        hint:
            "Introduce la clave CRYPTO en la herramienta de laboratorio de la lección y cuenta tú mismo las filas y columnas.",
    },
    {
        id: 3,
        title: "Misión 3 · Regla de fila",
        description:
            "Cuando las dos letras de un dígrafo están en la misma fila de la matriz, cada una se sustituye por la letra que está inmediatamente a su derecha (de forma circular). Con la clave PLAYFAIR, cifra el dígrafo LA.",
        answer: "AY",
        hint:
            "Cuando dos letras comparten fila, ¿en qué dirección se desplazan? Prueba el cifrador con LA y PLAYFAIR para verificar tu razonamiento.",
    },
    {
        id: 4,
        title: "Misión 4 · Regla de columna",
        description:
            "Cuando las dos letras de un dígrafo comparten la misma columna de la matriz, cada una se sustituye por la letra que está inmediatamente debajo (de forma circular). Con la clave PLAYFAIR, cifra el dígrafo PI.",
        answer: "IE",
        hint:
            "Localiza P e I en la matriz de la lección y comprueba si comparten columna. Luego aplica la dirección que indica la regla de columna.",
    },
    {
        id: 5,
        title: "Misión 5 · Regla de rectángulo",
        description:
            "Cuando las letras de un dígrafo están en filas y columnas distintas, forman las esquinas de un rectángulo en la matriz. Cada letra se sustituye por la que está en su misma fila pero en la columna de la otra. Con la clave PLAYFAIR, cifra el dígrafo AR.",
        answer: "LB",
        hint:
            "Imagina el rectángulo que forman A y R en la matriz: cada una viaja a la esquina opuesta de su misma fila. La sección de reglas geométricas de la lección te muestra exactamente cómo funciona ese intercambio.",
    },
    {
        id: 6,
        title: "Misión 6 · I y J comparten celda",
        description:
            "El alfabeto de Playfair tiene solo 25 letras porque I y J ocupan la misma celda. Antes de preparar cualquier mensaje, todas las J se convierten en I. Si el mensaje es JAVA, ¿cuál es el texto preparado tras aplicar la sustitución J→I y las reglas de dígrаfos?",
        answer: "IAVA",
        hint:
            "Recuerda que hay dos pasos antes de dividir en pares: uno es exclusivo del alfabeto de 25 letras de Playfair. ¿Los has aplicado ambos antes de revisar los pares?",
    }
];

const missions_caesar = [
    {
        id: 1,
        title: "Misión 1 · Descubre la clave",
        description:
            "Tenemos el mensaje CAESAR cifrado como QOSGOF. ¿Cual es la clave k para obtener este cifrado?",
        answer: "14",
        hint:
            "Ajusta la clave k hasta que tu disco produzca QOSGOF a partir de CAESAR. Luego escribe el valor de k. (Usando alfabeto inglés)",
    },
    {
        id: 2,
        title: "Misión 2 · Un nuevo abecedario",
        description:
            "Supón que un atacante ha cifrado el silabario de hiragana japonés. ¿Qué tan grande sería este cifrado?",
        answer: "46",
        hint:
            "Tal vez quieras buscar cuántos caracteres tiene ese silabario. Ese número sería el tamaño del espacio de claves.",
    },
    {
        id: 3,
        title: "Misión 3 · ¿Cuántas claves hay?",
        description:
            "Para el alfabeto que usamos día a día, ¿cuántas claves diferentes de César existen en total?",
        answer: "27",
        hint:
            "Piensa en todas las letras que usamos, recuerda que usamos el espaÑol. Cada valor distinto de k define un cifrado distinto.",
    },
    {
        id: 4,
        title: "Misión 4 · La clave que no hace nada",
        description:
            "Hay un valor de k que no cambia ningún mensaje al cifrarlo: el resultado es exactamente el mismo texto en claro. ¿Cuál es ese valor de k?",
        answer: "0",
        hint:
            "Imagina que en tu disco no giras nada. ¿Qué valor de k corresponde a 'no desplazar' las letras?",
    },
    {
        id: 5,
        title: "Misión 5 · Deshacer una clave",
        description:
            "Si cifras un mensaje con k = 5 y luego vuelves a cifrar el resultado con otra clave k', ¿qué valor de k' necesitas para que el mensaje vuelva a ser el original?",
        answer: "21",
        hint:
            "Busca un número k' tal que 5 + k' sea múltiplo de 26. Recuerda que estamos trabajando módulo 26. (Usando alfabeto inglés)",
    },
    {
        id: 6,
        title: "Misión 6 · ¿Misma clave para todo?",
        description:
            "En un cifrado de César, ¿usar la misma clave k sirve tanto para cifrar como para descifrar? Responde con SI o NO.",
        answer: "NO",
        hint:
            "Para descifrar usamos D_k(y) = (y - k) mod 26. ¿Es lo mismo restar k que volver a sumar k?",
    },
    {
        id: 7,
        title: "Misión 7 · Alfabeto extendido",
        description:
            "Imagina que amplías tu alfabeto a no solo con las letras minúsculas, sino añadimos también las mayúsculas. ¿Cuántas claves posibles de César habría ahora?",
        answer: "52",
        hint:
            "El número de claves posibles siempre coincide con el tamaño del alfabeto que estás usando. (Usando alfabeto inglés)",
    },
];

const missions_vigenere = [
    {
        id: 1,
        title: "Misión 1 · Cifra con Vigenère",
        description:
            "Cifra el mensaje ATAQUE usando la clave LIMON. Aplica la fórmula c_i = (m_i + k_i) mod 26 letra por letra. La clave cicla: L,I,M,O,N,L. Escribe el resultado en mayúsculas.",
        answer: "LBMEHP",
        hint:
            "¿No sabes por dónde empezar? Prueba a usar el cifrador de la lección — escribe ATAQUE como texto y LIMON como clave. ¡La sección 'Cifra tu mensaje secreto' hará el trabajo por ti!"
    },
    {
        id: 2,
        title: "Misión 2 · Descifra el mensaje",
        description:
            "Tienes el mensaje cifrado LBMEHP y sabes que la clave es LIMON. Aplica la fórmula m_i = (c_i - k_i + 26) mod 26 para recuperar el texto original. Escribe el resultado en mayúsculas.",
        answer: "ATAQUE",
        hint:
            "Recuerda que descifrar es la operación inversa: m = (c - k + 26) mod 26. Si tienes dudas, vuelve a la lección y usa el cifrador con ATAQUE y LIMON — verás cómo el resultado de 'Descifrado ✓' confirma el mensaje original."
    },
    {
        id: 3,
        title: "Misión 3 · El ciclo de la clave",
        description:
            "Tienes un mensaje de 12 letras y una clave de 4 letras. ¿Cuántas veces completa la clave su ciclo al cifrar el mensaje entero?",
        answer: "3",
        hint:
            "Divide la longitud del mensaje entre la longitud de la clave: 12 ÷ 4 = ?"
    },
    {
        id: 4,
        title: "Misión 4 · Polialfabético en acción",
        description:
            "Cifra el mensaje BANANA con la clave KEY (cicla como K,E,Y,K,E,Y). La letra A aparece en las posiciones 2, 4 y 6. ¿A qué tres letras cifradas distintas se convierte la A en esas posiciones? Escríbelas juntas en orden, en mayúsculas.",
        answer: "EKY",
        hint:
            "Escribe BANANA como texto y KEY como clave en el cifrador de la lección. Fíjate en la fila 'Cifrado' del visualizador de ciclado — cada A aparece con una letra de clave distinta (E, K, Y) y produce un cifrado diferente. ¡Ese es el poder del cifrado polialfabético!"
    },
    {
        id: 5,
        title: "Misión 5 · Test de Kasiski",
        description:
            "Analizando un texto largo cifrado con Vigenère, encuentras que una misma secuencia de letras se repite. La distancia entre las dos primeras apariciones es 9, y entre la segunda y la tercera es 15. Según el método de Kasiski, ¿cuál es la longitud más probable de la clave?",
        answer: "3",
        hint:
            "El método de Kasiski calcula el Máximo Común Divisor (MCD) de las distancias entre repeticiones. MCD(9, 15) = ?"
    },
    {
        id: 6,
        title: "Misión 6 · Espacio de claves",
        description:
            "Un cifrado César con el alfabeto inglés tiene 26 claves posibles. ¿Cuántas claves posibles tiene un cifrado de Vigenère con una clave de exactamente 3 letras del mismo alfabeto?",
        answer: "17576",
        hint:
            "Cada una de las 3 posiciones de la clave puede ser cualquiera de las 26 letras, de forma independiente. El total es 26 × 26 × 26."
    }
];

const missions_hill = [
    {
        id: 1,
        title: "Misión 1 · Letras a números",
        description:
            "El cifrado de Hill convierte cada letra a su posición en el alfabeto (A=0, B=1, …, Z=25). Si el bloque de mensaje es JULY, ¿cuál es la representación numérica de sus primeras dos letras, J y U? Escribe los dos números separados por un espacio.",
        answer: "9 20",
        hint:
            "Cuenta la posición de cada letra en el alfabeto inglés empezando desde 0. J es la décima letra, U es la vigésimo primera."
    },
    {
        id: 2,
        title: "Misión 2 · Multiplicación mod 26",
        description:
            "El corazón del cifrado Hill es multiplicar el bloque mensaje por la matriz clave en mod 26. Si el vector fila es [9, 20] y la primera columna de K es [11, 3], ¿cuál es el primer elemento del resultado? Es decir, calcula (9×11 + 20×3) mod 26.",
        answer: "3",
        hint:
            "Resuelve paso a paso: 9×11 = 99, 20×3 = 60, 99+60 = 159. Ahora aplica módulo 26: 159 = 6×26 + ?"
    },
    {
        id: 3,
        title: "Misión 3 · Cifra un bloque",
        description:
            "Usando la clave LIDH y el cifrador de la lección, cifra el mensaje JULY. Según la lección, el resultado esperado ya lo conoces. ¿Cuál es el texto cifrado completo?",
        answer: "DELW",
        hint:
            "Usa el cifrador interactivo de la lección con mensaje JULY y clave LIDH. Verifica que la clave LIDH tiene determinante invertible en mod 26."
    },
    {
        id: 4,
        title: "Misión 4 · Determinante de la clave",
        description:
            "La clave KCHB forma la matriz K = [[10,2],[7,1]]. Para que K sea invertible en mod 26, su determinante debe tener inverso multiplicativo. Calcula det(K) mod 26.",
        answer: "22",
        hint:
            "Para una matriz 2×2 [[a,b],[c,d]], det = (a×d - b×c) mod 26. Aquí: (10×1 - 2×7) mod 26."
    },
    {
        id: 5,
        title: "Misión 5 · ¿Es válida esta clave?",
        description:
            "La clave DCBA forma la matriz [[3,2],[1,0]]. Su determinante es (3×0 - 2×1) mod 26 = 24. ¿Existe el inverso multiplicativo de 24 en mod 26? Responde SI o NO.",
        answer: "NO",
        hint:
            "Un número tiene inverso en mod 26 solo si es coprimo con 26, es decir, si gcd(número, 26) = 1. Calcula gcd(24, 26)."
    },
    {
        id: 6,
        title: "Misión 6 · Pad del mensaje",
        description:
            "El cifrado de Hill con bloques de 4 letras exige que el mensaje tenga longitud múltiplo de 4. Si el mensaje es CRYPTOGRAPHY (12 letras), ¿cuántas X de relleno se añaden al final?",
        answer: "0",
        hint:
            "Cuenta las letras de CRYPTOGRAPHY: C-R-Y-P-T-O-G-R-A-P-H-Y. ¿Es ya múltiplo de 4? La fórmula es (4 - (len % 4)) % 4."
    }
];

const missions_homophonic = [
    {
        id: 1,
        title: "Misión 1 · ¿Cuántos homófonos tiene la E?",
        description:
            "En el sistema de CypherFox, la letra E tiene asignados varios homófonos del 0 al 99. Según la tabla de la lección, ¿cuántos valores tiene el pool de la E?",
        answer: "12",
        hint:
            "Revisa la tabla de homófonos de la lección y cuenta los valores listados en la fila de la E. Recuerda que el tamaño del pool es proporcional a la frecuencia de la letra en inglés (~12.7%)."
    },
    {
        id: 2,
        title: "Misión 2 · Descifra el número",
        description:
            "Recibes el símbolo cifrado 14. Usando el mapa inverso del sistema de la lección, ¿a qué letra del alfabeto corresponde?",
        answer: "E",
        hint:
            "Busca el número 14 dentro de los pools de la tabla. Recuerda que los pools son disjuntos: cada número pertenece a exactamente una letra."
    },
    {
        id: 3,
        title: "Misión 3 · ¿Determinístico o probabilístico?",
        description:
            "En el cifrado homofonico, si cifras la letra A dos veces con la misma clave, ¿obtendrás siempre el mismo número? Responde SI o NO.",
        answer: "NO",
        hint:
            "Recuerda cómo funciona el cifrado: E(mᵢ) = random(f(mᵢ)). ¿Qué implica esa aleatoriedad para cada nueva ejecución?"
    },
    {
        id: 4,
        title: "Misión 4 · Pools disjuntos",
        description:
            "Una propiedad clave del cifrado homofonico es que los pools de cada letra son disjuntos. ¿Cuántas letras distintas puede representar el número 48?",
        answer: "1",
        hint:
            "Si los pools son disjuntos (∀ a ≠ b, f(a) ∩ f(b) = ∅), cada número solo puede pertenecer a un pool. Busca el 48 en la tabla."
    },
    {
        id: 5,
        title: "Misión 5 · El tamaño del alfabeto cifrado",
        description:
            "El sistema de CypherFox usa números del 0 al 99 como alfabeto cifrado. ¿Cuántos símbolos tiene en total este alfabeto cifrado |C|?",
        answer: "100",
        hint:
            "Cuenta cuántos números enteros hay desde el 0 hasta el 99 inclusive."
    },
    {
        id: 6,
        title: "Misión 6 · ¿Por qué falla el análisis de frecuencias?",
        description:
            "El análisis de frecuencias clásico falla con el cifrado homofonico porque la distribución de símbolos en el criptograma es aproximadamente uniforme. Si el pool de cada letra tiene tamaño proporcional a su frecuencia, ¿cuál es la probabilidad aproximada de que aparezca cualquier símbolo en el criptograma?",
        answer: "1%",
        hint:
            "Si el alfabeto cifrado tiene 100 símbolos y la distribución es uniforme, P(cⱼ) ≈ 1/100. ¿Cuánto es eso en porcentaje?"
    }
];

const missions_turning_grille = [
    {
        id: 1,
        title: "Misión 1 · ¿Cuántos agujeros necesita una grilla 4×4?",
        description:
            "En una Turning Grille válida de tamaño 4×4, cada agujero genera 4 posiciones distintas al rotar. ¿Cuántos agujeros debe tener la grilla original?",
        answer: "4",
        hint:
            "Usa la condición |H| = n²/4. Si n = 4, entonces 4²/4 = 16/4."
    },
    {
        id: 2,
        title: "Misión 2 · Primera rotación horaria",
        description:
            "En una matriz 4×4, si un agujero está en la posición (0,0) y giras la rejilla 90° en sentido horario, ¿a qué posición se mueve? Responde en formato (fila,columna).",
        answer: "(0,3)",
        hint:
            "Aplica la fórmula de la lección para rotación horaria: R(r,c) = (c, n−1−r)."
    },
    {
        id: 3,
        title: "Misión 3 · ¿Sustitución o transposición?",
        description:
            "En el Turning Grille, las letras cambian de identidad o solo cambian de posición. ¿Este método es de SUSTITUCION o TRANSPOSICION?",
        answer: "TRANSPOSICION",
        hint:
            "Piensa en qué ocurre con las letras del mensaje: ¿se reemplazan por otras o simplemente se reordenan en la matriz?"
    },
    {
        id: 4,
        title: "Misión 4 · ¿Qué hace inválida una grilla?",
        description:
            "Si dos agujeros, al rotar la rejilla, terminan cubriendo la misma celda, ¿la grilla es válida? Responde SI o NO.",
        answer: "NO",
        hint:
            "Una grilla válida debe cubrir cada celda exactamente una vez. Si hay solapamiento, una letra sobrescribe a otra."
    },
    {
        id: 5,
        title: "Misión 5 · Cobertura total",
        description:
            "Una Turning Grille válida de 4×4 debe cubrir toda la matriz después de sus 4 rotaciones. ¿Cuántas celdas distintas debe cubrir en total?",
        answer: "16",
        hint:
            "Una matriz 4×4 tiene 16 celdas. La unión de H, R(H), R²(H) y R³(H) debe cubrirlas todas."
    },
    {
        id: 6,
        title: "Misión 6 · ¿Por qué se rellena con X?",
        description:
            "Si el mensaje es más corto que el número total de celdas de la matriz, el algoritmo lo completa con una letra de relleno. Según la implementación de la lección, ¿qué letra se usa?",
        answer: "X",
        hint:
            "Revisa la lógica del cifrado: el mensaje se completa con padEnd(totalCells, ...)."
    },
];

const missions_des = [
    {
        id: 1,
        title: "Misión 1 · ¿De cuántos bits es un bloque DES?",
        description:
            "En la lección se indica que DES trabaja sobre bloques de tamaño fijo. ¿Cuántos bits tiene cada bloque de entrada en DES?",
        answer: "64",
        hint:
            "Mira la explicación del laboratorio y del modal: DES cifra bloques de n = 64 bits."
    },
    {
        id: 2,
        title: "Misión 2 · ¿Cuántas rondas tiene DES?",
        description:
            "Después de la permutación inicial, DES aplica una estructura de Feistel repetida varias veces. ¿Cuántas rondas ejecuta el algoritmo antes de la permutación final?",
        answer: "16",
        hint:
            "En el resumen matemático aparece: IP → 16 rondas Feistel → IP⁻¹."
    },
    {
        id: 3,
        title: "Misión 3 · Tamaño de la subclave",
        description:
            "En cada ronda se genera una subclave kᵢ a partir del key schedule. ¿Cuántos bits tiene cada subclave de DES?",
        answer: "48",
        hint:
            "La expansión E lleva R de 32 a 48 bits para poder hacer XOR con la subclave."
    },
    {
        id: 4,
        title: "Misión 4 · Regla de Feistel",
        description:
            "En una ronda de DES, el nuevo bloque izquierdo se obtiene copiando una de las mitades anteriores. Si estás en la ronda i, ¿qué valor toma L_i? Responde exactamente como aparece en la fórmula.",
        answer: "R_{i-1}",
        hint:
            "La fórmula mostrada es: L_i = R_{i-1}, R_i = L_{i-1} ⊕ f(R_{i-1}, k_i)."
    },
    {
        id: 5,
        title: "Misión 5 · ¿Qué hace la expansión E?",
        description:
            "Dentro de la función f, la mitad derecha R pasa primero por una expansión antes del XOR con la subclave. ¿De cuántos bits a cuántos bits transforma E a R?",
        answer: "32 A 48",
        hint:
            "La función f comienza expandiendo R para que tenga el mismo tamaño que la subclave."
    },
    {
        id: 6,
        title: "Misión 6 · Resultado del ejemplo clásico",
        description:
            "En la lección se usa el mensaje 0123456789ABCDEF y la clave 133457799BBCDFF1. ¿Cuál es el texto cifrado final que produce DES para ese ejemplo?",
        answer: "85E813540F0AB405",
        hint:
            "Está escrito explícitamente en la sección “Resultado numérico (ejemplo)”."
    }
];

const missions_aes = [
    {
        id: 1,
        title: "Misión 1 · ¿De cuántos bits es un bloque AES?",
        description:
            "En la lección se explica que AES siempre trabaja con bloques de tamaño fijo, sin importar la variante de clave. ¿Cuántos bits tiene cada bloque de entrada en AES?",
        answer: "128",
        hint:
            "En la sección de parámetros se aclara que AES define un único block length de 128 bits."
    },
    {
        id: 2,
        title: "Misión 2 · Tamaños de clave permitidos",
        description:
            "AES puede usar distintas longitudes de clave según el nivel de seguridad requerido. ¿Cuáles son los tres tamaños de clave aceptados por el estándar?",
        answer: "128, 192 Y 256",
        hint:
            "En la introducción y en la tabla de parámetros aparecen las tres variantes del algoritmo."
    },
    {
        id: 3,
        title: "Misión 3 · ¿Cómo se llama la unidad básica de procesamiento?",
        description:
            "AES organiza los datos en una estructura interna antes de aplicar sus transformaciones. ¿Cómo se llama el arreglo de 4×4 bytes usado para procesar el bloque?",
        answer: "STATE ARRAY",
        hint:
            "La lección dice literalmente que la unidad básica de procesamiento es un arreglo 4×4 llamado state array."
    },
    {
        id: 4,
        title: "Misión 4 · Número de rondas en AES-256",
        description:
            "El número de rondas en AES depende del tamaño de la clave. Si trabajas con AES-256, ¿cuántas rondas ejecuta el algoritmo?",
        answer: "14",
        hint:
            "En la tabla de parámetros se muestran las rondas de AES-128, AES-192 y AES-256."
    },
    {
        id: 5,
        title: "Misión 5 · Transformación ausente en la ronda final",
        description:
            "Durante el cifrado, las rondas intermedias usan SubBytes, ShiftRows, MixColumns y AddRoundKey. Sin embargo, en la ronda final una de esas transformaciones se omite. ¿Cuál es?",
        answer: "MIXCOLUMNS",
        hint:
            "La ronda final solo incluye SubBytes, ShiftRows y AddRoundKey."
    },
    {
        id: 6,
        title: "Misión 6 · Resultado del ejemplo de cifrado",
        description:
            "En la lección se cifra el mensaje hexadecimal 41 45 53 20 65 73 20 6d 75 79 20 66 61 63 69 6c con la clave 2b 7e 15 16 28 ae d2 a6 ab f7 15 88 09 cf 4f 3c. ¿Cuál es el texto cifrado final obtenido?",
        answer: "E448E574A374D90CC33C22AF9B8EAB7F",
        hint:
            "Está escrito explícitamente en la sección “Cipher Example”, justo después del desarrollo de las rondas."
    }
];

const missions_rsa = [
    {
        id: 1,
        title: "Misión 1 · ¿Qué se publica en RSA?",
        description:
            "En RSA se genera un par de llaves. ¿Cuál de los siguientes pares se publica como clave pública?",
        answer: "(e, n)",
        hint:
            "En la sección de Key Generation se indica explícitamente qué se publica y qué se mantiene secreto."
    },
    {
        id: 2,
        title: "Misión 2 · Cálculo del módulo n",
        description:
            "En RSA el módulo se construye a partir de dos primos p y q. ¿Cuál es la fórmula correcta para n?",
        answer: "n = p*q",
        hint:
            "En la receta de generación de llaves aparece justo después de elegir p y q."
    },
    {
        id: 3,
        title: "Misión 3 · ¿Qué algoritmo se usa para hallar d?",
        description:
            "Para encontrar la clave privada d, se utiliza un algoritmo clásico de teoría de números. ¿Cuál?",
        answer: "EEA",
        hint:
            "En la lección aparece como EEA(ϕ, e): Extended Euclidean Algorithm."
    },
    {
        id: 4,
        title: "Misión 4 · Fórmula de cifrado",
        description:
            "Según la lección, el cifrado RSA se hace aplicando una potencia modular. ¿Cuál es la forma correcta?",
        answer: "c = PowerMod(m, e, n)",
        hint:
            "En la sección (b) Encryption: c_i = PowerMod(m_i, e, n)."
    },
    {
        id: 5,
        title: "Misión 5 · Fórmula de descifrado",
        description:
            "En la lección, el servidor descifra usando la clave privada d. ¿Cuál es la forma correcta?",
        answer: "m = PowerMod(c, d, n)",
        hint:
            "En la sección (c) Decryption: m_i = PowerMod(c_i, d, n)."
    },
    {
        id: 6,
        title: "Misión 6 · Resultado del ejemplo: el valor de d",
        description:
            "En el ejemplo con p = 47, q = 71 y e = 79, la lección calcula d con EEA(3220, 79). ¿Cuál es d?",
        answer: "1019",
        hint:
            "Está mostrado en la tabla del EEA y luego se declara la private key."
    },
    {
        id: 7,
        title: "Misión 7 · Resultado del ejemplo: cifrado de m = 688",
        description:
            "En el ejemplo, se toma el bloque m = 688 y se cifra con (e, n) = (79, 3337). ¿Cuál es el ciphertext correspondiente?",
        answer: "1570",
        hint:
            "En la lista de resultados del cifrado aparece como el primer valor del vector c."
    }
];

const missions_gamal = [
    {
        id: 1,
        title: "Misión 1 · Resultado del ejemplo: valor de β",
        description:
            "En el ejemplo con p = 2579, α = 2 y a = 765, ¿cuál es β?",
        answer: "949",
        hint:
            "En el ejemplo (a) Key Generation: Public key = (2579, 2, 949)."
    },
    {
        id: 2,
        title: "Misión 2 · Resultado del ejemplo: valor de γ",
        description:
            "En el ejemplo con k = 853, ¿cuál es γ = PowerMod(2, 853, 2579)?",
        answer: "435",
        hint:
            "En el ejemplo (b) Encryption: c = (γ, δ) = (435, 2396)."
    },
    {
        id: 3,
        title: "Misión 3 · Resultado del ejemplo: valor de δ′",
        description:
            "En el ejemplo, se calcula δ′ = PowerMod(949, 853, 2579). ¿Cuál es δ′?",
        answer: "2424",
        hint:
            "En la tabla del ejemplo aparece como δ′."
    },
    {
        id: 4,
        title: "Misión 4 · Resultado del ejemplo: valor de δ",
        description:
            "En el ejemplo, δ = (1299 × 2424) mod 2579. ¿Cuál es δ?",
        answer: "2396",
        hint:
            "En el ejemplo (b) Encryption: δ = 2396."
    },
    {
        id: 5,
        title: "Misión 5 · Resultado del ejemplo: valor de p′",
        description:
            "En el ejemplo, p′ = 2579 − 1 − 765. ¿Cuál es p′?",
        answer: "1813",
        hint:
            "En el ejemplo (c) Decryption: p′ = 1813."
    },
    {
        id: 6,
        title: "Misión 6 · Resultado del ejemplo: valor de m′",
        description:
            "En el ejemplo, m′ = PowerMod(435, 1813, 2579). ¿Cuál es m′?",
        answer: "1980",
        hint:
            "En la tabla del ejemplo aparece como m′."
    },
    {
        id: 7,
        title: "Misión 7 · Resultado del ejemplo: mensaje recuperado",
        description:
            "En el ejemplo, m = (2396 × 1980) mod 2579. ¿Cuál es el mensaje recuperado?",
        answer: "1299",
        hint:
            "En el ejemplo (c) Decryption el resultado final vuelve a ser 1299."
    }
];

export const methodMissionsConfig = {
    "one-time-pad": {
        missions: missions_one_time_pad,
        title: "Misiones · One-Time Pad",
        description: "Pon a prueba tus conocimientos sobre el One-Time Pad con estas misiones. Cada misión te desafiará a aplicar lo que has aprendido sobre este método de cifrado, desde operaciones bit a bit hasta conceptos clave de seguridad. ¡Acepta el reto y demuestra tu maestría en criptografía!"
    },
    "caesar": {
        missions: missions_caesar,
        title: "Misiones · César",
        description: "Desafía tu comprensión del cifrado César con estas misiones. Cada misión te llevará a explorar diferentes aspectos de este método clásico, desde descubrir claves hasta entender su funcionamiento con distintos alfabetos. ¡Acepta el reto y demuestra tu habilidad para descifrar mensajes secretos!"
    },
    "vigenere": {
        missions: missions_vigenere,
        title: "Misiones · Vigenère",
        description: "Pon a prueba tus conocimientos sobre el cifrado de Vigenère con estas misiones. Cada desafío te llevará a cifrar, descifrar y analizar mensajes usando claves cíclicas, desde operaciones básicas hasta conceptos clave del criptoanálisis polialfabético. ¡Demuestra que dominas la Tabula Recta!"
    },
    "playfair": {
        missions: missions_playfair,
        title: "Misiones · Cifrado Playfair",
        description: "Domina el primer cifrado poligráfico de la historia. Construye matrices, prepara dígrаfos y aplica las tres reglas geométricas para cifrar y descifrar mensajes como lo hacían los militares británicos en la Primera Guerra Mundial.",
    },
    "hill": {
        missions: missions_hill,
        title: "Misiones · Cifrado Hill",
        description: "Pon a prueba tu dominio del primer cifrado criptográfico basado en álgebra lineal. Desde la conversión de letras a matrices hasta la multiplicación modular y la invertibilidad de claves, estas misiones te llevarán por todos los engranajes matemáticos que Lester Hill diseñó en 1929."
    },
    "homophonic": {
        missions: missions_homophonic,
        title: "Misiones · Cifrado Homofonico",
        description:
            "Pon a prueba tu comprensión del cifrado homofonico: desde contar homófonos y descifrar símbolos hasta entender por qué la aleatoriedad derrota el análisis de frecuencias. Demuestra que dominas el primer cifrado que venció a Al-Kindi."
    },
    "turning-grille": {
        missions: missions_turning_grille,
        title: "Misiones · Turning Grille",
        description:
            "Pon a prueba tu comprensión de la Rejilla Girante: desde validar agujeros y aplicar rotaciones hasta entender por qué este método es un cifrado por transposición. Demuestra que puedes construir una grilla válida y seguir sus 4 giros sin perder ninguna letra."
    },
    "des": {
        missions: missions_des,
        title: "Misiones · DES",
        description:
            "Pon a prueba tu comprensión del Data Encryption Standard con estas misiones. Desde bloques de 64 bits y subclaves de ronda hasta la estructura de Feistel, las permutaciones y los modos de operación, cada desafío te acercará al funcionamiento interno de uno de los cifrados por bloques más influyentes de la historia."
    },
    "aes": {
        missions: missions_aes,
        title: "Misiones · AES",
        description:
            "Pon a prueba tu comprensión del Advanced Encryption Standard con estas misiones. Desde bloques de 128 bits y claves de distinto tamaño hasta el state array, las rondas, las transformaciones internas y el ejemplo clásico de cifrado, cada desafío te acercará al funcionamiento de uno de los cifrados por bloques más importantes de la criptografía moderna."
    },
    "rsa": {
        missions: missions_rsa,
        title: "Misiones · RSA",
        description:
            "Pon a prueba tu comprensión del RSA con estas misiones. Desde la generación de llaves (p, q, n, ϕ, e, d) hasta las fórmulas de cifrado y descifrado con PowerMod, cada desafío refuerza el corazón matemático del criptosistema de clave pública."
    },
    "gamal": {
        missions: missions_gamal,
        title: "Misiones · Gamal",
        description:
            "Pon a prueba tu comprensión de ElGamal con estas misiones. Desde la generación de llaves (p, α, a, β) hasta el cifrado probabilístico con (γ, δ) y el descifrado con p′, cada desafío refuerza cómo el logaritmo discreto sustenta este criptosistema de clave pública."
    },
};
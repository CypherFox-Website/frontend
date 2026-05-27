// FrontEnd/src/util/crypto.js

/**
 * Convierte un ArrayBuffer a una cadena Base64 de forma segura.
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

/**
 * Genera una clave criptográfica (CryptoKey) a partir de la variable de entorno VITE_ENCRYPTION_SECRET.
 * Se utiliza SHA-256 para derivar una clave de 256 bits consistente.
 * @returns {Promise<CryptoKey>}
 */
const getEncryptionKey = async () => {
    // Nota: VITE_ENCRYPTION_SECRET debe estar configurada en tu archivo .env
    const secret = import.meta.env.VITE_ENCRYPTION_SECRET || 'default_secret_please_change_this_in_production';
    const enc = new TextEncoder();
    const keyMaterial = enc.encode(secret);

    // Generamos un hash de la clave secreta para asegurar que tenga 256 bits (32 bytes)
    const hash = await window.crypto.subtle.digest('SHA-256', keyMaterial);

    return await window.crypto.subtle.importKey(
        "raw",
        hash,
        { name: "AES-GCM" },
        false,
        ["encrypt"]
    );
};

/**
 * Encripta un objeto JSON utilizando AES-GCM (Nativo).
 * @param {Object} data - Los datos que se desean cifrar.
 * @returns {Promise<{payload: string, iv: string}>} - Objeto con el payload e IV codificados en Base64.
 */
export const encryptPayload = async (data) => {
    try {
        const key = await getEncryptionKey();

        // Generamos un Vector de Inicialización (IV) aleatorio de 12 bytes (96 bits)
        // Este es el tamaño recomendado para AES-GCM por rendimiento y seguridad.
        const iv = window.crypto.getRandomValues(new Uint8Array(12));

        const enc = new TextEncoder();
        const encodedData = enc.encode(JSON.stringify(data));

        const encryptedBuffer = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            encodedData
        );

        return {
            payload: arrayBufferToBase64(encryptedBuffer),
            iv: arrayBufferToBase64(iv)
        };
    } catch (error) {
        console.error("Error al cifrar el payload:", error);
        throw error;
    }
};

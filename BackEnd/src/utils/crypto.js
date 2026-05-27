// BackEnd/src/utils/crypto.js
import crypto from 'crypto';
import { env } from '../config/env.js';

/**
 * Desencripta un payload cifrado con AES-GCM (proveniente del Frontend).
 * El Web Crypto API (Frontend) concatena el Auth Tag de 16 bytes al final del ciphertext.
 * 
 * @param {string} encryptedBase64 - El payload cifrado en formato Base64.
 * @param {string} ivBase64 - El Vector de Inicialización en formato Base64.
 * @returns {Object} - Los datos originales desencriptados (parseados de JSON).
 */
export const decryptPayload = (encryptedBase64, ivBase64) => {
    try {
        const secret = env.ENCRYPTION_SECRET || 'default_secret_please_change_this_in_production';
        
        // Derivar la clave de 256 bits usando SHA-256 (igual que en el Frontend)
        const key = crypto.createHash('sha256').update(secret).digest();
        
        const encryptedBuffer = Buffer.from(encryptedBase64, 'base64');
        const iv = Buffer.from(ivBase64, 'base64');
        
        // En AES-GCM, el tag de autenticación suele ser de 16 bytes.
        // Web Crypto API lo pone al final del buffer resultante del cifrado.
        const authTag = encryptedBuffer.slice(encryptedBuffer.length - 16);
        const ciphertext = encryptedBuffer.slice(0, encryptedBuffer.length - 16);
        
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(authTag);
        
        let decrypted = decipher.update(ciphertext, 'binary', 'utf8');
        decrypted += decipher.final('utf8');
        
        return JSON.parse(decrypted);
    } catch (error) {
        console.error("Error al desencriptar el payload:", error);
        const decryptionError = new Error("No se pudo procesar la petición (error de cifrado).");
        decryptionError.status = 400;
        throw decryptionError;
    }
};

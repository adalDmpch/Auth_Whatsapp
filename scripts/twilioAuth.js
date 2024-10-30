import base64 from 'base-64';
import { TWILIO_CONFIG } from '../constants/twilioconfig';

export const sendMessage = async (toNumber, message) => {
    try {
        if (!toNumber.startsWith('+')) {
            return { error: 'El número debe comenzar con + y el código del país' };
        }

        console.log('Enviando mensaje de WhatsApp:', {
            to: `whatsapp:${toNumber}`,
            from: `whatsapp:${TWILIO_CONFIG.twilioNumber}`,
            body: message,
        });

        const auth = base64.encode(`${TWILIO_CONFIG.accountSid}:${TWILIO_CONFIG.authToken}`);
        const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_CONFIG.accountSid}/Messages.json`;



        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${auth}`,
            },
            body: formData,
        });

        const result = await response.json();
        console.log('Respuesta de Twilio:', result);

        if (!response.ok) {
            return {
                error: result.message || result.error_message || 'Error en el envío del mensaje',
            };
        }

        return result;
    } catch (error) {
        console.error('Error en el envío:', error);
        return { error: 'Error en la conexión con el servicio de mensajería' };
    }
};

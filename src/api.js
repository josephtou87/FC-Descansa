// src/api.js
const BASE_URL = import.meta.env.VITE_CLOUD_FUNCTIONS_BASE_URL;

export const sendEmailVerification = async (email) => {
  try {
    const res = await fetch(`${BASE_URL}/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch (err) {
    console.error('Error enviando email:', err);
  }
};

export const sendWhatsAppNotification = async (number, message) => {
  try {
    const res = await fetch(`${BASE_URL}/send-whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number, message }),
    });
    return await res.json();
  } catch (err) {
    console.error('Error enviando WhatsApp:', err);
  }
};

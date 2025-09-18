// functions/index.js
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());

// Configura SendGrid con la API Key (variable de entorno de Vercel Functions)
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Twilio
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

app.post('/send-email', async (req, res) => {
  const { email } = req.body;
  try {
    await sgMail.send({
      to: email,
      from: 'tu-correo@dominio.com',
      subject: 'Verificación FC DESCANSDA',
      text: '¡Gracias por registrarte en FC DESCANSDA!',
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/send-whatsapp', async (req, res) => {
  const { number, message } = req.body;
  try {
    await twilioClient.messages.create({
      body: message,
      from: 'whatsapp:+14155238886', // número de Twilio sandbox
      to: `whatsapp:${number}`,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;

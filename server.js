
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/pedido', async (req, res) => {
  const { cliente, pedido } = req.body;
  if (!cliente || !pedido.length) return res.status(400).send('Datos incompletos');

  const html = `<h3>Nuevo pedido de ${cliente}</h3><ul>` +
    pedido.map(p => `<li>${p.codigo} - Cantidad: ${p.cantidad}</li>`).join('') +
    '</ul>';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `Pedido mayorista de ${cliente}`,
      html
    });
    res.send('Pedido enviado con éxito.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al enviar el pedido.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor iniciado en puerto ' + PORT));

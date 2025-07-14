// Cargar variables de entorno desde el archivo .env
require('dotenv').config({ path: './.env.local' });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importar rutas de la API
const productRoutes = require('./server/routes/products');
const orderRoutes = require('./server/routes/orders');
const paymentRoutes = require('./server/routes/payments');
// const authRoutes = require('./server/routes/auth'); // Opcional: Descomentar si se implementa autenticación

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
// Habilitar CORS para permitir peticiones desde el frontend (localhost:3000)
app.use(cors({ origin: 'http://localhost:3000' }));
// Parsear cuerpos de petición en formato JSON
app.use(express.json());

// --- Conexión a la Base de Datos MongoDB ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

// --- Rutas de la API ---
app.get('/api', (req, res) => {
  res.json({ message: '👋 API de DigitalStore funcionando correctamente' });
});

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
// app.use('/api/auth', authRoutes); // Opcional

// --- Iniciar el Servidor ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
});

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria.'],
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio.'],
    min: [0, 'El precio no puede ser negativo.'],
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria.'],
    enum: ['Streaming', 'Gaming', 'Música', 'Software', 'Tarjetas de Regalo'],
  },
  imageUrl: {
    type: String,
    required: [true, 'La URL de la imagen es obligatoria.'],
  },
  isFeatured: { // Para la sección "Productos Destacados"
    type: Boolean,
    default: false,
  },
  stock: { // Para productos digitales, puede representar claves disponibles
    type: Number,
    default: 999, // Asumimos un stock "infinito" para la mayoría de los casos
  },
}, {
  timestamps: true, // Crea los campos createdAt y updatedAt automáticamente
});

// Evita que Mongoose recompile el modelo si ya existe
module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);

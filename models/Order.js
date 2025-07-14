const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerEmail: {
    type: String,
    required: [true, 'El email del cliente es obligatorio.'],
    trim: true,
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  }],
  total: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Stripe', 'PayPal', 'MercadoPago', 'Crypto'],
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  paymentResult: { // Para guardar información de la transacción
    id: String,
    status: String,
    update_time: String,
    email_address: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);

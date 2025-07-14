const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const Product = require('../../models/Product');

// POST /api/orders - Crear una nueva orden
router.post('/', async (req, res) => {
  const { customerEmail, items, total, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No hay artículos en la orden.' });
  }

  try {
    // Podríamos añadir una verificación extra de precios aquí consultando la BD
    const newOrder = new Order({
      customerEmail,
      items,
      total,
      paymentMethod,
      paymentStatus: 'pending', // El estado inicial siempre es pendiente
    });

    const createdOrder = await newOrder.save();
    res.status(201).json(createdOrder);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear la orden.', error: err.message });
  }
});

// GET /api/orders - Obtener todas las órdenes (para el admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }); // Más recientes primero
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener las órdenes.', error: err.message });
  }
});

// GET /api/orders/:id - Obtener una orden específica
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.productId');
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Orden no encontrada' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener la orden.', error: err.message });
    }
});

// PUT /api/orders/:id/pay - Actualizar estado de pago (simulado)
// En un caso real, esta ruta sería llamada por un webhook de la pasarela de pago
router.put('/:id/pay', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.paymentStatus = 'completed';
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.payer ? req.body.payer.email_address : 'N/A',
            };
            const updatedOrder = await order.save();
            // Aquí se podría enviar el email al cliente con el producto digital
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Orden no encontrada' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar la orden.', error: err.message });
    }
});


module.exports = router;

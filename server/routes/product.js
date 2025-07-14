const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');

// --- Rutas Públicas ---

// GET /api/products - Obtener todos los productos (con filtros)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' }; // Búsqueda insensible a mayúsculas
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los productos.', error: err.message });
  }
});

// GET /api/products/:id - Obtener un producto por su ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el producto.', error: err.message });
  }
});


// --- Rutas de Administración (CRUD) ---

// POST /api/products - Crear un nuevo producto
router.post('/', async (req, res) => {
  const { name, description, price, category, imageUrl, isFeatured } = req.body;
  try {
    const newProduct = new Product({ name, description, price, category, imageUrl, isFeatured });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: 'Error al crear el producto.', error: err.message });
  }
});

// PUT /api/products/:id - Actualizar un producto existente
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Devuelve el documento actualizado y corre validaciones
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado para actualizar.' });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar el producto.', error: err.message });
  }
});

// DELETE /api/products/:id - Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado para eliminar.' });
    }
    res.json({ message: 'Producto eliminado exitosamente.' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el producto.', error: err.message });
  }
});

module.exports = router;

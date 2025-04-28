/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestión de órdenes
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crear una nueva orden
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: string
 *               total:
 *                 type: number
 *             required:
 *               - userId
 *               - products
 *               - total
 *     responses:
 *       201:
 *         description: Orden creada con éxito
 *       400:
 *         description: Error al crear la orden
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Obtener todas las órdenes del usuario autenticado
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Lista de órdenes
 *       500:
 *         description: Error al obtener las órdenes
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Obtener una orden por ID (solo si pertenece al usuario autenticado)
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la orden a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles de la orden
 *       404:
 *         description: Orden no encontrada
 *       403:
 *         description: No tienes acceso a esta orden
 */


const express = require('express');
const router = express.Router();
const Order = require('./order');
const mongoose = require('mongoose');

//Crear orden
router.post('/', async (req, res) => {
  console.log("User info: ", req.user);

  const order = new Order({
    userId: req.user.userId,
    products: req.body.products,
    total: req.body.total,
    date: new Date()
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener las órdenes de un usuario
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ userId: new mongoose.Types.ObjectId(req.user.userId) });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    if (order.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'No tienes acceso a esta orden' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

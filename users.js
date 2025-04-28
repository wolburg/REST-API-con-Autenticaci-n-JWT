/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, client]
 *     responses:
 *       201:
 *         description: Usuario creado con éxito
 *       400:
 *         description: Error al crear el usuario
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Autenticación del usuario (retorna un JWT)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT Token retornado con éxito
 *       400:
 *         description: Error al autenticar al usuario
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios (solo admin)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID (admin o dueño)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Información del usuario
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Editar un usuario (solo admin o el propio usuario)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *       400:
 *         description: Error al actualizar el usuario
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario (solo admin o el propio usuario)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado con éxito
 *       400:
 *         description: Error al eliminar el usuario
 *       404:
 *         description: Usuario no encontrado
 */

const express = require('express');
const router = express.Router();
const { createUser, loginUser } = require('./userController');
const { authenticate, authorize } = require('./auth');
const User = require('./user');

//Creamos usuario 
router.post('/', createUser);

//Login para tok
router.post('/login', loginUser);

//LLamamos a otodos los usuarus solo si eres admin
router.get('/', authenticate, authorize('admin'), async (req, res) => {
    //Jalamos los usuarios
    const users = await User.find();
    //vemos al los usuarios
    res.json(users);
});

//Optener solo 1 usuario
router.get('/:id', authenticate, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      if (req.user.role !== 'admin' && req.user._id.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Acceso denegado' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  //Editar un usuario
  router.put('/:id', authenticate, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      if (req.user.role !== 'admin' && req.user._id.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Acceso denegado' });
      }
  
      const { name, email, password, role } = req.body;
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = password;
      if (role) user.role = role;
  
      await user.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

//Eliminae usuario
router.delete('/:id', authenticate, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      if (req.user.role !== 'admin' && req.user._id.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Acceso denegado' });
      }
  
      await user.deleteOne();
      res.status(200).json({ message: 'Usuario eliminado con éxito' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;


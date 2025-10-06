const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const ensureAuth = require('../middleware/ensureAuth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - customerName
 *         - product
 *         - quantity
 *         - price
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the order
 *         customerName:
 *           type: string
 *           description: The customer name
 *         product:
 *           type: string
 *           description: The product name
 *         quantity:
 *           type: number
 *           minimum: 1
 *           description: The quantity ordered
 *         price:
 *           type: number
 *           minimum: 0
 *           description: The product price
 *       example:
 *         _id: 650a1b2c3d4e5f0012345679
 *         customerName: John Doe
 *         product: Laptop
 *         quantity: 1
 *         price: 999.99
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: The orders managing API
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Returns the list of all the orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: The list of the orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Internal server error
 */
router.get('/', ordersController.getAllOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get the order by id
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order id
 *     responses:
 *       200:
 *         description: The order description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: The order was not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', ordersController.getOrderById);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: The order was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: string
 *       400:
 *         description: Missing required fields or invalid data
 *       500:
 *         description: Internal server error
 */
router.post('/', ensureAuth,ordersController.createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update the order by the id
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: The order was updated
 *       400:
 *         description: Invalid ID format or missing fields
 *       404:
 *         description: The order was not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', ensureAuth,ordersController.updateOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Remove the order by id
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order id
 *     responses:
 *       200:
 *         description: The order was deleted
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: The order was not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id',ensureAuth, ordersController.deleteOrder);

module.exports = router;
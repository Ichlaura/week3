const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');

// GET all items
router.get('/', itemsController.getAllItems);

// GET one item by id
router.get('/:id', itemsController.getItemById);

// POST create new item
router.post('/', itemsController.createItem);

// PUT update item by id
router.put('/:id', itemsController.updateItem);

// DELETE remove item by id
router.delete('/:id', itemsController.deleteItem);

module.exports = router;

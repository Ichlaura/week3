const { ObjectId } = require('mongodb');

// GET all items
const getAllItems = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const items = await db.collection('items').find().toArray();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get items' });
  }
};

// GET item by id
const getItemById = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const item = await db.collection('items').findOne({ _id: new ObjectId(req.params.id) });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get item' });
  }
};

// POST create item
const createItem = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { name, category, price } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await db.collection('items').insertOne({ name, category, price });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create item' });
  }
};

// PUT update item
const updateItem = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { name, category, price } = req.body;
    const result = await db.collection('items').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, category, price } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Item not found' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
};

// DELETE item
const deleteItem = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const result = await db.collection('items').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Item not found' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
};

module.exports = { getAllItems, getItemById, createItem, updateItem, deleteItem };

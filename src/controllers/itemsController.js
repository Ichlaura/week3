const { ObjectId } = require('mongodb');

// GET all items
const getAllItems = async (req, res) => {
  try {
    const items = await req.app.locals.db.collection('items').find().toArray();
    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET item by ID
const getItemById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const item = await req.app.locals.db.collection('items').findOne({ _id: new ObjectId(id) });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST create new item
const createItem = async (req, res) => {
  try {
    const { name, category, price } = req.body;

    // Validación
    if (!name || !category || price === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }

    const result = await req.app.locals.db.collection('items').insertOne({ name, category, price });
    res.status(201).json({ message: 'Item created', id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PUT update item by ID
const updateItem = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, category, price } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Validación
    if (!name || !category || price === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }

    const result = await req.app.locals.db.collection('items').updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, category, price } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json({ message: 'Item updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE item by ID
const deleteItem = async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const result = await req.app.locals.db.collection('items').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};

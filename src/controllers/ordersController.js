const { ObjectId } = require('mongodb');

// GET all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await req.app.locals.db.collection('orders').find().toArray();
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET order by ID
const getOrderById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID format' });

    const order = await req.app.locals.db.collection('orders').findOne({ _id: new ObjectId(id) });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST create order
const createOrder = async (req, res) => {
  try {
    const { customerName, product, quantity, price } = req.body;

    if (!customerName || !product || quantity === undefined || price === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (typeof quantity !== 'number' || quantity <= 0 || typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'Quantity must be >0 and price >=0' });
    }

    const result = await req.app.locals.db.collection('orders').insertOne({ customerName, product, quantity, price });
    res.status(201).json({ message: 'Order created', id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PUT update order
const updateOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const { customerName, product, quantity, price } = req.body;

    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID format' });
    if (!customerName || !product || quantity === undefined || price === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (typeof quantity !== 'number' || quantity <= 0 || typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'Quantity must be >0 and price >=0' });
    }

    const result = await req.app.locals.db.collection('orders').updateOne(
      { _id: new ObjectId(id) },
      { $set: { customerName, product, quantity, price } }
    );

    if (result.matchedCount === 0) return res.status(404).json({ error: 'Order not found' });

    res.status(200).json({ message: 'Order updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE order
const deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID format' });

    const result = await req.app.locals.db.collection('orders').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Order not found' });

    res.status(200).json({ message: 'Order deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};

const express = require('express');
const router = express.Router();

// GET ORDERS
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Order were fetched'
  });
});

// CREATE NEW ORDER
router.post('/', (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity
  };
  res.status(201).json({
    message: 'Order was created',
    order: order
  });
});

// GET ORDER BY ID
router.get('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'Order was created',
    orderId: req.params.orderId
  });
});

// DELETE ORDER BY ID
router.delete('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'Order was deleted',
    orderId: req.params.orderId
  });
});

module.exports = router;
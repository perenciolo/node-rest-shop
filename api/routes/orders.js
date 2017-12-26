const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Order = require('../models/order')
const Product = require('../models/product')

// GET ORDERS
router.get('/', (req, res, next) => {
  Order
    .find()
    .select('product quantity _id')
    .populate('product', '_id name price')
    .exec()
    .then(docs => res.status(200).json({
      count: docs.length,
      orders: docs.map(doc => {
        return {
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/orders/' + doc._id
          }
        }
      })
    }))
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

// CREATE NEW ORDER
router.post('/', (req, res, next) => {
  Product
    .findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found'
        })
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      })
      order
        .save()
        .then(result => {
          console.log(result)
          res.status(201).json({
            message: 'Order stored',
            createdOrder: {
              _id: result._id,
              product: result.product,
              quantity: result.quantity
            },
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + result._id
            }
          })
        })
        .catch(err => {
          console.log(err)
          res.status(500).json(err)
        })
    })
    .catch(err => {
      res.status(404).json({
        message: 'Product not found',
        error: err
      })
    })
})

// GET ORDER BY ID
router.get('/:orderId', (req, res, next) => {
  Order
    .findById(req.params.orderId)
    .populate('product', '_id name price')
    .exec()
    .then(order => res.status(200).json({
      order: order,
      request: {
        type: 'GET',
        url: 'http://localhost:3000/orders'
      }
    }))
    .catch(err => res.status(500).json({
      error: err
    }))
})

// DELETE ORDER BY ID
router.delete('/:orderId', (req, res, next) => {
  Order
    .remove({ _id: req.params.orderId})
    .exec()
    .then(result => res.status(200).json({
      message: 'Order deleted',
      request: {
        type: 'POST',
        url: 'http://localhost:3000/orders',
        body: {productId: 'ID', quantity: 'Number'}
      }
    }))
    .catch(err => res.status(500).json({
      error: err
    }))
})

module.exports = router

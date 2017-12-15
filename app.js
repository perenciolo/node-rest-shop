const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// ROUTES IMPORT
const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')

// DATABASE CONNECTION
mongoose.connect(`mongodb://${process.env.MONGO_ATLAS_USR}:${process.env.MONGO_ATLAS_PASSWD}@node-rest-shop-shard-00-00-fkqdy.mongodb.net:27017,node-rest-shop-shard-00-01-fkqdy.mongodb.net:27017,node-rest-shop-shard-00-02-fkqdy.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin`, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;

// CONSOLE LOG REQUESTS
app.use(morgan('dev'))

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE')
    return res.status(200).json({})
  }
  next()
})

// ROUTE /Products
app.use('/products', productRoutes)

// ROUTE /orders
app.use('/orders', orderRoutes)

// HANDLING ERROR
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app

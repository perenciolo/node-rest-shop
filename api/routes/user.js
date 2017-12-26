const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

// POST /user/signup -- Create new user
router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length > 0) {
        return res.status(409).json({
          message: 'Email already exists on database.'
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: 'User successfully created.',
                  result: {
                    id: result._id,
                    email: result.email
                  },
                  request: {
                    type: 'GET',
                    url: 'http://localhost:3000/user/' + result._id
                  }
                });
              }).catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});

// GET /user/:userId -- Get user by ID
router.get('/:userId', (req, res, next) => {
  User
    .findById(req.params.userId)
    .select('_id email password')
    .exec()
    .then(doc => {
      if (doc) {
        console.log(doc);
        res.status(200).json({
          user: doc
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// DELETE /user/:userId -- Remove user from the database
router.delete('/:userId', (req, res, next) => {
  User.find({ _id: req.params.userId })
    .exec()
    .then(user => {
      if (user.length > 0) {
        User.remove({ _id: req.params.id })
          .exec()
          .then(result => {
            res.status(204).json({
              message: 'User removed successfully.'
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err,
              message: 'Error. user could not be removed.'
            });
          });
      } else {
        res.status(404).json({
          message: 'User not found.'
        });
      }
    });
});

module.exports = router;
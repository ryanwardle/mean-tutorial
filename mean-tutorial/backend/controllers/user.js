const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.createUser = (req, res, next) => {
  // Encrypts passwords
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save().then(result => {
      res.status(201).json({
        message: 'User created!',
        result: result
      });
    }).catch(err => {
      res.status(500).json({
        message: 'Invalid authentication credentials'
      });
    });
  });
}

exports.userLogin = (req, res, next) => {
  // Need to assign to get user value outside of initial then block, value assigned below.
  let fetchedUser;

  // Checks if email exists
  User.findOne({email: req.body.email}).then(user => {
    if(!user) {
      return res.status(401).json({
        message: 'Auth failed'
      });
    }

    fetchedUser = user;
    // Checks if the password is valid, will return promise which has 'then' chained to it.
    return bcrypt.compare(req.body.password, user.password)
  }).then(result => {
    if (!result) {
      return res.status(401).json({
        message: 'Auth failed'
      });
    }
    const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
                          process.env.JWT_KEY,
                           {expiresIn: '1h'}
                          );
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id
    })
  }).catch(err => {
    return res.status(401).json({
      message: 'Invalid Authentication Credentials'
    });
  });
}

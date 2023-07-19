var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs');

const salt = 12;

const User = require('../models/User');
const isLoggedIn = require('../middleware/isLoggedIn');

router.get('/signup', (req,res,next) => {
    res.render('auth/signup.hbs')
})

//SIGNUP 
router.post("/signup", (req, res, next) => {
    const { fullName, email, password } = req.body;
  
    if (!fullName || !email || !password) {
      res.render("auth/signup", {errorMessage: "All fields are mandatory. Please provide your email and password."});
      return;
    }
  
    bcrypt
      .genSalt(salt)
      .then((salts) => {
        return bcrypt.hash(password, salts);
      })
      .then((hashedPass) =>{
        return User.create({ email, password: hashedPass, fullName })
    })
      .then((createdUser) => {
        console.log("Created user:", createdUser)
        res.redirect("/")
    })
    .catch((error) => {
        console.log("error line 29:", error)
        next(error)
    });
    
  });

  //LOGIN 

  router.get('/login' , (req,res,next) => {
    res.render('auth/login.hbs')
  })

  router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
   
    if (!email || !password ) {
      res.render('auth/login.hbs', {
        errorMessage: 'Please enter both email and password to login.'
      });
      return;
    }

    User.findOne({ email })
      .then(user => {
        if (!user) {
          console.log("Email not registered. ");
          res.render('auth/login.hbs', { errorMessage: 'User not found and/or incorrect password.' });
          return;
        } else if (
          bcrypt.compareSync(password, user.password)) {
          
          req.session.user = user  
  
          console.log("Sessions", req.session)
  
          res.redirect('/items/all-items')
        } else {
          console.log("Incorrect password. ");
          res.render('auth/login.hbs', { errorMessage: 'User not found and/or incorrect password.' });
        }
      })
      .catch(error => next(error));
  });


  router.get('/logout', isLoggedIn, (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        res.redirect('/auth/login');
    });
    console.log("Session", req.session)
});

    module.exports = router;
   
var express = require('express');
var router = express.Router();

const Item = require('../models/Item');

const isLoggedIn = require('../middleware/isLoggedIn');
const isOwner = require('../middleware/isOwner');
const User = require('../models/User');

//CREATE ITEMS 


router.get('/new-item', isLoggedIn, (req,res,next) => {
    res.render('items/new-item.hbs')
})

router.post('/new-item', isLoggedIn, (req,res,next) => {
    const {name, imageUrl, description } = req.body

    Item.create({
        name,
        imageUrl,
        description,
        owner: req.session.user._id
    })

    .then((newItem) => {
        console.log("Item:" , newItem)
        res.redirect('/items/all-items')
    })

    .catch((err) => {
        console.log(err)
        next(err)
    })
})

router.get('/all-items', isLoggedIn, (req, res, next) => {

    Item.find()
    .populate('owner')
    .then((foundItems) => {

        res.render('items/all-items.hbs', {items: foundItems})
    })

    .catch((err) => {
        console.log(err)
        next(err)
    })
})

router.get('/item-details/:itemId', (req,res,next) => {
    Item.findById(req.params.itemId)
    .populate('owner')
    .then((foundItems) => {
        console.log("Item selected", foundItems)
        res.render('items/item-details.hbs', foundItems)
    })

    .catch((err) => {
        console.log(err)
        next(err)
    })
})

//DELETE ITEMS

router.get('/delete/:itemId', isLoggedIn, isOwner, (req, res, next) => {
    
    Item.findByIdAndDelete(req.params.itemId)
    .then((deletedItem) => {
        console.log("Deleted Item: ", deletedItem)
        res.redirect('/items/all-items')
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

//EDIT ITEMS

router.get('/edit/:itemId', isLoggedIn, isOwner, (req,res,next) => {

        Item.findById(req.params.itemId)
        .populate('owner')
        .then ((foundItems) => {
            console.log("Selected Item: ", foundItems)
            res.render('items/edit-item.hbs', foundItems)
        })
    
        .catch((err) => {
            console.log(err)
            next(err)
        })
    
})

router.post('/edit/:itemId', isLoggedIn, isOwner, (req, res, next) => {

    const { name, imageUrl, description  } = req.body

    Item.findByIdAndUpdate(
        req.params.itemId,
        {
            name,
            imageUrl,
            description
        },
        {new: true}
    )
    .then((updatedItem) => {
        res.redirect(`/items/item-details/${updatedItem._id}`)
    })

    .catch((err) => {
        console.log(err)
        next(err)
    })

})


//PROFILE PAGE

router.get('/profile', isLoggedIn, (req,res,next) => {

    Item.find(
        {
            owner: req.session.user._id
        })

        .then((foundItems) => {
            console.log("Owned Items:", foundItems)
            res.render('items/profile.hbs', { user: req.session.user, items: foundItems})
        })

        .catch((err) => {
            console.log(err)
            next(err)
        })
})

router.get('/message', isLoggedIn, (req,res,next) => {
    
    User.find(
        {
            owner: req.session.user._id
        })
  
  })



module.exports = router;

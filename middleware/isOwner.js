const Item = require('../models/Item')

const isOwner = (req, res, next) => {

    Item.findById(req.params.itemId)
    .populate('owner')
    .then((foundItems) => {
        if(foundItems.owner._id.toString() === req.session.user._id) {
            next()
        } else {
            res.redirect('/items/all-items')
        }
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

}

module.exports = isOwner
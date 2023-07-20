var express = require('express');
var router = express.Router();

const Item = require('../models/Item')
const Message = require('../models/Message')
const Conversation = require('../models/Conversation')

const isLoggedIn = require('../middleware/isLoggedIn')

/* GET home page. */
router.get('/primary-message/:itemId', isLoggedIn, function(req, res, next) {

    Item.findById(req.params.itemId)
        .then((foundItem) => {

            console.log("Found item", foundItem)

            res.render('items/message.hbs', foundItem)

        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

});

router.post('/primary-message/:itemId/:sellerId', isLoggedIn, (req, res, next) => {

    console.log("Sending message")

    const author = req.session.user._id
    const item = req.params.itemId
    const seller = req.params.sellerId

    const { content } = req.body

    Message.create({
        author,
        content,
    })
        .then((createdMessage) => {
            Conversation.create(
                {
                    item,
                    buyer: author,
                    seller
                }
            )
            .then((createdConversation) => {
                return Conversation.findByIdAndUpdate(createdConversation._id,
                    {
                    $push: {messages: createdMessage._id}
                }, 
                {new: true})
            })
            .then((newConversation) => {
                console.log("new convo", newConversation)
                console.log("created message:", createdMessage)
                res.redirect('/items/profile')
            })
            .catch((err) => {
                console.log(err)
                next(err)
            })
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})


router.get("/conversation/:convoId", isLoggedIn, (req, res, next)=> {
    Conversation.findById(req.params.convoId)
    .populate({path: "messages", populate: {path: "author"}})
    .then(convo => {
        console.log("CONVO", convo)
        res.render("conversation/conversation.hbs", convo)})
    .catch(err => console.log(err))
}  )


router.post("/conversation/:convoId", isLoggedIn, (req, res, next) => {

    Message.create({
        content: req.body.content,
        author: req.session.user._id
    })
    .then((newMessage) => {
        console.log("New message", newMessage)
        
        Conversation.findByIdAndUpdate(
            req.params.convoId,
            {
                $push: {messages: newMessage._id}
            },
            {new: true})
        .then((updatedConvo) => {
            console.log('updated Convo', updatedConvo)
            res.redirect(`/messages/conversation/${updatedConvo._id}`)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})
module.exports = router;

const { Schema, model } = require('mongoose')

const conversationSchema = new Schema({

    item: {type: Schema.Types.ObjectId, ref: "Item"},
    buyer: {type: Schema.Types.ObjectId, ref: "User"},
    seller: {type: Schema.Types.ObjectId, ref: "User"},
    messages: [{type: Schema.Types.ObjectId, ref: "Message"}]

}, {
    timeseries: true,
    timestamps: true
})

module.exports = model("Conversation", conversationSchema)
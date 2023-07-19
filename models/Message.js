const { Schema, model } = require("mongoose");

const messageSchema = new Schema({

    author: {type: Schema.Types.ObjectId, ref: "User"},
    item: {type: Schema.Types.ObjectId, ref: "Item"},
    message : {
        type: Schema.Types.ObjectId, ref: "Message",
        default: null
    },
    content: String
}, 
{ 
    timeseries: true
});

module.exports = model("Message", messageSchema);
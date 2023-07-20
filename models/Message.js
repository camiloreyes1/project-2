const { Schema, model } = require("mongoose");

const messageSchema = new Schema({

    author: {type: Schema.Types.ObjectId, ref: "User"},
    content: String
}, 
{ 
    timeseries: true
});

module.exports = model("Message", messageSchema);
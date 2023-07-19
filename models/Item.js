const {Schema, model} = require('mongoose');

const itemSchema = new Schema ({
    name: String,
    imageUrl: String,
    description: String,
    owner: { type: Schema.Types.ObjectId, ref: "User" }
});

module.exports = model('Item', itemSchema);
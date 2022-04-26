const mongoose = require("mongoose");

const pasteSchema = new mongoose.Schema({
    _id: String,
    name: String,
    content: String
});

const Paste = mongoose.model("Paste", pasteSchema);

module.exports = Paste;
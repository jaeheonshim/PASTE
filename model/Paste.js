const mongoose = require("mongoose");

const pasteSchema = new mongoose.Schema({
    _id: String,
    name: {
        type: String,
        minlength: [1, "A name must be present"],
        maxlength: [64, "The name cannot be longer than 64 characters."]
    },
    content: {
        type: String,
        minlength: [1, "Content must be present"]
    },
    security: {
        type: {type: String, select: true},
        hmac: {type: String, select: false},
        passphrase: {type: String, select: false}
    }
}, { timestamps: true });

const Paste = mongoose.model("Paste", pasteSchema);

module.exports = Paste;
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
    },
    language: {
        type: String,
        default: "txt"
    },
    meta: {
        creation_ip: {type: String, select: false}
    },
    expiration: Date
}, { timestamps: true });

pasteSchema.methods.isExpired = function() {
    const today = new Date();
    return today > this.expiration;
}

const Paste = mongoose.model("Paste", pasteSchema);

module.exports = Paste;
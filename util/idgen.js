const Paste = require("../model/Paste");

const LENGTH = 6;
const validCharacters = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

function generateId(length) {
    let id = "";
    for(let i = 0; i < LENGTH; i++) {
        id += validCharacters[Math.floor(Math.random() * validCharacters.length)];
    }

    return id;
}

async function generateUniqueId(length) {
    let id = generateId(length);
    while(!(await checkId(id))) {
        id = generateId(length);
    }

    return id;
}

async function defaultGenId() {
    return await generateUniqueId(LENGTH);
}

async function checkId(id) {
    if((await Paste.findById(id).exec()) != null) {
        return false;
    } else {
        return true;
    }
}

module.exports.defaultGenId = defaultGenId;
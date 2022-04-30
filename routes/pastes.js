const AES = require("crypto-js/aes");
const CryptoJS = require("crypto-js");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const idgen = require("../util/idgen");

const Paste = require("../model/Paste");

exports.retrieve = async (req, res) => {
    const pasteId = req.params.pasteId;
    const action = req.params.action;
    const paste = await Paste.findById(pasteId).exec();

    if (paste != null) {
        if (paste.security.type != null) {
            const passphrase = req.body.passphrase;
            if (!passphrase) {
                if (req.method == "GET") {
                    res.render("pages/password", { pasteId: pasteId, action: (action || "") });
                } else {
                    res.status(403).send("You are not allowed to access this paste.");
                }
                return;
            }

            if (paste.security.type === "AES") {
                const decrypted = await handleAESDecrypt(paste, passphrase);

                if(decrypted) {
                    paste.content = decrypted;
                } else {
                    onIncorrectPassphrase(req, res);
                    return;
                }
            } else {
                const truePassphrase = (await Paste.findById(paste._id).select({ "security.passphrase": 1 }).exec()).security.passphrase;
                
                if(!(await bcrypt.compare(passphrase, truePassphrase))) {
                    paste.content = "";
                    onIncorrectPassphrase(req, res);
                    return;
                }
            }
        }

        if (action === "raw") {
            res.send(paste.content);
        } else if (action == "dl") {
            res.attachment(`${pasteId}.txt`);
            res.type("txt");
            res.send(paste.content);
        } else if (action == "json") {
            res.type("json");
            res.send(paste);
        } else {
            res.render("pages/paste", {paste: paste});
        }
    } else {
        res.status(404).send("404: Not found");
    }
};

exports.new = async (req, res) => {
    const body = req.body;
    const name = body.name;
    const content = body.content;
    const expiration = body.expiration;

    const security = body.security;
    const passphrase = body.passphrase;
    const aes = body.AES;

    const newPaste = new Paste({
        name: name,
        content: content
    });

    const error = newPaste.validateSync();
    if (error) {
        const errorMessages = [];

        for (const prop in error.errors) {
            const err = error.errors[prop];
            errorMessages.push(err.message);
        }

        res.status(400).send(errorMessages.join("\n"));
        return;
    }

    if (security) {
        if (aes) {
            const encrypted = CryptoJS.AES.encrypt(content, passphrase).toString();
            const hmac = CryptoJS.HmacSHA256(encrypted, CryptoJS.SHA256(passphrase)).toString();

            newPaste.content = encrypted;

            newPaste.security = {
                type: "AES",
                hmac: hmac
            };
        } else {
            const hashedPass = await bcrypt.hash(passphrase, saltRounds);

            newPaste.security = {
                type: "passphrase",
                passphrase: hashedPass
            };
        }
    }

    if(expiration) {
        const expirationDate = new Date();

        addToDate(expiration, expirationDate);
    }

    newPaste._id = await idgen.defaultGenId();

    await newPaste.save();
    res.send(newPaste);
};

const handleAESDecrypt = async (paste, passphrase) => {
    const trueHmac = (await Paste.findById(paste._id).select({ "security.hmac": 1 }).exec()).security.hmac;
    const hmac = CryptoJS.HmacSHA256(paste.content, CryptoJS.SHA256(passphrase)).toString();
    if (hmac != trueHmac) {
        return null;
    }

    const decrypted = AES.decrypt(paste.content, passphrase).toString(CryptoJS.enc.Utf8);
    return decrypted;
};

const onIncorrectPassphrase = async (req, res) => {
    const pasteId = req.params.pasteId;
    const action = req.params.action;

    res.status(403).render("pages/password", { pasteId: pasteId, error: "Incorrect passphrase", action: (action || "") });
}

const addToDate = (period, date) => {
    const data = parseInt(period);
    const specifier = period.replace(/[^a-z]/gi, '').trim();

    switch(specifier) {
        case "m":
            date.setMinutes(date.getMinutes() + data);
            break;
        case "h":
            date.setHours(date.getHours() + data);
            break;
        case "d":
            date.setDays(date.getDays() + data);
            break;
        case "w":
            date.setDays(date.getDays() + data * 7);
            break;
        case "m":
            date.setMonths(date.getMonths() + data);
            break;
        case "y":
            date.setFullYear(date.getFullYear() + data);
            break;
    }
};
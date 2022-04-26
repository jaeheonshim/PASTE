const AES = require("crypto-js/aes");
const CryptoJS = require("crypto-js");
const Paste = require("../model/Paste");

exports.retrieve = async (req, res) => {
    const pasteId = req.params.pasteId;
    const action = req.params.action;
    const paste = await Paste.findById(pasteId).exec();

    if (paste != null) {
        if (paste.security) {
            const passphrase = req.body.passphrase;
            if (!passphrase) {
                res.status(403).send("You are not allowed to access this paste.");
                return;
            }

            if (paste.security.type === "AES") {
                const hmac = CryptoJS.HmacSHA256(paste.content, CryptoJS.SHA256(passphrase)).toString();
                if (hmac != paste.security.hmac) {
                    res.status(403).send("Incorrect passphrase");
                    return;
                }
                paste.content = AES.decrypt(paste.content, passphrase).toString(CryptoJS.enc.Utf8);
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
            res.send(paste);
        }
    } else {
        res.status(404).send("404: Not found");
    }
};
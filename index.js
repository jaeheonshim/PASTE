const mongoose = require("mongoose");
const express = require('express');
const CryptoJS = require("crypto-js");
const idgen = require("./util/idgen");

const pastes = require("./routes/pastes");

const Paste = require("./model/Paste");

const port = 3000;

const app = express();
app.use(express.json({limit: '50mb'}));

main().catch(err => console.error(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/paste");
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });
}

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post("/new", async (req, res) => {
  const body = req.body;
  const name = body.name;
  const content = body.content;

  const security = body.security;

  const newPaste = new Paste({
    name: name,
    content: content
  });
  
  const error = newPaste.validateSync();
  if(error) {
    const errorMessages = [];

    for(const prop in error.errors) {
      const err = error.errors[prop];
      errorMessages.push(err.message);
    }

    res.status(400).send(errorMessages.join("\n"));
    return;
  }

  if(security) {
    if(security.type === "AES") {
      const encrypted = CryptoJS.AES.encrypt(content, security.passphrase).toString();
      const hmac = CryptoJS.HmacSHA256(encrypted, CryptoJS.SHA256(security.passphrase)).toString();

      newPaste.content = encrypted;

      newPaste.security = {
        type: "AES",
        hmac: hmac
      };
    }
  }

  newPaste._id = await idgen.defaultGenId();

  await newPaste.save();
  res.send(newPaste);
});

app.get("/:action?/:pasteId", pastes.retrieve);
app.post("/:action?/:pasteId", pastes.retrieve);
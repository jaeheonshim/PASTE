const mongoose = require("mongoose");
const express = require('express');
const app = express();
const port = 3000;

const Paste = require("./model/Paste");

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

app.get("/:pasteId", async (req, res) => {
  try {
    const pasteId = req.params.pasteId;
    const pasteArray = await Paste.find({_id: pasteId});

    if(pasteArray.length <= 0) {
        res.status(404).send();
    } else {
        res.send(pasteArray[0]);
    }
  } catch(error) {
    return next()
  }
});
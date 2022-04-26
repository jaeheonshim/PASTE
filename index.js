const mongoose = require("mongoose");
const express = require('express');
const app = express();
const idgen = require("./util/idgen");

const Paste = require("./model/Paste");

const port = 3000;

app.use(express.json());

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

app.get("/:action?/:pasteId", async (req, res) => {
  const pasteId = req.params.pasteId;
  const action = req.params.action;
  const paste = await Paste.findById(pasteId).exec();

  if (paste != null) {
    if(action === "raw") {
      res.send(paste.content);
    } else if(action == "dl") {
      res.attachment(`${pasteId}.txt`);
      res.type("txt");
      res.send(paste.content);
    } else if(action == "json") {
      res.type("json");
      res.send(paste);
    } else {
      res.send(paste);
    }
  } else {
    res.status(404).send("404: Not found");
  }
});

app.post("/new", async (req, res) => {
  const body = req.body;
  const name = body.name;
  const content = body.content;

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

  newPaste._id = await idgen.defaultGenId();

  await newPaste.save();
  res.send(newPaste);
});
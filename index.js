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
    } else {
      res.send(paste);
    }
  } else {
    res.status(404).send("404: Not found");
  }
});
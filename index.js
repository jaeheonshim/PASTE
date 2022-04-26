const mongoose = require("mongoose");
const express = require('express');
const bodyParser = require('body-parser');
const CryptoJS = require("crypto-js");

const idgen = require("./util/idgen");

const pastes = require("./routes/pastes");

const Paste = require("./model/Paste");

const port = 3000;

const app = express();
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true })); 

app.set('views', './views');
app.set('view engine', 'ejs');

main().catch(err => console.error(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/paste");
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });
}

app.post("/new", pastes.new);
app.get("/:action?/:pasteId", pastes.retrieve);
app.post("/:action?/:pasteId", pastes.retrieve);
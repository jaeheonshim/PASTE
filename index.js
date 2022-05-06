const mongoose = require("mongoose");
const compression = require("compression");
const express = require('express');
const bodyParser = require('body-parser');
const CryptoJS = require("crypto-js");

const pastes = require("./routes/pastes");

const Paste = require("./model/Paste");

const port = process.env.PORT || 3000;

const app = express();

app.use(express.static(__dirname + '/public'))
app.use(express.json({limit: '16mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '16mb'}));
app.use(compression());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

main().catch(err => console.error(err));

async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
  app.listen(port, () => {
    console.log(`PASTE app listening on port ${port}`)
  });
}

app.get("/", async (req, res) => {
  const pasteCount = await Paste.estimatedDocumentCount({});

  res.render("pages/index", {pasteCount: pasteCount});
});
app.get("/new", (req, res) => res.render("pages/new"));
app.post("/new", pastes.new);
app.get("/:action?/:pasteId", pastes.retrieve);
app.post("/:action?/:pasteId", pastes.retrieve);

app.use((req, res) => {
  res.status(404).render("pages/404");
});

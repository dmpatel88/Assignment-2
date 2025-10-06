// server.js
const express = require("express");
const path = require("path");

const LegoData = require("./modules/legoSets");
const legoData = new LegoData();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// serve static files if needed (not required for HTML files we send via sendFile)
app.use(express.static(path.join(__dirname, "public")));

// initialize legoData and then start server
legoData.initialize()
  .then(() => {
    // routes for home and about
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "home.html"));
    });

    app.get("/about", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "about.html"));
    });

    // GET /lego/sets  -> all sets OR filtered by ?theme=...
    app.get("/lego/sets", (req, res) => {
      if (req.query.theme) {
        legoData.getSetsByTheme(req.query.theme)
          .then((sets) => res.json(sets))
          .catch((err) => res.status(404).send(err));
      } else {
        legoData.getAllSets()
          .then((sets) => res.json(sets))
          .catch((err) => res.status(404).send(err));
      }
    });

    // GET /lego/sets/:set_num  -> single set
    app.get("/lego/sets/:set_num", (req, res) => {
      legoData.getSetByNum(req.params.set_num)
        .then((set) => res.json(set))
        .catch((err) => res.status(404).send(err));
    });

    // custom 404 - respond with 404.html
    app.use((req, res) => {
      res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
    });

    // start listening
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on port ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize lego data:", err);
  });

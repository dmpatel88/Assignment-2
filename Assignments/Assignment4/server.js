// server.js
const express = require("express");
const path = require("path");

const LegoData = require("./modules/legoSets");
const legoData = new LegoData();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Serve static files (CSS, images, etc.)
app.use(express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname, "public")));

// Initialize lego data and then start the server
legoData.initialize()
  .then(() => {

    // Home route
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "home.html"));
    });

    // About route
    app.get("/about", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "about.html"));
    });

    // GET /lego/sets  -> all sets or filtered by ?theme=...
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

    // GET /lego/sets/:set_num -> single set by number
    app.get("/lego/sets/:set_num", (req, res) => {
      legoData.getSetByNum(req.params.set_num)
        .then((set) => res.json(set))
        .catch((err) => res.status(404).send(err));
    });

    // NEW TEST ROUTE — to test addSet() functionality
    app.get("/lego/add-test", (req, res) => {
      let testSet = {
        set_num: "123",
        name: "testSet name",
        year: "2024",
        theme_id: "366",
        num_parts: "123",
        img_url: "https://fakeimg.pl/375x375?text=[+Lego+]"
      };

      legoData.addSet(testSet)
        .then(() => {
          res.redirect("/lego/sets"); // Redirect to list after adding
        })
        .catch((err) => {
          res.status(422).send(err); // If already exists, show 422 error
        });
    });

    // Custom 404 handler
    app.use((req, res) => {
      res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
    });

    // Start server
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on port ${HTTP_PORT}`);
    });

  })
  .catch((err) => {
    console.error("Failed to initialize lego data:", err);
  });
/********************************************************************************
* WEB700 – Assignment 05
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Dev Mihir Patel Student ID: 143122240  Date: 15/11/2025
*
* Published URL: 
*
********************************************************************************/

const express = require("express");
const path = require("path");

const LegoData = require("./modules/legoSets");
const legoData = new LegoData();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

/* ---------------------------------------------------
   MIDDLEWARE
--------------------------------------------------- */

// static folder (css, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// body parser for form POST
app.use(express.urlencoded({ extended: true }));

// EJS setup
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");


/* ---------------------------------------------------
   INITIALIZE DATA
--------------------------------------------------- */

legoData.initialize().then(() => {

  /* ---------------------------------------------------
     ROUTES
  --------------------------------------------------- */

  // HOME
  app.get("/", (req, res) => {
    res.render("home", { page: "/" });
  });

  // ABOUT
  app.get("/about", (req, res) => {
    res.render("about", { page: "/about" });
  });

  /* --------------------------
        ADD SET (GET)
  --------------------------- */
  app.get("/lego/addSet", (req, res) => {
    legoData.getAllThemes()
      .then(themes => {
        res.render("addSet", { page: "/lego/addSet", themes });
      })
      .catch(err => res.status(500).send(err));
  });

  /* --------------------------
        ADD SET (POST)
  --------------------------- */
  app.post("/lego/addSet", async (req, res) => {
    try {
      // find theme name for the new set
      let themeObj = await legoData.getThemeById(req.body.theme_id);
      req.body.theme = themeObj.name;

      // add set
      await legoData.addSet(req.body);

      res.redirect("/lego/sets");

    } catch (err) {
      res.status(422).send(err);
    }
  });

  /* --------------------------
        VIEW ALL SETS
  --------------------------- */
  app.get("/lego/sets", (req, res) => {

    if (req.query.theme) {
      legoData.getSetsByTheme(req.query.theme)
        .then(sets => res.render("sets", { page: "/lego/sets", sets }))
        .catch(err => res.status(404).send(err));
    } else {
      legoData.getAllSets()
        .then(sets => res.render("sets", { page: "/lego/sets", sets }))
        .catch(err => res.status(404).send(err));
    }

  });

  /* --------------------------
        VIEW ONE SET
  --------------------------- */
  app.get("/lego/sets/:set_num", (req, res) => {
    legoData.getSetByNum(req.params.set_num)
      .then(set => res.render("set", { page: "", set }))
      .catch(err => res.status(404).send(err));
  });

  /* --------------------------
        DELETE SET
  --------------------------- */
  app.get("/lego/deleteSet/:set_num", async (req, res) => {
    try {
      await legoData.deleteSetByNum(req.params.set_num);
      res.redirect("/lego/sets");
    } catch (err) {
      res.status(404).send(err);
    }
  });

  /* --------------------------
        404 PAGE
  --------------------------- */
  app.use((req, res) => {
    res.status(404).render("404", { page: "" });
  });

  /* --------------------------
        START SERVER
  --------------------------- */
  app.listen(HTTP_PORT, () => {
    console.log(`Server listening on port ${HTTP_PORT}`);
  });


}).catch(err => {
  console.log("Unable to initialize data:", err);
});

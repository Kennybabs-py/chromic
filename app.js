require("dotenv").config();

const errorHandler = require("errorhandler");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const logger = require("morgan");
const methodOverride = require("method-override");

const app = express();
const port = 3000;

const prismic = require("@prismicio/client");
const fetch = require("node-fetch");

const repoName = "chromic";
const accessToken = process.env.PRISMIC_ACCESS_TOKEN;

app.use(logger("dev"));
app.use(errorHandler());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());

/** The `routes` property is your route resolver. It defines how you will
 ** structure URLs in your project. Update the types to match the Custom
 **Types in your project, and edit the paths to match the routing in your
 **project.
 */

const routes = [
  {
    type: "page",
    path: "/:uid",
  },
];

//* Creating a client that connects prismic repo with express paths
const client = prismic.createClient(repoName, {
  fetch,
  accessToken,
  // routes,
});

//* This commented out code was used in the previous version of prismic & express integration
//! Not to be used, but as a reference
/**  app.use((req, res, next) => {
//   res.locals.ctx = {
//     endpoint: process.env.PRISMIC_ENDPOINT,
//     linkResolver: handleLinkResolver,
//   };
//   res.locals.createClient = createClient;
//   next();
 });
 */

function handleLinkResolver(doc) {
  // if (doc.type === "blog_post") {
  //   const date = new Date(doc.first_publication_date);
  //   return `/${date.getFullYear()}/${doc.uid}`;
  // }
  return "/";
}

function handleIndexResolver(index) {
  let arr = ["One", "Two", "Three", "Four", "Five"];

  return arr[index];
}

app.use((req, res, next) => {
  // res.locals.ctx = {
  //   prismic,
  //   endpoint: process.env.PRISMIC_ENDPOINT,
  //   linkResolver: handleLinkResolver,
  //   indexResolver: handleIndexResolver,
  // };
  res.locals.prismic = prismic;
  res.locals.endpoint = process.env.PRISMIC_ENDPOINT;
  res.locals.linkResolver = handleLinkResolver;
  res.locals.indexResolver = handleIndexResolver;

  next();
});

//* Exposing views folder to routes
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//*  Home page
app.get("/", async (req, res) => {
  const meta = await client.getSingle("metadata");
  const preloader = await client.getSingle("preloader");

  res.render("pages/home", { meta, preloader });
});

//* About page
app.get("/about", async (req, res) => {
  try {
    const about = await client.getSingle("about");
    const meta = await client.getSingle("metadata");
    const preloader = await client.getSingle("preloader");

    res.render("pages/about", { about, meta, preloader });
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});

//* Collection detail page
app.get("/detail/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    const meta = await client.getSingle("metadata");
    const product = await client.getByUID("produc", uid, {
      fetchLinks: "collection.title",
    });
    const preloader = await client.getSingle("preloader");

    res.render("pages/detail", {
      product,
      preloader,
      meta,
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});

//* Collections page
app.get("/collections", async (req, res) => {
  try {
    const meta = await client.getSingle("metadata");
    const home = await client.getSingle("home");
    const collections = await client.getAllByType("collection", {
      fetchLinks: "produc.image",
    });
    const preloader = await client.getSingle("preloader");

    console.log(preloader);

    res.render("pages/collections", {
      collections,
      home,
      preloader,
      meta,
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Chromic app listening on port http://localhost:${port}`);
});

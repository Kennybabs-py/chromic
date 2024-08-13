require("dotenv").config();

const errorHandler = require("errorhandler");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const logger = require("morgan");
const methodOverride = require("method-override");
const prismic = require("@prismicio/client");
const fetch = require("node-fetch");

const app = express();
const port = 3000;

const repoName = "chromic";
const accessToken = process.env.PRISMIC_ACCESS_TOKEN;

app.use(logger("dev"));
app.use(errorHandler());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, "public")));

/**
 ** The `routes` property is your route resolver. It defines how you will
 ** structure URLs in your project. Update the types to match the Custom
 ** Types in your project, and edit the paths to match the routing in your
 ** project.
 */

//* Creating a client that connects prismic repo with express paths
const client = prismic.createClient(repoName, {
  fetch,
  accessToken,
  // routes,
});

function handleLinkResolver(doc) {
  if (doc.type === "produc") {
    return `/detail/${doc.slug}`;
  }
  if (doc.type === "about") {
    return `/about`;
  }
  if (doc.type === "collections") {
    return `/collections`;
  }
  console.log(doc);
  return "/";
}

function handleIndexResolver(index) {
  let arr = ["One", "Two", "Three", "Four", "Five"];
  return arr[index];
}

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
app.use((req, res, next) => {
  res.locals.ctx = {
    prismic,
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: handleLinkResolver,
    indexResolver: handleIndexResolver,
  };
  res.locals.prismic = prismic;
  res.locals.endpoint = process.env.PRISMIC_ENDPOINT;
  res.locals.linkResolver = handleLinkResolver;
  res.locals.indexResolver = handleIndexResolver;

  next();
});

//* Exposing views folder to routes
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

async function handleDefaults(api) {
  const meta = await api.getSingle("metadata");
  const navigation = await api.getSingle("navigation");
  const preloader = await api.getSingle("preloader");
  return { meta, navigation, preloader };
}

//* Home page
app.get("/", async (req, res) => {
  const home = await client.getSingle("home");
  const defaults = await handleDefaults(client);
  const collections = await client.getAllByType("collection", {
    fetchLinks: "produc.image",
  });
  res.render("pages/home", { ...defaults, home, collections });
});

//* About page
app.get("/about", async (req, res) => {
  try {
    const about = await client.getSingle("about");
    const defaults = await handleDefaults(client);
    res.render("pages/about", { ...defaults, about });
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});

//* Collections page
app.get("/collections", async (req, res) => {
  try {
    const defaults = await handleDefaults(client);
    const home = await client.getSingle("home");
    const collections = await client.getAllByType("collection", {
      fetchLinks: "produc.image",
    });
    res.render("pages/collections", {
      ...defaults,
      collections,
      home,
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});

//* Collection detail page
app.get("/detail/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const defaults = await handleDefaults(client);
    const product = await client.getByUID("produc", uid, {
      fetchLinks: "collection.title",
    });

    res.render("pages/detail", {
      ...defaults,
      product,
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Chromic app listening on port http://localhost:${port}`);
});

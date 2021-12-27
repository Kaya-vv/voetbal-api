const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const sources = [
  {
    name: "Voetbalzone",
    address: "https://www.voetbalzone.nl/",
  },
  {
    name: "Voetbalprimeur",
    address: "https://www.voetbalprimeur.nl",
  },
];
let nieuws = [];
const voetbalzone = [];
const voetbalprimeur = [];

app.get("/nieuws", (req, res) => {
  sources.forEach((source) => {
    axios
      .get(source.address)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        if (source.name == "Voetbalzone") {
          getVoetbalzone(html);
        } else if (source.name == "Voetbalprimeur") {
          getVoetbalprimeur(html);
        }
      })
      .catch((err) => console.log(err));
  });
  nieuws = nieuws.concat(voetbalzone, voetbalprimeur);
  res.json(nieuws);
});

app.get("/voetbalzone", async (req, res) => {
  await axios
    .get("https://www.voetbalzone.nl/")
    .then((response) => {
      const html = response.data;

      getVoetbalzone(html);
    })
    .catch((err) => console.log(err));

  res.json(voetbalzone);
});

app.get("/voetbalprimeur", async (req, res) => {
  await axios
    .get("https://www.voetbalprimeur.nl")
    .then((response) => {
      const html = response.data;

      getVoetbalprimeur(html);
    })
    .catch((err) => console.log(err));

  res.json(voetbalprimeur);
});
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

const getVoetbalzone = (html) => {
  const $ = cheerio.load(html);
  $(".mainNews a", html).each(function () {
    let text = $(this).find("h1").text();
    let link = $(this).attr("href");
    voetbalzone.push({
      title: text,
      url: "https://www.voetbalzone.nl/" + link,
      source: "Voetbalzone",
      main: "yes",
    });
  });
  $(".subNews a", html).each(function () {
    let text = $(this).find("h2").text();
    let link = $(this).attr("href");
    voetbalzone.push({
      title: text,
      url: "https://www.voetbalzone.nl/" + link,
      source: "Voetbalzone",
      main: "yes",
    });
  });

  $(".trend", html).each(function () {
    let text = $(this).find("h4").text();
    let link = $(this).attr("href");
    voetbalzone.push({
      title: text,
      url: "https://www.voetbalzone.nl/" + link,
      source: "Voetbalzone",
      main: "no",
    });
  });
};

const getVoetbalprimeur = (html) => {
  const $ = cheerio.load(html);
  $("article a", html).each(function () {
    let text = $(this).find("h2").text().trim();
    let link = $(this).attr("href");
    let img = $(this).find("img").attr("src");
    voetbalprimeur.push({
      title: text,
      url: "https://www.voetbalprimeur.nl" + link,
      img: img,
      source: "Voetbalprimeur",
      main: "yes",
    });
  });

  $(".news li .information", html).each(function () {
    let text = $(this).find("h3").text().trim();
    let link = $(this).find("a").attr("href");
    let img = "";
    voetbalprimeur.push({
      title: text,
      url: "Voetbalprimeur" + link,
      img: img,
      source: "Voetbalprimeur",
      main: "no",
    });
  });
};

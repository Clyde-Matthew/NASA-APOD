"use strict";

const resultsNAV = document.querySelector(".navigation1");
const favoritesNav = document.querySelector(".navigation2");
const imagesContainer = document.getElementById("images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.getElementById("loader");

// NASA API
const demoKey = "DEMO_KEY";
const count = 10;
const apiKey = "zAw9AsNNu8peSGts3JtncopdgHm2DGTe8N76v3WW";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${demoKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent(page) {
  window.scrollTo({
    top: 0,
    behavior: "instant",
  });
  loader.classList.add("hidden");
  if (page === "results") {
    resultsNAV.classList.remove("hidden");
    favoritesNav.classList.add("hidden");
  } else {
    resultsNAV.classList.add("hidden");
    favoritesNav.classList.remove("hidden");
  }
}

// create DOM Nodes
function createDOMNodes(page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favorites);
  currentArray.forEach((result) => {
    // card container
    const card = document.createElement("div");
    card.classList.add("card");
    // link
    const link = document.createElement("a");
    link.setAttribute("href", result.hdurl);
    link.setAttribute("target", "_blank");
    link.setAttribute("title", result.title);
    // image
    const image = document.createElement("img");
    image.setAttribute("src", result.url);
    image.setAttribute("alt", result.title);
    image.setAttribute("title", result.title);
    image.setAttribute("loading", "lazy");
    image.classList.add("card-img-top");
    // card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    // card title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;
    // save text
    const saveText = document.createElement("p");
    saveText.classList.add("save-text");
    if (page === "results") {
      saveText.textContent = "Add To Favorites";
      saveText.addEventListener("click", () => {
        saveFavorite(result.title);
      });
    } else {
      saveText.textContent = "Remove From Favorites";
      saveText.addEventListener("click", () => {
        deleteFavorite(result.title);
      });
    }

    // card text
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = result.explanation;
    // footer container
    const footer = document.createElement("small");
    footer.classList.add("text-muted");
    // date
    const date = document.createElement("strong");
    date.textContent = result.date;
    // copyright
    const copyrightResult =
      result.copyright === undefined ? "" : result.copyright;
    const copyright = document.createElement("span");
    copyright.textContent = ` ${copyrightResult}`;
    // append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}

// update DOM
function updateDOM(page) {
  if (localStorage.getItem("nasaFavorites")) {
    // get data from local storage
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
  }
  imagesContainer.textContent = "";
  createDOMNodes(page);
  showContent(page);
}
// get 10 images from NASA API
async function getNasaPictures() {
  // show loader
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    resultsArray = data;
    updateDOM("results");
  } catch (error) {
    console.error(error);
  }
}

// add results to favorites
function saveFavorite(title) {
  // loop through resultsArray to select favorite
  resultsArray.forEach((result) => {
    if (result.title.includes(title) && !favorites[title]) {
      favorites[title] = result;
      console.log(favorites);
      //   show save confirmation for 2 seconds
      saveConfirmed.classList.remove("hidden");
      setTimeout(() => {
        saveConfirmed.classList.add("hidden");
      }, 2000);
      // set favorites to local storage
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
  });
}

// delete favorites
function deleteFavorite(title) {
  if (favorites[title]) {
    delete favorites[title];
    console.log(favorites);
    // set favorites to local storage
    localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    updateDOM("favorites");
  }
}

// on load
getNasaPictures();

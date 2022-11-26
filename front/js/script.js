/* Recupere les donnees stockees dans l'API */
  
/*function dataCollect(url) {
    fetch(url)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
    })
  }*/

/* Ajoute un element enfant, ses attributs et son contenu, dans un element parent identifie par un id */ 

// "tagName" est le nom de l'element enfant, "idContainer" est l'identifiant de l'element parent, "attributes" est un tableau contenant des tableaux composes du nom et de la valeur d'un attribut, "contents" est le contenu de l'element enfant

function addElementIntoId(tagName, idContainer, attributes, contents) {
  let element = document.createElement(tagName);
  let container = document.getElementById(idContainer);
  container.appendChild(element);
  if (attributes) {
    for (let attribute of attributes) {
      element.setAttribute(attribute[0], attribute[1]);
    }
  }
  if (contents) {
    element.textContent = contents[i];
  }
}

/* Ajoute un element enfant, ses attributs et son contenu, dans un element parent */ 

// "tagName" est le nom de l'element enfant, "tagNameContainer" est le nom de l'element parent, "attributes" est un tableau contenant des tableaux composes du nom et de la valeur d'un attribut, "contents" est le contenu de l'element enfant

async function addElementIntoTag(tagName, tagNameContainer, attributes, contents) {
  let container = document.querySelectorAll(tagNameContainer);
  for (let i in container) {
    let element = document.createElement(tagName);
    // renvoie une erreur
    container[i].appendChild(element);
    if (attributes) {
      for (let attribute of attributes[i]) {
        element.setAttribute(attribute[0], attribute[1]);
      }
    }
    if (contents) {
      element.textContent = contents[i];
    }
  }
}


fetch("http://localhost:3000/api/products")
.then(function(response) {
  if (response.ok) {
    return response.json();
  }
})

.then(function(value) {

  // Ajout des liens

  for (let i in value) {
    let linkArray = [["href", "./product.html?id=" + value[i]._id]];
    addElementIntoId("a", "items", linkArray);
  }

  // Ajout des balises <article>

  addElementIntoTag("article", "a[href*='./product.html?id=']");

  // Ajout des images

  let pictureArray = [];

  for (let i in value) {
    pictureArray.push([["src", value[i].imageUrl], ["alt", value[i].altTxt]]);
  }
  addElementIntoTag("img", "article", pictureArray);

  // Ajout des titres

  let titleArray = [];
  let titleContent = [];

  for (let i in value) {
    titleArray.push([["class", "productName"]]);
    titleContent.push(value[i].name);
  }

  addElementIntoTag("h3", "article", titleArray, titleContent);

  // Ajout des descriptions

  let descriptionArray = [];
  let descriptionContent = [];

  for (let i in value) {
    descriptionArray.push([["class", "productDescription"]]);
    descriptionContent.push(value[i].description);
  }

  addElementIntoTag("p", "article", descriptionArray, descriptionContent);
}) 

.catch(function(error) {
  console.log("Erreur" + error.message);
})
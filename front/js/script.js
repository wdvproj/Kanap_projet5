/** 
 * Recupere les donnees du produit ou des produits, stockees dans le back-end
 * @param { String } url
 * @return { Promise } 
 */

async function collectProductsData(url) {
  try {
      let response = await fetch(url);
      if (response.ok) {
          return response.json();
      }
  } catch (error) {
      console.error(`Erreur : ${error}`);
  }
}

/**
 * Cree un bloc d'elements DOM pour un produit a partir des donnees 
 * @param { Object } productData
 * @return { HTMLElement }
 */

function createProduct(productData) {
  
  // Ajoute le lien vers la page produit
  let link = document.createElement("a");
  link.setAttribute("href", "./product.html?id=" + productData._id);

  // Ajoute la balise <article> 
  let article = document.createElement("article");

  // Ajoute l'image du produit
  let picture = document.createElement("img");
  picture.setAttribute("src", productData.imageUrl);
  picture.setAttribute("alt", productData.altTxt);
  article.appendChild(picture);

  // Ajoute le titre du produit
  let title = document.createElement("h3");
  title.setAttribute("class", "productName");
  title.textContent = productData.name;
  article.appendChild(title);

  // Ajoute la description du produit
  let description = document.createElement("p");
  description.setAttribute("class", "productDescription");
  description.textContent = productData.description;
  article.appendChild(description);

  link.appendChild(article);

  return link;
}

/** 
 * Affiche les produits sur la page 
 * @param { String } productsContainer - selecteur du conteneur des produits
 * @param { Array.<HTMLElement> } products - tableau contenant l'ensemble des produits
 */

function displayProducts(productsContainer, products) {
  let container = document.querySelector(productsContainer);
  for (let product of products) {
    container.appendChild(product);
  } 
}

/*window.addEventListener("load", function(event) {
  let body = document.querySelector("body");
  let script = document.createElement("script");
  script.setAttribute("src", "../js/functions.js");
  body.appendChild(script);
});*/

// Recupere les donnees des produits 
collectProductsData("http://localhost:3000/api/products")
  .then(function(productsData) {
    // Cree les elements DOM des produits
    let products = [];
    for (let productData of productsData) {
      let product = createProduct(productData);
      products.push(product);
    }

    // Affiche les produits
    displayProducts("#items", products);
  })
  .catch(function(error) {
    console.error(`Erreur : ${error}`);
  })
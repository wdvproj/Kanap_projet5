/* Recupere les donnees des produits, stockees dans l'API */

async function collectProductsData(url) {
  let response = await fetch(url);
  if (response.ok) {
    return response.json();
  }
}

/* Cree un bloc d'elements DOM pour un produit a partir des donnees des produits*/

function createProduct(productsData) {

  // Ajoute le lien vers la page produit
  let link = document.createElement("a");
  link.setAttribute("href", "./product.html?id=" + productsData._id);

  // Ajoute la balise <article> 
  let article = document.createElement("article");

  // Ajoute l'image du produit
  let picture = document.createElement("img");
  picture.setAttribute("src", productsData.imageUrl);
  picture.setAttribute("alt", productsData.altTxt);
  article.appendChild(picture);

  // Ajoute le titre du produit
  let title = document.createElement("h3");
  title.setAttribute("class", "productName");
  title.textContent = productsData.name;
  article.appendChild(title);

  // Ajoute la description du produit
  let description = document.createElement("p");
  description.setAttribute("class", "productDescription");
  description.textContent = productsData.description;
  article.appendChild(description);

  link.appendChild(article);

  return link;
}

/* Affiche les produits sur la page */

// "productsContainer" est le selecteur du conteneur des produits, "products" est un tableau contenant l'ensemble des produits
function displayProducts(productsContainer, products) {
  let container = document.querySelector(productsContainer);
  for (let product of products) {
    container.appendChild(product);
  } 
}

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
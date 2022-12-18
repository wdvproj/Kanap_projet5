/** 
 * Récupère les données du produit ou des produits, stockées dans le back-end
 * @param { String } url
 * @return { Promise } 
 */

async function collectProductsData(url) {
  try {
    let response = await fetch(url);
    if (response.ok) {
      return response.json();
    }
  } 
  catch(error) {
    console.error(`Erreur : ${error}`);
  }
}

/**
 * Crée un bloc d'éléments DOM à partir des données d'un produit
 * @param { Object } productData
 * @return { HTMLElement }
 */

function createProduct(productData) {
  // Ajoute le lien vers la page du produit
  let link = document.createElement("a");
  link.setAttribute("href", "./product.html?id=" + productData._id);

  // Ajoute un élément <article>  
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
 * @param { String } productsContainer - sélecteur du conteneur des éléments DOM des produits
 * @param { Array.<HTMLElement> } products - tableau contenant l'ensemble des éléments DOM des produits
 */

function displayProducts(productsContainer, products) {
  let container = document.querySelector(productsContainer);
  for (let product of products) {
    container.appendChild(product);
  } 
} 

// Récupère les données des produits 
collectProductsData("http://localhost:3000/api/products")
  .then(function(productsData) {
    // Crée les éléments DOM des produits
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
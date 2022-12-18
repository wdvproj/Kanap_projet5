/** 
 * Récupère les paramètres d'URL
 * @param { String } parameter - paramètre recherché dans l'URL
 * @return { String } 
 */

function getUrlParameter(parameter) {
  let url = new URL(window.location.href);

  let searchParams = new URLSearchParams(url.search);

  let foundParameter = searchParams.get(parameter);

  return foundParameter;
}

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
 * Ajoute les données du produit aux éléments du DOM 
 * @param { Object } productData
 */

function addProductData(productData) {
  // Ajoute l'image du produit
  let picture = document.createElement("img");
  let pictureContainer = document.querySelector(".item__img");
  pictureContainer.appendChild(picture);
  picture.setAttribute("src", productData.imageUrl);
  picture.setAttribute("alt", productData.altTxt);

  // Ajoute le titre du produit
  let title = document.getElementById("title");
  title.textContent = productData.name;

  // Ajoute le prix du produit
  let price = document.getElementById("price");
  price.textContent = productData.price;

  // Ajoute la description du produit
  let description = document.getElementById("description");
  description.textContent = productData.description;

  // Ajoute les couleurs du produit
  let colors = document.getElementById("colors");
  for (let index in productData.colors) {  
    let option = document.createElement("option");
    colors.appendChild(option);
    option.setAttribute("value", productData.colors[index]);
    option.textContent = productData.colors[index];  
  }
}                                                                                     

/** 
 * Remplit le panier 
 * @param { Array.<Object> } cart - tableau de tableaux
 * @param { Array.<Object> } newItem - tableau contenant "String" et "Number"
 * @return { Array.<Object> }
 */

function changeCart(cart, newItem) {
  let knownItem;
  // Si le panier n'est pas stocké en local, il est vide
  if (!cart) {
    cart = [];
  }
  for (let index in cart) {
    // Si le produit est déjà dans le panier, la quantité d'articles est modifiée
    if (cart[index][0] === newItem[0] && cart[index][2] === newItem[2]) {
      cart[index][1] = cart[index][1] + newItem[1];
      knownItem = true;
      break;
    } 
  }
  // Si le produit n'est pas dans le panier, il est ajouté au panier
  if (!knownItem) {
    cart.push(newItem);
    window.alert("Le produit est ajouté à votre panier !");
  }
  return cart;
}

// Récupère l'identifiant du produit
let idNumber = getUrlParameter("id");
let productUrl = "http://localhost:3000/api/products/" + idNumber;

// Récupère les données du produit
collectProductsData(productUrl)
  .then(async function(productData) {
    //Complète les données du produit
    addProductData(productData);

    // Ajoute un produit au panier
    let cartButton = document.getElementById("addToCart");
    cartButton.addEventListener("click", function(event) {
      // Vérifie la couleur et la quantité
      let colors = document.getElementById("colors");
      let quantity = document.getElementById("quantity");

      if (!colors.value) {
        window.alert("Choisissez une couleur !");
        return;
      }

      if (quantity.value < 1 || quantity.value > 100) {
        window.alert("Vous pouvez ajouter 1 article ou jusqu'à 100 articles par produit, au panier");
        return;
      }
      
      // Récupère les données du produit sélectionné
      let newItem = [productData._id , Number(quantity.value), colors.value];

      // Récupère les données stockées en local
      let cart = JSON.parse(localStorage.getItem("cart")); 

      // Modifie le panier 
      let newCart = changeCart(cart, newItem);

      // Stocke le panier en local
      localStorage.setItem("cart", JSON.stringify(newCart));
    })
  })
  .catch(function(error) {
    console.error(`Erreur : ${error}`);
  })


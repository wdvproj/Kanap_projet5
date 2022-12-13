/** 
 * Recupere les parametres d'url 
 * @param { String } parameter - parametre recherche dans l'url
 * @return { String } 
 */

function getUrlParameter(parameter) {
  let url = new URL(window.location.href);

  let searchParams = new URLSearchParams(url.search);

  let foundParameter = searchParams.get(parameter);

  return foundParameter;
}

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
 * Ajoute les donnees du produit aux elements du DOM 
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
  for (let i in productData.colors) {  
    let option = document.createElement("option");
    colors.appendChild(option);
    option.setAttribute("value", productData.colors[i]);
    option.textContent = productData.colors[i];  
  }
}                                                                                     

/** 
 * Stocke les donnees en local 
 * @param { String } dataName
 * @param { Array.<Object> } data - tableau de tableaux
 */

function storeData(dataName, data) {
  localStorage.setItem(dataName, JSON.stringify(data));
}

/** 
 * Remplit le panier 
 * @param { Array.<Object> } cart - tableau de tableaux
 * @param { Array.<Object> } newItem - tableau contenant "String" et "Number"
 * @return { Array.<Object> }
 */

function changeCart(cart, newItem) {
  let knownItem;
  // Si le panier n'est pas stocke en local, il est vide
  if (!cart) {
    cart = [];
  }
  for (let i in cart) {
    // Modifie la quantite, si le produit est le meme
    if (cart[i][0] === newItem[0] && cart[i][2] === newItem[2]) {
      cart[i][1] = cart[i][1] + newItem[1];
      knownItem = true;
      break;
    } 
  }
  // Ajoute le nouveau produit au panier
  if (!knownItem) {
    cart.push(newItem);
    window.alert("Le produit est ajouté à votre panier !");
  }
  return cart;
}

// Recupere l'identifiant pour former l'URL du produit
let idNumber = getUrlParameter("id");
let productUrl = "http://localhost:3000/api/products/" + idNumber;

// Recupere les donnees du produit
collectProductsData(productUrl)
  .then(async function(productData) {
    //Complete les donnees du produit
    addProductData(productData);

    // Ajoute un produit au panier
    let cartButton = document.getElementById("addToCart");
    let apiData = await collectProductsData("http://localhost:3000/api/products/");
    cartButton.addEventListener("click", function(event) {
      // Verifie la couleur et la quantite
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
      
      // Recupere les donnees du produit selectionne
      let newItem = [productData._id , Number(quantity.value), colors.value];

      // Recupere les donnees stockees en local
      let cart = JSON.parse(localStorage.getItem("cart")); 

      // Modifie le panier
      let newCart = changeCart(cart, newItem);
      storeData("cart", newCart);

      // Affiche le contenu du panier
      let productName = "";
      let cartContent = [];
      for (let i in newCart) {
        for (let k in apiData) {
          if (newCart[i][0] === apiData[k]._id) {
            productName = apiData[k].name;
            cartContent.push(`\n${newCart[i][1]} ${productName} ${newCart[i][2]}`);
          }
        }
      }
      window.alert(`Panier\n${cartContent}`);
    })
  })
  .catch(function(error) {
    console.error(`Erreur : ${error}`);
  })


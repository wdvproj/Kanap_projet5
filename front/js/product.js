/* Recupere les parametres d'url */

// "parameter" est le parametre recherche dans l'url, c'est une chaîne de caracteres
function getUrlParameter(parameter) {
  let url = new URL(window.location.href);

  let searchParams = new URLSearchParams(url.search);

  let foundParameter = searchParams.get(parameter);

  return foundParameter;
}

/* Recupere les donnees du produit, stockees dans l'API */

async function collectProductData(url) {
  let response = await fetch(url);
  if (response.ok) {
    return response.json();
  }
} 

/* Ajoute les donnees du produit aux elements du DOM */

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

/* Stocke les donnees en local */

// "dataName" est une chaîne de caracteres
function storeData(dataName, data) {
  localStorage.setItem(dataName, JSON.stringify(data));
}

/* Remplit le panier */

function changeCart(cart, newItem, apiData) {
  let knownItem = 0;
  let productName ="";
  let productColor = "";
  let productQuantity = 0;
  // Verifie si le panier est vide
  if (!cart) {
    cart = [];
  }
  if (cart.length == 0) {
    cart = [newItem];
    productName = apiData.name;
    productColor = cart[cart.length -1].color;
    productQuantity = cart[cart.length -1].quantity;
    if (productQuantity === 1) {
      window.alert(`${productQuantity} ${productName} ${productColor} est ajouté à votre panier !`);
    } else {
      window.alert(`${productQuantity} ${productName} ${productColor} sont ajoutés à votre panier !`);
    }
  } else { // Verifie si le panier est rempli
    for (let i in cart) {
      // Modifie la quantite, si le produit est le meme
      if (cart[i].id === newItem.id && cart[i].color === newItem.color) {
        cart[i].quantity = cart[i].quantity + newItem.quantity;
        knownItem++;
        productName = apiData.name;
        productColor = cart[i].color;
        productQuantity = cart[i].quantity;
        window.alert(`Il y a ${productQuantity} ${productName} ${productColor} dans votre panier !`);
        break;
      } 
    }
    // Ajoute le nouveau produit au panier
    if (knownItem === 0) {
      cart.push(newItem);
      productName = apiData.name;
      productColor = cart[cart.length -1].color;
      productQuantity = cart[cart.length -1].quantity;
      if (productQuantity === 1) {
        window.alert(`${productQuantity} ${productName} ${productColor} est ajouté à votre panier !`);
      } else {
        window.alert(`${productQuantity} ${productName} ${productColor} sont ajoutés à votre panier !`);
      }
    }
  }
  return cart;
}

// Recupere l'identifiant pour former l'URL du produit
let idNumber = getUrlParameter("id");
let productUrl = "http://localhost:3000/api/products/" + idNumber;

// Recupere les donnees du produit
collectProductData(productUrl)
  .then(function(productData) {
    //Complete les donnees du produit
    addProductData(productData);

    // Ajoute un produit au panier
    let cartButton = document.getElementById("addToCart");
    cartButton.addEventListener("click", function(event) {
      // Verifie la couleur et la quantite
      let missingColor = 0;
      let missingQuantity = 0;
      let colors = document.getElementById("colors");
      let quantity = document.getElementById("quantity");

      for (let color of productData.colors) {
        if (colors.value === color) {
          missingColor++;
        }
      }
      if (missingColor === 0) {
        window.alert("Choisissez une couleur !");
      }

      if (quantity.value < 1 || quantity.value > 100) {
        window.alert("Vous pouvez ajouter 1 article ou jusqu'à 100 articles par produit, au panier");
        missingQuantity++;
      }
      
      if (missingColor !== 0 && missingQuantity === 0) {
        // Recupere les donnees du produit selectionne
        let newItem = {id: productData._id , quantity: Number(quantity.value), color: colors.value};

        // Recupere les donnees stockees en local
        let cart = JSON.parse(localStorage.getItem("cart")); 

        // Modifie le panier
        let newCart = changeCart(cart, newItem, productData);
        storeData("cart", newCart);
        let productName ="";
        let productColor = "";
        let productQuantity = 0;
        let cartContent = [];
        for (let i in newCart) {
          productName = productData.name;
          productColor = newCart[i].color;
          productQuantity = newCart[i].quantity;
          cartContent.push(`\n${productQuantity} ${productName} ${productColor}`);
        }
        window.alert(`Panier\n${cartContent}`);
      }
    })
  })
  .catch(function(error) {
    console.error(`Erreur : ${error}`);
  })
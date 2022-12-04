let url = new URL(window.location.href);

let searchParams = new URLSearchParams(url.search);

let idNumber = searchParams.get('id');

let productUrl = "http://localhost:3000/api/products/" + idNumber;

/* Recuperer les donnees stockees dans l'API */

async function dataCollect(url) {
  let response = await fetch(url);
  if (response.ok) {
    return response.json();
  }
} 

/* Remplir les donnees du produit */

function fillProductData(productData) {
  // Ajout de l'image du produit
  let picture = document.createElement("img");
  let pictureParent = document.querySelector("div[class='item__img']");
  pictureParent.appendChild(picture);
  picture.setAttribute("src", productData.imageUrl);
  picture.setAttribute("alt", productData.altTxt);

  // Ajout du titre du produit
  let title = document.getElementById("title");
  title.textContent = productData.name;

  // Ajout du prix du produit
  let price = document.getElementById("price");
  price.textContent = productData.price;

  // Ajout de la description du produit
  let description = document.getElementById("description");
  description.textContent = productData.description;

  // Ajout des couleurs du produit
  let colors = document.getElementById("colors");
  for (let i in productData.colors) {  
    let option = document.createElement("option");
    colors.appendChild(option);
    option.setAttribute("value", productData.colors[i]);
    option.textContent = productData.colors[i];  
  }
}

/* Modifier la valeur du champ apres la saisie de l'utilisateur */

// "field" est le champ (quantite ou couleur)
function changeFieldValue(field) {
  field.addEventListener("change", function(event) {
      field.setAttribute("value", event.target.value);
  })
}

/* Stocker les donnees en local */

// "dataName" est une chaîne de caracteres, "data" est une variable
function storageData(dataName, data) {
  localStorage.setItem(dataName, JSON.stringify(data));
}

/* Ajouter la nouvelle quantite du produit a l'ancienne quantite */

// "quantity" et "newQuantity" sont des chaînes de caracteres 
function addNewQuantity(quantity, newQuantity) {
  let quantitySum = Number(quantity) + Number(newQuantity);
  return quantitySum;
}

/* Remplir le panier */

// "cart" et "newCartItem" sont des tableaux 
function changeCart(cart, newCartItem) {
  let knownItem = 0;
  // Le panier est vide
  if (cart == 0 || cart == null) {
    cart = newCartItem;
    storageData("cart", cart);
  } 
  // Le panier est rempli
  else { 
      for (let i in cart) {
          // Le produit est le meme, la quantite est modifiee
          if (cart[i].id === newCartItem[0].id && cart[i].color === newCartItem[0].color) {
              cart[i].quantity = addNewQuantity(cart[i].quantity, newCartItem[0].quantity);
              storageData("cart", cart);
          }
          
          // Le produit n'est pas le meme
          else {
              for (let i in cart) {
                  // Le produit est deja dans le panier, il n'est pas ajoute au panier
                  if (cart[i].id === newCartItem[0].id && cart[i].color === newCartItem[0].color) {
                      knownItem++;
                  }
              }
              if (knownItem === 0) {
                cart.push(newCartItem[0]);
                storageData("cart", cart);
              } 
          }
      }
  }
  return cart;
}

// Recupere les donnees du produit
dataCollect(productUrl)
  .then(function(productData) {
    //Complete les donnees du produit
    fillProductData(productData);

    // Modification de la valeur du champ de saisie de la quantite, apres saisie de l'utilisateur
    let quantity = document.getElementById("quantity");
    changeFieldValue(quantity);
    // Modification de la valeur du champ de saisie de la couleur, apres saisie de l'utilisateur
    changeFieldValue(colors);
    
    // Ajout d'un produit au panier
    let cartButton = document.getElementById("addToCart");
    cartButton.addEventListener("click", function(event) {
      // Produit selectionne
      let newCartItem = [{id: productData._id , quantity: quantity.getAttribute("value"), color: colors.getAttribute("value")}];
      // Recupere les donnees stockees en local
      let cart = JSON.parse(localStorage.getItem("cart")); 
      // Modification du panier
      let newCart = changeCart(cart, newCartItem);
      console.log(newCart);    
    })
  })
  .catch(function(error) {
    console.log("Erreur : " + error.message);
  })
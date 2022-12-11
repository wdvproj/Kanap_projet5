/* Recupere les parametres d'url */

// "parameter" est le parametre recherche dans l'url, c'est une chaîne de caracteres
function getUrlParameter(parameter) {
    let url = new URL(window.location.href);
  
    let searchParams = new URLSearchParams(url.search);
  
    let foundParameter = searchParams.get(parameter);
  
    return foundParameter;
}

/* Stocke les donnees en local */

// "dataName" est une chaîne de caracteres
function storeData(dataName, data) {
  localStorage.setItem(dataName, JSON.stringify(data));
}

// Affiche l'identifiant de commande
let orderId = getUrlParameter("orderId");

let displayedOrder = document.getElementById("orderId");

displayedOrder.textContent = orderId;

// Supprime la donnee de l'identifiant de commande
orderId = "";

// Supprime les donnees locales
cart = [];
storeData("cart", cart);

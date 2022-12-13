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
 * Stocke les donnees en local 
 * @param { String } dataName
 * @param { Array.<Object> } data - tableau de tableaux
 */

function storeData(dataName, data) {
  localStorage.setItem(dataName, JSON.stringify(data));
}

// Affiche l'identifiant de commande
let orderId = getUrlParameter("orderId");

let displayedOrder = document.getElementById("orderId");

displayedOrder.textContent = orderId; 



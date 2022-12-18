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

// Affiche le numéro de commande
let orderId = getUrlParameter("orderId");

let displayedOrder = document.getElementById("orderId");

displayedOrder.textContent = orderId; 



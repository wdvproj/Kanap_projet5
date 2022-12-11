/* Recupere les donnees des produits, stockees dans l'API */
  
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

/* Regroupe les produits par modele */

function sortData(apiData, localData) {    
    try {
        let sortedData = [];
        for (let i in apiData) {
            for (let k in localData) {
                if (localData[k].id == apiData[i]._id) {
                    sortedData.push(localData[k]);
                }
            }
        }
        return sortedData; 
    } catch (error) {
        console.error(`Erreur : ${error}`);
    }
} 

/* Cree un produit */

function createProduct(apiData, localData) {
    // Ajoute le conteneur principal 
    let article = document.createElement("article");
    article.setAttribute("class", "cart__item");
    article.setAttribute("data-id", apiData._id);
    article.setAttribute("data-color", localData.color);
  
    // Ajoute l'image du produit
    let pictureContainer = document.createElement("div");
    article.appendChild(pictureContainer);
    pictureContainer.setAttribute("class", "cart__item__img");
    let image = document.createElement("img");
    pictureContainer.appendChild(image);
    image.setAttribute("src", apiData.imageUrl);
    image.setAttribute("alt", "Photographie d'un canapé");

  
    // Ajoute le conteneur du contenu
    let contentContainer = document.createElement("div");
    article.appendChild(contentContainer);
    contentContainer.setAttribute("class", "cart__item__content");
  
    // Ajoute la description du produit
    let descriptionContainer = document.createElement("div");
    contentContainer.appendChild(descriptionContainer);
    descriptionContainer.setAttribute("class", "cart__item__content__description");

    let title = document.createElement("h2");
    descriptionContainer.appendChild(title);
    title.textContent = apiData.name;

    let color = document.createElement("p");
    descriptionContainer.appendChild(color);
    color.textContent = localData.color;

    let price = document.createElement("p");
    descriptionContainer.appendChild(price);
    price.textContent = apiData.price.toFixed(2) + "€";

    // Ajoute la quantite du produit 
    let settingsContainer = document.createElement("div");
    contentContainer.appendChild(settingsContainer);
    descriptionContainer.setAttribute("class", "cart__item__content__settings");

    let quantityContainer = document.createElement("div");
    settingsContainer.appendChild(quantityContainer);
    quantityContainer.setAttribute("class", "cart__item__content__settings__quantity");

    let quantity = document.createElement("p");
    quantityContainer.appendChild(quantity);
    quantity.textContent = "Qté :";

    let quantityInput = document.createElement("input");
    quantityContainer.appendChild(quantityInput);
    quantityInput.setAttribute("type", "number");
    quantityInput.setAttribute("class", "itemQuantity");
    quantityInput.setAttribute("name", "itemQuantity");
    quantityInput.setAttribute("min", 1);
    quantityInput.setAttribute("max", 100);
    quantityInput.setAttribute("value", localData.quantity);

    // Ajoute la suppression du produit
    let deleteContainer = document.createElement("div");
    settingsContainer.appendChild(deleteContainer);
    deleteContainer.setAttribute("class", "cart__item__content__settings__delete");

    let remove = document.createElement("p");
    deleteContainer.appendChild(remove);
    remove.setAttribute("class", "deleteItem");
    remove.textContent = "Supprimer";
  
    return article;
}
  
/* Affiche les produits sur la page */

// "productsContainer" est le selecteur du conteneur des produits, "products" est un tableau contenant l'ensemble des produits
function displayProducts(productsContainer, products) {
    let container = document.querySelector(productsContainer);
    for (let product of products) {
      container.appendChild(product);
    } 
}


/* Calcule le nombre d'articles */

// "articles" est un tableau contenant la quantite de chaque produit
function calculateQuantity(apiData,  localData, articles) {
    let totalQuantity = 0;
    if (localData.length !== 0) {
        for (let i in apiData) {
            for (let k in localData) {
                if (apiData[i]._id == localData[k].id) {
                    let articleQuantity = localData[k].quantity;
                    articles.push(articleQuantity);
                }
            }
        }
        totalQuantity = articles.reduce((first, second) => first + second);
    } else { 
        totalQuantity = 0;
    }
    return totalQuantity;
}

/* Calcule le prix total */

// "prices" est un tableau contenant le prix de chaque produit, "articles" est un tableau contenant la quantite de chaque produit
function calculatePrice(apiData,  localData, prices, articles) {
    let totalPrice = 0;
    if (localData.length !== 0) {
        for (let i in apiData) {
            for (let k in localData) {
                if (apiData[i]._id == localData[k].id) {
                    let articleQuantity = localData[k].quantity;
                    articles.push(articleQuantity);
                    let price = apiData[i].price;
                    prices.push(price);
                }
            }
        }
        for (let i in prices) {
            if (articles[i] > 1 || articles[i] == 0) {
                prices[i] = articles[i] * prices[i];
            }
            totalPrice = prices.reduce((first, second) => first + second);
        }
    } else {
        totalPrice = 0;
    }
    return totalPrice;
}

/* Stocke les donnees en local */

// "dataName" est une chaîne de caracteres
function storeData(dataName, data) {
    localStorage.setItem(dataName, JSON.stringify(data));
}

async function main() {
    let cart = JSON.parse(localStorage.getItem("cart"));
    // Affiche les donnees des produits
    try {
        // Verifie le contenu du panier
        if (cart == 0) {
            // Supprime les produits du panier apres une confirmation de commande
            let orderedProducts = document.getElementsByClassName("cart__item");
            for (let product of orderedProducts) {
                product.remove();
            }
        }
        // Recupere les donnees des produits, dans l'API
        let apiData = await collectProductsData("http://localhost:3000/api/products");

        // Groupe les produits par modele
        cart = sortData(apiData, cart);

        // Cree les elements DOM des produits
        let products = [];
        for (let i in apiData) {
            for (let k in cart) {
                if (apiData[i]._id == cart[k].id) {
                    let product =  createProduct(apiData[i], cart[k]);
                    products.push(product);
                }
            }
        }

        // Affiche les produits
        displayProducts("#cart__items", products);

        // Affiche le nombre d'articles
        let articles = [];
        let numberOfArticle = document.getElementById("totalQuantity");
        numberOfArticle.textContent = calculateQuantity(apiData, cart, articles);

        // Affiche le prix total
        let prices = [];
        let totalCost = document.getElementById("totalPrice");
        totalCost.textContent = calculatePrice(apiData, cart, prices, articles);

        // Supprime un produit
        let removeItemArray = document.querySelectorAll("p[class='deleteItem']");

        for (let removeItem of removeItemArray) {
            removeItem.addEventListener("click", function() {
                // Selectionne le produit a supprimer
                let removedProduct = removeItem.closest("article[class='cart__item']");
                let dataColor = removedProduct.dataset.color;
                let dataId = removedProduct.dataset.id;

                // Modifie le panier
                for (let i in cart) {
                    if (dataColor === cart[i].color && dataId === cart[i].id) {
                        cart.splice(i, 1);
                    }
                }
                storeData("cart", cart);

                // Supprime les elements DOM du produit supprime
                removedProduct.remove();

                // Affiche le nombre d'articles
                articles = [];
                numberOfArticle.textContent = calculateQuantity(apiData, cart, articles);

                // Affiche le prix total
                prices = [];
                totalCost.textContent = calculatePrice(apiData, cart, prices, articles);
            }); 
        }

        // Modifie la quantite d'un produit
        let quantityItemArray = document.getElementsByClassName("itemQuantity");
        for (let articleQuantity of quantityItemArray) {
            articleQuantity.addEventListener("change", function(event) {

                // Modifie la valeur de l'element input 
                articleQuantity.setAttribute("value", event.target.value);

                // Selectionne le produit
                let productNewQuantity = articleQuantity.closest("article[class='cart__item']");
                let dataColor = productNewQuantity.dataset.color;
                let dataId = productNewQuantity.dataset.id;

                // Modifie le panier
                let wrongQuantity = 0;
                for (let i in cart) {
                    if (dataColor === cart[i].color && dataId === cart[i].id) {
                        if (Number(articleQuantity.value) < 1 || Number(articleQuantity.value) > 100) {
                            wrongQuantity++;
                        }
                        if (wrongQuantity !== 0) {
                            window.alert("Vous pouvez ajouter 1 article ou jusqu'à 100 articles par produit, au panier");
                        }
                        cart[i].quantity = Number(articleQuantity.value);
                    }
                }
                storeData("cart", cart);            

               // Affiche le nombre d'articles
               articles = [];
               numberOfArticle.textContent = calculateQuantity(apiData, cart, articles);

               // Affiche le prix total
               prices = [];
               totalCost.textContent = calculatePrice(apiData, cart, prices, articles);
            });
        } 

    } catch(error) {
        console.error(`Erreur : ${error}`);
    }

    // Envoie les donnees du formulaire
    try {
        let orderButton = document.getElementById("order");
        orderButton.addEventListener("click", function(event) {
            event.preventDefault();

            // Recupere les valeurs des champs de saisie 
            let firstName = document.getElementById("firstName");
            let lastName = document.getElementById("lastName");
            let address = document.getElementById("address");
            let city = document.getElementById("city");
            let email = document.getElementById("email");

            // Cree l'objet 'contact'
            let contact = {"firstName": firstName.value, "lastName": lastName.value, "address": address.value, "city": city.value,"email": email.value};
            
            // Initialise la valeur initiale du contenu des messages d'erreur
            let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
            firstNameErrorMsg.textContent = "";
            let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
            lastNameErrorMsg.textContent = "";
            let addressErrorMsg = document.getElementById("addressErrorMsg");
            addressErrorMsg.textContent = "";
            let cityErrorMsg = document.getElementById("cityErrorMsg");
            cityErrorMsg.textContent = "";
            let emailErrorMsg = document.getElementById("emailErrorMsg");
            emailErrorMsg.textContent = "";

            // Analyse les donnees de formulaire
            let blank = "";
            let numberRegexp = /\d+/;
            let contactValidation = 0;
            // Affiche un message d'alerte lorsque le prenom et le nom possedent un chiffre
            if (contact.firstName === blank) {
                firstNameErrorMsg.textContent = "Ecrivez votre prénom !"
            } else {
                if (!numberRegexp.test(contact.firstName) && typeof contact.firstName === "string") {
                    contactValidation++;
                } else {
                    firstNameErrorMsg.textContent = "Votre prénom ne doit pas contenir de chiffres";
                }
            }
            if (contact.lastName === blank) {
                lastNameErrorMsg.textContent = "Ecrivez votre nom !"
            } else {
                if (!numberRegexp.test(contact.lastName) && typeof contact.lastName === "string") {
                    contactValidation++;
                } else {
                    lastNameErrorMsg.textContent = "Votre nom ne doit pas contenir de chiffres";
                }
            }
            // Affiche un message d'alerte lorsque l'adresse ne contient pas un numero et un nom de rue, avenue
            let streetRegexp = /[0-9+ +]\brue\b[ +A-Za-z+^0-9]/i;
            let avenueRegexp = /[0-9+ +]\bavenue\b[ +A-Za-z+^0-9]/i;
            if (contact.address === blank) {
                addressErrorMsg.textContent = "Ecrivez votre adresse !"
            } else {
                if (streetRegexp.test(contact.address) || avenueRegexp.test(contact.address) && typeof contact.address === "string") {
                    contactValidation++;
                } else {
                    addressErrorMsg.textContent = "Votre adresse doit être composée d'un numéro et d'un nom de rue ou d'avenue";
                }
            }
            // Affiche un message d'alerte lorsque la ville possede un chiffre
            if (contact.city === blank) {
                cityErrorMsg.textContent = "Ecrivez le nom de la ville !"
            } else {
                if (!numberRegexp.test(contact.city) && typeof contact.city === "string") {
                    contactValidation++;
                } else {
                    cityErrorMsg.textContent = "La ville ne doit pas contenir de chiffres";
                }
            }
            // Affiche un message d'alerte lorsque l'email ne contient pas de '@' et n'a pas par exemple la forme suivante : exemple@exemple.fr
            let emailRegexp = /\w+@\w+\.\w+/;
            if (contact.firstName === blank) {
                emailErrorMsg.textContent = "Ecrivez votre email !"
            } else {
                if (emailRegexp.test(contact.email) && typeof contact.email === "string") {
                    contactValidation++;
                } else {
                    emailErrorMsg.textContent = "L'adresse mail n'est pas correcte !";
                }
            }

            // Cree le tableau des identifiants des produits du panier
            let products = [];
            let productsValidation = 0;
            // Verifie que les identifiants sont des chaînes de caracteres
            for (let i in cart) {
                if (typeof cart[i].id === "string") {
                    products.push(cart[i].id);
                    productsValidation++;
                }
            }
            if (productsValidation === 0) {
                window.alert("Choisissez un canapé !");
            }

            // Verifie le nombre d'articles par produit
            let wrongQuantity = 0;
            for (let product of cart) {
                if (product.quantity < 1 || product.quantity > 100) {
                    wrongQuantity++;
                }
            }
            if (wrongQuantity !== 0) {
                window.alert("Vous pouvez ajouter 1 article ou jusqu'à 100 articles par produit, au panier");
            }

            // Verifie la presence de l'objet 'contact' valide et du tableau 'products' valide
            if (contactValidation === 5 && productsValidation !== 0 && wrongQuantity === 0) {
                // Envoie les donnees du formulaire et le tableau d'identifiants vers l'API
                let data = JSON.stringify({"contact": contact, "products": products});
                fetch("http://localhost:3000/api/products/order", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: data
                })
                    .then(function(response) {
                        if (response.ok) {
                            return response.json();
                        }
                    })
                    .then(function(data) {
                        // Cree l'URL vers la page de confirmation
                        let orderId =  data.orderId;
                        let confirmationUrl = "./confirmation.html?";
                        let orderParameter = new URLSearchParams(confirmationUrl.search);
                        orderParameter.set("orderId", orderId);
                        let confirmationUrlParameter = confirmationUrl + orderParameter.toString();
                        orderId = "";
                        return confirmationUrlParameter;
                    })
                    .then(function(url) {
                        // Ouvre la page de confirmation
                        window.open(url, "_self");
                    })
                    .catch(function(error) {
                        console.error(`Erreur : ${error}`);
                    })
            } 
        });
      

    } catch(error) {
        console.error(`Erreur : ${error}`);
    }
}

main();


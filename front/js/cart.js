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
 * Crée un produit 
 * @param { Object } apiProductData
 * @param { Array.<Object> } localProductData - tableau contenant "String" et "Number"
 * @return { HTMLElement }
 */

function createProduct(apiProductData, localProductData) {
    // Ajoute le conteneur principal 
    let article = document.createElement("article");
    article.setAttribute("class", "cart__item");
    article.setAttribute("data-id", apiProductData._id);
    article.setAttribute("data-color", localProductData[2]);
  
    // Ajoute l'image du produit
    let pictureContainer = document.createElement("div");
    article.appendChild(pictureContainer);
    pictureContainer.setAttribute("class", "cart__item__img");
    let image = document.createElement("img");
    pictureContainer.appendChild(image);
    image.setAttribute("src", apiProductData.imageUrl);
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
    title.textContent = apiProductData.name;

    let color = document.createElement("p");
    descriptionContainer.appendChild(color);
    color.textContent = localProductData[2];

    let price = document.createElement("p");
    descriptionContainer.appendChild(price);
    price.textContent = apiProductData.price.toFixed(2) + "€";

    // Ajoute la quantité du produit 
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
    quantityInput.setAttribute("value", localProductData[1]);

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

/** 
 * Calcule le nombre d'articles 
 * @param { Array.<Object> } localProductsData - tableau de tableaux
 * @return { Number } 
 */

function calculateQuantity(localProductsData) {
    let articles = [];
    let totalQuantity = 0;
    if (localProductsData.length !== 0) {
        for (let index in localProductsData) {
                let articleQuantity = localProductsData[index][1];
                articles.push(articleQuantity);
        }
        totalQuantity = articles.reduce((first, second) => first + second);
    } else { 
        totalQuantity = 0;
    }
    return totalQuantity;
}

/** Calcule le prix total 
 * @param { Array.<Object> } apiProductsData - tableau contenant les données des produits
 * @param { Array.<Object> } localProductsData - tableau de tableaux
 * @return { Number } 
 */

function calculatePrice(apiProductsData, localProductsData) {
    let prices = [];
    let articles = [];
    let totalPrice = 0;
    if (localProductsData.length !== 0) {
        for (let index in apiProductsData) {
            for (let number in localProductsData) {
                if (apiProductsData[index]._id === localProductsData[number][0]) {
                    let articleQuantity = localProductsData[number][1];
                    articles.push(articleQuantity);
                    let price = apiProductsData[index].price;
                    prices.push(price);
                }
            }
        }
        for (let i in prices) {
            prices[i] = articles[i] * prices[i];
            totalPrice = prices.reduce((first, second) => first + second);
        }
    } else {
        totalPrice = 0;
    }
    return totalPrice;
}

/**
 * Initialise la valeur d'un champ de saisie à une chaîne de caractères vide
 * @param { String } id - identifiant de l'élément de champ de saisie
 * @return { HTMLElement }
 */

function initializeFieldContent(id) {
    let field = document.getElementById(id);
    field.textContent = "";
    return field;
}

/** Vérifie les données du formulaire de contact
 * @param { String } fieldValue - la valeur du champ de saisie
 * @param { String } regexp
 * @return { ?Boolean }
 */

function verifyFormData(fieldValue, regexp) {
    if (regexp.test(fieldValue)) {
        return true
    } 
}

/** Envoie des données vers le back-end et récupère une donnée 
 * @param { String } url
 * @param { Object } data 
 * @return { Promise }
*/

async function sendDataAndCollectData(url, data) {
    try {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: data
        });
        if (response.ok) {
            return response.json();
        }
    } 
    catch(error) {
        console.error(`Erreur : ${error}`);
    }
}

async function main() {
    // Récupère les données stockées en local
    let cart = JSON.parse(localStorage.getItem("cart"));

    // Si le panier n'est pas stocké en local, il est vide
    if (!cart) {
        cart = [];
    }

    // Affiche les données des produits
    try {
        // Récupère les données des produits
        let productData = await collectProductsData("http://localhost:3000/api/products");

        // Groupe les produits par modèle
        cart = cart.sort();

        // Crée les éléments DOM des produits
        let products = [];
        for (let index in productData) {
            for (let number in cart) {
                if (productData[index]._id == cart[number][0]) {
                    let product =  createProduct(productData[index], cart[number]);
                    products.push(product);
                }
            }
        }

        // Affiche les produits
        displayProducts("#cart__items", products);

        // Affiche le nombre d'articles
        let numberOfArticle = document.getElementById("totalQuantity");
        numberOfArticle.textContent = calculateQuantity(cart);

        // Affiche le prix total
        let totalCost = document.getElementById("totalPrice");
        totalCost.textContent = calculatePrice(productData, cart);

        // Supprime un produit
        let removeItemArray = document.querySelectorAll(".deleteItem");

        for (let removeItem of removeItemArray) {
            removeItem.addEventListener("click", function() {
                // Sélectionne le produit à supprimer
                let removedProduct = removeItem.closest(".cart__item");
                let dataColor = removedProduct.dataset.color;
                let dataId = removedProduct.dataset.id;

                // Modifie le panier
                for (let index in cart) {
                    if (dataColor === cart[index][2] && dataId === cart[index][0]) {
                        cart.splice(index, 1);
                    }
                }
                localStorage.setItem("cart", JSON.stringify(cart));

                // Supprime les éléments DOM du produit supprimé
                removedProduct.remove();

                // Affiche le nombre d'articles
                numberOfArticle.textContent = calculateQuantity(cart);

                // Affiche le prix total
                totalCost.textContent = calculatePrice(productData, cart);
            }); 
        }

        // Modifie la quantité d'articles d'un produit
        let quantityItemArray = document.getElementsByClassName("itemQuantity");
        for (let articleQuantity of quantityItemArray) {
            articleQuantity.addEventListener("change", function(event) {

                // Sélectionne le produit
                let productNewQuantity = articleQuantity.closest(".cart__item");
                let dataColor = productNewQuantity.dataset.color;
                let dataId = productNewQuantity.dataset.id;

                // Modifie le panier
                for (let index in cart) {
                    if (dataColor === cart[index][2] && dataId === cart[index][0]) {
                        if (Number(articleQuantity.value) < 1 || Number(articleQuantity.value) > 100) {
                            window.alert("Vous pouvez ajouter 1 article ou jusqu'à 100 articles par produit, au panier");
                        } else {
                            cart[index][1] = Number(articleQuantity.value);
                        }
                    }
                }
                localStorage.setItem("cart", JSON.stringify(cart));           

               // Affiche le nombre d'articles
                numberOfArticle.textContent = calculateQuantity(cart);

               // Affiche le prix total
                totalCost.textContent = calculatePrice(productData, cart);
            });
        } 

    } 
    catch(error) {
        console.error(`Erreur : ${error}`);
    }

    // Envoie les données du formulaire et les identifiants des produits du panier
    try {
        let orderButton = document.getElementById("order");
        orderButton.addEventListener("click", function(event) {
            event.preventDefault();

            // Récupère les valeurs des champs de saisie 
            let firstName = document.getElementById("firstName");
            let lastName = document.getElementById("lastName");
            let address = document.getElementById("address");
            let city = document.getElementById("city");
            let email = document.getElementById("email");

            // Crée l'objet "contact"
            let contact = {"firstName": firstName.value, "lastName": lastName.value, "address": address.value, "city": city.value,"email": email.value};
            
            // Initialise les valeurs initiales des contenus des messages d'erreur
            let firstNameErrorMsg = initializeFieldContent("firstNameErrorMsg");
            let lastNameErrorMsg = initializeFieldContent("lastNameErrorMsg");
            let addressErrorMsg = initializeFieldContent("addressErrorMsg");
            let cityErrorMsg = initializeFieldContent("cityErrorMsg");
            let emailErrorMsg = initializeFieldContent("emailErrorMsg");

            // Analyse les données du formulaire

            // Affiche un message d'alerte lorsque le prénom et le nom possèdent un chiffre
            let numberRegexp = /\d+/;
            let firstNameError = verifyFormData(contact.firstName, numberRegexp);
            let firstNameValidation;
            if (contact.firstName === "") {
                firstNameErrorMsg.textContent = "Remplir le champ !"
            } else {
                if (firstNameError) {
                    firstNameErrorMsg.textContent = "Votre prénom ne doit pas contenir de chiffres.";
                } else {
                    firstNameValidation = true;
                }
            }

            let lastNameError = verifyFormData(contact.lastName, numberRegexp);
            let lastNameValidation;
            if (contact.lastName === "") {
                lastNameErrorMsg.textContent = "Remplir le champ !"
            } else {
                if (lastNameError) {
                    lastNameErrorMsg.textContent = "Votre nom ne doit pas contenir de chiffres.";
                } else {
                    lastNameValidation = true;
                }
            }

            // Affiche un message d'alerte lorsque l'adresse ne contient pas un numéro et un nom de rue ou d'avenue
            let streetRegexp = /[0-9+ +]\brue\b[ +A-Za-z+^0-9]/i;
            let avenueRegexp = /[0-9+ +]\bavenue\b[ +A-Za-z+^0-9]/i;
            let streetValidation = verifyFormData(contact.address, streetRegexp);
            let avenueValidation = verifyFormData(contact.address, avenueRegexp);
            let addressValidation;
            if (contact.address === "") {
                addressErrorMsg.textContent = "Remplir le champ !"
            } else {
                if (!streetValidation && !avenueValidation) {
                    addressErrorMsg.textContent = "Votre adresse doit être composée d'un numéro et d'un nom de rue ou d'avenue.";
                } else {
                    addressValidation = true;
                }
            }

            // Affiche un message d'alerte lorsque la ville possède des chiffres
            let cityError = verifyFormData(contact.city, numberRegexp);
            let cityValidation;
            if (contact.city === "") {
                cityErrorMsg.textContent = "Remplir le champ !"
            } else {
                if (cityError) {
                    cityErrorMsg.textContent = "Le nom de la ville ne doit pas contenir de chiffres.";
                
                } else {
                    cityValidation = true;
                }
            }

            // Affiche un message d'alerte lorsque l'email n'a pas par exemple la forme suivante : exemple@exemple.fr
            let emailRegexp = /\w+@\w+\.\w+/;
            let emailValidation = verifyFormData(contact.email, emailRegexp);
            if (contact.email === "") {
                emailErrorMsg.textContent = "Remplir le champ !"
            } else {
                if (!emailValidation) {
                    emailErrorMsg.textContent = "L'adresse mail n'est pas correcte !";
                }
            }
            
            // Vérifie le type des champs
            if (typeof contact.firstName !== "string" || typeof contact.lastName !== "string" || typeof contact.address !== "string" || typeof contact.city !== "string" || typeof contact.email !== "string") {
                return;
            }

            // Analyse le tableau des identifiants des produits du panier
            
            // Crée le tableau des identifiants des produits du panier
            let products = [];
            for (let index in cart) {
                products.push(cart[index][0]);
            }
                     
            // Vérifie la présence du tableau "products" contenant au moins un produit
            if (cart.length === 0) {
                window.alert("Choisissez un canapé !");
                return;
            }

            // Vérifie le type des identifiants 
            for (let product of products) {
                if (typeof product !== "string") {
                    return;
                }
            }

            // Vérifie le nombre d'articles par produit
            let quantityItemArray = document.getElementsByClassName("itemQuantity");
            for (let articleQuantity of quantityItemArray) {
                if (articleQuantity.value < 1 || articleQuantity.value > 100) {
                    window.alert("Vous pouvez ajouter 1 article ou jusqu'à 100 articles par produit, au panier");
                    return;
                }
            }

            // Vérifie la présence de l'objet "contact" valide
            if (firstNameValidation && lastNameValidation && addressValidation && cityValidation && emailValidation) {

                // Envoie les données du formulaire et le tableau d'identifiants vers le back-end  
                let url = "http://localhost:3000/api/products/order";
                let data = JSON.stringify({"contact": contact, "products": products});
                sendDataAndCollectData(url, data)
                    .then(function(data) {
                        // Crée l'URL vers la page de confirmation
                        let confirmationUrl = `./confirmation.html?orderId=${data.orderId}`;
                        return confirmationUrl;
                    })
                    .then(function(confirmationUrl) {
                        // Vide le panier
                        cart = [];

                        // Stocke le panier en local
                        localStorage.setItem("cart", JSON.stringify(cart));

                        // Supprime les éléments DOM des produits commandés
                        let orderedProducts = document.getElementsByClassName("cart__item");
                        for (let product of orderedProducts) {
                            product.remove();
                        }

                        // Ouvre la page de confirmation
                        window.open(confirmationUrl, "_self");
                    })
                    .catch(function(error) {
                        console.error(`Erreur : ${error}`);
                    })
            }
        });
    } 
    catch(error) {
        console.error(`Erreur : ${error}`);
    }
}

main();


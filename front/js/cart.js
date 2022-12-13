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
 * Cree un produit 
 * @param { Object } apiData
 * @param { Array.<Object> } localData - tableau de tableaux
 * @return { HTMLElement }
 */

function createProduct(apiData, localData) {
    // Ajoute le conteneur principal 
    let article = document.createElement("article");
    article.setAttribute("class", "cart__item");
    article.setAttribute("data-id", apiData._id);
    article.setAttribute("data-color", localData[2]);
  
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
    color.textContent = localData[2];

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
    quantityInput.setAttribute("value", localData[1]);

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
 * @param { String } productsContainer - selecteur du conteneur des produits
 * @param { Array.<HTMLElement> } products - tableau contenant l'ensemble des produits
 */

function displayProducts(productsContainer, products) {
    let container = document.querySelector(productsContainer);
    for (let product of products) {
      container.appendChild(product);
    } 
}


/** 
 * Calcule le nombre d'articles 
 * @param { Array.<Object> } localData - tableau de tableaux
 * @return { Number } 
 */

function calculateQuantity(localData) {
    let articles = [];
    let totalQuantity = 0;
    if (localData.length !== 0) {
        for (let i in localData) {
                let articleQuantity = localData[i][1];
                articles.push(articleQuantity);
        }
        totalQuantity = articles.reduce((first, second) => first + second);
    } else { 
        totalQuantity = 0;
    }
    return totalQuantity;
}

/** Calcule le prix total 
 * @param { Array.<Object> } apiData - tableau contenant les donnees des produits
 * @param { Array.<Object> } localData - tableau de tableaux
 * @return { Number } 
 */

function calculatePrice(apiData, localData) {
    let prices = [];
    let articles = [];
    let totalPrice = 0;
    if (localData.length !== 0) {
        for (let i in apiData) {
            for (let k in localData) {
                if (apiData[i]._id == localData[k][0]) {
                    let articleQuantity = localData[k][1];
                    articles.push(articleQuantity);
                    let price = apiData[i].price;
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
 * Stocke les donnees en local 
 * @param { String } dataName
 * @param { Array.<Object> } data - tableau de tableaux
 */

function storeData(dataName, data) {
    localStorage.setItem(dataName, JSON.stringify(data));
}

/**
 * Initialise la valeur d'un champ de saisie a une chaîne de caracteres vide
 * @param { String } id - identifiant de l'element de champ de saisie
 * @return { HTMLElement }
 */

function initializeFieldContent (id) {
    let field = document.getElementById(id);
    field.textContent = "";
    return field;
}

/** Verifie les donnees du formulaire de contact
 * @param { String } fieldValue - la valeur du champ de saisie
 * @param { Srting } regexp
 * @return { ?Boolean }
 */

function verifyFormData (fieldValue, regexp) {
    if (regexp.test(fieldValue)) {
        return true
    } 
}

/** Envoie des donnees vers le back-end et recupere une donnee 
 * @param { String } url
 * @param { Object } data 
 * @return { Promise }
*/

async function sendDataAndCollectData (url, data) {
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
    } catch (error) {
        console.error(`Erreur : ${error}`);
    }
}

async function main() {
    // Donnee stockees en local
    let cart = JSON.parse(localStorage.getItem("cart"));
    // Si le panier n'est pas stocke en local, il est vide
    if (!cart) {
        cart = [];
    }

    // Affiche les donnees des produits
    try {
        // Recupere les donnees des produits, dans l'API
        let apiData = await collectProductsData("http://localhost:3000/api/products");

        // Groupe les produits par modele
        cart = cart.sort();

        // Cree les elements DOM des produits
        let products = [];
        for (let i in apiData) {
            for (let k in cart) {
                if (apiData[i]._id == cart[k][0]) {
                    let product =  createProduct(apiData[i], cart[k]);
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
        totalCost.textContent = calculatePrice(apiData, cart);

        // Supprime un produit
        let removeItemArray = document.querySelectorAll(".deleteItem");

        for (let removeItem of removeItemArray) {
            removeItem.addEventListener("click", function() {
                // Selectionne le produit a supprimer
                let removedProduct = removeItem.closest(".cart__item");
                let dataColor = removedProduct.dataset.color;
                let dataId = removedProduct.dataset.id;

                // Modifie le panier
                for (let i in cart) {
                    if (dataColor === cart[i][2] && dataId === cart[i][0]) {
                        cart.splice(i, 1);
                    }
                }
                storeData("cart", cart);

                // Supprime les elements DOM du produit supprime
                removedProduct.remove();

                // Affiche le nombre d'articles
                numberOfArticle.textContent = calculateQuantity(cart);

                // Affiche le prix total
                totalCost.textContent = calculatePrice(apiData, cart);
            }); 
        }

        // Modifie la quantite d'articles d'un produit
        let quantityItemArray = document.getElementsByClassName("itemQuantity");
        for (let articleQuantity of quantityItemArray) {
            articleQuantity.addEventListener("change", function(event) {

                // Modifie la valeur de l'element input 
                articleQuantity.setAttribute("value", event.target.value);

                // Selectionne le produit
                let productNewQuantity = articleQuantity.closest(".cart__item");
                let dataColor = productNewQuantity.dataset.color;
                let dataId = productNewQuantity.dataset.id;

                // Modifie le panier
                for (let i in cart) {
                    if (dataColor === cart[i][2] && dataId === cart[i][0]) {
                        if (Number(articleQuantity.value) < 1 || Number(articleQuantity.value) > 100) {
                            window.alert("Vous pouvez ajouter 1 article ou jusqu'à 100 articles par produit, au panier");
                        } else {
                            cart[i][1] = Number(articleQuantity.value);
                        }
                    }
                }
                storeData("cart", cart);            

               // Affiche le nombre d'articles
                numberOfArticle.textContent = calculateQuantity(cart);

               // Affiche le prix total
                totalCost.textContent = calculatePrice(apiData, cart);
            });
        } 

    } catch(error) {
        console.error(`Erreur : ${error}`);
    }

    // Envoie les donnees du formulaire et les identifiants des produits du panier
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
            let firstNameErrorMsg = initializeFieldContent("firstNameErrorMsg");
            let lastNameErrorMsg = initializeFieldContent("lastNameErrorMsg");
            let addressErrorMsg = initializeFieldContent("addressErrorMsg");
            let cityErrorMsg = initializeFieldContent("cityErrorMsg");
            let emailErrorMsg = initializeFieldContent("emailErrorMsg");

            // Analyse les donnees du formulaire

            // Affiche un message d'alerte lorsque le prenom et le nom possedent un chiffre
            let numberRegexp = /\d+/;
            let firstNameError = verifyFormData(contact.firstName, numberRegexp);
            if (contact.firstName === "") {
                firstNameErrorMsg.textContent = "Remplir le champ."
            } else {
                if (firstNameError) {
                    firstNameErrorMsg.textContent = "Votre prénom ne doit pas contenir de chiffres";
                }
            }

            let lastNameError = verifyFormData(contact.lastName, numberRegexp);
            if (contact.lastName === "") {
                lastNameErrorMsg.textContent = "Remplir le champ."
            } else {
                if (lastNameError) {
                    lastNameErrorMsg.textContent = "Votre nom ne doit pas contenir de chiffres";
                }
            }

            // Affiche un message d'alerte lorsque l'adresse ne contient pas un numero et un nom de rue ou d'avenue
            let streetRegexp = /[0-9+ +]\brue\b[ +A-Za-z+^0-9]/i;
            let avenueRegexp = /[0-9+ +]\bavenue\b[ +A-Za-z+^0-9]/i;
            let streetValidation = verifyFormData(contact.address, streetRegexp);
            let avenueValidation = verifyFormData(contact.address, avenueRegexp);
            let addressValidation;
            if (contact.address === "") {
                addressErrorMsg.textContent = "Remplir le champ."
            } else {
                if (!streetValidation && !avenueValidation) {
                    addressErrorMsg.textContent = "Votre adresse doit être composée d'un numéro et d'un nom de rue ou d'avenue";
                } else {
                    addressValidation = true;
                }
            }

            // Affiche un message d'alerte lorsque la ville possede un chiffre
            let cityError = verifyFormData(contact.city, numberRegexp);
            if (contact.city === "") {
                cityErrorMsg.textContent = "Remplir le champ."
            } else {
                if (cityError) {
                    cityErrorMsg.textContent = "Le nom de la ville ne doit pas contenir de chiffres";
                
                }
            }

            // Affiche un message d'alerte lorsque l'email ne contient pas de '@' et n'a pas par exemple la forme suivante : exemple@exemple.fr
            let emailRegexp = /\w+@\w+\.\w+/;
            let emailValidation = verifyFormData(contact.email, emailRegexp);
            if (contact.email === "") {
                emailErrorMsg.textContent = "Remplir le champ."
            } else {
                if (!emailValidation) {
                    emailErrorMsg.textContent = "L'adresse mail n'est pas correcte !";
                }
            }
            
            // Verifie le type des champs
            if (typeof contact.firstName !== "string") {
                return;
            }
            if (typeof contact.lastName !== "string") {
                return;
            }            
            if (typeof contact.address !== "string") {
                return;
            }
            if (typeof contact.city !== "string") {
                return;
            }
            if (typeof contact.email !== "string") {
                return;
            }

            // Cree le tableau des identifiants des produits du panier
            let products = [];
            for (let i in cart) {
                products.push(cart[i][0]);
            }
            
            // Verifie la presence du tableau 'products' contenant au moins un produit
            if (cart.length === 0) {
                window.alert("Choisissez un canapé !");
                return;
            }

            // Verifie le type des identifiants 
            for (let product of products) {
                if (typeof product !== "string") {
                    return;
                }
            }

            // Verifie le nombre d'articles par produit
            let quantityItemArray = document.getElementsByClassName("itemQuantity");
            for (let articleQuantity of quantityItemArray) {
                if (articleQuantity.value < 1 || articleQuantity.value > 100) {
                    window.alert("Vous pouvez ajouter 1 article ou jusqu'à 100 articles par produit, au panier");
                    return;
                }
            }

            // Verifie la presence de l'objet 'contact' valide
            if (!firstNameError && !lastNameError && addressValidation && !cityError && emailValidation) {

                // Envoie les donnees du formulaire et le tableau d'identifiants vers le back-end  
                let url = "http://localhost:3000/api/products/order";
                let data = JSON.stringify({"contact": contact, "products": products});
                sendDataAndCollectData (url, data)
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
                        // Vide le panier
                        cart = [];
                        storeData("cart", cart);
                        let orderedProducts = document.getElementsByClassName("cart__item");
                        for (let product of orderedProducts) {
                            product.remove();
                        }
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


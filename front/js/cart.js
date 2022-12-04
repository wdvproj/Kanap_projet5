let cart = JSON.parse(localStorage.getItem("cart"));  

/* Recuperer les donnees stockees dans l'API */
  
async function dataCollect(url) {
    try {
        let response = await fetch(url);
        if (response.ok) {
        return response.json();
        }
    } catch (error) {
        console.log("Erreur : " + error.message);
    }
}

/* Regrouper les produits par modele */

async function sortData(url, storageData) {    
    try {
        let apiData  = await dataCollect(url);
        let sortedData = [];
        for (let i in apiData) {
            for (let k in storageData) {
                if (storageData[k].id == apiData[i]._id) {
                    sortedData.push(storageData[k]);
                }
            }
        }
        return sortedData; 
    } catch (error) {
        console.log("Erreur : " + error.message);
    }
} 

/* Creer un produit */

function createProduct(apiData, localData) {
    // Ajout du conteneur principal 
    let article = document.createElement("article");
    article.setAttribute("class", "cart__item");
    article.setAttribute("data-id", apiData._id);
    article.setAttribute("data-color", localData.color);
  
    // Ajout de l'image du produit
    let pictureContainer = document.createElement("div");
    article.appendChild(pictureContainer);
    pictureContainer.setAttribute("class", "cart__item__img");
    let image = document.createElement("img");
    pictureContainer.appendChild(image);
    image.setAttribute("src", apiData.imageUrl);
    image.setAttribute("alt", "Photographie d'un canapé");

  
    // Ajout du conteneur du contenu
    let contentContainer = document.createElement("div");
    article.appendChild(contentContainer);
    contentContainer.setAttribute("class", "cart__item__content");
  
    // Ajout de la description du produit
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

    // Ajout de la quantite du produit 
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

    // Suppression du produit
    let deleteContainer = document.createElement("div");
    settingsContainer.appendChild(deleteContainer);
    deleteContainer.setAttribute("class", "cart__item__content__settings__delete");

    let remove = document.createElement("p");
    deleteContainer.appendChild(remove);
    remove.setAttribute("class", "deleteItem");
    remove.textContent = "Supprimer";
  
    return article;
}
  
/* Afficher les produits sur la page */

// "productsContainer" est le selecteur du conteneur des produits, "products" est un tableau contenant l'ensemble des produits
function displayProducts(productsContainer, products) {
    let container = document.querySelector(productsContainer);
    for (let product of products) {
      container.appendChild(product);
    } 
}

/* Calculer le nombre d'articles */

// "quantities" est un tableau contenant la quantite de chaque article
function calculateQuantity(quantities) {
    let totalQuantity = 0;
    for (let quantity of quantities) {
        totalQuantity = totalQuantity + Number(quantity);
    }
    return totalQuantity;
}

/* Afficher le nombre d'articles */

// "articles" est un tableau contenant la quantite de chaque article, "element" est l'element contenant la valeur du nombre d'articles
function displayQuantity(articles, localData, element) {
    for (let i in localData) {
        let article = localData[i].quantity;
        articles.push(article);
    }
    element.textContent = calculateQuantity(articles);
    return articles;
}

/* Calculer le prix total */

// "prices" est un tableau contenant les prix, "quantities" est un tableau contenant la quantite de chaque article
function calculatePrice(prices, quantities) {
    let totalPrice = 0;
    for (let i in prices) {
        if (quantities[i] > 1 || quantities[i] == 0) {
            prices[i] = Number(quantities[i]) * prices[i];
        }
        totalPrice = totalPrice + prices[i];
    }
    return totalPrice;
}

/* Afficher le prix total */

// "prices" est un tableau contenant le prix de chaque article, "element" est l'element contenant la valeur du prix total
async function displayPrice(prices, localData, element, articles) {
    apiData = await retrieveProductData(localData);
    for (let i in apiData) {
        let price = apiData[i].price;
        prices.push(price);
    }
    element.textContent = calculatePrice(prices, articles);
}

/* Recupere les donnees de chaque produit du panier, dans l'api */

async function retrieveProductData(cart) {
    let data = [];
    for (let i in cart) {
        let productUrl = "http://localhost:3000/api/products/" + cart[i].id;
        data.push(await dataCollect(productUrl));
    }
    return data;
}

async function main() {
    try {
        let url = "http://localhost:3000/api/products";
        // Groupe les produits par modele
        cart = await sortData(url, cart);

        // Cree les elements DOM des produits
        let products = [];
        let productData = await retrieveProductData(cart);
        for (let i in productData) {
            let product =  createProduct(productData[i], cart[i]);
            products.push(product);
        }

        // Affiche les produits
        displayProducts("section[id='cart__items']", products);

        // Affiche le nombre d'articles
        let articles = [];
        let numberOfArticle = document.getElementById("totalQuantity");
        let articlesArray = displayQuantity(articles, cart, numberOfArticle);

        // Affiche le prix total
        let prices = [];
        let totalCost = document.getElementById("totalPrice");
        displayPrice(prices, cart, totalCost, articlesArray);

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
                localStorage.setItem("cart", JSON.stringify(cart));

                // Supprime les elements DOM du produit supprime
                removedProduct.remove();

                // Affiche le nombre d'articles
                articles = [];
                let articlesArray = displayQuantity(articles, cart, numberOfArticle);

                // Affiche le prix total
                prices = [];
                displayPrice(prices, cart, totalCost, articlesArray);
            }); 
        }

        // Modifie la quantite d'un article
        let quantityItemArray = document.getElementsByClassName("itemQuantity");
        for (let article of quantityItemArray) {
            article.addEventListener("change", function(event) {
                
                // Modifie le contenu de l'element input 
                article.setAttribute("value", event.target.value);

                // Selectionne le produit
                let productNewQuantity = article.closest("article[class='cart__item']");
                let dataColor = productNewQuantity.dataset.color;
                let dataId = productNewQuantity.dataset.id;

                // Modifie le panier
                articles = [];
                for (let i in cart) {
                    if (dataColor === cart[i].color && dataId === cart[i].id) {
                        cart[i].quantity = article.value;
                        articles[i] = article.value;
                    }
                }
                localStorage.setItem("cart", JSON.stringify(cart));               

                // Affiche le nombre d'articles
                articles = [];
                let articlesArray = displayQuantity(articles, cart, numberOfArticle);

                // Affiche le prix total
                prices = [];
                displayPrice(prices, cart, totalCost, articlesArray);
            });
        } 

    }

    catch(error) {
        console.log("Erreur : ", error.message);
    }
}

main();


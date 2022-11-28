let url = new URL(window.location.href);

let searchParams = new URLSearchParams(url.search);

let idNumber = searchParams.get('id');

let idUrl = "http://localhost:3000/api/products/" + idNumber;

/* Recupere les donnees stockees dans l'API */
  
async function dataCollect(url) {
  let response = await fetch(url);
  if (response.ok) {
    return response.json();
  }
}

/* Ajoute un element enfant a un element parent */ 

// "childTagName" est le nom de l'element enfant, "parentTagName" est le nom de l'element parent, ce sont des chaînes de caracteres


function addChildIntoParent(childTagName, parentTagName) {
  let childData;
  let parent = document.querySelectorAll(parentTagName);
  
  if (parent.length === 1) {
    childData = document.createElement(childTagName);
    parent[0].appendChild(childData);
  }
  else {
    for (let i = 0; i < parent.length; i++) {
      let child = document.createElement(childTagName);
      parent[i].appendChild(child);
      if (i === 0) {
        childData = [];
      }
      childData.push(child);
    }
  }
  return childData;
}

dataCollect(idUrl)
.then(function(value) {

    // Ajout de l'image du produit

    let pictureAttribute = addChildIntoParent("img", "div[class='item__img']");
    pictureAttribute.setAttribute("src", value.imageUrl);
    pictureAttribute.setAttribute("alt", value.altTxt);

    // Ajout du titre du produit

    let title = document.getElementById("title");
    title.textContent = value.name;

    // Ajout du prix du produit

    let price = document.getElementById("price");
    price.textContent = value.price;

    // Ajout de la description du produit

    let description = document.getElementById("description");
    description.textContent = value.description;

    // Ajout des couleurs du produit
  
    for (let i in value.colors) {  
      addChildIntoParent("option", "select[id='colors']").setAttribute("value", value.colors[i]);
      addChildIntoParent("option", "select[id='colors']").textContent = value.colors[i];  
    }

    let quantity = document.getElementById("quantity");
    
    quantity.addEventListener("change", function(event) {
        quantity.setAttribute("value", event.target.value);
    })

    colors.addEventListener("change", function(event) {
        colors.setAttribute("value", event.target.value);
    })
    
    let cartButton = document.getElementById("addToCart");

    let moreCartItem;

    let knownItem;

    cartButton.addEventListener("click", function(event) {
        moreCartItem = [{id: value._id , quantity: quantity.getAttribute("value"), color: colors.getAttribute("value")}];
        let cart = JSON.parse(localStorage.getItem("cart")); 

        if (cart === null) {
            cart = [{id: value._id , quantity: quantity.getAttribute("value"), color: colors.getAttribute("value")}];
            localStorage.setItem("cart", JSON.stringify(cart));
        }
         
        else {
            for (let i in cart) {

                if (cart[i].id === moreCartItem[0].id && cart[i].color === moreCartItem[0].color) {
                    cart[i].quantity = Number(moreCartItem[0].quantity) + Number(cart[i].quantity);
                    localStorage.setItem("cart", JSON.stringify(cart)); 
                }
    
                else {
                    for (let i in cart) {
                        if (cart[i].id === moreCartItem[0].id && cart[i].color === moreCartItem[0].color) {
                            knownItem = true;
                        }
                        else {
                            knownItem = false;
                        }
                    }
                }
            }

            if (knownItem === false) {
                cart.push({id: value._id , quantity: quantity.getAttribute("value"), color: colors.getAttribute("value")});
                localStorage.setItem("cart", JSON.stringify(cart));
            }
        }
        console.log(cart);    
    })
})

.catch(function(error) {
    console.log("Erreur : " + error.message);
})
let url = new URL(window.location.href);

let searchParams = new URLSearchParams(url.search);

let idNumber = searchParams.get('id');

let idUrl = "http://localhost:3000/api/products/" + idNumber;

fetch(idUrl)
.then(function(response) {
  if (response.ok) {
    return response.json();
  }
})

.then(function(value) {
    let picture = document.createElement("img");
    let itemImg = document.getElementsByClassName("item__img");
    itemImg[0].appendChild(picture);
    picture.setAttribute("src", value.imageUrl);
    picture.setAttribute("alt", value.altTxt);

    let title = document.getElementById("title");
    title.textContent = value.name;

    let price = document.getElementById("price");
    price.textContent = value.price;

    let description = document.getElementById("description");
    description.textContent = value.description;

    let colors = document.getElementById("colors");
    for (let i=0; i < value.colors.length; i++) {
        let option = document.createElement("option");
        colors.appendChild(option);
        option.setAttribute("value", value.colors[i]);
        option.textContent = value.colors[i];
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
    console.log("Erreur" + error.message);
})
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
})

.catch(function(error) {
    console.log("Erreur" + error.message);
})
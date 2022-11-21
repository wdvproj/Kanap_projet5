fetch("http://localhost:3000/api/products")
.then(function(reponse) {
  if (reponse.ok) {
    return reponse.json();
  }
})

.then(function(value) {
  let items = document.getElementById("items");
  for (let i = 0; i < value.length; i++) {
    let link = document.createElement("a");
    items.appendChild(link);
    let url = "./product.html?id=" + value[i]._id;
    link.setAttribute("href", url);

    let article = document.createElement("article");
    link.appendChild(article);

    let picture = document.createElement("img");
    article.appendChild(picture);
    let url_picture = value[i].imageUrl;
    picture.setAttribute("src", url_picture);
    let alt = value[i].altTxt;
    picture.setAttribute("alt", alt);

    let title = document.createElement("h3");
    article.appendChild(title);
    title.setAttribute("class", "productName");
    title.textContent = value[i].name;
    
    let paragraphe = document.createElement("p");
    article.appendChild(paragraphe);
    paragraphe.setAttribute("class", "productDescription");
    paragraphe.textContent = value[i].description;
  }
})

.catch(function(err){

})
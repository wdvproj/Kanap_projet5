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

dataCollect("http://localhost:3000/api/products")
.then(function(value) {

  // Ajout des liens vers la page produit

  for (let i in value) {
      addChildIntoParent("a", "section[id='items']").setAttribute("href", "./product.html?id=" + value[i]._id);
  }

  // Ajout des balises <article> 

  addChildIntoParent("article", "a[href*='./product.html?id=']");

  // Ajout des images des produits

  let pictureAttribute = addChildIntoParent("img", "article");

  for (let i in pictureAttribute) {
    pictureAttribute[i].setAttribute("src", value[i].imageUrl);
    pictureAttribute[i].setAttribute("alt", value[i].altTxt);
  }

  // Ajout des titres des produits

  let titleAttributeAndContent =  addChildIntoParent("h3", "article");

  for (let i in titleAttributeAndContent) {
    titleAttributeAndContent[i].setAttribute("class", "productName");
    titleAttributeAndContent[i].textContent = value[i].name;
  }
  
  // Ajout des descriptions des produits

  let descriptionAttributeAndContent =  addChildIntoParent("p", "article");

  for (let i in descriptionAttributeAndContent) {
    descriptionAttributeAndContent[i].setAttribute("class", "productDescription");
    descriptionAttributeAndContent[i].textContent = value[i].description;
  }
}) 

.catch(function(error) {
  console.log("Erreur : " + error.message);
})
const productGrid = document.getElementById("productGrid");
const cartList = document.getElementById("cartList");
const emptyCart = document.getElementById("emptyCart");
let cart = [];

fetch(`./data.json`).then(response => response.json()).then(data => {
    displayProduct(data);
});

function displayProduct(products){
    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `<div class="image">
        <img src="${product.image.desktop}" alt="${product.name}">
        <button class="btn" onclick="addToCart(${product.name}, ${product.price})" id="btn"><img src="assets/images/icon-add-to-cart.svg" alt="">Add to Cart
        <div class="productCount">
            <img src="assets/images/icon-decrement-quantity.svg">
            <span class="quantityCount">0</span>
            <img src="assets/images/icon-increment-quantity.svg">
        </div>
        </button>
        </div>
        <span>${product.category}</span>
        <h3>${product.name}</h3>
        <p>$${product.price.toFixed(2)}</p>`;

        productGrid.appendChild(productCard);


    })        


}


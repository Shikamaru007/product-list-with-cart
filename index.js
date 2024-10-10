const productGrid = document.getElementById("productGrid");
const cartList = document.getElementById("cartList");
const emptyCart = document.getElementById("emptyCart");
const orderSummary = document.getElementById("orderSummary");
const totalOrderAmount = document.getElementById("orderTotalAmount");
const orderBtn = document.getElementById("confirmOrderBtn");
const startNewOrderBtn = document.getElementById("startNewOrder");
let cart = [];


fetch('./data.json').then(response => response.json()).then(data => {
    displayProduct(data);
});

//<img src="${product.image.desktop}" alt="${product.name}">
function displayProduct(products) {
    products.forEach(product => {
        const productCard = document.createElement("div");
        const productImg = document.createElement("img");

        updateImageSrc(productImg, product.image);


        productImg.src = product.image.desktop;
        productImg.alt = product.name;
        productCard.classList.add("product-card");
        productImg.classList.add("imge")
    
        productCard.innerHTML = `
            <div class="image">                
                <button class="btn" id="btn-${product.id}">
                    <img src="assets/images/icon-add-to-cart.svg" alt="">Add to Cart
                </button>
            </div>
            <span>${product.category}</span>
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>`;

        productCard.querySelector(".image").appendChild(productImg);

        productGrid.appendChild(productCard);

        document.getElementById(`btn-${product.id}`).addEventListener('click', () => {
            addToCart(product);
        });

        startNewOrderBtn.addEventListener("click", () => {startNewOrder(product)});

        window.addEventListener("resize", () => {
            document.querySelectorAll(".imge").forEach((img, index) => {
                updateImageSrc(img, products[index].image);
            })
        });

    });
}


function addToCart(product) {
    let existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        existingProduct = { ...product, quantity: 1 }; 
        
        cart.push(existingProduct);
    }

    updateProductButton(existingProduct); 
    updateImageBorder(existingProduct);
    updateCart(); 
}

function updateImageBorder(product){
    const productImage = document.getElementById(`btn-${product.id}`).parentNode;
    
    if(product.quantity > 0){
        productImage.classList.add("selected");
    }
    else {
        productImage.classList.remove("selected");
    }
}


function updateProductButton(product) {
    const productButton = document.getElementById(`btn-${product.id}`);

    if (product.quantity > 0) {
        productButton.innerHTML = `
            <div class="productCount">
                <div class="decrementBtn"><i class="fa-solid fa-minus decrement"></i></div>
                <span class="quantityCount">${product.quantity}</span>
                <div class="incrementBtn"><i class="fa-solid fa-plus increment"></i></div>
            </div>`;

       
        const newButton = productButton.cloneNode(true);
        productButton.parentNode.replaceChild(newButton, productButton);
        

        
        newButton.querySelector('.incrementBtn').addEventListener('click', () => incrementQuantity(product));
        newButton.querySelector('.decrementBtn').addEventListener('click', () => decrementQuantity(product));
    } else {
      
        resetAddToCartButton(product);
    }
}


function resetAddToCartButton(product) {
    const productButton = document.getElementById(`btn-${product.id}`);
    productButton.innerHTML = `<img src="assets/images/icon-add-to-cart.svg" alt="">Add to Cart`;


    const newButton = productButton.cloneNode(true);
    productButton.parentNode.replaceChild(newButton, productButton);


    newButton.addEventListener('click', () => addToCart(product));
}


function incrementQuantity(product) {
    product.quantity += 1;
    updateProductButton(product); 
    updateCart(); 
}


function decrementQuantity(product) {
    if (product.quantity > 1) {
        product.quantity -= 1; 
    } else {
        product.quantity = 0;
        cart = cart.filter(item => item.id !== product.id); 
        updateImageBorder(product);
    }

    updateProductButton(product);
    updateCart(); 
}


function updateCart() {
    cartList.innerHTML = ''; 
    let totalQuantity = 0;
    let totalAmount = 0;

    cart.forEach(item => {
        totalQuantity += item.quantity; 
        const totalItemPrice = item.quantity * item.price;
        totalAmount += item.quantity * item.price;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <div class="list">
                <div class="name">
                    <p>${item.name}</p>
                    <div class="details">
                        <span class="quantity">${item.quantity}x</span>
                        <span class="price">@ $${item.price.toFixed(2)}</span>
                        <span class="total">$${totalItemPrice.toFixed(2)}</span>
                    </div>
                </div>
                <div class="removePdct">
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>`;

        cartItem.querySelector(".removePdct").addEventListener("click", () => {removeFromCart(item.id)})

        cartList.appendChild(cartItem);  
        
    });


    document.getElementById('quantity').innerText = totalQuantity;


    totalOrderAmount.textContent = `$${totalAmount.toFixed(2)}`


    if (totalQuantity === 0) {
       emptyCart.style.display = "flex";
       orderSummary.style.display = "none";
       totalOrderAmount.textContent = '';
    }
    else{
        emptyCart.style.display = "none";
        orderSummary.style.display = "flex";
        
    }
}
function removeFromCart(productId){

    const product = cart.find(item => item.id === productId);

    if(product){
        product.quantity = 0;
        resetAddToCartButton(product);
        updateImageBorder(product);
    }
    
    cart = cart.filter(item => item.id !== productId);

    updateCart();
}

orderBtn.addEventListener("click", () => {confirmOrder()});

function confirmOrder() {
    const modal = document.getElementById("confirmationModal");
    const confirmedItems = document.getElementById("confirmedOrderItems");
    const confirmedOrderTotal = document.getElementById("confirmationTotal");
    

    confirmedItems.innerHTML = '';
    document.body.classList.add("no-scroll");

    let totalOrderedAmount = 0;

    cart.forEach(item => {
        totalPrice = item.quantity * item.price;
        totalOrderedAmount += totalPrice;

        const orderItem = document.createElement("div");
        orderItem.classList.add("order-item");
        orderItem.innerHTML = `
                     <div class="thumbnail">
                     <img src="${item.image.thumbnail}" alt="${item.name}">
                    </div>
                    <div class="orderDetails">
                        <p class="name">${item.name}</p>
                        <div><span class="quantity">${item.quantity}x</span> <span class="price">$${item.price.toFixed(2)}</span></div>
                    </div>
                    <p class="itemTotal">$${totalPrice.toFixed(2)}</p>`;

        confirmedItems.appendChild(orderItem);        
    })

    confirmedOrderTotal.textContent = `$${totalOrderedAmount.toFixed(2)}`;

    modal.style.display = "flex";
}

function startNewOrder(product) {
    cart = [];
    updateCart();
    updateImageBorder(product);
    resetAddToCartButton(product);

    const confirmationModal = document.getElementById("confirmationModal");
    
    confirmationModal.style.display = "none";
    document.body.classList.remove("no-scroll");
}

function  updateImageSrc(imageElement, imageSources){
    if(window.innerWidth <= 769){
        imageElement.src = imageSources.mobile;
    }
    else if(window.innerWidth <= 1025){
        imageElement.src = imageSources.tablet;
    }
    else {
        imageElement.src = imageSources.desktop;
    }
}
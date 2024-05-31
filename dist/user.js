"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const USER_BASE_URL = "http://localhost:3000/products";
let cart = [];
const loadProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(USER_BASE_URL);
    const products = yield response.json();
    const productList = document.getElementById("product-list");
    if (productList) {
        productList.innerHTML = products
            .map((product) => `
      <div class="product">
        <img src="${product.imageUrl}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>$${product.price}</p>
        <p>${product.description}</p>
        <button class="add-to-cart" data-id="${product.id}" 
        onclick="()=>{addToCart(${product})}">Add to Cart</button>
      </div>
    `)
            .join("");
    }
});
const renderCart = () => {
    const cartList = document.getElementById("cart-list");
    if (cartList) {
        console.log(cart.length);
        if (cart.length === 0) {
            cartList.innerHTML = "<p>Your cart is empty</p>";
        }
        else {
            cartList.innerHTML = cart
                .map((item) => `
        <div class="cart-item">
          <img src="${item.imageUrl}" alt="${item.name}">
          <h2>${item.name}</h2>
          <p>Price: $${item.price}</p>
          <p>Quantity: ${item.quantity}</p>
      <button class="remove-from-cart" data-id="${item.id}" >Remove</button>
        </div>
      `)
                .join("");
        }
    }
};
const addToCart = (product) => {
    console.log("adding to cart", product);
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    }
    else {
        cart.push(Object.assign(Object.assign({}, product), { quantity: 1 }));
    }
    renderCart();
};
const removeFromCart = (id) => {
    cart = cart.filter((item) => item.id !== id);
    renderCart();
};
const userinit = () => __awaiter(void 0, void 0, void 0, function* () {
    yield loadProducts();
    document.body.addEventListener("click", (event) => {
        var _a, _b, _c, _d, _e;
        const target = event.target;
        if (target.matches(".add-to-cart")) {
            const id = target.dataset.id;
            if (id) {
                const productElement = target.closest(".product");
                if (productElement) {
                    const name = ((_a = productElement.querySelector("h2")) === null || _a === void 0 ? void 0 : _a.textContent) || "";
                    const price = parseFloat(((_c = (_b = productElement.querySelector("p")) === null || _b === void 0 ? void 0 : _b.textContent) === null || _c === void 0 ? void 0 : _c.replace("$", "")) ||
                        "0");
                    const description = ((_d = productElement.querySelectorAll("p")[1]) === null || _d === void 0 ? void 0 : _d.textContent) || "";
                    const imageUrl = ((_e = productElement.querySelector("img")) === null || _e === void 0 ? void 0 : _e.getAttribute("src")) || "";
                    const product = { id, name, price, description, imageUrl };
                    addToCart(product);
                }
            }
        }
        else if (target.matches(".remove-from-cart")) {
            const id = target.dataset.id;
            if (id) {
                removeFromCart(id);
            }
        }
        else if (target.matches("#view-cart")) {
            const productList = document.getElementById("product-list");
            const cartList = document.getElementById("cart-list");
            if (productList && cartList) {
                productList.classList.toggle("hidden");
                cartList.classList.toggle("hidden");
                renderCart();
            }
        }
    });
});
userinit();

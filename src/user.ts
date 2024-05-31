interface Product {
  id?: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface CartItem extends Product {
  quantity: number;
}

const USER_BASE_URL = "http://localhost:3000/products";
let cart: CartItem[] = [];

const loadProducts = async () => {
  const response = await fetch(USER_BASE_URL);

  const products: Product[] = await response.json();

  const productList = document.getElementById("product-list");
  if (productList) {
    productList.innerHTML = products
      .map(
        (product) => `
      <div class="product">
        <img src="${product.imageUrl}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>$${product.price}</p>
        <p>${product.description}</p>
        <button class="add-to-cart" data-id="${product.id}" 
        onclick="()=>{addToCart(${product})}">Add to Cart</button>
      </div>
    `
      )
      .join("");
  }
};

const renderCart = () => {
  const cartList = document.getElementById("cart-list");
  if (cartList) {
    console.log(cart.length);
    if (cart.length === 0) {
      cartList.innerHTML = "<p>Your cart is empty</p>";
    } else {
      cartList.innerHTML = cart
        .map(
          (item) => `
        <div class="cart-item">
          <img src="${item.imageUrl}" alt="${item.name}">
          <h2>${item.name}</h2>
          <p>Price: $${item.price}</p>
          <p>Quantity: ${item.quantity}</p>
      <button class="remove-from-cart" data-id="${item.id}" >Remove</button>
        </div>
      `
        )
        .join("");
    }
  }
};

const addToCart = (product: Product) => {
  console.log("adding to cart", product);
  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
};

const removeFromCart = (id: string) => {
  cart = cart.filter((item) => item.id !== id);
  renderCart();
};

const userinit = async () => {
  await loadProducts();

  document.body.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (target.matches(".add-to-cart")) {
      const id = target.dataset.id;
      if (id) {
        const productElement = target.closest(".product");
        if (productElement) {
          const name = productElement.querySelector("h2")?.textContent || "";
          const price = parseFloat(
            productElement.querySelector("p")?.textContent?.replace("$", "") ||
              "0"
          );
          const description =
            productElement.querySelectorAll("p")[1]?.textContent || "";
          const imageUrl =
            productElement.querySelector("img")?.getAttribute("src") || "";

          const product: Product = { id, name, price, description, imageUrl };
          addToCart(product);
        }
      }
    } else if (target.matches(".remove-from-cart")) {
      const id = target.dataset.id;
      if (id) {
        removeFromCart(id);
      }
    } else if (target.matches("#view-cart")) {
      const productList = document.getElementById("product-list");
      const cartList = document.getElementById("cart-list");
      if (productList && cartList) {
        productList.classList.toggle("hidden");
        cartList.classList.toggle("hidden");
        renderCart();
      }
    }
  });
};

userinit();

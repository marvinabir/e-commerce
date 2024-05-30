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
const BASE_URL = "http://localhost:3000/products";
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    yield loadProductList();
    document.body.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
        const target = event.target;
        if (target.matches("#add-product")) {
            showModal();
            renderProductForm();
        }
        else if (target.matches(".edit-product")) {
            const id = target.dataset.id;
            if (id) {
                showModal();
                yield renderProductForm(id);
            }
        }
        else if (target.matches(".update-product")) {
            const id = target.dataset.id;
            if (id) {
                showModal();
                yield renderProductForm(id, true);
            }
        }
        else if (target.matches(".delete-product")) {
            const id = target.dataset.id;
            if (id) {
                yield deleteProduct(id);
                yield loadProductList();
            }
        }
        else if (target.matches(".view-product")) {
            const id = target.dataset.id;
            if (id) {
                yield viewProduct(id);
            }
        }
        else if (target.matches("#view-all-products")) {
            yield loadProductList();
        }
    }));
});
const loadProductList = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(BASE_URL);
    const products = yield response.json();
    const tbody = document.getElementById('item-table-body');
    if (tbody) {
        tbody.innerHTML = products.map(product => `
         <tr>
           <td>
                <h2>${product.name}</h2>
                <a href="#" class="view-product" data-id="${product.id}">View</a>
            </td>
            <td>
                <h2>$${product.price}</h2>
            </td>
            <td>
                <p>${product.description}</p>
            </td>
            <td>
                <img src="${product.imageUrl}" alt="${product.name}">
            </td>
            <td>
                <button class="delete-product" data-id="${product.id}">Delete</button>
                <button class="update-product" data-id="${product.id}">Update</button>
            </td>  
        </tr>
    `).join('');
    }
});
const renderProductForm = (id_1, ...args_1) => __awaiter(void 0, [id_1, ...args_1], void 0, function* (id, isUpdate = false) {
    const modalContent = document.getElementById("modal-content");
    let product = { name: "", price: 0, description: "", imageUrl: "" };
    if (id) {
        const response = yield fetch(`${BASE_URL}/${id}`);
        product = yield response.json();
    }
    if (modalContent) {
        modalContent.innerHTML = `
     
            <div class="a-form">
                <form id="product-form">
                    <div>
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" value="${product.name}" required>
                    </div>
                    <div>
                        <label for="price">Price</label>
                        <input type="number" id="price" name="price" value="${product.price}" required>
                    </div>
                    <div>
                        <label for="description">Description</label>
                        <textarea id="description" name="description" required>${product.description}</textarea>
                    </div>
                    <div>
                        <label for="imageUrl">Image URL</label>
                        <input type="text" id="imageUrl" name="imageUrl" value="${product.imageUrl}" required>
                    </div>
                    <button type="submit">${id ? "Update" : "Create"}</button>
                    <button type="button" onclick="location.reload()" id="view-all-products">Cancel</button>
                </form>
            </div>
        `;
        const form = document.getElementById("product-form");
        if (form) {
            form.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
                event.preventDefault();
                const formData = new FormData(form);
                const updatedProduct = {
                    name: formData.get("name"),
                    price: parseFloat(formData.get("price")),
                    description: formData.get("description"),
                    imageUrl: formData.get("imageUrl"),
                };
                if (id) {
                    yield updateProduct(id, updatedProduct);
                }
                else {
                    yield createProduct(updatedProduct);
                }
                closeModal();
                yield loadProductList();
            }));
        }
    }
});
const viewProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`${BASE_URL}/${id}`);
    const product = yield response.json();
    const content = document.getElementById("content");
    if (content) {
        content.innerHTML = `
           <div class='formv'>
           <div class='hv'> <h2>${product.name}</h2></div>
           <div class='pv'> <p>Price: $${product.price}</p></div>
           <div class='dv'><p>Description: ${product.description}</p></div>
           <div class='iv'><img src="${product.imageUrl}" alt="${product.name}" width=370px ></div>
           <div class='btnv'><button onclick="location.reload()">Back</button>
            </div>
        `;
    }
});
const createProduct = (product) => __awaiter(void 0, void 0, void 0, function* () {
    yield fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    });
});
const updateProduct = (id, product) => __awaiter(void 0, void 0, void 0, function* () {
    yield fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    });
});
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });
});
const showModal = () => {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'block';
    }
};
const closeModal = () => {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
    }
};
window.onclick = (event) => {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
};
init();

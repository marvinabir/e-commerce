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
const BASE_URL = 'http://localhost:3000/products';
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    yield loadProductList();
    document.body.addEventListener('click', (event) => __awaiter(void 0, void 0, void 0, function* () {
        const target = event.target;
        if (target.matches('#add-product')) {
            renderProductForm();
        }
        else if (target.matches('.edit-product')) {
            const id = target.dataset.id;
            if (id) {
                yield renderProductForm(id);
            }
        }
        else if (target.matches('.update-product')) {
            const id = target.dataset.id;
            if (id) {
                yield renderProductForm(id, true);
            }
        }
        else if (target.matches('.delete-product')) {
            const id = target.dataset.id;
            if (id) {
                yield deleteProduct(parseInt(id));
                yield loadProductList();
            }
        }
        else if (target.matches('.view-product')) {
            const id = target.dataset.id;
            if (id) {
                yield viewProduct(parseInt(id));
            }
        }
        else if (target.matches('#view-all-products')) {
            yield loadProductList();
        }
    }));
});
const loadProductList = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(BASE_URL);
    const products = yield response.json();
    const content = document.getElementById('content');
    if (content) {
        content.innerHTML = `
            <button id="add-product">Add Product</button>
            <ul>
                ${products.map(product => `
                    <li>
                        ${product.name} - $${product.price}
                        ${product.description} 

                        <a href="#" class="view-product" data-id="${product.id}">View</a>
                        <a href="#" class="edit-product" data-id="${product.id}">Edit</a>
                        <button class="delete-product" data-id="${product.id}">Delete</button>
                        <button class="update-product" data-id="${product.id}">Update</button>
                    </li>
                `).join('')}
            </ul>
        `;
    }
});
const renderProductForm = (id_1, ...args_1) => __awaiter(void 0, [id_1, ...args_1], void 0, function* (id, isUpdate = false) {
    const content = document.getElementById('content');
    let product = { name: '', price: 0, description: '' };
    if (id) {
        const response = yield fetch(`${BASE_URL}/${id}`);
        product = yield response.json();
    }
    if (content) {
        content.innerHTML = `
            <h2>${id ? (isUpdate ? 'Update Product' : 'Edit Product') : 'Add Product'}</h2>
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
                    <button type="submit">${id ? 'Update' : 'Create'}</button>
                    <button type="button" id="view-all-products">View All</button>
                </form>
            </div>
        `;
        const form = document.getElementById('product-form');
        if (form) {
            form.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
                event.preventDefault();
                const formData = new FormData(form);
                const updatedProduct = {
                    name: formData.get('name'),
                    price: parseFloat(formData.get('price')),
                    description: formData.get('description')
                };
                if (id) {
                    yield updateProduct(parseInt(id), updatedProduct);
                }
                else {
                    yield createProduct(updatedProduct);
                }
                yield loadProductList();
            }));
        }
    }
});
const viewProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`${BASE_URL}/${id}`);
    const product = yield response.json();
    const content = document.getElementById('content');
    if (content) {
        content.innerHTML = `
            <h2>${product.name}</h2>
            <p>Price: $${product.price}</p>
            <p>Description: ${product.description}</p>
            <button onclick="location.reload()">Back</button>
        `;
    }
});
const createProduct = (product) => __awaiter(void 0, void 0, void 0, function* () {
    yield fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    });
});
const updateProduct = (id, product) => __awaiter(void 0, void 0, void 0, function* () {
    yield fetch(`${BASE_URL}/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    });
});
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });
});
init();

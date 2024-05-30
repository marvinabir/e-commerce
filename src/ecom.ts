interface Product {
  id?: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

const BASE_URL = "http://localhost:3000/products";

const init = async () => {
  await loadProductList();

  document.body.addEventListener("click", async (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (target.matches("#add-product")) {
      showModal();
      renderProductForm();
    } else if (target.matches(".edit-product")) {
      const id = target.dataset.id;
      if (id) {
        showModal();
        await renderProductForm(id);
      }
    } else if (target.matches(".update-product")) {
      const id = target.dataset.id;
      if (id) {
        showModal();
        await renderProductForm(id, true);
      }
    } else if (target.matches(".delete-product")) {
      const id = target.dataset.id;
      if (id) {
        await deleteProduct(id);
        await loadProductList();
      }
    } else if (target.matches(".view-product")) {
      const id = target.dataset.id;
      if (id) {
        await viewProduct(id);
      }
    } else if (target.matches("#view-all-products")) {
      await loadProductList();
    }
  });
};

const loadProductList = async () => {
  const response = await fetch(BASE_URL);
  const products: Product[] = await response.json();

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
};

const renderProductForm = async (id?: string, isUpdate = false) => {
  const modalContent = document.getElementById("modal-content");
  let product: Product = { name: "", price: 0, description: "", imageUrl: "" };

  if (id) {
    const response = await fetch(`${BASE_URL}/${id}`);
    product = await response.json();
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
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(form as HTMLFormElement);
        const updatedProduct: Product = {
          name: formData.get("name") as string,
          price: parseFloat(formData.get("price") as string),
          description: formData.get("description") as string,
          imageUrl: formData.get("imageUrl") as string,
        };

        if (id) {
          await updateProduct(id, updatedProduct);
        } else {
          await createProduct(updatedProduct);
        }

        closeModal();
        await loadProductList();
      });
    }
  }
};

const viewProduct = async (id: string) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  const product: Product = await response.json();

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
};

const createProduct = async (product: Product) => {
  await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
};

const updateProduct = async (id: string, product: Product) => {
  await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
};

const deleteProduct = async (id: string) => {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
};

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

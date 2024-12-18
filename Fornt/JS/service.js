    // Select DOM elements
    const productList = document.getElementById('product-list');
    const addProductButton = document.getElementById('add-product');
    const productNameInput = document.getElementById('product-name');
    const productPriceInput = document.getElementById('product-price');
    const productQuantityInput = document.getElementById('product-quantity');
    const productSizeSelect = document.getElementById('product-size');

    // Fetch existing products from the server
    async function fetchProducts() {
        try {
            const response = await fetch('http://localhost:3000/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Error loading products. Please try again later.');
        }
    }

    // Render products to the table
    function renderProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.product_id}</td>
                <td>${product.product_name}</td>
                <td>${product.product_price}</td>
                <td>${product.product_quantity}</td>
                <td>${product.product_size}</td>
                <td>${product.product_status}</td>
                <td>
                    <button class="btn update" onclick="window.location.href='update-product.html?id=${product.product_id}'">Update</button>
                    <button class="btn delete" data-id="${product.product_id}">Delete</button>
                </td>
            `;
            productList.appendChild(row);
        });

        // Add event listeners for delete buttons
        document.querySelectorAll('.btn.delete').forEach(button => {
            button.addEventListener('click', () => deleteProduct(button.dataset.id));
        });
    }

    // Add a new product
    addProductButton.addEventListener('click', async () => {
        const name = productNameInput.value.trim();
        const price = parseFloat(productPriceInput.value);
        const quantity = parseInt(productQuantityInput.value, 10);
        const size = productSizeSelect.value;

        if (!name || isNaN(price) || isNaN(quantity) || !size) {
            alert('Please fill in all fields correctly.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/add/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_name: name, product_price: price, product_quantity: quantity, product_size: size }),
            });

            if (!response.ok) throw new Error('Failed to add product');
            alert('Product added successfully.');
            fetchProducts();
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Error adding product. Please try again.');
        }
    });


    // Update a product
    async function updateProduct(id) {
        // Fetch product details from the server to populate the update form
        try {
            const response = await fetch(`http://localhost:3000/products/${id}`);
            if (!response.ok) throw new Error('Failed to fetch product details');
            const product = await response.json();

            // Prompt user to update product details
            const name = prompt('Enter new product name:', product.product_name);
            const price = prompt('Enter new product price:', product.product_price);
            const quantity = prompt('Enter new product quantity:', product.product_quantity);
            const size = prompt('Enter new product size (S, M, L, XL):', product.product_size);

            // Validate inputs
            if (!name || isNaN(price) || isNaN(quantity) || !['S', 'M', 'L', 'XL'].includes(size)) {
                alert('Invalid input. Please try again.');
                return;
            }

            // Send update request to the server
            const updateResponse = await fetch(`http://localhost:3000/update/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_name: name.trim(),
                    product_price: parseFloat(price),
                    product_quantity: parseInt(quantity, 10),
                    product_size: size,
                }),
            });

            if (!updateResponse.ok) throw new Error('Failed to update product');
            alert('Product updated successfully.');
            fetchProducts(); // Refresh the product list
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Error updating product. Please try again.');
        }
    }


    // Delete a product
    async function deleteProduct(id) {
        const confirmDelete = confirm('Are you sure you want to delete this product?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:3000/delete/products/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete product');
            alert('Product deleted successfully.');
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product. Please try again.');
        }
    }

    // Initial fetch of products
    fetchProducts();

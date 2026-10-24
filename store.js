let products = [
    { id: 1, name: "Laptop", price: 1200, category: "electronics", rating: 4.6, inStock: true, image: "https://via.placeholder.com/150" },
    { id: 2, name: "Smartphone", price: 800, category: "electronics", rating: 4.5, inStock: true, image: "https://via.placeholder.com/150" },
    { id: 3, name: "Headphones", price: 150, category: "electronics", rating: 4.2, inStock: true, image: "https://via.placeholder.com/150" },
    { id: 4, name: "T-Shirt", price: 25, category: "clothing", rating: 4.0, inStock: true, image: "https://via.placeholder.com/150" },
    { id: 5, name: "Jeans", price: 50, category: "clothing", rating: 4.3, inStock: true, image: "https://via.placeholder.com/150" },
    { id: 6, name: "Jacket", price: 110, category: "clothing", rating: 4.7, inStock: true, image: "https://via.placeholder.com/150" },
    { id: 7, name: "JS Programming Book", price: 40, category: "books", rating: 4.8, inStock: true, image: "https://via.placeholder.com/150" },
    { id: 8, name: "Web Dev Guide", price: 35, category: "books", rating: 4.4, inStock: true, image: "https://via.placeholder.com/150" },
    { id: 9, name: "Smart Watch", price: 200, category: "electronics", rating: 4.1, inStock: true, image: "https://via.placeholder.com/150" },
    { id: 10, name: "Backpack", price: 60, category: "clothing", rating: 4.5, inStock: true, image: "https://via.placeholder.com/150" }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function displayProducts(list) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = '';
    list.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>Category: ${p.category}</p>
            <p>Rating: ${p.rating}</p>
            <p><strong>$${p.price}</strong></p>
            <button class="add-btn" data-id="${p.id}">Add to Cart</button>
        `;
        grid.appendChild(card);
    });
}

function searchProducts(list, text) {
    return list.filter(p => p.name.toLowerCase().includes(text.toLowerCase()));
}

function filterByCategory(list, category) {
    if (category === 'all') return list;
    return list.filter(p => p.category === category);
}

function sortProducts(list, order) {
    const copy = [...list];
    return copy.sort((a, b) => order === 'low' ? a.price - b.price : b.price - a.price);
}

function getProductById(list, id) {
    return list.find(p => p.id === id) || "Product not found";
}

function addToCart(id) {
    const item = getProductById(products, id);
    if (typeof item === 'string') return;
    const existing = cart.find(c => c.id === id);
    if (existing) {
        cart = cart.map(c => c.id === id ? { ...c, quantity: c.quantity + 1 } : c);
    } else {
        cart = [...cart, { ...item, quantity: 1 }];
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
}

function updateQuantity(id, change) {
    cart = cart.map(c => {
        if (c.id === id) return { ...c, quantity: c.quantity + change };
        return c;
    }).filter(c => c.quantity > 0);
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getCartTotal(cartList) {
    return cartList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function calculateBill(discount, ...prices) {
    const total = prices.reduce((acc, curr) => acc + curr, 0);
    return total - (total * (discount / 100));
}

function validateCheckout() {
    let valid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const city = document.getElementById('city');
    const address = document.getElementById('address');

    document.querySelectorAll('.error-msg').forEach(el => el.innerText = '');

    if (!name.value.trim()) {
        document.getElementById('nameErr').innerText = 'Name is required';
        valid = false;
    }
    if (!email.value.includes('@')) {
        document.getElementById('emailErr').innerText = 'Valid email is required';
        valid = false;
    }
    if (phone.value.length < 10) {
        document.getElementById('phoneErr').innerText = 'Min 10 digits required';
        valid = false;
    }
    if (!city.value) {
        document.getElementById('cityErr').innerText = 'Please select a city';
        valid = false;
    }
    if (!address.value.trim()) {
        document.getElementById('addressErr').innerText = 'Address is required';
        valid = false;
    }

    return valid;
}
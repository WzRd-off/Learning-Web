let productList = [
    {name: "Кока-Кола", category: "Напої", price: 50, discount: 10, date: Date.now(), img: "images/coca-cola.webp", id: 1},
    {name: "Пепсі", category: "Напої", price: 45, discount: 5, date: Date.now() - 86400000, img: "images/pepsi.jpg", id: 2},
    {name: "Фанта", category: "Напої", price: 40, discount: 0, date: Date.now() - 172800000, img: "images/fanta.jpg", id: 3},
    {name: "Спрайт", category: "Напої", price: 42, discount: 7, date: Date.now() - 259200000, img: "images/sprite.webp", id: 4},
    {name: "Моршинська", category: "Вода", price: 20, discount: 0, date: Date.now() - 345600000, img: "images/morshinska.jpg", id: 5},
    {name: "Боржомі", category: "Вода", price: 30, discount: 5, date: Date.now() - 432000000, img: "images/borjomi.jpg", id: 6},
    {name: "Lipton Ice Tea", category: "Напої", price: 35, discount: 10, date: Date.now() - 518400000, img: "images/lipton.png", id: 7},
    {name: "Чіпси Lay's", category: "Закуски", price: 35, discount: 5, date: Date.now() - 604800000, img: "images/lays.jpg", id: 8},
    {name: "Сухарики Flint", category: "Закуски", price: 25, discount: 0, date: Date.now() - 691200000, img: "images/flint.png", id: 9},
    {name: "Арахіс солоний", category: "Закуски", price: 40, discount: 10, date: Date.now() - 777600000, img: "images/peanuts.jpg", id: 10},
    {name: "M&M's", category: "Цукерки", price: 30, discount: 5, date: Date.now() - 864000000, img: "images/mms.jpg", id: 11},
    {name: "Шоколад Milka", category: "Цукерки", price: 45, discount: 10, date: Date.now() - 950400000, img: "images/milka.jpg", id: 12},
    {name: "Чупа Чупс", category: "Цукерки", price: 10, discount: 0, date: Date.now() - 1036800000, img: "images/chupachups.webp", id: 13}
];

let shownProductsList = [...productList];

let cartList = [];

function renderProducts() {
    const productContainer = document.getElementById('products-grid');
    productContainer.innerHTML = '';
    shownProductsList.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            ${product.discount > 0 ? `<div class="badge">-${product.discount}%</div>` : ''}
            <div class="card-content-top">
                <h3>${product.name}</h3>
                <p class="category">${product.category}</p>
                <img src="${product.img}" alt="${product.name}">
            </div>
            <div class="card-content-bottom">
                <p class="price"> грн</p>
                <div class="price-row">
                    <span class="old-price">${product.price} ₴</span>
                    <span class="current-price">${(product.price * (1 - product.discount/100)).toFixed(2)} ₴</span>
                </div>
                <button class="btn-add" onclick="addToCart(${product.id})">
                    <span class="material-icons-round">add_shopping_cart</span> Додати
                </button>
            </div>
        `;
        productContainer.appendChild(productCard);
    });
}

function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';
    cartList.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML =
        `
        <div class="info">
            <img src="${item.img}" alt="${item.name}">
            <span>${item.name}</span>
            <span>${item.price} ₴</span>
        </div>
        <button class="btn-remove">
            <span class="material-icons-round" onclick="removeFromCart(${item.id})">remove_circle</span>
        </button>
        `;
        cartContainer.appendChild(cartItem);
    });

}

function addToCart(id) {
    const product = productList.find(p => p.id === parseInt(id));
    if (!product) return;
    cartList.push(product);
    renderCart(); 
}

function removeFromCart(id) {
    cartList = cartList.filter(item => item.id !== parseInt(id));
    renderCart();
}

function applyFilters() {
    const categoryFilters = Array.from(document.querySelectorAll('.category-filter:checked')).map(cb => cb.value);
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
    const startDate = new Date(document.getElementById('start-date').value).getTime() || 0;
    const endDate = new Date(document.getElementById('end-date').value).getTime() || Infinity;
    const searchQuery = document.getElementById('search-input').value.toLowerCase().trim();
    const sortValue = document.getElementById('sort-select').value;

    let filteredProducts = productList.filter(product => {
        const finalPrice = product.price * (1 - product.discount/100);
        const inCategory = categoryFilters.length === 0 || categoryFilters.includes(product.category);
        const inPriceRange = finalPrice >= minPrice && finalPrice <= maxPrice;
        const inDateRange = product.date >= startDate && product.date <= endDate;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery);
        
        return inCategory && inPriceRange && inDateRange && matchesSearch;
    });

    if (sortValue === 'price-asc') {
        filteredProducts.sort((a, b) => (a.price * (1 - a.discount/100)) - (b.price * (1 - b.discount/100)));
    } else if (sortValue === 'price-desc') {
        filteredProducts.sort((a, b) => (b.price * (1 - b.discount/100)) - (a.price * (1 - a.discount/100)));
    } else if (sortValue === 'date-new') {
        filteredProducts.sort((a, b) => b.date - a.date);
    }
    shownProductsList = [...filteredProducts];
    renderProducts();
}

function resetFilters() {
    shownProductsList = [...productList];
    document.querySelectorAll('.category-filter').forEach(cb => cb.checked = false);
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
    renderProducts();
}

function updateTotals() {
    let subtotal = 0;
    let totalDiscount = 0;

    cartList.forEach(item => {
        const originalPrice = item.price;
        const finalPrice = item.price * (1 - item.discount/100);
        subtotal += originalPrice;
        totalDiscount += (originalPrice - finalPrice);
    });

    const finalTotal = subtotal - totalDiscount;
    const tax = finalTotal * 0.20; 

    document.getElementById('subtotal').textContent = subtotal.toFixed(2) + ' ₴';
    document.getElementById('discount-total').textContent = totalDiscount.toFixed(2) + ' ₴';
    document.getElementById('tax-amount').textContent = tax.toFixed(2) + ' ₴';
    document.getElementById('final-total').textContent = finalTotal.toFixed(2) + ' ₴';
}

// Новая функция: Подсчет сумм для LCD экрана
function updateTotals() {
    let subtotal = 0;
    let totalDiscount = 0;

    cartList.forEach(item => {
        const originalPrice = item.price;
        const finalPrice = item.price * (1 - item.discount/100);
        subtotal += originalPrice;
        totalDiscount += (originalPrice - finalPrice);
    });

    const finalTotal = subtotal - totalDiscount;
    const tax = finalTotal * 0.20; 

    document.getElementById('subtotal').textContent = subtotal.toFixed(2) + ' ₴';
    document.getElementById('discount-total').textContent = totalDiscount.toFixed(2) + ' ₴';
    document.getElementById('tax-amount').textContent = tax.toFixed(2) + ' ₴';
    document.getElementById('final-total').textContent = finalTotal.toFixed(2) + ' ₴';
}

document.getElementById('checkout-btn').addEventListener('click', function() {
    if (cartList.length === 0) {
        alert("Кошик порожній!");
        return;
    }

    const receiptOutput = document.getElementById('receipt-output');
    const receiptBody = document.getElementById('receipt-body');
    const receiptDate = document.getElementById('receipt-date');
    
    receiptDate.innerText = new Date().toLocaleString('uk-UA');

    let html = '';
    let total = 0;
    
    cartList.forEach(item => {
        const finalPrice = item.price * (1 - item.discount/100);
        total += finalPrice;
        html += `<div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span>${item.name}</span>
                    <span>${finalPrice.toFixed(2)}</span>
                 </div>`;
    });
    
    html += `<br><strong>РАЗОМ: ${total.toFixed(2)} ₴</strong>`;
    receiptBody.innerHTML = html;

    receiptOutput.classList.remove('hidden');
    receiptOutput.scrollIntoView({ behavior: 'smooth' });
    
    // Очистка
    cartList = [];
    renderCart();
});

document.getElementById('search-input').addEventListener('input', applyFilters);
document.getElementById('sort-select').addEventListener('change', applyFilters);

renderProducts();
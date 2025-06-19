// Dados dos produtos
const products = [
    { id: 1, name: "Calça", price: 199.90, image: "assets/p1.jpg" },
    { id: 2, name: "Conjunto jeans", price: 249.90, image: "assets/p2.jpg" },
    { id: 3, name: "Calça jeans", price: 129.90, image: "assets/p3.jpg" },
    { id: 4, name: "Saia Evangelica", price: 179.90, image: "assets/r1.png" },
    { id: 5, name: "Vestido", price: 299.90, image: "assets/r2.png" }
];

// Renderizar produtos (sem mudanças na função, apenas os caminhos foram atualizados)
function renderProducts() {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" loading="lazy" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>R$ ${product.price.toFixed(2)}</p>
            <button class="buy-btn" onclick="addToCart(${product.id})">Comprar</button>
        `;
        productGrid.appendChild(productDiv);
    });
}

// Rolagem de produtos
let scrollPosition = 0;
const productWidth = 195; // 180px + 15px margin

function scrollProducts(direction) {
    const productGrid = document.getElementById('product-grid');
    const maxScroll = (products.length - 3) * productWidth;
    scrollPosition += direction * productWidth;
    if (scrollPosition > maxScroll) scrollPosition = maxScroll;
    if (scrollPosition < 0) scrollPosition = 0;
    productGrid.style.transform = `translateX(-${scrollPosition}px)`;
}

// Carrinho
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'cart.html';
}

// Funções do carrinho
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const div = document.createElement('div');
        div.textContent = `${item.name} - R$ ${item.price.toFixed(2)}`;
        cartItems.appendChild(div);
    });
    const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
    cartTotal.textContent = `Total: R$ ${total}`;
}

function continueShopping() {
    window.location.href = 'index.html';
}

function checkout() {
    alert('Finalizar Compra - Em desenvolvimento');
    // Aqui você pode integrar um gateway de pagamento
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('product-grid')) {
        renderProducts();
    }
    if (document.getElementById('cart-items')) {
        renderCart();
    }
});
// ... (manter os dados dos produtos e funções renderProducts, scrollProducts, etc.)

// Configurar Mercado Pago
function initMercadoPago() {
    const mp = new MercadoPago('SUA_PUBLIC_KEY', { // Substitua por sua Public Key do Mercado Pago
        locale: 'pt-BR'
    });

    const orderData = {
        items: cart.map(item => ({
            title: item.name,
            unit_price: parseFloat(item.price),
            quantity: 1,
            currency_id: 'BRL'
        })),
        back_urls: {
            success: 'cart.html',
            failure: 'cart.html',
            pending: 'cart.html'
        },
        auto_return: 'approved'
    };

    fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer SUA_ACCESS_TOKEN`, // Substitua por seu Access Token
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(preference => {
        mp.checkout({
            preference: {
                id: preference.id
            },
            render: {
                container: '#mercado-pago-button-container',
                label: 'Pagar com Mercado Pago'
            }
        });
    })
    .catch(error => console.error('Erro ao criar preferência:', error));
}

// Adicionar ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'cart.html';
}

// Renderizar carrinho com botão de pagamento
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const div = document.createElement('div');
        div.textContent = `${item.name} - R$ ${item.price.toFixed(2)}`;
        cartItems.appendChild(div);
    });
    const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
    cartTotal.textContent = `Total: R$ ${total}`;
    
    // Adicionar botão Mercado Pago (se estiver em cart.html)
    if (document.getElementById('mercado-pago-button-container') && cart.length > 0) {
        initMercadoPago();
    }
}

// Continuar comprando
function continueShopping() {
    window.location.href = 'index.html';
}

// Checkout (agora redireciona para Mercado Pago)
function checkout() {
    if (cart.length > 0) {
        initMercadoPago(); // Inicia o fluxo de pagamento
    } else {
        alert('Seu carrinho está vazio!');
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('product-grid')) {
        renderProducts();
    }
    if (document.getElementById('cart-items')) {
        renderCart();
    }
});
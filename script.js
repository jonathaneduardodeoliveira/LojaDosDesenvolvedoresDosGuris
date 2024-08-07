document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('index.html')) {
        loadProducts();
    } else if (window.location.pathname.endsWith('Carrinho.html')) {
        displayCartItems();
        document.getElementById('clear-cart-button')?.addEventListener('click', () => {
            if (confirm('Tem certeza de que deseja limpar o carrinho?')) {
                localStorage.removeItem('Carrinho');
                displayCartItems();
            }
        });
    }

    document.getElementById('checkout-button')?.addEventListener('click', () => {
        localStorage.removeItem('Carrinho');
        window.location.href = 'compra.html';
    });
});

const MAX_VISIBLE_PRODUCTS = 12;

function loadProducts() {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=notebooks')
        .then(response => response.json())
        .then(data => {
            const products = data.results;
            const productList = document.getElementById('product-list');
            const showMoreButton = document.getElementById('show-more-button');
            
            productList.innerHTML = '';

            products.forEach((product, index) => {
                const productElement = document.createElement('div');
                productElement.className = 'product';
                productElement.style.display = index < MAX_VISIBLE_PRODUCTS ? 'block' : 'none';

                const img = document.createElement('img');
                img.src = product.thumbnail;
                img.alt = product.title;

                const title = document.createElement('h2');
                title.textContent = product.title;

                const price = document.createElement('p');
                price.textContent = `R$ ${product.price.toFixed(2)}`;

                productElement.append(img, title, price);

// Recortei o código que adiciona o botão de comprar e o colei abaixo da linha em que imagem, título e preço são adicionados ao produto. Fazendo dessa maneira, o botão comprar vai ficar abaixo das outras informações. - Juliana
                 if (window.location.pathname.endsWith('index.html')) {
                    const button = document.createElement('button');
                    button.textContent = 'Comprar';
                    button.addEventListener('click', () => addToCart(product.id, product.title, product.price, product.thumbnail));
                    productElement.appendChild(button);
                }
// Fim da inserção.

                productList.appendChild(productElement);
            });

            if (products.length > MAX_VISIBLE_PRODUCTS) {
                showMoreButton.style.display = 'block';
                showMoreButton.addEventListener('click', () => {
                    const hiddenProducts = document.querySelectorAll('.product[style*="display: none"]');
                    hiddenProducts.forEach(product => product.style.display = 'block');
                    showMoreButton.style.display = 'none';
                });
            } else {
                showMoreButton.style.display = 'none';
            }
        })
        .catch(() => {
            alert('Não foi possível carregar os produtos. Por favor, tente novamente mais tarde.');
        });
}

function addToCart(id, title, price, image) {
    const cart = JSON.parse(localStorage.getItem('Carrinho')) || [];
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += 1;
    } else {
        cart.push({ id, title, price, image, quantity: 1 });
    }

    localStorage.setItem('Carrinho', JSON.stringify(cart));
    alert('Produto adicionado ao carrinho!');
}

function displayCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('Carrinho')) || [];
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartContainer.innerHTML = '';
    let total = 0;

    cartItems.forEach(item => {
        total += item.price * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;

        const title = document.createElement('h2');
        title.textContent = item.title;

        const price = document.createElement('p');
        price.textContent = `R$ ${item.price.toFixed(2)} x ${item.quantity}`;

        cartItem.append(img, title, price);
        cartContainer.appendChild(cartItem);
    });

    cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
}

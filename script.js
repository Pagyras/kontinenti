document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('product-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const closeModal = document.getElementsByClassName('close-btn')[0];

  const productDescriptions = {
    // ... (описания продуктов)
  };

  document.querySelectorAll('.product-card img').forEach(img => {
    img.addEventListener('click', (event) => {
      const productCard = event.target.closest('.product-card');
      const productName = productCard.dataset.name;

      modalTitle.innerText = productName;
      modalDescription.innerText = productDescriptions[productName];

      modal.style.display = 'block';
    });
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const quantityControls = document.querySelectorAll('.quantity-control');
  const quantities = document.querySelectorAll('.quantity');
  const productCards = document.querySelectorAll('.product-card');

  function updateCartStateOnPage() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    productCards.forEach((card, index) => {
      const name = card.dataset.name;
      const existingItem = cartItems.find(item => item.name === name);

      if (existingItem) {
        addToCartButtons[index].style.display = 'none';
        quantityControls[index].style.display = 'flex';
        quantities[index].textContent = existingItem.quantity;
      } else {
        addToCartButtons[index].style.display = 'block';
        quantityControls[index].style.display = 'none';
        quantities[index].textContent = '1';
      }
    });
  }

  updateCartStateOnPage();

  window.addEventListener('storage', () => {
    updateCartStateOnPage();
  });

  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();

      const productCard = event.target.closest('.product-card');
      const productName = productCard.dataset.name;
      const productPrice = parseFloat(productCard.dataset.price);
      const productImage = productCard.querySelector('img').src;
      const quantityControl = productCard.querySelector('.quantity-control');
      const addToCartButton = productCard.querySelector('.add-to-cart');

      quantityControl.style.display = 'flex';
      addToCartButton.style.display = 'none';

      const minusBtn = quantityControl.querySelector('.minus-btn');
      const plusBtn = quantityControl.querySelector('.plus-btn');
      const quantitySpan = quantityControl.querySelector('.quantity');

      let quantity = 1;

      minusBtn.addEventListener('click', () => {
        if (quantity > 1) {
          quantity--;
          quantitySpan.textContent = quantity;
          updateCartItem(productName, quantity, productPrice, productImage);
        } else {
          quantityControl.style.display = 'none';
          addToCartButton.style.display = 'block';
          removeFromCart(productName);
        }
      });

      plusBtn.addEventListener('click', () => {
        quantity++;
        quantitySpan.textContent = quantity;
        updateCartItem(productName, quantity, productPrice, productImage);
      });

      addToCart(productName, productPrice, quantity, productImage);
    });
  });

  function addToCart(name, price, quantity, image) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItemIndex = cartItems.findIndex(item => item.name === name);

    if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      cartItems.push({ name, price, quantity, image });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartStateOnPage(); // Добавлено обновление состояния страницы
  }

  function removeFromCart(name) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const updatedCartItems = cartItems.filter(item => item.name !== name);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    updateCartStateOnPage(); // Добавлено обновление состояния страницы
  }

  function updateCartItem(name, quantity, price, image) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const updatedCartItems = cartItems.map(item => {
      if (item.name === name) {
        return { ...item, quantity, price, image };
      }
      return item;
    });
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    updateCartStateOnPage(); // Добавлено обновление состояния страницы
  }
});

// Получаем ссылки на необходимые элементы
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const totalButton = document.getElementById('cart-total');

// Функция для отображения товаров в корзине
function displayCartItems() {
  cartItemsContainer.innerHTML = '';
  let totalPrice = 0;

  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  cartItems.forEach((item) => {
    const { name, price, quantity, image } = item; // Добавляем image
    const itemTotal = price * quantity;
    totalPrice += itemTotal;

    const cartItemElement = document.createElement('div');
    cartItemElement.classList.add('product-card');
    cartItemElement.setAttribute('data-name', name);
    cartItemElement.innerHTML = `
        <img src="${image}" alt="${name}"> <!-- Используем URL изображения -->
        <div class="product-details">
            <h3>${name}</h3>
            <div class="quantity-control">
                <button class="minus-btn">-</button>
                <span class="quantity">${quantity}</span>
                <button class="plus-btn">+</button>
            </div>
        </div>
    `;
    cartItemsContainer.appendChild(cartItemElement);
  });

  totalPriceElement.textContent = Math.floor(totalPrice);

  // Обработчики событий для кнопок "-" и "+"
  const minusButtons = document.querySelectorAll('#cart-items .minus-btn');
  const plusButtons = document.querySelectorAll('#cart-items .plus-btn');
  const quantities = document.querySelectorAll('#cart-items .quantity');

  minusButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      let quantity = parseInt(quantities[index].textContent);
      if (quantity > 1) {
        quantity--;
        quantities[index].textContent = quantity;
        const item = cartItems[index];
        item.quantity = quantity;
        updateCartItem(item.name, quantity);
        updateTotalPrice();
        broadcastChannel.postMessage({ action: 'update', item });
      } else {
        const item = cartItems[index];
        removeFromCart(item.name);
        displayCartItems();
        broadcastChannel.postMessage({ action: 'remove', item });
      }
    });
  });

  plusButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      let quantity = parseInt(quantities[index].textContent);
      quantity++;
      quantities[index].textContent = quantity;
      const item = cartItems[index];
      item.quantity = quantity;
      updateCartItem(item.name, quantity);
      updateTotalPrice();
      broadcastChannel.postMessage({ action: 'update', item });
    });
  });

  // Проверка суммы на кнопке "Итого" и блокировка клика, если сумма равна 0
  if (totalPrice === 0) {
    totalButton.style.pointerEvents = 'none';
    totalButton.style.opacity = '0.5';
  } else {
    totalButton.style.pointerEvents = 'auto';
    totalButton.style.opacity = '1';
  }
}

// Функция для обновления количества товара в корзине
function updateCartItem(name, quantity) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const updatedCartItems = cartItems.map(cartItem => {
    if (cartItem.name === name) {
      return { ...cartItem, quantity };
    }
    return cartItem;
  });
  localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
}

// Функция для удаления товара из корзины
function removeFromCart(name) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const updatedCartItems = cartItems.filter(cartItem => cartItem.name !== name);
  localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
}

// Функция для обновления общей суммы в корзине
function updateTotalPrice() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  let totalPrice = 0;
  cartItems.forEach(item => {
    const { price, quantity } = item;
    totalPrice += price * quantity;
  });
  totalPriceElement.textContent = totalPrice.toFixed(2);

  // Проверка суммы на кнопке "Итого" и блокировка клика, если сумма равна 0
  if (totalPrice === 0) {
    totalButton.style.pointerEvents = 'none';
    totalButton.style.opacity = '0.5';
  } else {
    totalButton.style.pointerEvents = 'auto';
    totalButton.style.opacity = '1';
  }
}

// Отображаем товары при загрузке страницы
displayCartItems();

// Обновляем корзину при изменениях в локальном хранилище
window.addEventListener('storage', displayCartItems);

// Создаем канал BroadcastChannel
const broadcastChannel = new BroadcastChannel('cart_channel');

// Добавляем слушатель сообщений BroadcastChannel
broadcastChannel.addEventListener('message', (event) => {
  const { action, item } = event.data;
  if (action === 'update') {
    updateCartItem(item.name, item.quantity);
    displayCartItems();
  } else if (action === 'remove') {
    removeFromCart(item.name);
    displayCartItems();
  }
});

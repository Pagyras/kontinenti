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

// Вызываем функцию отображения товаров при загрузке страницы
displayCartItems();

// Создаем экземпляр BroadcastChannel
const broadcastChannel = new BroadcastChannel('cart-update');

// Обработчик события message для BroadcastChannel
broadcastChannel.addEventListener('message', (event) => {
  const { action, item } = event.data;

  switch (action) {
    case 'add':
      addToCart(item);
      displayCartItems();
      break;
    case 'remove':
      removeFromCart(item.name); // Исправлено
      displayCartItems();
      break;
    case 'update':
      updateCartItem(item.name, item.quantity);
      displayCartItems();
      break;
    default:
      break;
  }
});

// Функция для добавления товара в корзину
function addToCart(item) {
  const { name, price, quantity, image } = item; // Добавляем image
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const existingItemIndex = cartItems.findIndex(cartItem => cartItem.name === name);

  if (existingItemIndex !== -1) {
    cartItems[existingItemIndex].quantity += quantity;
  } else {
    cartItems.push({ name, price, quantity, image }); // Сохраняем image
  }

  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Получаем ссылку на кнопку "Итого"
const cartTotalButton = document.getElementById('cart-total');

// Функция для отправки данных в Telegram-бот
const sendDataToBot = () => {
  return new Promise((resolve, reject) => {
    const totalPrice = parseFloat(document.getElementById('total-price').textContent);
    
    const dataToSend = {
        total: totalPrice
    };

    // Отправляем данные в бот
    Telegram.WebApp.sendData(JSON.stringify(dataToSend));

    // После успешной отправки вызываем resolve
    resolve();
  });
};

// Обработчик события для кнопки "Итого"
cartTotalButton.addEventListener('click', () => {
  sendDataToBot()
    .then(() => {
      // После успешной отправки вызываем функцию для очистки корзины
      clearCart();
      localStorage.clear(); // Очищаем все данные из localStorage
    })
    .catch((error) => {
      console.error('Произошла ошибка при отправке данных в бот:', error);
    });
});

// Функция для очистки корзины
function clearCart() {
  localStorage.removeItem('cartItems');
  displayCartItems(); // Перерисовываем корзину после очистки
}

// Получите элементы корзины
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

addToCartButtons.forEach((button, index) => {
  button.addEventListener('click', (event) => {
    event.preventDefault(); // Предотвращаем поведение по умолчанию для ссылки
    button.style.display = 'none';
    quantityControls[index].style.display = 'flex';
    const name = productCards[index].dataset.name;
    const price = parseFloat(productCards[index].dataset.price);
    const image = productCards[index].querySelector('img').src; // Получаем URL изображения
    const quantity = parseInt(quantities[index].textContent);
    addToCart(name, price, quantity, image); // Добавляем товар в корзину с изображением
    broadcastChannel.postMessage({ action: 'add', item: { name, price, quantity, image } }); // Отправляем сообщение в канал
  });
});

const minusButtons = document.querySelectorAll('.minus-btn');
const plusButtons = document.querySelectorAll('.plus-btn');

minusButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    let quantity = parseInt(quantities[index].textContent);
    if (quantity > 1) {
      quantity--;
      quantities[index].textContent = quantity;
      const name = productCards[index].dataset.name;
      updateCartItem(name, quantity); // Используем имя товара для обновления корзины
    } else {
      quantityControls[index].style.display = 'none';
      addToCartButtons[index].style.display = 'block';
      const name = productCards[index].dataset.name;
      removeFromCart(name); // Используем имя товара для удаления из корзины
    }
  });
});

plusButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    let quantity = parseInt(quantities[index].textContent);
    quantity++;
    quantities[index].textContent = quantity;
    const name = productCards[index].dataset.name;
    updateCartItem(name, quantity); // Используем имя товара для обновления корзины
  });
});

function addToCart(name, price, quantity, image) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const existingItemIndex = cartItems.findIndex(item => item.name === name);

  if (existingItemIndex !== -1) {
    cartItems[existingItemIndex].quantity += quantity;
  } else {
    cartItems.push({ name, price, quantity, image }); // Добавляем изображение
  }

  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function removeFromCart(name) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const updatedCartItems = cartItems.filter(item => item.name !== name);
  localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
}

function updateCartItem(name, quantity) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const updatedCartItems = cartItems.map(item => {
    if (item.name === name) {
      return { ...item, quantity };
    }
    return item;
  });
  localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
}

window.addEventListener('load', () => {
  updateCartStateOnPage();
});

window.addEventListener('storage', () => {
  updateCartStateOnPage();
});

import { products } from '../data/products.js';
import {cart, removeFromCart, updateCartQuantity, updateQuantity, updateDeliveryOption} from '../data/cart.js'
import { formatCurrency } from './utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {deliveryOptions} from '../data/deliveryOptions.js';

let cartSummaryHTML = ' '

cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProducts;

    products.forEach((product) => {
        if (product.id === productId){
            matchingProducts = product
        }
    });

    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption;

    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId){
        deliveryOption = option
      }
    })

    const today = dayjs();

    const deliveryDate = today.add(
      deliveryOption.deliveryDays,
      'days'
    );
    const dateString = deliveryDate.format('dddd, MMMM D');


    cartSummaryHTML += `
        <div class="cart-item-container 
        js-cart-item-container-${productId}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProducts.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProducts.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProducts.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link"
                  data-product-id="${matchingProducts.id}">
                    Update
                  </span>
                  <input class="quantity-input js-quantity-input js-input-handle" data-product-id="${matchingProducts.id}">
                  <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${matchingProducts.id}">
                    Save
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProducts.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingProducts, cartItem)}
              </div>
            </div>
          </div>
    `;
});

    function deliveryOptionsHTML(matchingProducts, cartItem) {
      let html = '';

      deliveryOptions.forEach((deliveryOption) => {
        const today = dayjs();
        const deliveryDate = today.add(
          deliveryOption.deliveryDays,
          'days'
        );
        const dateString = deliveryDate.format('dddd, MMMM D');

        const priceString = deliveryOption.priceCents === 0 
          ? 'FREE'
          : `$${formatCurrency(deliveryOption.priceCents)} -`;

          const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

          html +=
        `
        <div class="delivery-option js-delivery-option"
        data-product-id="${matchingProducts.id}"
        data-delivery-option-id="${deliveryOption.id}">
            <input type="radio"
              ${isChecked ? 'checked' : ''}
              class="delivery-option-input"
              name="delivery-option-${matchingProducts.id}">
            <div>
              <div class="delivery-option-date">
                ${dateString}
              </div>
              <div class="delivery-option-price">
                ${priceString} - Shipping
              </div>
            </div>
          </div>
          `
      });

      return html;
    };

    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML

    document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        const container = document.querySelector(`.js-cart-item-container-${productId}`);

        container.remove()

        updateCartQuantity('.js-header-cart-quantity', '.js-cart-quantity1');
    });
});

    updateCartQuantity('.js-header-cart-quantity', '.js-cart-quantity1');

    document.querySelectorAll('.js-update-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;

        const container = link.closest('.cart-item-container').classList;

        container.add('is-editing-quantity')
      })
    })

    function saveQuantity(container, productId) {
        container.classList.remove('is-editing-quantity');

        let quantityInput = container.querySelector('.js-quantity-input')
        const quantityValue = Number(quantityInput.value)

        if (isNaN(quantityValue)) {
          quantityInput.value = '';
          return;
        }
        
        if (quantityValue <= 1 || quantityValue >= 1000){
          quantityInput.value = '';
          return;
        }

        updateQuantity(productId, quantityValue)

        container.querySelector(`.js-quantity-label`).innerHTML = quantityValue;
        
        updateCartQuantity('.js-header-quantity')

        quantityInput.value = '';
    }

    document.querySelectorAll('.js-save-quantity-link').
    forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;

        const container = link.closest('.cart-item-container');

        saveQuantity(container, productId)
      })
    })

    document.querySelectorAll('.js-input-handle').forEach((input) => {
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter'){
        const productId = input.dataset.productId;

        const container = input.closest('.cart-item-container');

        saveQuantity(container, productId)
        }
      })
    });

    document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset
        updateDeliveryOption(productId, deliveryOptionId);
      })
    })
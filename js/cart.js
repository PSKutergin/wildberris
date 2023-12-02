'use strict';

const cart = () => {
    const cartBtn = document.querySelector('.button-cart');
    const cartModal = document.getElementById('modal-cart');
    const closeBtn = cartModal.querySelector('.modal-close');
    const cardTotalSum = cartModal.querySelector('.card-table__total');
    const goodsContainer = document.querySelector('.long-goods-list');
    const cartTable = document.querySelector('.cart-table__goods');
    const modalForm = document.querySelector('.modal-form');

    const deleteCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'));
        const newCart = cart.filter(good => good.id !== id);

        localStorage.setItem('cart', JSON.stringify(newCart));
        renderCardsGoods(JSON.parse(localStorage.getItem('cart')))
    };

    const plusCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'));

        const newCart = cart.map(good => {
            if (good.id === id) {
                good.count++
            };
            return good;
        })

        localStorage.setItem('cart', JSON.stringify(newCart));
        renderCardsGoods(JSON.parse(localStorage.getItem('cart')))
    };

    const minusCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'));

        const newCart = cart.map(good => {
            if (good.id === id) {
                if (good.count > 0) {
                    good.count--
                };
            };
            return good;
        })

        localStorage.setItem('cart', JSON.stringify(newCart));
        renderCardsGoods(JSON.parse(localStorage.getItem('cart')))
    };

    const addToCart = (id) => {
        const goods = JSON.parse(localStorage.getItem('goods'));
        const clickedGood = goods.find(good => good.id === id);
        const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

        if (cart.some(good => good.id === clickedGood.id)) {
            cart.map(good => {
                if (good.id === clickedGood.id) {
                    good.count++
                };
                return good;
            })
        } else {
            clickedGood.count = 1;
            cart.push(clickedGood);
        };

        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const renderCardsGoods = (goods) => {
        let totalSum = 0;

        cartTable.innerHTML = '';

        goods.forEach(good => {
            const tr = document.createElement('tr');

            tr.innerHTML =
                `
                    <tr>
                        <td>${good.name}</td>
                        <td>${good.price}$</td>
                        <td><button class="cart-btn-minus">-</button></td>
                        <td>${good.count}</td>
                        <td><button class="cart-btn-plus">+</button></td>
                        <td>${+good.price * +good.count}$</td>
                        <td><button class="cart-btn-delete">x</button></td>
                    </tr>
                `;
            cartTable.append(tr);

            tr.addEventListener('click', (e) => {
                if (e.target.classList.contains('cart-btn-minus')) {
                    minusCartItem(good.id);
                } else if (e.target.classList.contains('cart-btn-plus')) {
                    plusCartItem(good.id);
                } else if (e.target.classList.contains('cart-btn-delete')) {
                    deleteCartItem(good.id)
                };
            });

            totalSum += +good.price * +good.count
        });

        cardTotalSum.textContent = `${totalSum}$`
    };

    const validate = (list) => {
        let success = true;

        list.forEach(input => {
            switch (input.name) {
                case 'nameCustomer':
                    if (!/[а-яА-Я\s]/.test(input.value)) {
                        success = false
                    }
                    break;
                case 'phoneCustomer':
                    if (!/[0-9\(\)\-\+]/.test(input.value)) {
                        success = false
                    }
                    break;
            }
        });

        return success
    };

    const sendForm = (formBody) => {
        const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                cart: cart,
                name: formBody.nameCustomer,
                phone: formBody.phoneCustomer
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(() => {
            cartModal.style.display = ''
            localStorage.setItem('cart', []);
        });
    };

    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formElements = modalForm.querySelectorAll('input');
        const formData = new FormData(modalForm);
        const formBody = {};

        formElements.forEach(input => {
            input.addEventListener('input', () => {
                input.style.border = ''
            })
        })

        formData.forEach((value, key) => {
            formBody[key] = value
        });

        if (validate(formElements)) {
            sendForm(formBody);
            modalForm.reset();
        } else {
            formElements.forEach(input => {
                input.style.border = '1px solid red'
            })
        }
    });

    cartBtn.addEventListener('click', () => {
        const cartArray = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

        renderCardsGoods(cartArray);
        cartModal.style.display = 'flex'
    });

    closeBtn.addEventListener('click', () => {
        cartModal.style.display = ''
    });

    cartModal.addEventListener('click', (e) => {
        if (!e.target.closest('.modal') && e.target.classList.contains('overlay')) {
            cartModal.style.display = ''
        }
    })

    if (goodsContainer) {
        goodsContainer.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart')) {
                const buttonToCart = e.target.closest('.add-to-cart');
                const goodId = buttonToCart.dataset.id;

                addToCart(goodId);
            }
        })
    }
};

cart();
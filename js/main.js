class Product {
    constructor(id, price, name, image, description = '') {
        this.price = price;
        this.description = description;
        this.id = id;
        this.name = name;
        this.image = image;
    }

    renderCart() {
        return `
            <div class="item">
                <img src="${this.image}" alt="">
                <div class="description">
                    <h3>${this.name}</h3>
                    <p>${this.description}</p>
                    <div class="price">
                        <h4>${this.price}$</h4>
                    </div>
                </div>
            </div>
        `;
    }

    renderMenu() {
        return `
            <div class="item">
                <img src="${this.image}" alt="">
                <div class="description">
                    <h3>${this.name}</h3>
                    <p>${this.description}</p>
                    <div class="price">
                        <h4>${this.price}$</h4>
                        <button id="button_${this.id}">Add to cart</button>
                    </div>
                </div>
            </div>
        `;
    }
}

class Cart {
    constructor(cartModal, cartMenu, isShown = false) {
        this.cartModal = cartModal;
        this.isShown = isShown;
        this.cart = [];
        this.cartMenu = cartMenu;
    }

    showCart() {
        if(this.isShown) {
            return;
        }

        this.cartModal.classList.remove("hidden");
        this.isShown = !this.isShown;
    }

    hideCart() {
        if(!this.isShown) {
            return;
        }

        this.cartModal.classList.add("hidden");
        this.isShown = !this.isShown;
    }

    toggle() {
        if(this.isShown) {
            return this.hideCart();
        }

        return this.showCart();
    }

    order() {
        return this.toggle();
    }

    addProduct(product) {
        if(!(product instanceof Product)) {
            return;
        }

        this.cart.push(product);
        this.render();
    }

    render() {
        let html = '';
        this.cart.forEach(element => {
            html += element.renderCart();
        });

        this.cartMenu.innerHTML = html;
    }
}

class ProductF {
    constructor(menuItem, cart) {
        if(!(cart instanceof Cart)) {
            throw 'KAKA';
        }

        this.menu = menuItem;
        this.cart = cart;
    }

    init(source) {
        this.products = [];

        source.forEach(source => {
            this.products.push(new Product(
                source.id,
                source.price,
                source.name,
                source.image,
                source.description
            ));
        });

        return this;
    }

    render() {
        let html = '';
        this.products.forEach(product => {
            html += product.renderMenu();
        });

        this.menu.innerHTML = html;
        this.products.forEach(product => {
            let button = document.getElementById(`button_${product.id}`);
            button.addEventListener('click', () => {
                this.cart.addProduct(product);
            });
        });
    }
}

window.addEventListener('load', (event) => {
    // Cart
    let openCartButton = document.getElementById('openCart');
    let cartContinue = document.getElementById('cartContinue');
    let cartOrder = document.getElementById('cartOrder');
    let cartModal = document.getElementById('cartModal');
    let cartMenu = document.getElementById('cartMenu');

    let cart = new Cart(cartModal, cartMenu);

    openCartButton.addEventListener('click', () => {
        cart.toggle();
    });

    cartContinue.addEventListener('click', () => {
        cart.toggle();
    });

    cartOrder.addEventListener('click', () => {
        cart.order();
    });

    // Menu
    let menu = document.getElementById('menu');

    let productF = new ProductF(menu, cart);
    // const source = require('');

    fetch("../data/source.json")
        .then(response => response.json())
        .then(json => productF.init(json).render());

});

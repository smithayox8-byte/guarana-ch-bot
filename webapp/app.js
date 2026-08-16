// ==========================================
// GUARANĂ.CH MINI APP
// Complete Catalogue + Cart + Contact
// ==========================================

const tg = window.Telegram?.WebApp;

// Start Telegram Mini App
if (tg) {
    tg.ready();
    tg.expand();
}


// ==========================================
// APP DATA
// ==========================================

let cart = [];

let selectedContactMethod = "";


// ==========================================
// PRODUCTS
// ==========================================

const products = [
    {
        name: "Gaming Headset",
        price: 89,
        image: "assets/gaming-headset.png"
    },
    {
        name: "Mechanical Keyboard",
        price: 109,
        image: "assets/mechanical-keyboard.png"
    },
    {
        name: "Wireless Gaming Mouse",
        price: 69,
        image: "assets/gaming-mouse.png"
    },
    {
        name: "Compact Digital Camera",
        price: 149,
        image: "assets/digital-camera.png"
    },
    {
        name: "Tech Organizer Bag",
        price: 45,
        image: "assets/tech-organizer.png"
    },
    {
        name: "RGB Ambient Light",
        price: 49,
        image: "assets/rgb-light.png"
    }
];


// ==========================================
// LOAD SAVED CART
// ==========================================

function loadCart() {

    const savedCart =
        localStorage.getItem("guarana_cart");

    if (!savedCart) {
        cart = [];
        return;
    }

    try {
        cart = JSON.parse(savedCart);

        if (!Array.isArray(cart)) {
            cart = [];
        }

    } catch (error) {
        cart = [];
    }
}


// ==========================================
// SAVE CART
// ==========================================

function saveCart() {

    localStorage.setItem(
        "guarana_cart",
        JSON.stringify(cart)
    );
}


// ==========================================
// STEP 1 / 2 / 3
// ==========================================

function goToStep(step) {

    const step1 =
        document.getElementById("step1");

    const step2 =
        document.getElementById("step2");

    const step3 =
        document.getElementById("step3");

    const circle1 =
        document.getElementById("circle1");

    const circle2 =
        document.getElementById("circle2");

    const circle3 =
        document.getElementById("circle3");


    // Hide all steps

    step1?.classList.add("hidden");
    step2?.classList.add("hidden");
    step3?.classList.add("hidden");


    circle1?.classList.remove("active");
    circle2?.classList.remove("active");
    circle3?.classList.remove("active");


    // Step 1

    if (step === 1) {

        step1?.classList.remove("hidden");

        circle1?.classList.add("active");
    }


    // Step 2

    if (step === 2) {

        step2?.classList.remove("hidden");

        circle1?.classList.add("active");
        circle2?.classList.add("active");
    }


    // Step 3

    if (step === 3) {

        step3?.classList.remove("hidden");

        circle1?.classList.add("active");
        circle2?.classList.add("active");
        circle3?.classList.add("active");
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ==========================================
// CONTACT METHOD
// ==========================================

function selectContact(method) {

    selectedContactMethod = method;

    const signal =
        document.getElementById("signalButton");

    const threema =
        document.getElementById("threemaButton");


    signal?.classList.remove("selected");

    threema?.classList.remove("selected");


    if (method === "Signal") {
        signal?.classList.add("selected");
    }


    if (method === "Threema") {
        threema?.classList.add("selected");
    }
}


// ==========================================
// UNLOCK CATALOGUE
// ==========================================

function unlockCatalogue() {

    const input =
        document.getElementById("contactInput");

    const contact =
        input?.value.trim();


    if (!selectedContactMethod) {

        showMessage(
            "Please choose a contact method first."
        );

        return;
    }


    if (!contact) {

        showMessage(
            "Please enter your contact information."
        );

        return;
    }


    localStorage.setItem(
        "guarana_contact_method",
        selectedContactMethod
    );


    localStorage.setItem(
        "guarana_contact",
        contact
    );


    document
        .getElementById("welcome")
        ?.classList.add("hidden");


    document
        .getElementById("catalogue")
        ?.classList.remove("hidden");


    document
        .getElementById("bottomNav")
        ?.classList.remove("hidden");


    showCatalogue();
}


// ==========================================
// SHOW CATALOGUE
// ==========================================

function showCatalogue() {

    document
        .getElementById("catalogue")
        ?.classList.remove("hidden");


    document
        .getElementById("bottomNav")
        ?.classList.remove("hidden");


    updateNavigation("catalogue");
}


// ==========================================
// ADD TO CART
// ==========================================

function addProduct(name, price) {

    const existing =
        cart.find(
            item => item.name === name
        );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }


    saveCart();

    updateCartBadge();


    showMessage(
        `${name} added to your cart.`
    );
}


// ==========================================
// INCREASE QUANTITY
// ==========================================

function increaseQuantity(index) {

    if (!cart[index]) {
        return;
    }


    cart[index].quantity += 1;

    saveCart();

    renderCart();
}


// ==========================================
// DECREASE QUANTITY
// ==========================================

function decreaseQuantity(index) {

    if (!cart[index]) {
        return;
    }


    cart[index].quantity -= 1;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);
    }


    saveCart();

    renderCart();
}


// ==========================================
// REMOVE PRODUCT
// ==========================================

function removeProduct(index) {

    if (!cart[index]) {
        return;
    }


    cart.splice(index, 1);

    saveCart();

    renderCart();
}


// ==========================================
// CART TOTAL
// ==========================================

function getCartTotal() {

    return cart.reduce(
        (total, item) => {

            return total +
                (item.price * item.quantity);

        },
        0
    );
}


// ==========================================
// CART ITEM COUNT
// ==========================================

function getCartCount() {

    return cart.reduce(
        (total, item) => {

            return total + item.quantity;

        },
        0
    );
}


// ==========================================
// UPDATE CART BADGE
// ==========================================

function updateCartBadge() {

    const cartButton =
        document.querySelectorAll(".nav-button")[1];


    if (!cartButton) {
        return;
    }


    const count =
        getCartCount();


    const oldBadge =
        cartButton.querySelector(".cart-count");


    if (oldBadge) {
        oldBadge.remove();
    }


    if (count > 0) {

        const badge =
            document.createElement("span");

        badge.className = "cart-count";

        badge.textContent = count;

        cartButton.appendChild(badge);
    }
}


// ==========================================
// SHOW CART
// ==========================================

function showCart() {

    updateNavigation("cart");

    renderCart();
}


// ==========================================
// RENDER CART
// ==========================================

function renderCart() {

    let cartBox =
        document.getElementById("cartScreen");


    // Create cart screen if it does not exist

    if (!cartBox) {

        cartBox =
            document.createElement("section");

        cartBox.id = "cartScreen";

        cartBox.className =
            "cart-screen";


        document
            .getElementById("catalogue")
            ?.parentNode
            .appendChild(cartBox);
    }


    document
        .getElementById("catalogue")
        ?.classList.add("hidden");


    cartBox.classList.remove("hidden");


    // Empty cart

    if (cart.length === 0) {

        cartBox.innerHTML = `

            <div class="cart-content">

                <div class="cart-icon">
                    🛒
                </div>

                <h2>
                    Your cart is empty
                </h2>

                <p>
                    Add some products from the catalogue.
                </p>

                <button
                    class="btn full"
                    onclick="backToCatalogue()"
                >
                    Continue Shopping
                </button>

            </div>

        `;

        return;
    }


    // Cart HTML

    let html = `

        <div class="cart-content">

            <h1>
                Your Cart
            </h1>

            <div class="cart-items">
    `;


    cart.forEach((item, index) => {

        const subtotal =
            item.price * item.quantity;


        html += `

            <div class="cart-item">

                <div class="cart-item-info">

                    <h3>
                        ${escapeHTML(item.name)}
                    </h3>

                    <p>
                        ${item.price} CHF each
                    </p>

                    <strong>
                        ${subtotal} CHF
                    </strong>

                </div>


                <div class="quantity-controls">

                    <button
                        onclick="decreaseQuantity(${index})"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="increaseQuantity(${index})"
                    >
                        +
                    </button>

                </div>


                <button
                    class="remove-button"
                    onclick="removeProduct(${index})"
                >
                    🗑️
                </button>

            </div>

        `;
    });


    html += `

            </div>

            <div class="cart-summary">

                <div class="summary-row">

                    <span>
                        Items
                    </span>

                    <strong>
                        ${getCartCount()}
                    </strong>

                </div>


                <div class="summary-row total">

                    <span>
                        Total
                    </span>

                    <strong>
                        ${getCartTotal()} CHF
                    </strong>

                </div>

            </div>


            <div class="cart-actions">

                <button
                    class="btn secondary"
                    onclick="backToCatalogue()"
                >
                    Continue Shopping
                </button>


                <button
                    class="btn"
                    onclick="checkout()"
                >
                    Checkout
                </button>

            </div>

        </div>

    `;


    cartBox.innerHTML = html;
}


// ==========================================
// BACK TO CATALOGUE
// ==========================================

function backToCatalogue() {

    const cartScreen =
        document.getElementById("cartScreen");


    cartScreen?.classList.add("hidden");


    document
        .getElementById("catalogue")
        ?.classList.remove("hidden");


    updateNavigation("catalogue");
}


// ==========================================
// CHECKOUT
// ==========================================

function checkout() {

    if (cart.length === 0) {

        showMessage(
            "Your cart is empty."
        );

        return;
    }


    const method =
        localStorage.getItem(
            "guarana_contact_method"
        );


    const contact =
        localStorage.getItem(
            "guarana_contact"
        );


    if (!method || !contact) {

        showMessage(
            "Please save your contact information before checkout."
        );

        return;
    }


    let order = {

        shop: "Guarană.ch",

        contactMethod: method,

        contact: contact,

        items: cart,

        total: getCartTotal(),

        currency: "CHF",

        createdAt:
            new Date().toISOString()

    };


    const orderText =
        createOrderText(order);


    // Send order to Telegram bot

    if (
        tg &&
        typeof tg.sendData === "function"
    ) {

        tg.sendData(
            JSON.stringify(order)
        );


        showMessage(
            "Your order has been sent successfully."
        );


    } else {

        // Browser testing

        console.log(orderText);


        showMessage(
            "Order created successfully."
        );
    }
}


// ==========================================
// CREATE ORDER TEXT
// ==========================================

function createOrderText(order) {

    let text =
        "🛍️ GUARANĂ.CH ORDER\n\n";


    order.items.forEach(item => {

        text +=
            `${item.name}\n` +
            `Quantity: ${item.quantity}\n` +
            `Price: ${item.price} CHF\n\n`;

    });


    text +=
        `TOTAL: ${order.total} CHF\n\n` +
        `Contact method: ${order.contactMethod}\n` +
        `Contact: ${order.contact}`;


    return text;
}


// ==========================================
// CONTACT BUTTON
// ==========================================

function showContact() {

    updateNavigation("contact");


    const method =
        localStorage.getItem(
            "guarana_contact_method"
        );


    const contact =
        localStorage.getItem(
            "guarana_contact"
        );


    let contactScreen =
        document.getElementById(
            "contactScreen"
        );


    if (!contactScreen) {

        contactScreen =
            document.createElement("section");

        contactScreen.id =
            "contactScreen";

        contactScreen.className =
            "contact-screen";


        document
            .getElementById("catalogue")
            ?.parentNode
            .appendChild(contactScreen);
    }


    document
        .getElementById("catalogue")
        ?.classList.add("hidden");


    document
        .getElementById("cartScreen")
        ?.classList.add("hidden");


    contactScreen.classList.remove("hidden");


    contactScreen.innerHTML = `

        <div class="contact-content">

            <div class="contact-icon">
                💬
            </div>

            <h1>
                Contact Guarană.ch
            </h1>

            <p>
                Need help with your order?
                Contact us using your saved method.
            </p>


            ${
                method && contact
                ?

                `

                <div class="saved-contact">

                    <strong>
                        Contact method
                    </strong>

                    <span>
                        ${escapeHTML(method)}
                    </span>


                    <strong>
                        Contact
                    </strong>

                    <span>
                        ${escapeHTML(contact)}
                    </span>

                </div>

                `

                :

                `

                <div class="saved-contact">

                    <p>
                        No contact information saved yet.
                    </p>

                </div>

                `
            }


            <button
                class="btn full"
                onclick="editContact()"
            >
                Update Contact
            </button>


            <button
                class="btn secondary full"
                onclick="backToCatalogue()"
            >
                Back to Catalogue
            </button>

        </div>

    `;
}


// ==========================================
// EDIT CONTACT
// ==========================================

function editContact() {

    const method =
        localStorage.getItem(
            "guarana_contact_method"
        );


    const contact =
        localStorage.getItem(
            "guarana_contact"
        );


    const contactScreen =
        document.getElementById(
            "contactScreen"
        );


    if (!contactScreen) {
        return;
    }


    contactScreen.innerHTML = `

        <div class="contact-content">

            <h1>
                Update Contact
            </h1>


            <p>
                Choose your preferred contact method.
            </p>


            <div class="contact-options">

                <button
                    class="contact-option ${
                        method === "Signal"
                        ? "selected"
                        : ""
                    }"
                    onclick="selectEditContact('Signal')"
                    id="editSignal"
                >
                    Signal
                </button>


                <button
                    class="contact-option ${
                        method === "Threema"
                        ? "selected"
                        : ""
                    }"
                    onclick="selectEditContact('Threema')"
                    id="editThreema"
                >
                    Threema
                </button>

            </div>


            <input
                id="editContactInput"
                class="contact-input"
                type="text"
                placeholder="Enter your contact"
                value="${escapeHTML(contact || "")}"
            >


            <button
                class="btn full"
                onclick="saveUpdatedContact()"
            >
                Save Contact
            </button>


            <button
                class="btn secondary full"
                onclick="showContact()"
            >
                Cancel
            </button>

        </div>

    `;


    window.editContactMethod =
        method || "";
}


// ==========================================
// SELECT EDIT CONTACT
// ==========================================

function selectEditContact(method) {

    window.editContactMethod =
        method;


    document
        .getElementById("editSignal")
        ?.classList.remove("selected");


    document
        .getElementById("editThreema")
        ?.classList.remove("selected");


    if (method === "Signal") {

        document
            .getElementById("editSignal")
            ?.classList.add("selected");

    }


    if (method === "Threema") {

        document
            .getElementById("editThreema")
            ?.classList.add("selected");

    }
}


// ==========================================
// SAVE UPDATED CONTACT
// ==========================================

function saveUpdatedContact() {

    const input =
        document.getElementById(
            "editContactInput"
        );


    const contact =
        input?.value.trim();


    const method =
        window.editContactMethod;


    if (!method) {

        showMessage(
            "Please select a contact method."
        );

        return;
    }


    if (!contact) {

        showMessage(
            "Please enter your contact."
        );

        return;
    }


    localStorage.setItem(
        "guarana_contact_method",
        method
    );


    localStorage.setItem(
        "guarana_contact",
        contact
    );


    showContact();
}


// ==========================================
// NAVIGATION
// ==========================================

function updateNavigation(active) {

    const buttons =
        document.querySelectorAll(
            ".nav-button"
        );


    buttons.forEach(button => {

        button.classList.remove(
            "active"
        );

    });


    if (active === "catalogue") {

        buttons[0]
            ?.classList.add("active");
    }


    if (active === "cart") {

        buttons[1]
            ?.classList.add("active");
    }


    if (active === "contact") {

        buttons[2]
            ?.classList.add("active");
    }
}


// ==========================================
// MENU
// ==========================================

function openMenu() {

    showMessage(
        "Guarană.ch\n\n" +
        "Welcome to our catalogue."
    );
}


// ==========================================
// MESSAGE
// ==========================================

function showMessage(message) {

    if (
        tg &&
        typeof tg.showPopup === "function"
    ) {

        tg.showPopup({

            title: "Guarană.ch",

            message: message,

            buttons: [
                {
                    id: "ok",
                    type: "ok",
                    text: "OK"
                }
            ]

        });

        return;
    }


    alert(message);
}


// ==========================================
// SECURITY / HTML ESCAPE
// ==========================================

function escapeHTML(value) {

    if (value === null ||
        value === undefined) {

        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// START APP
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadCart();

        updateCartBadge();

        goToStep(1);

    }
);

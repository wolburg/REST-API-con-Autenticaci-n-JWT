class Product {
    constructor(id, name, price, image, description) {
        if (!id || !name || price < 0 || !image || !description) {
            throw new Error("Datos inválidos para el producto");
        }
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.description = description;
        this.quantity = 1;
    }
}

class CarritoCompras {
    constructor() {
        this.items = JSON.parse(localStorage.getItem("cart")) || [];
    }

    saveToStorage() {
        localStorage.setItem("cart", JSON.stringify(this.items));
    }

    addItem(product) {
        const existingProduct = this.items.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += product.quantity;
        } else {
            this.items.push(product);
        }
        this.saveToStorage();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
    }

    calculateTotal() {
        return this.items.reduce((total, item) => {
            const price = parseFloat(item.price);
            if (isNaN(price)) {
                console.error("Precio inválido para el producto", item);
                return total; 
            }
            return total + price * item.quantity;
        }, 0);
    }

    getItems() {
        return this.items;
    }
}

const futbolistas = [
    { id: "1", name: "Cristiano Ronaldo", price: 120000000, image: "futbolistas/cristiano.jpg", description: "Goles, títulos, liderazgo" },
    { id: "2", name: "Lionel Messi", price: 115000000, image: "futbolistas/messi.jpg", description: "Destreza, regate, visión" },
    { id: "3", name: "Neymar Jr", price: 110000000, image: "futbolistas/neymar.jpg", description: "Habilidad, agilidad, creatividad" },
    { id: "4", name: "Antoine Griezmann", price: 105000000, image: "futbolistas/griezman.jpg", description: "Versatilidad, inteligencia, goles" },
    { id: "5", name: "Kylian Mbappé", price: 100000000, image: "futbolistas/mbappe.jpg", description: "Velocidad, potencia, goles" },
    { id: "6", name: "Vinícius Jr", price: 95000000, image: "futbolistas/vinicius.jpg", description: "Rápido, habilidoso, talentoso" },
    { id: "7", name: "Erling Haaland", price: 90000000, image: "futbolistas/halland.jpg", description: "Goleador, físico, imponente" },
    { id: "8", name: "Mohamed Salah", price: 85000000, image: "futbolistas/salah.jpg", description: "Velocidad, definición, magia" },
    { id: "9", name: "Lamine Yamal", price: 80000000, image: "futbolistas/yamal.jpg", description: "Joven, prometedor, técnico" },
    { id: "10", name: "Santiago Giménez", price: 75000000, image: "futbolistas/santi.jpg", description: "Físico, definición, agresividad" }
];



function renderProducts() {
    const container = document.querySelector("#products-container"); 
    if (!container) return;

    container.innerHTML = "";  // Limpiar cualquier contenido previo

    // Recorremos el arreglo de productos
    futbolistas.forEach(product => {
        const card = document.createElement("div");
        card.className = "col-lg-3 col-md-4 col-sm-6 mb-4"; // tamaño de la tarjeta

        card.innerHTML = `
            <div class="card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">$${product.price.toLocaleString()}</p>
                    <button class="btn btn-primary w-100" id="add-to-cart-${product.id}">Agregar al Carrito</button>
                </div>
            </div>
        `;

        // Agregamos la tarjeta al contenedor
        container.appendChild(card);

        const addToCartButton = document.getElementById(`add-to-cart-${product.id}`);
        addToCartButton.addEventListener("click", function() {
            agregarAlCarrito(product.id);  
        });
    });
}



function agregarAlCarrito(productId) {
    const product = futbolistas.find(p => p.id === productId);  
    if (product) {
        const productToAdd = new Product(product.id, product.name, product.price, product.image, product.description);
        const cart = new CarritoCompras();  
        cart.addItem(productToAdd); 
        alert(`${product.name} agregado al carrito ✅`);
    } else {
        alert("Producto no encontrado ❌");
    }
}


function loadCart() {
    const cart = new CarritoCompras();
    const cartList = document.getElementById("cart-list");
    if (!cartList) return; 

    cartList.innerHTML = "";

    cart.getItems().forEach(item => {
        item.quantity = item.quantity || 1;
        cartList.innerHTML += `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card">
                    <img src="${item.image}" class="card-img-top" alt="${item.name}">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">Precio: $${item.price}</p>
                        <p class="card-text">Cantidad: ${item.quantity}</p>
                        <button class="btn btn-danger btn-sm w-100" onclick="removeFromCart('${item.id}')">Borrar</button>
                    </div>
                </div>
            </div>
        `;
    });
    const total = cart.calculateTotal();
    document.getElementById("total-price").textContent = total.toLocaleString();
}
function removeFromCart(productId) {
    const cart = new CarritoCompras();
    cart.removeItem(productId);
    loadCart();
}

function cancelOrder() {
    const cart = new CarritoCompras();
    cart.items = [];
    cart.saveToStorage();
    loadCart();
}

document.addEventListener("DOMContentLoaded", function () {
    renderProducts();
    
    let loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
        mostrarUsuario(loggedInUser);
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            let email = document.getElementById("loginEmail").value.trim();
            let password = document.getElementById("loginPassword").value.trim();
            let valid = true;

            if (!email.includes("@") || !email.includes(".")) {
                document.getElementById("emailError").textContent = "⚠️ Ingresa un correo válido.";
                valid = false;
            } else {
                document.getElementById("emailError").textContent = "";
            }

            if (password.length < 6) {
                document.getElementById("passwordError").textContent = "⚠️ La contraseña debe tener al menos 6 caracteres.";
                valid = false;
            } else {
                document.getElementById("passwordError").textContent = "";
            }

            if (valid) {
                alert("Inicio de sesión exitoso ✅");
                let storedName = localStorage.getItem(email);
                if (storedName) {
                    localStorage.setItem("user", storedName);
                    mostrarUsuario(storedName);
                    cerrarModal("loginModal");
                } else {
                    alert("Correo no registrado ❌");
                }
            }
        });
    }

    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();
            let name = document.getElementById("registerName").value.trim();
            let email = document.getElementById("registerEmail").value.trim();
            let password = document.getElementById("registerPassword").value.trim();
            let valid = true;

            if (name.length < 3) {
                document.getElementById("nameError").textContent = "⚠️ El nombre debe tener al menos 3 caracteres.";
                valid = false;
            } else {
                document.getElementById("nameError").textContent = "";
            }

            if (!email.includes("@") || !email.includes(".")) {
                document.getElementById("registerEmailError").textContent = "⚠️ Ingresa un correo válido.";
                valid = false;
            } else {
                document.getElementById("registerEmailError").textContent = "";
            }

            if (password.length < 8) {
                document.getElementById("registerPasswordError").textContent = "⚠️ La contraseña debe tener al menos 8 caracteres.";
                valid = false;
            } else {
                document.getElementById("registerPasswordError").textContent = "";
            }

            if (valid) {
                alert("Registro exitoso ✅");
                localStorage.setItem(email, name);
                localStorage.setItem("user", name);
                mostrarUsuario(name);
                cerrarModal("registerModal");
            }
        });
    }

    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("user");
            location.reload();
        });
    }
});

function mostrarUsuario(userName) {
    document.getElementById("loginNav").style.display = "none";
    document.getElementById("registerNav").style.display = "none";
    document.getElementById("user-info").style.display = "block";
    document.getElementById("user-name").textContent = userName;
}

function cerrarModal(modalId) {
    let modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.hide();
}

window.onload = loadCart;

// Carrito con local storage

//Mostrar / ocultar carrito
function toggleCarrito() {
    const sidebar = document.getElementById("carritoLateral");
    sidebar.classList.toggle("active");
    mostrarCarrito();
}

// Obtener carrito
function cargarCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

// Guardar carrito
function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(producto) {
    let carrito = cargarCarrito();

    const existe = carrito.find(item => item.id_producto === producto.id_producto);
    if (existe) {
        // Límite de 3 unidades
        if (existe.cantidad >= 3) {
            alert("Solo puedes agregar máximo 3 unidades de este producto.");
            return;
        }
        existe.cantidad++;

    } else {
        carrito.push({
            id_producto: producto.id_producto,
            nombre_producto: producto.nombre_producto,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
    mostrarCarrito();
    toggleCarrito(); // abre carrito después de agregar
}

// Suma la cantidad y el valor del carrito
function agregarUnidad(id) {
    let carrito = cargarCarrito();
    const item = carrito.find(p => p.id_producto === id);

    if (!item) return;

    // ❗ LIMITE DE 3
    if (item.cantidad >= 3) {
        alert("Solo puedes agregar máximo 3 unidades de este producto.");
        return;
    }

    item.cantidad++;

    guardarCarrito(carrito);
    mostrarCarrito();
}

// Resta la cantidad y el valor del producto
function restarUnidad(id) {
    let carrito = cargarCarrito();
    const item = carrito.find(p => p.id_producto === id);
    if (!item) return;

    // Mínimo 1 unidad
    if (item.cantidad > 1) {
        item.cantidad--;
    }
    guardarCarrito(carrito);
    mostrarCarrito();
}

// Eliminar todas las cantidades del producto que estan en el carrito
function eliminarProducto(id) {
    let carrito = cargarCarrito().filter(p => p.id_producto !== id);
    guardarCarrito(carrito);
    mostrarCarrito();
}

// Vaciar carrito
function vaciarCarrito() {
    localStorage.removeItem("carrito");
    mostrarCarrito();
}

// Calcular total de todos los productos y arrojar el valor total
function calcularTotal() {
    return cargarCarrito().reduce((acc, p) => acc + p.precio * p.cantidad, 0);
}

// Mostrar el carrito 
function mostrarCarrito() {
    const carrito = cargarCarrito();
    const cont = document.getElementById("carritoItems");
    const total = document.getElementById("totalCarrito");

    cont.innerHTML = "";

    if (carrito.length === 0) {
        cont.innerHTML = "<p class='empty'>No hay productos en el carrito</p>";
        total.textContent = "0";
        return;
    }

    carrito.forEach(p => {
        const imgSrc = (p.imagen && p.imagen !== "default.svg")
            ? `/frontend/media/img/products/${p.imagen}`
            : `/frontend/media/img/default.svg`;

        cont.innerHTML += `
        <div class="carrito-item">
            <div class="carrito-product">
                <img src="${imgSrc}" alt="${p.nombre_producto}"/>
                <div class="info">
                    <h4>${p.nombre_producto}</h4>
                    <p>Precio: $${p.precio.toLocaleString("es-CO")}</p>
                    <p>Cantidad: ${p.cantidad}</p>
                </div>
            </div>

            <div class="acciones">
                <button onclick="eliminarProducto(${p.id_producto})">🗑</button>
                <button onclick="restarUnidad(${p.id_producto})">-</button>
                <button onclick="agregarUnidad(${p.id_producto})">+</button>
            </div>
        </div>`;
    });

    total.textContent = calcularTotal().toLocaleString("es-CO");
}
/*funcion para completar el proceso de compra  */
// Verifica login y muestra modal de pago
function procesarCompra() {
    const user = JSON.parse(localStorage.getItem("usuarioActual"));

    // Si no está logeado → abre modal login
    if (!user) {

        // CERRAR CARRITO AQUÍ 👇
        document.getElementById("carritoLateral").classList.remove("active");

        const modalOverlay = document.getElementById("modal-overlay");
        const modal = document.getElementById("modal");

        modalOverlay.classList.add("show");
        modal.classList.add("show");

        // Forzar vista login
        document.getElementById("loginView").style.display = "block";
        document.getElementById("registerView").style.display = "none";

        return;
    }

    // Si está logueado → abre modal de pago
    abrirModalPago();
}


// funcion de proceso de compra solo si hay productos en el carrito 
function procesarCompra() {
    const carrito = cargarCarrito();

    // ❗ Si el carrito está vacío → NO dejar abrir modal de pago
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega productos para continuar.");
        return;
    }

    const user = JSON.parse(localStorage.getItem("usuarioActual"));

    // Si no está logeado → abre modal login
    if (!user) {
        // CERRAR CARRITO AQUÍ 👇
        document.getElementById("carritoLateral").classList.remove("active");

        const modalOverlay = document.getElementById("modal-overlay");
        const modal = document.getElementById("modal");

        modalOverlay.classList.add("show");
        modal.classList.add("show");

        // Forzar vista login
        document.getElementById("loginView").style.display = "block";
        document.getElementById("registerView").style.display = "none";

        return;
    }

    // Si está logueado → abre modal pago
    abrirModalPago();
}
document.addEventListener("DOMContentLoaded", () => {
    const modalPago = document.getElementById("modalPago");


    
// Cierre al hacer clic fuera del contenido
    if (modalPago) {
    modalPago.addEventListener("click", (e) => {
        if (e.target === modalPago) {
            cerrarModalPago();
        }
    });
}

});


// Abrir modal de pago
function abrirModalPago() {
    const carrito = cargarCarrito();

    if (carrito.length === 0) {
        return; // Evita abrir el modal si no hay productos
    }

    const modalPago = document.getElementById("modalPago");
    const total = calcularTotal();

    document.getElementById("totalPagar").textContent = total.toLocaleString("es-CO");
    modalPago.classList.remove("hidden");
}

// Cerrar modal pago
function cerrarModalPago() {
    document.getElementById("modalPago").classList.add("hidden");
}

// Confirmar pago
document.addEventListener("DOMContentLoaded", () => {
    const btnPagar = document.getElementById("btnConfirmarPago");

    if (btnPagar) {
        btnPagar.addEventListener("click", () => {
            // Simulación
            alert("Pago realizado con éxito ✔️");

            vaciarCarrito();
            cerrarModalPago();
            toggleCarrito(); // cerrar carrito
        });
    }
});
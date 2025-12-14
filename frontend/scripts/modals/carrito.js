// Carrito con local storage

// ===============================
// OBTENER STOCK DESDE BACKEND
// ===============================
async function obtenerStockProducto(idProducto) {
    const resp = await fetch(`http://localhost:3000/api/productos/${idProducto}/stock`);
    const data = await resp.json();
    return data.stock;
}

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

// ===============================
// AGREGAR AL CARRITO
// ===============================
async function agregarAlCarrito(producto) {
    let carrito = cargarCarrito();

    const existe = carrito.find(item => item.id_producto === producto.id_producto);
    if (existe) {

        const stock = await obtenerStockProducto(producto.id_producto);

        if (existe.cantidad >= stock) {
            alert("No hay más stock disponible.");
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

// ===============================
// SUMAR UNIDAD
// ===============================
async function agregarUnidad(id) {
    let carrito = cargarCarrito();
    const item = carrito.find(p => p.id_producto === id);

    if (!item) return;

    const stock = await obtenerStockProducto(id);

    if (item.cantidad >= stock) {
        alert("No hay más stock disponible.");
        return;
    }

    item.cantidad++;

    guardarCarrito(carrito);
    mostrarCarrito();
}

// ===============================
// RESTAR UNIDAD
// ===============================
function restarUnidad(id) {
    let carrito = cargarCarrito();
    const item = carrito.find(p => p.id_producto === id);
    if (!item) return;

    if (item.cantidad > 1) {
        item.cantidad--;
    }
    guardarCarrito(carrito);
    mostrarCarrito();
}

// ===============================
// ELIMINAR PRODUCTO
// ===============================
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

// Calcular total
function calcularTotal() {
    return cargarCarrito().reduce((acc, p) => acc + p.precio * p.cantidad, 0);
}

// ===============================
// MOSTRAR CARRITO
// ===============================
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

/* ===============================
   PROCESO DE COMPRA
   =============================== */

function procesarCompra() {
    const carrito = cargarCarrito();

    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega productos para continuar.");
        return;
    }

    const user = JSON.parse(localStorage.getItem("usuarioActual"));

    if (!user) {
        document.getElementById("carritoLateral").classList.remove("active");

        const modalOverlay = document.getElementById("modal-overlay");
        const modal = document.getElementById("modal");

        modalOverlay.classList.add("show");
        modal.classList.add("show");

        document.getElementById("loginView").style.display = "block";
        document.getElementById("registerView").style.display = "none";

        return;
    }

    abrirModalPago();
}

document.addEventListener("DOMContentLoaded", () => {
    const modalPago = document.getElementById("modalPago");

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
    if (carrito.length === 0) return;

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
        btnPagar.addEventListener("click", async () => {

            const user = JSON.parse(localStorage.getItem("usuarioActual"));
            const carrito = cargarCarrito();

            if (!user) {
                alert("Debes iniciar sesión para completar el pago.");
                return;
            }

            if (carrito.length === 0) {
                alert("Tu carrito está vacío.");
                return;
            }

            try {
                const respuesta = await fetch("http://localhost:3000/api/ventas", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_usuario: user.id_usuario,
                        carrito: carrito
                    })
                });

                const data = await respuesta.json();

                if (respuesta.ok) {
                    alert("Pago realizado con éxito ✔️");
                    vaciarCarrito();
                    cerrarModalPago();
                    toggleCarrito();
                } else {
                    alert("Error al procesar la venta: " + data.error);
                }

            } catch (error) {
                console.error("Error en el pago:", error);
                alert("Error en el servidor.");
            }
        });
    }
});

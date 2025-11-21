// ===============================
// CARRITO CON LOCALSTORAGE
// ===============================
// Abrir / cerrar panel lateral
function toggleCarrito() {
    document.getElementById("sidebarCarrito").classList.toggle("active");
    mostrarCarrito(); // refresca los datos al abrir
}

// Cargar carrito desde localStorage
function cargarCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

// Guardar carrito
function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Agregar producto al carrito
function agregarAlCarrito(producto) {
    let carrito = cargarCarrito();

    const productoExistente = carrito.find(item => item.id_producto === producto.id_producto);

    if (productoExistente) {
        productoExistente.cantidad++;
        productoExistente.subtotal = productoExistente.cantidad * productoExistente.precio;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1,
            subtotal: producto.precio
        });
    }

    guardarCarrito(carrito);
    mostrarCarrito();
}

// Quitar una unidad
function restarProducto(id_producto) {
    let carrito = cargarCarrito();

    const item = carrito.find(p => p.id_producto === id_producto);

    if (!item) return;

    item.cantidad--;
    item.subtotal = item.cantidad * item.precio;

    if (item.cantidad <= 0) {
        carrito = carrito.filter(p => p.id_producto !== id_producto);
    }

    guardarCarrito(carrito);
    mostrarCarrito();
}

// Eliminar completamente un producto
function eliminarProducto(id_producto) {
    let carrito = cargarCarrito().filter(p => p.id_producto !== id_producto);

    guardarCarrito(carrito);
    mostrarCarrito();
}

// Calcular total
function calcularTotal() {
    const carrito = cargarCarrito();
    return carrito.reduce((sum, p) => sum + p.subtotal, 0);
}

//vaciar carrito 
function vaciarCarrito() {
    localStorage.removeItem("carrito");
    mostrarCarrito();
}



// Mostrar carrito en HTML
function mostrarCarrito() {
    const carrito = cargarCarrito();
    const contenedor = document.getElementById("carritoItems");
    const totalElemento = document.getElementById("totalCarrito");

    if (!contenedor) return; // protege si el HTML no tiene panel

    contenedor.innerHTML = "";

    carrito.forEach(p => {
        contenedor.innerHTML += `
            <div class="carrito-item">
                <img src="${p.imagen}">
                <div>
                    <p>${p.nombre_producto}</p>
                    <p>$${p.precio}</p>
                    <p>Cantidad: ${p.cantidad}</p>
                </div>

                <button onclick='agregarAlCarrito(${JSON.stringify(p)})'>+</button>
                <button onclick='restarProducto(${p.id_producto})'>-</button>
                <button onclick='eliminarProducto(${p.id_producto})'>🗑️</button>
            </div>
        `;
    });
    totalElemento.innerText = calcularTotal();
}
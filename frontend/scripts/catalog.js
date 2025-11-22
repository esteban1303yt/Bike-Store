const API = "http://localhost:3000/api";

// Elementos HTML
const contenedor = document.getElementById("product-container");
const searchInput = document.getElementById("searchInput");

// Dropdowns
const listaMarcas = document.getElementById("listaMarcas");
const btnMarcas = document.getElementById("btnMarcas");

const listaCategorias = document.getElementById("listaCategorias");
const btnCategorias = document.getElementById("btnCategorias");

const listaOrdenar = document.getElementById("listaOrdenar");
const btnOrdenar = document.getElementById("btnOrdenar");




// ===============================
// AGREGAR AL CARRITO
// ===============================
function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // ¿El producto ya está en el carrito?
    const itemExistente = carrito.find(item => item.id_producto === producto.id_producto);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Actualizar el carrito visual inmediatamente
    if (typeof renderizarCarrito === "function") {
        renderizarCarrito();
    }

    // Abrir el carrito al agregar
    toggleCarrito();
}





// Cache de productos
let productosCache = [];

// ==========================================
// Cargar Productos
// ==========================================
async function cargarProductos() {
    try {
        const res = await fetch(`${API}/productos`);
        const productos = await res.json();
        productosCache = productos;
        renderizarProductos(productos);
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

// ==========================================
// Renderizar Productos
// ==========================================
function renderizarProductos(productos) {
    if (!productos || productos.length === 0) {
        contenedor.innerHTML = `<div class="product-grid-empty">No se encontraron productos.</div>`;
        return;
    }

    const html = productos.map(p => `
        <article class="product-card">
            <div class="badge">${p.stock > 0 ? "Disponible" : "Agotado"}</div>
            <div class="year">${p.year ?? 2025}</div>
            <img src="/frontend/media/img/products/${p.imagen ?? "default.png"}" alt="${p.nombre_producto}">
            <div class="product-desc">
                <div class="card-info">
                    <div class="texto-principal">
                        <h3>${p.nombre_producto}</h3>
                        <p class="subtitle">${p.descripcion ?? ""}</p>
                    </div>
                    <p class="price">$ ${Number(p.precio).toLocaleString("es-CO")}</p>
                </div>
                <button class="btn-add-cart"
    onclick='agregarAlCarrito({
        id_producto: ${p.id_producto},
        nombre_producto: "${p.nombre_producto}",
        precio: Number(${p.precio}),
        imagen: "${p.imagen}"
    })'>
    Agregar al carrito
</button>


            </div>
        </article>
    `).join("");

    contenedor.innerHTML = html;
}

// ==========================================
// Cargar filtros (marcas y categorías)
// ==========================================
async function cargarFiltros() {
    // Marcas
    try {
        const resMarca = await fetch(`${API}/marcas`);
        const marcas = await resMarca.json();
        listaMarcas.innerHTML = marcas.map(m => `
            <label>
                <input type="checkbox" class="checkbox-marca" value="${m.id_marca}">
                ${m.nombre_marca}
            </label>
        `).join("");
    } catch (error) {
        console.error("Error cargando marcas:", error);
    }

    // Categorías
    try {
        const resCat = await fetch(`${API}/categorias`);
        const categorias = await resCat.json();
        listaCategorias.innerHTML = categorias.map(c => `
            <label>
                <input type="checkbox" class="checkbox-categoria" value="${c.id_categoria}">
                ${c.nombre_categoria}
            </label>
        `).join("");
    } catch (error) {
        console.error("Error cargando categorías:", error);
    }
}

// ==========================================
// Toggle acordeón
// ==========================================
function toggleDropdown(btn, lista) {
    lista.classList.toggle("active");
    btn.querySelector(".toggle-icon").textContent = lista.classList.contains("active") ? "-" : "+";
}

btnMarcas.addEventListener("click", () => toggleDropdown(btnMarcas, listaMarcas));
btnCategorias.addEventListener("click", () => toggleDropdown(btnCategorias, listaCategorias));
btnOrdenar.addEventListener("click", () => toggleDropdown(btnOrdenar, listaOrdenar));

// Cerrar dropdowns si clic afuera
document.addEventListener("click", (e) => {
    if (!e.target.closest(".filter-box")) {
        listaMarcas.classList.remove("active");
        listaCategorias.classList.remove("active");
        listaOrdenar.classList.remove("active");
        btnMarcas.querySelector(".toggle-icon").textContent = "+";
        btnCategorias.querySelector(".toggle-icon").textContent = "+";
        btnOrdenar.querySelector(".toggle-icon").textContent = "+";
    }
});

// ==========================================
// Aplicar filtros, búsqueda y orden
// ==========================================
function aplicarFiltros() {
    let filtrados = [...productosCache];

    // Filtrar por marcas
    const checkMarcas = Array.from(document.querySelectorAll(".checkbox-marca:checked")).map(cb => cb.value);
    if (checkMarcas.length > 0) filtrados = filtrados.filter(p => checkMarcas.includes(String(p.id_marca)));

    // Filtrar por categorías
    const checkCategorias = Array.from(document.querySelectorAll(".checkbox-categoria:checked")).map(cb => cb.value);
    if (checkCategorias.length > 0) filtrados = filtrados.filter(p => checkCategorias.includes(String(p.id_categoria)));

    // Búsqueda
    const textoBusqueda = searchInput.value.trim().toLowerCase();
    if (textoBusqueda !== "") {
        filtrados = filtrados.filter(p =>
            p.nombre_producto.toLowerCase().includes(textoBusqueda) ||
            (p.descripcion && p.descripcion.toLowerCase().includes(textoBusqueda)) ||
            (p.nombre_marca && p.nombre_marca.toLowerCase().includes(textoBusqueda))
        );
    }

    // Ordenar
    const ordenSeleccionado = document.querySelector('input[name="ordenar"]:checked')?.value;
    switch (ordenSeleccionado) {
        case "precio-asc":
            filtrados.sort((a, b) => a.precio - b.precio);
            break;
        case "precio-desc":
            filtrados.sort((a, b) => b.precio - a.precio);
            break;
        case "nombre-asc":
            filtrados.sort((a, b) => a.nombre_producto.localeCompare(b.nombre_producto));
            break;
        case "nombre-desc":
            filtrados.sort((a, b) => b.nombre_producto.localeCompare(a.nombre_producto));
            break;
        case "anio-asc":
            filtrados.sort((a, b) => (a.year ?? 2025) - (b.year ?? 2025));
            break;
        case "anio-desc":
            filtrados.sort((a, b) => (b.year ?? 2025) - (a.year ?? 2025));
            break;
    }

    renderizarProductos(filtrados);
}

// ==========================================
// Escuchar cambios
// ==========================================
document.addEventListener("change", aplicarFiltros);
searchInput.addEventListener("input", aplicarFiltros);

// ==========================================
// Inicializar
// ==========================================
cargarFiltros();
cargarProductos();
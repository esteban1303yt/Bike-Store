const API = "http://localhost:3000/api";

// Elementos HTML
const contenedor = document.getElementById("product-container");
const searchInput = document.getElementById("searchInput");

// Dropdown Marcas
const listaMarcas = document.getElementById("listaMarcas");
const btnMarcas = document.getElementById("btnMarcas");

// Dropdown Categorías
const listaCategorias = document.getElementById("listaCategorias");
const btnCategorias = document.getElementById("btnCategorias");

// Inputs precio
const precioMin = document.getElementById("precioMin");
const precioMax = document.getElementById("precioMax");

// Variable global para todos los productos
let productosTodos = [];

// ==========================
// Cargar Productos
// ==========================
async function cargarProductos() {
    try {
        const res = await fetch(`${API}/productos`);
        productosTodos = await res.json();
        renderizarProductos(productosTodos);
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

// ==========================
// Renderizar Productos
// ==========================
function renderizarProductos(productos) {
    let html = "";

    if (productos.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron productos.</p>";
        return;
    }

    productos.forEach(producto => {
        html += `
        <article class="product-card">
            <div class="badge">${producto.stock > 0 ? "Disponible" : "Agotado"}</div>
            <div class="year">2025</div>
            <img src="/frontend/media/img/products/${producto.imagen ?? "default.png"}"
                alt="${producto.nombre_producto}">
            <div class="card-info">
                <div class="texto-principal">
                    <h3>${producto.nombre_producto}</h3>
                    <p class="subtitle">${producto.descripcion ?? ""}</p>
                </div>
                <p class="price">$ ${Number(producto.precio).toLocaleString("es-CO")}</p>
            </div>
        </article>
        `;
    });

    contenedor.innerHTML = html;
}

// ==========================
// Búsqueda en tiempo real
// ==========================
searchInput.addEventListener("input", () => {
    aplicarFiltros();
});

// ==========================
// Cargar Marcas
// ==========================
async function cargarMarcas() {
    try {
        const res = await fetch(`${API}/marcas`);
        const marcas = await res.json();
        listaMarcas.innerHTML = "";
        marcas.forEach(m => {
            listaMarcas.innerHTML += `
                <label>
                    <input type="checkbox" class="checkbox-marca" value="${m.id_marca}">
                    ${m.nombre_marca}
                </label>
            `;
        });

        // Agregar event listener a cada checkbox
        document.querySelectorAll(".checkbox-marca").forEach(cb => {
            cb.addEventListener("change", aplicarFiltros);
        });
    } catch (error) {
        console.error("Error cargando marcas:", error);
    }
}

// Dropdown funcional Marcas
btnMarcas.addEventListener("click", () => {
    listaMarcas.style.display =
        listaMarcas.style.display === "block" ? "none" : "block";
});

// ==========================
// Cargar Categorías
// ==========================
async function cargarCategorias() {
    try {
        const res = await fetch(`${API}/categorias`);
        const categorias = await res.json();
        listaCategorias.innerHTML = "";
        categorias.forEach(c => {
            listaCategorias.innerHTML += `
                <label>
                    <input type="checkbox" class="checkbox-categoria" value="${c.id_categoria}">
                    ${c.nombre_categoria}
                </label>
            `;
        });

        // Agregar event listener a cada checkbox
        document.querySelectorAll(".checkbox-categoria").forEach(cb => {
            cb.addEventListener("change", aplicarFiltros);
        });
    } catch (error) {
        console.error("Error cargando categorías:", error);
    }
}

// Dropdown funcional Categorías
btnCategorias.addEventListener("click", () => {
    listaCategorias.style.display =
        listaCategorias.style.display === "block" ? "none" : "block";
});

// ==========================
// Cerrar dropdowns si clic afuera
// ==========================
document.addEventListener("click", (e) => {
    if (!e.target.closest(".filter-box")) {
        listaMarcas.style.display = "none";
        listaCategorias.style.display = "none";
    }
});

// ==========================
// Aplicar filtros en tiempo real
// ==========================
function aplicarFiltros() {
    let filtrados = [...productosTodos];

    const textoBusqueda = searchInput.value.trim().toLowerCase();

    // Filtrar por búsqueda
    if (textoBusqueda !== "") {
        filtrados = filtrados.filter(p =>
            p.nombre_producto.toLowerCase().includes(textoBusqueda) ||
            (p.descripcion && p.descripcion.toLowerCase().includes(textoBusqueda)) ||
            (p.nombre_marca && p.nombre_marca.toLowerCase().includes(textoBusqueda))
        );
    }

    // Filtrar por marcas
    const marcasSeleccionadas = Array.from(document.querySelectorAll(".checkbox-marca:checked"))
                                    .map(cb => cb.value);
    if (marcasSeleccionadas.length > 0) {
        filtrados = filtrados.filter(p =>
            marcasSeleccionadas.includes(String(p.id_marca))
        );
    }

    // Filtrar por categorías
    const categoriasSeleccionadas = Array.from(document.querySelectorAll(".checkbox-categoria:checked"))
                                    .map(cb => cb.value);
    if (categoriasSeleccionadas.length > 0) {
        filtrados = filtrados.filter(p =>
            categoriasSeleccionadas.includes(String(p.id_categoria))
        );
    }

    // Filtrar por precio
    const min = precioMin.value;
    const max = precioMax.value;
    if (min !== "") filtrados = filtrados.filter(p => p.precio >= Number(min));
    if (max !== "") filtrados = filtrados.filter(p => p.precio <= Number(max));

    renderizarProductos(filtrados);
}

// ==========================
// Precio inputs
// ==========================
precioMin.addEventListener("input", aplicarFiltros);
precioMax.addEventListener("input", aplicarFiltros);

// ==========================
// Inicializar
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    cargarMarcas();
    cargarCategorias();
    cargarProductos();
});
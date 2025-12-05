// ===============================
// FAVORITOS - LOCALSTORAGE
// ===============================

// Abrir/Cerrar Modal
function toggleFavoritos() {
    document.getElementById("modalFavoritos").classList.toggle("hidden");
    renderizarFavoritos();
}

// Agregar a favoritos
function agregarAFavoritos(producto) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    // evitar repetidos
    if (!favoritos.some(f => f.id_producto === producto.id_producto)) {
        favoritos.push(producto);
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

// Renderizar favoritos
function renderizarFavoritos() {
    const cont = document.getElementById("favoritosItems");
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    if (favoritos.length === 0) {
        cont.innerHTML = `<p style="text-align:center;color:#aaa;">No tienes favoritos aún.</p>`;
        return;
    }

    cont.innerHTML = favoritos.map(p => {
        const imgSrc = (p.imagen && p.imagen !== "default.svg")
            ? `/frontend/media/img/products/${p.imagen}`
            : `/frontend/media/img/default.svg`;

        return `
            <div class="fav-item">
                <img src="${imgSrc}">
                <div class="fav-item-info">
                    <h4>${p.nombre_producto || p.nombre}</h4>
                    <p>$${p.precio}</p>
                </div>
                <button class="fav-remove" onclick="eliminarFavorito(${p.id_producto})">X</button>
            </div>
        `;
    }).join("");
}

// Eliminar un favorito
function eliminarFavorito(id) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    favoritos = favoritos.filter(f => f.id_producto !== id);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    renderizarFavoritos();
}

// Vaciar todos
function vaciarFavoritos() {
    localStorage.removeItem("favoritos");
    renderizarFavoritos();
}

function agregarAFavoritos(id_producto) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    // Buscar el producto completo en productosCache
    const producto = productosCache.find(p => p.id_producto == id_producto);

    if (!producto) {
        console.error("Producto no encontrado:", id_producto);
        return;
    }

    // Ver si ya existe
    const existe = favoritos.some(f => f.id_producto == id_producto);

    if (existe) {
        // Si ya existe -> eliminar
        favoritos = favoritos.filter(f => f.id_producto != id_producto);
    } else {
        // Si no existe -> agregar el OBJETO COMPLETO
        favoritos.push(producto);
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));

    // Actualizar corazones
    renderizarProductos(productosCache);
}

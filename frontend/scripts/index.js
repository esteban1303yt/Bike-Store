async function cargarProductos() {
    try {
        const res = await fetch("http://localhost:3000/api/productos");
        const productos = await res.json();

        let html = "";

        productos.forEach(producto => {

            html += `
            <article class="product-card">
                <div class="badge">${producto.stock > 0 ? "Disponible" : "Agotado"}</div>
                <div class="year">2025</div>

                <img src="/frontend/media/img/bikes/bicicleta1.webp" alt="${producto.nombre_producto}">

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

        document.getElementById("product-container").innerHTML = html;

    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

cargarProductos();
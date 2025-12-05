document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.querySelector(".productos-grid");

    try {
        const res = await fetch("http://localhost:3000/api/productos");
        const productos = await res.json();

        // Mezclar array aleatoriamente
        const aleatorios = productos
            .sort(() => Math.random() - 0.5) // desordenar
            .slice(0, 4); // tomar 4

        contenedor.innerHTML = "";

        aleatorios.forEach(prod => {
            const imgSrc = (prod.imagen && prod.imagen !== "default.svg")
                ? `/frontend/media/img/products/${prod.imagen}`
                : `/frontend/media/img/default.svg`;


            contenedor.innerHTML += `
                <div class="producto">
                    <img src="${imgSrc}" alt="${prod.nombre_producto}">
                    <div class="info-producto">
                        <p>${prod.nombre_producto}</p>
                        <p>$${Number(prod.precio).toLocaleString()}</p>
                        <a href="#" class="btn">Añadir al carrito</a>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error cargando productos:", error);
    }
});
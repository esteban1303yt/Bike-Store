const apiURL = 'http://localhost:3000/api/productos';

// =======================
// CARGAR PRODUCTOS
// =======================
async function cargarProductos() {
    try {
        const res = await fetch(apiURL);
        const productos = await res.json();

        const tbody = document.querySelector("#tablaProductos tbody");
        if (!tbody) return;

        tbody.innerHTML = '';

        productos.forEach(producto => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${producto.id_producto}</td>
                <td>${producto.id_categoria || ''}</td>
                <td>${producto.id_marca || ''}</td>

                <td><input type="text" id="nombre-${producto.id_producto}" value="${producto.nombre_producto}"></td>
                <td><input type="number" id="precio-${producto.id_producto}" value="${producto.precio}"></td>
                <td><input type="number" id="stock-${producto.id_producto}" value="${producto.stock}"></td>

                <td>
                    <button class="editarBtn" data-id="${producto.id_producto}">Editar</button>
                    <button class="eliminarBtn" data-id="${producto.id_producto}">Eliminar</button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        // Eventos de botones
        document.querySelectorAll(".editarBtn").forEach(btn => {
            btn.onclick = () => abrirModal(btn.dataset.id);
        });

        document.querySelectorAll(".eliminarBtn").forEach(btn => {
            btn.onclick = () => eliminarProducto(btn.dataset.id);
        });

    } catch (error) {
        console.error("Error cargando productos", error);
    }
}



// =======================
// ELIMINAR PRODUCTO
// =======================
let productoAEliminar = null;

function eliminarProducto(id) {
    productoAEliminar = id;
    document.getElementById("modalEliminar").style.display = "flex";
}

// Cancelar
document.getElementById("cancelEliminar").onclick = () => {
    productoAEliminar = null;
    document.getElementById("modalEliminar").style.display = "none";
};

// Confirmar eliminación
document.getElementById("confirmEliminar").onclick = async () => {
    if (!productoAEliminar) return;

    try {
        await fetch(`${apiURL}/${productoAEliminar}`, { method: "DELETE" });

        await cargarProductos();
        document.getElementById("modalEliminar").style.display = "none";
        productoAEliminar = null;

    } catch (error) {
        console.error("Error eliminando producto", error);
    }
};



// =======================
// ABRIR MODAL DE EDICIÓN
// =======================
async function abrirModal(id) {
    const nombre = document.getElementById(`nombre-${id}`).value;
    const precio = document.getElementById(`precio-${id}`).value;
    const stock = document.getElementById(`stock-${id}`).value;

    document.getElementById("editId").value = id;
    document.getElementById("editNombre").value = nombre;
    document.getElementById("editPrecio").value = precio;
    document.getElementById("editStock").value = stock;

    const res = await fetch(`${apiURL}/${id}`);
    const data = await res.json();

    document.getElementById("editDescripcion").value = data.descripcion || "";

    // Imagen previa
    const preview = document.getElementById("editImagenPreview");
    if (preview) {
        preview.src = data.imagen
            ? `/frontend/media/img/products/${data.imagen}`
            : `/frontend/media/img/products/default.png`;
    }

    document.getElementById("modalEditar").style.display = "flex";
}



// =======================
// CERRAR MODAL
// =======================
document.getElementById("cerrarModal").onclick = () => {
    document.getElementById("modalEditar").style.display = "none";
};



// =======================
// GUARDAR CAMBIOS
// =======================
document.getElementById("guardarBtn").onclick = async () => {
    const id = document.getElementById("editId").value;

    const imagenFile = document.getElementById("editImagen").files[0];
    const imagenNombre = imagenFile ? imagenFile.name.toLowerCase() : null;

    const body = {
        nombre_producto: document.getElementById("editNombre").value,
        precio: Number(document.getElementById("editPrecio").value),
        stock: Number(document.getElementById("editStock").value),
        descripcion: document.getElementById("editDescripcion").value,
        imagen: imagenNombre,
    };

    try {
        const res = await fetch(`${apiURL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) throw new Error("Error actualizando");

        await cargarProductos();
        document.getElementById("modalEditar").style.display = "none";

    } catch (err) {
        console.error(err);
        alert("No se pudo actualizar el producto");
    }
};



// =======================
// INICIALIZAR
// =======================
cargarProductos();

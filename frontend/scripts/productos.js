const apiURL = 'http://localhost:3000/api/productos';

// ================== Cargar productos ==================
async function cargarProductos() {
    const respuesta = await fetch(apiURL);
    const productos = await respuesta.json();

    const tbody = document.querySelector("#tablaProductos tbody");
    if(!tbody) return; // Previene errores si la tabla no existe aún

    tbody.innerHTML = '';

    productos.forEach(producto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${producto.id_producto}</td>
            <td>${producto.id_categoria || ''}</td>
            <td>${producto.id_marca || ''}</td>
            <td><input type="text" value="${producto.nombre_producto}" id="nombre-${producto.id_producto}"></td>
            <td><input type="number" value="${producto.precio}" id="precio-${producto.id_producto}"></td>
            <td><input type="number" value="${producto.stock}" id="stock-${producto.id_producto}"></td>
            <td>
                <button class="editarBtn" data-id="${producto.id_producto}">Editar</button>
                <button class="eliminarBtn" data-id="${producto.id_producto}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Delegar eventos de botones
    document.querySelectorAll(".editarBtn").forEach(btn => {
        btn.onclick = () => abrirModal(btn.dataset.id);
    });
    document.querySelectorAll(".eliminarBtn").forEach(btn => {
        btn.onclick = () => eliminarProducto(btn.dataset.id);
    });
}

// ================== Eliminar producto ==================
let productoAEliminar = null; // Guardamos el ID temporalmente

async function eliminarProducto(id) {
    productoAEliminar = id;
    document.getElementById("modalEliminar").style.display = "flex";
}

// Cancelar eliminación
document.getElementById("cancelEliminar").onclick = () => {
    productoAEliminar = null;
    document.getElementById("modalEliminar").style.display = "none";
};

// Confirmar eliminación
document.getElementById("confirmEliminar").onclick = async () => {
    if (!productoAEliminar) return;

    await fetch(`${apiURL}/${productoAEliminar}`, { method: 'DELETE' });
    await cargarProductos();

    productoAEliminar = null;
    document.getElementById("modalEliminar").style.display = "none";
};

// ================== Abrir modal ==================
async function abrirModal(id) {
    const nombre = document.getElementById("nombre-" + id).value;
    const precio = document.getElementById("precio-" + id).value;
    const stock = document.getElementById("stock-" + id).value;

    document.getElementById("editId").value = id;
    document.getElementById("editNombre").value = nombre;
    document.getElementById("editPrecio").value = precio;
    document.getElementById("editStock").value = stock;

    const res = await fetch(`${apiURL}/${id}`);
    const data = await res.json();

    document.getElementById("editDescripcion").value = data.descripcion || "";
    
    // Mostrar imagen actual
    document.getElementById("editImagenPreview").src = data.imagen
        ? `/frontend/media/img/products/${data.imagen}`
        : `/frontend/media/img/products/default.png`;

    document.getElementById("modalEditar").style.display = "flex";
}

// ================== Cerrar modal ==================
document.getElementById("cerrarModal").onclick = () => {
    document.getElementById("modalEditar").style.display = "none";
};

// ================== Guardar cambios ==================
document.getElementById("guardarBtn").onclick = async () => {
    try {
        const id = document.getElementById("editId").value;

        const imagenInput = document.getElementById("editImagen");
        let imagenNombre = null;

        if (imagenInput.files.length > 0) {
            const file = imagenInput.files[0];
            imagenNombre = file.name.toLowerCase();
            // Aquí podrías implementar subir la imagen al servidor si tienes endpoint
        }

        const datos = {
            nombre_producto: document.getElementById("editNombre").value,
            precio: Number(document.getElementById("editPrecio").value),
            stock: Number(document.getElementById("editStock").value),
            descripcion: document.getElementById("editDescripcion").value,
            imagen: imagenNombre // nueva propiedad imagen
        };

        const respuesta = await fetch(`${apiURL}/${id}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) throw new Error("Error al actualizar producto");

        // Recargar tabla y cerrar modal
        await cargarProductos();
        document.getElementById("modalEditar").style.display = "none";

    } catch (error) {
        console.error(error);
        alert("No se pudo actualizar el producto");
    }
};

// ================== Inicialización ==================
cargarProductos();

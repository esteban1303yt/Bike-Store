const apiURL = 'http://localhost:3000/api/productos';

// Cargar productos
async function cargarProductos() {
    const respuesta = await fetch(apiURL);
    const productos = await respuesta.json();

    const tbody = document.querySelector("#tablaProductos tbody");
    tbody.innerHTML = '';

    productos.forEach(producto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${producto.id_producto}</td>
            <td><input type="text" value="${producto.nombre_producto}" id="nombre-${producto.id_producto}"></td>
            <td><input type="number" value="${producto.precio}" id="precio-${producto.id_producto}"></td>
            <td><input type="number" value="${producto.stock}" id="stock-${producto.id_producto}"></td>
            <td>
                <button onclick="abrirModal(${producto.id_producto})">Editar</button>
                <button onclick="eliminarProducto(${producto.id_producto})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Eliminar producto
async function eliminarProducto(id) {
    if (confirm("¿Deseas eliminar este producto?")) {
        await fetch(`${apiURL}/${id}`, { method: 'DELETE' });
        cargarProductos();
    }
}

// Abrir modal
async function abrirModal(id) {

    // Tomar datos de la tabla
    const nombre = document.getElementById("nombre-" + id).value;
    const precio = document.getElementById("precio-" + id).value;
    const stock = document.getElementById("stock-" + id).value;

    // Llenar los inputs del modal
    document.getElementById("editId").value = id;
    document.getElementById("editNombre").value = nombre;
    document.getElementById("editPrecio").value = precio;
    document.getElementById("editStock").value = stock;

    // Obtener la descripción REAL desde la BD
    const res = await fetch(`${apiURL}/${id}`);
    const data = await res.json();
    document.getElementById("editDescripcion").value = data.descripcion || "";

    // Mostrar modal
    document.getElementById("modalEditar").style.display = "flex";
}

// Cerrar modal
document.getElementById("cerrarModal").onclick = () => {
    document.getElementById("modalEditar").style.display = "none";
};

// Guardar cambios
async function guardarCambios() {
    try {
        console.log("Guardar cambios clickeado");

        const id = document.getElementById("editId").value;

        const datos = {
            nombre_producto: document.getElementById("editNombre").value,
            precio: Number(document.getElementById("editPrecio").value),
            stock: Number(document.getElementById("editStock").value),
            descripcion: document.getElementById("editDescripcion").value
        };

        const respuesta = await fetch(`${apiURL}/${id}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            throw new Error(`Error al actualizar producto: ${respuesta.statusText}`);
        }

        // Actualizar solo los inputs de la fila editada
        document.getElementById(`nombre-${id}`).value = datos.nombre_producto;
        document.getElementById(`precio-${id}`).value = datos.precio;
        document.getElementById(`stock-${id}`).value = datos.stock;

        // Cerrar modal
        document.getElementById("modalEditar").style.display = "none";
    } catch (error) {
        console.error(error);
        alert("No se pudo actualizar el producto. Revisa la consola para más detalles.");
    }
}

// Cargar al inicio
cargarProductos();

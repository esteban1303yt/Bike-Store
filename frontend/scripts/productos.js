const apiURL = 'http://localhost:3000/api/productos';

// Función para obtener productos
async function cargarProductos() {
    const respuesta = await fetch(apiURL);
    const productos = await respuesta.json();

    const tbody = document.querySelector("#tablaProductos tbody");
    tbody.innerHTML = '';

    productos.forEach(producto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${producto.id_producto}</td>
            <td>${producto.nombre_producto}</td>
            <td>${producto.precio}</td>
            <td>${producto.stock}</td>
            <td>
                <button onclick="editarProducto(${producto.id_producto})">Editar</button>
                <button onclick="eliminarProducto(${producto.id_producto})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para eliminar producto
async function eliminarProducto(id) {
    if (confirm('¿Deseas eliminar este producto?')) {
        await fetch(`${apiURL}/${id}`, { method: 'DELETE' });
        cargarProductos();
    }
}

// Función para editar producto
function editarProducto(id) {
    const nuevoNombre = prompt('Nuevo nombre:');
    const nuevoPrecio = prompt('Nuevo precio:');
    const nuevoStock = prompt('Nuevo stock:');

    if (nuevoNombre && nuevoPrecio && nuevoStock) {
        fetch(`${apiURL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre_producto: nuevoNombre,
                precio: nuevoPrecio,
                stock: nuevoStock
            })
        }).then(() => cargarProductos());
    }
}

// Función para crear producto
function crearProducto() {
    const nombre = prompt('Nombre del producto:');
    const precio = prompt('Precio:');
    const stock = prompt('Stock:');

    if (nombre && precio && stock) {
        fetch(apiURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre_producto: nombre,
                precio: precio,
                stock: stock
            })
        }).then(() => cargarProductos());
    }
}

// Cargar productos al inicio
cargarProductos();
const contenido = document.getElementById('contenido');

document.getElementById('menu-dashboard').addEventListener('click', () => {
    contenido.innerHTML = '<h2>Panel de Inicio</h2><p>Selecciona un módulo del menú lateral.</p>';
});

document.getElementById('menu-productos').addEventListener('click', () => {
    mostrarProductos();
});

document.getElementById('menu-usuarios').addEventListener('click', () => {
    contenido.innerHTML = '<h2>Usuarios</h2><p>Módulo en construcción</p>';
});

document.getElementById('menu-ventas').addEventListener('click', () => {
    contenido.innerHTML = '<h2>Ventas</h2><p>Módulo en construcción</p>';
});

// Función para mostrar productos como tarjetas
async function mostrarProductos() {
    try {
        const res = await fetch('http://localhost:3000/api/productos'); // URL completa
        const productos = await res.json();

        let html = `<h2>Productos Registrados</h2><div class="tarjetas-container">`;

        productos.forEach(p => {
            html += `
                <div class="tarjeta">
                 <img src="/frontend/media/img/products/${p.imagen ?? "default.png"}" alt="${p.nombre_producto}">
                    <h3>${p.nombre_producto}</h3>
                    <p><strong>Precio:</strong> ${p.precio}</p>
                    <p><strong>Stock:</strong> ${p.stock}</p>
                    <p>${p.descripcion}</p>
                    <div class="acciones">
                        <button onclick="editarProducto(${p.id_producto})">Editar</button>
                        <button onclick="eliminarProducto(${p.id_producto})">Eliminar</button>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        contenido.innerHTML = html;

    } catch (error) {
        console.error('Error al cargar productos:', error);
        contenido.innerHTML = '<p>Error al cargar productos. Revisa la consola.</p>';
    }
}

// Función para eliminar producto
async function eliminarProducto(id) {
    if (confirm('¿Deseas eliminar este producto?')) {
        await fetch(`http://localhost:3000/api/productos/${id}`, { method: 'DELETE' });
        mostrarProductos();
    }
}

// Función para editar producto
function editarProducto(id) {
    const nuevoNombre = prompt('Nuevo nombre:');
    const nuevoPrecio = prompt('Nuevo precio:');
    const nuevoStock = prompt('Nuevo stock:');

    if(nuevoNombre && nuevoPrecio && nuevoStock) {
        fetch(`http://localhost:3000/api/productos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                nombre_producto: nuevoNombre, 
                precio: nuevoPrecio, 
                stock: nuevoStock 
            })
        }).then(() => mostrarProductos());
    }
}

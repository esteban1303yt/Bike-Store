const API_URL = 'http://localhost:3000/api';

// Elementos del DOM
const productoForm = document.getElementById('productoForm');
const productosContainer = document.getElementById('productosContainer');
const nombreInput = document.getElementById('nombre');
const descripcionInput = document.getElementById('descripcion');
const precioInput = document.getElementById('precio');
const imagenInput = document.getElementById('imagen');
const productoIdInput = document.getElementById('productoId');

// Verificar autenticación
document.addEventListener('DOMContentLoaded', () => {
    verificarSesion();
    cargarProductos();
});

// Verificar si el usuario está autenticado
function verificarSesion() {
    const usuarioId = localStorage.getItem('usuarioId');
    const usuarioNombre = localStorage.getItem('usuarioNombre');

    if (!usuarioId) {
        window.location.href = 'login.html';
    } else {
        document.getElementById('usuarioNombre').textContent = usuarioNombre;
    }
}

// Cerrar sesión
function cerrarSesion() {
    localStorage.clear();
    window.location.href = 'login.html';
}

document.getElementById('cerrarSesionBtn').addEventListener('click', cerrarSesion);

// Cargar productos desde la API
async function cargarProductos() {
    try {
        const response = await fetch(`${API_URL}/productos`);
        const productos = await response.json();
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// Mostrar productos en tarjetas
function mostrarProductos(productos) {
    productosContainer.innerHTML = '';

    productos.forEach(async producto => {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3');
        card.style.width = '18rem';

        // Cargar imagen del producto
        let imagenHTML = '';
        try {
            const response = await fetch(`${API_URL}/imagenes/obtener/productos/id_producto/${producto.id_producto}`);
            const data = await response.json();
            if (data && data.imagen) {
                imagenHTML = `<img src="data:image/jpeg;base64,${data.imagen}" class="card-img-top" alt="Imagen producto">`;
            }
        } catch (error) {
            console.error('Error al cargar imagen:', error);
        }

        card.innerHTML = `
            ${imagenHTML}
            <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">${producto.descripcion}</p>
                <p class="card-text"><strong>$${producto.precio}</strong></p>
                <button class="btn btn-warning btn-sm editarBtn" data-id="${producto.id_producto}">Editar</button>
                <button class="btn btn-danger btn-sm eliminarBtn" data-id="${producto.id_producto}">Eliminar</button>
            </div>
        `;

        productosContainer.appendChild(card);

        card.querySelector('.editarBtn').addEventListener('click', () => editarProducto(producto));
        card.querySelector('.eliminarBtn').addEventListener('click', () => eliminarProducto(producto.id_producto));
    });
}

// Guardar producto (nuevo o editado)
productoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = nombreInput.value;
    const descripcion = descripcionInput.value;
    const precio = parseFloat(precioInput.value);

    const producto = { nombre, descripcion, precio };

    try {
        let response;
        if (productoIdInput.value) {
            // Editar producto
            const id = productoIdInput.value;
            response = await fetch(`${API_URL}/productos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(producto)
            });

            if (imagenInput.files.length > 0) {
                await subirImagen(id);
            }
        } else {
            // Nuevo producto
            response = await fetch(`${API_URL}/productos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(producto)
            });

            const nuevoProducto = await response.json();
            if (imagenInput.files.length > 0) {
                await subirImagen(nuevoProducto.id_producto);
            }
        }

        limpiarFormulario();
        cargarProductos();
    } catch (error) {
        console.error('Error al guardar producto:', error);
    }
});

// Subir imagen a la API
async function subirImagen(id_producto) {
    const file = imagenInput.files[0];
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
            try {
                const imagenBase64 = reader.result.split(',')[1];
                await fetch(`${API_URL}/imagenes/insertar/productos/id_producto/${id_producto}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imagen: imagenBase64 })
                });
                resolve();
            } catch (error) {
                reject(error);
            }
        };
        reader.readAsDataURL(file);
    });
}

// Editar producto
async function editarProducto(producto) {
    productoIdInput.value = producto.id_producto;
    nombreInput.value = producto.nombre;
    descripcionInput.value = producto.descripcion;
    precioInput.value = producto.precio;

    try {
        const response = await fetch(`${API_URL}/imagenes/obtener/productos/id_producto/${producto.id_producto}`);
        const data = await response.json();
        if (data && data.imagen) {
            document.getElementById('previewImagen').src = `data:image/jpeg;base64,${data.imagen}`;
            document.getElementById('previewImagen').style.display = 'block';
        }
    } catch (error) {
        console.error('Error al cargar imagen:', error);
    }
}

// Eliminar producto
async function eliminarProducto(id) {
    try {
        if (confirm('¿Seguro que deseas eliminar este producto?')) {
            await fetch(`${API_URL}/productos/${id}`, {
                method: 'DELETE'
            });
            cargarProductos();
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
    }
}

// Limpiar formulario
function limpiarFormulario() {
    productoIdInput.value = '';
    nombreInput.value = '';
    descripcionInput.value = '';
    precioInput.value = '';
    imagenInput.value = '';
    document.getElementById('previewImagen').style.display = 'none';
}
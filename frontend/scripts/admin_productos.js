const apiURL = 'http://localhost:3000/api/productos';


// =======================
// CARGAR PRODUCTOS (TARJETAS COMPLETAS)
// =======================
async function cargarProductos() {
    try {
        const res = await fetch(apiURL);
        const productos = await res.json();

        const container = document.getElementById("productos-container");
        container.innerHTML = "";

        productos.forEach(producto => {
            const card = document.createElement("div");
            card.classList.add("product-card"); // ← corregido

            card.innerHTML = `
                <img src="/frontend/media/img/products/${producto.imagen}" class="producto-img">

                <div class="product-info">   <!-- ← corregido -->
                    <h3>${producto.nombre_producto}</h3>

                    <p><strong>Precio:</strong> $${producto.precio}</p>
                    <p><strong>Stock:</strong> ${producto.stock}</p>
                    <p class="descripcion">${producto.descripcion || "Sin descripción"}</p>
                </div>

                <div class="product-actions"> <!-- ← corregido -->
                    <button class="btn-editar" data-id="${producto.id_producto}">Editar</button>
                    <button class="btn-eliminar btn-delete" data-id="${producto.id_producto}">Eliminar</button>
                </div>
            `;

            container.appendChild(card);
        });

        activarBotones();

    } catch (error) {
        console.error("Error cargando productos", error);
    }
}



// =======================
// ACTIVAR BOTONES
// =======================
function activarBotones() {

    // EDITAR
    document.querySelectorAll(".btn-editar").forEach(btn => {
        btn.onclick = () => abrirModalEditar(btn.dataset.id);
    });

    // ELIMINAR
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.onclick = () => abrirModalEliminar(btn.dataset.id);
    });
}



// =======================
// ELIMINAR PRODUCTO
// =======================
let productoAEliminar = null;

function abrirModalEliminar(id) {
    productoAEliminar = id;
    document.getElementById("modalEliminar").style.display = "flex";
}

document.getElementById("cancelEliminar").onclick = () => {
    productoAEliminar = null;
    document.getElementById("modalEliminar").style.display = "none";
};

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
// ABRIR MODAL EDICIÓN
// =======================
async function abrirModalEditar(id) {

    const res = await fetch(`${apiURL}/${id}`);
    const data = await res.json();

    document.getElementById("editId").value = id;
    document.getElementById("editNombre").value = data.nombre_producto;
    document.getElementById("editPrecio").value = data.precio;
    document.getElementById("editStock").value = data.stock;
    document.getElementById("editDescripcion").value = data.descripcion || "";

    document.getElementById("editImagenPreview").src =
        `/frontend/media/img/products/${data.imagen}`;

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

    const body = new FormData();
    body.append("nombre_producto", document.getElementById("editNombre").value);
    body.append("precio", document.getElementById("editPrecio").value);
    body.append("stock", document.getElementById("editStock").value);
    body.append("descripcion", document.getElementById("editDescripcion").value);

    if (imagenFile) body.append("imagen", imagenFile);

    try {
        const res = await fetch(`${apiURL}/${id}`, {
            method: "PUT",
            body
        });

        if (!res.ok) throw new Error("Error actualizando producto");

        const data = await res.json();

        // CERRAR MODAL
        document.getElementById("modalEditar").style.display = "none";

        // 🔥 ACTUALIZAR AL INSTANTE SIN RECARGAR LA PÁGINA
        await cargarProductos();

    } catch (err) {
        console.error(err);
        alert("Error al actualizar el producto");
    }
};




// =======================
// CREAR PRODUCTO
// =======================

// Abrir modal
document.getElementById("btnCrearProducto").onclick = () => {
    document.getElementById("modalCrear").style.display = "flex";
};

// Cerrar modal
document.getElementById("cerrarModalCrear").onclick = () => {
    document.getElementById("modalCrear").style.display = "none";
};

const crearImagen = document.getElementById("crearImagen");
const crearPreview = document.getElementById("crearImagenPreview");

crearImagen.addEventListener("change", () => {
    const file = crearImagen.files[0];
    if (file) {
        crearPreview.src = URL.createObjectURL(file);
        crearPreview.style.display = "block";
    }
});


// =======================
// GUARDAR NUEVO PRODUCTO
// =======================
document.getElementById("btnGuardarNuevo").onclick = async () => {

    const body = new FormData();
    body.append("nombre_producto", document.getElementById("crearNombre").value);
    body.append("precio", document.getElementById("crearPrecio").value);
    body.append("stock", document.getElementById("crearStock").value);
    body.append("descripcion", document.getElementById("crearDescripcion").value);

    const imagenFile = document.getElementById("crearImagen").files[0];
    if (imagenFile) body.append("imagen", imagenFile);

    try {
        const res = await fetch(apiURL, {
            method: "POST",
            body
        });

        if (!res.ok) throw new Error("Error al crear producto");

        // Cerrar modal
        document.getElementById("modalCrear").style.display = "none";

        // Limpiar formulario
        document.getElementById("crearNombre").value = "";
        document.getElementById("crearPrecio").value = "";
        document.getElementById("crearStock").value = "";
        document.getElementById("crearDescripcion").value = "";
        document.getElementById("crearImagen").value = "";
        crearPreview.style.display = "none";

        // Recargar tarjetas
        await cargarProductos();

    } catch (err) {
        console.error(err);
        alert("Error al crear producto");
    }
};






// =======================
// INICIALIZAR
// =======================





cargarProductos();

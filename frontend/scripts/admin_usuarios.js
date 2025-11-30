const apiURL = "http://localhost:3000/api/usuarios";
const token = localStorage.getItem("token");

// =======================
// CARGAR USUARIOS
// =======================
async function cargarUsuarios() {
    try {
        const res = await fetch(apiURL, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const usuarios = await res.json();

        const tbody = document.querySelector("#tablaUsuarios tbody");
        tbody.innerHTML = "";

        usuarios.forEach(user => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${user.id_usuario}</td>
                <td>${user.nombre} ${user.apellido}</td>
                <td>${user.correo}</td>
                <td>${user.telefono}</td>

                <td>
                    <select disabled>
                        <option value="cliente" ${user.rol === "cliente" ? "selected" : ""}>Cliente</option>
                        <option value="administrador" ${user.rol === "administrador" ? "selected" : ""}>Administrador</option>
                    </select>
                </td>

                <td>
                    <button class="editarBtn" data-id="${user.id_usuario}" data-rol="${user.rol}">Editar Rol</button>
                    <button class="eliminarBtn" data-id="${user.id_usuario}">Eliminar</button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        // Activar botones
        document.querySelectorAll(".editarBtn").forEach(btn => {
            btn.onclick = () => abrirModalEditar(btn.dataset.id, btn.dataset.rol);
        });

        document.querySelectorAll(".eliminarBtn").forEach(btn => {
            btn.onclick = () => eliminarUsuario(btn.dataset.id);
        });

    } catch (err) {
        console.error("Error cargando usuarios", err);
    }
}


// =======================
// MODAL EDITAR ROL
// =======================
function abrirModalEditar(id, rolActual) {
    document.getElementById("editId").value = id;
    document.getElementById("editRol").value = rolActual;

    document.getElementById("modalEditar").style.display = "flex";
}

document.getElementById("cerrarModal").onclick = () => {
    document.getElementById("modalEditar").style.display = "none";
};


// =======================
// GUARDAR CAMBIO DE ROL
// =======================
document.getElementById("guardarRol").onclick = async () => {
    const id = document.getElementById("editId").value;
    const nuevoRol = document.getElementById("editRol").value;

    try {
        const res = await fetch(`${apiURL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ rol: nuevoRol })
        });

        if (!res.ok) throw new Error("No se pudo actualizar");

        document.getElementById("modalEditar").style.display = "none";
        cargarUsuarios();

    } catch (err) {
        console.error(err);
        alert("Error actualizando rol");
    }
};


// =======================
// ELIMINAR USUARIO
// =======================
async function eliminarUsuario(id) {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
        await fetch(`${apiURL}/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        cargarUsuarios();

    } catch (err) {
        console.error("Error eliminando usuario", err);
    }
}

// =======================
// INICIALIZAR
// =======================
cargarUsuarios();
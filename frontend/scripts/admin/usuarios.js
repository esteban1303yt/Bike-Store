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

                const esAdmin = user.rol === "administrador";

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
                        ${!esAdmin ? `
                            <button class="eliminarBtn" data-id="${user.id_usuario}">Eliminar</button>
                        ` : `
                            <button class="bloqueado" disabled>No editable</button>
                        `}
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
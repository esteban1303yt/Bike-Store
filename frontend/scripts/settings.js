console.log("settings.js cargado");

// API base
const apiURL = "http://localhost:3000/api/usuarios";

// Obtener valores del usuario almacenado
const idUsuario = localStorage.getItem("id_usuario");
const token = localStorage.getItem("token");

// Validar autenticación
if (!idUsuario || !token) {
    console.error("Usuario no autenticado");
}

// ELEMENTOS DEL FORMULARIO — EMAIL
const changeEmailForm = document.getElementById("changeEmailForm");
const newEmailInput = document.getElementById("newEmail");
const emailMsg = document.getElementById("emailMsg");

// ELEMENTOS DEL FORMULARIO — CONTRASEÑA
const changePasswordForm = document.getElementById("changePasswordForm");
const oldPasswordInput = document.getElementById("oldPassword");
const newPasswordInput = document.getElementById("newPassword");
const newPassword2Input = document.getElementById("newPassword2");
const passwordMsg = document.getElementById("passwordMsg");

// ─────────────────────────────────────────────
//   ACTUALIZAR CORREO
// ─────────────────────────────────────────────
changeEmailForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevoCorreo = newEmailInput.value.trim();

    if (!nuevoCorreo) {
        emailMsg.textContent = "Ingresa un nuevo correo.";
        return;
    }

    try {
        const res = await fetch(`${apiURL}/correo/${idUsuario}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
     body: JSON.stringify({ nuevoCorreo: nuevoCorreo })

        });

        const data = await res.json();
        emailMsg.textContent = data.message || "Correo actualizado.";

    } catch (error) {
        console.error(error);
        emailMsg.textContent = "Error al actualizar el correo.";
    }
});

// ─────────────────────────────────────────────
//   ACTUALIZAR CONTRASEÑA
// ─────────────────────────────────────────────
changePasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const actual = oldPasswordInput.value.trim();
    const nueva = newPasswordInput.value.trim();
    const confirmar = newPassword2Input.value.trim();

    passwordMsg.textContent = "";
    passwordMsg.style.color = "red";

    if (!actual || !nueva || !confirmar) {
        passwordMsg.textContent = "Llena todos los campos.";
        return;
    }

    if (nueva !== confirmar) {
        passwordMsg.textContent = "Las contraseñas no coinciden.";
        return;
    }

    try {
        const res = await fetch(`${apiURL}/password/${idUsuario}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                claveActual: actual,
                nuevaClave: nueva
            })
        });

        const data = await res.json();

        // ❌ Si el backend rechaza la contraseña actual
        if (!res.ok) {
            passwordMsg.textContent = data.message || "La contraseña actual es incorrecta.";
            return;
        }

        // ✅ Solo si TODO salió bien
        passwordMsg.style.color = "green";
        passwordMsg.textContent = data.message || "Contraseña actualizada correctamente.";

        // Opcional: limpiar campos
        oldPasswordInput.value = "";
        newPasswordInput.value = "";
        newPassword2Input.value = "";

    } catch (error) {
        console.error(error);
        passwordMsg.textContent = "Error en el servidor.";
    }
});


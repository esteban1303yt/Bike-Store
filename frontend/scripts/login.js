document.addEventListener("DOMContentLoaded", () => {

    const profileBtn = document.getElementById("profileBtn");
    const dropdown = document.getElementById("profileDropdown");

    const profileName = document.getElementById("profileName");
    const adminPanel = document.getElementById("adminPanel");
    const logoutBtn = document.getElementById("logoutBtn");
    const settingsBtn = document.getElementById("settingsBtn");

    // Modal (login/registro)
    const modalOverlay = document.getElementById("modal-overlay");
    const modal = document.getElementById("modal");

    // Vistas internas del modal
    const loginView = document.getElementById("loginView");
    const registerView = document.getElementById("registerView");

    // Botones para cambiar vista
    const openRegister = document.getElementById("openRegister");
    const openLogin = document.getElementById("openLogin");

    // Formularios
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    const mensajeLogin = document.getElementById("mensajeLogin");
    const mensajeRegistro = document.getElementById("mensajeRegistro");

    // URL de tu backend
    const API_BASE = "http://localhost:3000/api/auth";

    // Datos del usuario
    const user = JSON.parse(localStorage.getItem("usuarioActual"));

    // ──────────── SI EL USUARIO ESTÁ LOGUEADO ────────────
    if (user) {
        profileName.textContent = `${user.nombre} ${user.apellido}`;

        // Mostrar Panel de admin si el rol lo permite
        if (user.rol && user.rol.toLowerCase() === "administrador") {
            adminPanel.classList.remove("hidden");

            adminPanel.addEventListener("click", () => {
                window.location.href = "/frontend/pages/admin/dashboard.html";
            });
        }

        // Abrir menú del perfil
        profileBtn.addEventListener("click", () => {
            dropdown.classList.toggle("hidden");
        });

    } else {
        // Si NO hay usuario, abrir modal de login
        profileBtn.addEventListener("click", () => {
            modalOverlay.classList.add("show");
            modal.classList.add("show");
            loginView.style.display = "block";
            registerView.style.display = "none";
        });
    }

    // ──────────── SWITCH LOGIN → REGISTRO ────────────
    if (openRegister) {
        openRegister.addEventListener("click", () => {
            loginView.style.display = "none";
            registerView.style.display = "block";
        });
    }

    // ──────────── SWITCH REGISTRO → LOGIN ────────────
    if (openLogin) {
        openLogin.addEventListener("click", () => {
            loginView.style.display = "block";
            registerView.style.display = "none";
        });
    }

    // ──────────── FORMULARIO REGISTRO ────────────
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const data = {
                nombre: document.getElementById("regNombre").value,
                apellido: document.getElementById("regApellido").value,
                correo: document.getElementById("regEmail").value,
                telefono: document.getElementById("regTelefono").value,
                clave: document.getElementById("regClave").value
            };

            const clave2 = document.getElementById("regClave2").value;

            if (data.clave !== clave2) {
                mensajeRegistro.style.display = "block";
                mensajeRegistro.style.color = "red";
                mensajeRegistro.textContent = "Las contraseñas no coinciden";
                return;
            }

            try {
                const res = await fetch(`${API_BASE}/registro`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                if (!res.ok) throw new Error("Error HTTP " + res.status);

                const result = await res.json();

                if (result.success) {
                    localStorage.setItem("usuarioActual", JSON.stringify(result.usuario));

                    // Si backend devuelve token, lo guardamos
                    if (result.token) {
                        localStorage.setItem("token", result.token);
                    }

                    window.location.reload();
                } else {
                    mensajeRegistro.style.display = "block";
                    mensajeRegistro.style.color = "red";
                    mensajeRegistro.textContent = result.message || "Error al registrar";
                }

            } catch (error) {
                mensajeRegistro.style.display = "block";
                mensajeRegistro.style.color = "red";
                mensajeRegistro.textContent = "Error en el servidor";
                console.error(error);
            }
        });
    }

    // ──────────── FORMULARIO LOGIN ────────────
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const data = {
                correo: document.getElementById("loginEmail").value,
                clave: document.getElementById("loginClave").value
            };

            try {
                const res = await fetch(`${API_BASE}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                if (!res.ok) throw new Error("Error HTTP " + res.status);

                const result = await res.json();

                if (result.success) {
                    localStorage.setItem("usuarioActual", JSON.stringify(result.usuario));
                    localStorage.setItem("token", result.token);
                    window.location.reload();
                } else {
                    mensajeLogin.style.display = "block";
                    mensajeLogin.style.color = "red";
                    mensajeLogin.textContent = result.message || "Error al iniciar sesión";
                }

            } catch (error) {
                mensajeLogin.style.display = "block";
                mensajeLogin.style.color = "red";
                mensajeLogin.textContent = "Error en el servidor";
                console.error(error);
            }
        });
    }

    // ──────────── Cerrar sesión ────────────
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("usuarioActual");
            localStorage.removeItem("token");
            window.location.reload();
        });
    }

    // ──────────── Ir a ajustes ────────────
    if (settingsBtn) {
        settingsBtn.addEventListener("click", () => {
            window.location.href = "/frontend/pages/settings.html";
        });
    }

    // ──────────── Cerrar modal tocando afuera ────────────
    if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove("show");
                modal.classList.remove("show");
            }
        });
    }
});
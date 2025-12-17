document.addEventListener("DOMContentLoaded", () => {

    const btnEnviar = document.querySelector(".submit-btn");
    const mensaje = document.getElementById("mensaje");
    const modalExito = document.getElementById("modalExito");

    btnEnviar.addEventListener("click", (e) => {
        e.preventDefault();

        // Validar que el mensaje tenga texto
        if (!mensaje.value.trim()) {
            alert("Por favor escribe un mensaje antes de enviar");
            return;
        }

        // Mostrar modal
        modalExito.style.display = "flex";

        // Ocultar modal después de 3 segundos
        setTimeout(() => {
            modalExito.style.display = "none";

            // Limpiar campos (opcional)
            document.getElementById("nombre").value = "";
            document.getElementById("email").value = "";
            mensaje.value = "";
        }, 3000);
    });
});

let ventas = [];

// ================================
// CARGAR VENTAS
// ================================
async function cargarVentas() {
    try {
        const response = await fetch('http://localhost:3000/api/ventas');
        if (!response.ok) {
            throw new Error("Error al obtener ventas");
        }

        ventas = await response.json(); // ✔️ usamos el array GLOBAL

        renderizarTabla(ventas);
        actualizarResumen(ventas);

    } catch (error) {
        console.error("Error cargando ventas:", error);
    }
}

// ================================
// RENDERIZAR TABLA
// ================================
function renderizarTabla(listaVentas) {
    const tablaBody = document.querySelector('#tablaVentas tbody');
    tablaBody.innerHTML = '';

    listaVentas.forEach(venta => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${venta.id_venta}</td>
            <td>${venta.cliente}</td>
            <td>$${Number(venta.monto_total).toLocaleString("es-CO")}</td>
            <td>${new Date(venta.fecha).toLocaleString("es-CO")}</td>
        `;
        tablaBody.appendChild(fila);
    });
}

// ================================
// RESUMEN
// ================================
function actualizarResumen(listaVentas) {

    if (!listaVentas || listaVentas.length === 0) {
        document.getElementById("totalVendido").textContent = "$0";
        document.getElementById("cantidadVentas").textContent = "0";
        document.getElementById("ultimaVenta").textContent = "—";
        return;
    }

    const total = listaVentas.reduce(
        (acc, v) => acc + Number(v.monto_total), 0
    );

    document.getElementById("totalVendido").textContent =
        "$" + total.toLocaleString("es-CO");

    document.getElementById("cantidadVentas").textContent =
        listaVentas.length;

    document.getElementById("ultimaVenta").textContent =
        new Date(listaVentas[0].fecha).toLocaleString("es-CO");
}

// ================================
// BUSCADOR
// ================================
document.getElementById("buscarCliente").addEventListener("input", e => {
    const texto = e.target.value.toLowerCase();

    const filtradas = ventas.filter(v =>
        v.cliente.toLowerCase().includes(texto) ||
        String(v.id_venta).includes(texto)
    );

    renderizarTabla(filtradas);
});


// ================================
// INIT
// ================================
window.addEventListener('DOMContentLoaded', cargarVentas);

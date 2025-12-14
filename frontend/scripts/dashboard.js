// ===============================
// DASHBOARD - RESUMEN GENERAL
// ===============================

// Ejecutar cuando cargue la página
document.addEventListener("DOMContentLoaded", () => {
    cargarTotalProductos();
    cargarTotalVentas();
});

// ===============================
// TOTAL DE PRODUCTOS
// ===============================
async function cargarTotalProductos() {
    try {
        const res = await fetch("http://localhost:3000/api/productos");
        const productos = await res.json();

        // Mostrar cantidad total
        document.getElementById("totalProductos").textContent = productos.length;

    } catch (error) {
        console.error("Error cargando productos:", error);
        document.getElementById("totalProductos").textContent = "—";
    }
}

// ===============================
// TOTAL DE VENTAS
// ===============================
async function cargarTotalVentas() {
    try {
        const res = await fetch("http://localhost:3000/api/ventas");
        const ventas = await res.json();

        // Mostrar cantidad total
        document.getElementById("totalVentas").textContent = ventas.length;

    } catch (error) {
        console.error("Error cargando ventas:", error);
        document.getElementById("totalVentas").textContent = "—";
    }
}

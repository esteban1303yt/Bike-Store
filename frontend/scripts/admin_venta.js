// Función para cargar todas las ventas desde el backend
async function cargarVentas() {
    try {
       const response = await fetch('http://localhost:3000/api/ventas'); // Ajusta la ruta si tu backend tiene prefijo
        if (!response.ok) {
            throw new Error("Error al obtener ventas");
        }

        const ventas = await response.json();

        const tablaBody = document.querySelector('#tablaVentas tbody');
        tablaBody.innerHTML = ''; // Limpiar tabla antes de insertar

        ventas.forEach(venta => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${venta.id_venta}</td>
                <td>${venta.cliente}</td>
                <td>${venta.monto_total}</td>
                <td>${new Date(venta.fecha).toLocaleString()}</td>
            `;
            tablaBody.appendChild(fila);
        });

    } catch (error) {
        console.error("Error cargando ventas:", error);
    }
}

// Ejecutar la carga de ventas cuando la página se haya cargado
window.addEventListener('DOMContentLoaded', cargarVentas);

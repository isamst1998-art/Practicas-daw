document.getElementById("formCompra").addEventListener("submit", function(event) {
    event.preventDefault();

    let nombre = document.getElementById("nombre").value;
    let fecha = document.getElementById("fecha").value;
    let cantidad = document.getElementById("cantidad").value;
    let categoria = document.getElementById("categoria").value;
    let metodoPago = document.querySelector('input[name="pago"]:checked');

    if (!metodoPago) {
        alert("Selecciona un método de pago.");
        return;
    }

    metodoPago = metodoPago.value;

    // Confirmación antes de procesar el pago
    let confirmacion = confirm(`Resumen de compra:\n\nNombre: ${nombre}\nFecha: ${fecha}\nEntradas: ${cantidad}\nCategoría: ${categoria}\nPago: ${metodoPago}\n\n¿Confirmar compra?`);
    
    if (confirmacion) {
        // Guardar datos en sessionStorage
        sessionStorage.setItem("nombre", nombre);
        sessionStorage.setItem("fecha", fecha);
        sessionStorage.setItem("cantidad", cantidad);
        sessionStorage.setItem("categoria", categoria);
        sessionStorage.setItem("metodoPago", metodoPago);

        // Redirigir a la página de confirmación
        window.location.href = "confirmacion.html";
    }
});

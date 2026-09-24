document.addEventListener('DOMContentLoaded', function() {
    // 1. Bloquear fechas anteriores a la actual en el campo de fecha
    const hoy = new Date().toISOString().split('T')[0];
    const inputFecha = document.getElementById('fechaCita');
    if (inputFecha) {
        inputFecha.setAttribute('min', hoy);
    }

    // 2. Capturar el servicio y precio desde los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const servicioParam = urlParams.get('servicio');
    const precioParam = urlParams.get('precio');

    let precioBase = 0;
    let nombreServicio = "Servicio General";

    if (servicioParam && precioParam) {
        nombreServicio = decodeURIComponent(servicioParam);
        precioBase = parseInt(precioParam);

        // Mostrar el servicio en el formulario y resumen
        document.getElementById('nombreServicio').value = nombreServicio;
        document.getElementById('precioServicio').value = precioBase;
        document.getElementById('resumenServicio').textContent = nombreServicio;
    } else {
        document.getElementById('nombreServicio').value = "Servicio General Sakura";
        document.getElementById('resumenServicio').textContent = "Servicio General Sakura";
    }

    // 3. Elementos del resumen y pagos
    const selectProfesional = document.getElementById('profesional');
    const inputFechaCita = document.getElementById('fechaCita');
    const radiosHora = document.querySelectorAll('input[name="hora"]');
    const radiosPago = document.querySelectorAll('input[name="tipoPago"]');

    const lblResumenProfesional = document.getElementById('resumenProfesional');
    const lblResumenFechaHora = document.getElementById('resumenFechaHora');
    const lblPrecioTotal = document.getElementById('resumenPrecioTotal');
    const lblMontoPagar = document.getElementById('resumenMontoPagar');

    let horaSeleccionada = '';

    function actualizarResumen() {
        // Profesional
        const optionProf = selectProfesional.options[selectProfesional.selectedIndex];
        lblResumenProfesional.textContent = optionProf.value ? optionProf.text : 'No seleccionado';

        // Fecha y Hora
        const fechaVal = inputFechaCita.value;
        let fechaFormateada = 'Por definir';
        if (fechaVal) {
            const partes = fechaVal.split('-');
            fechaFormateada = `${partes[2]}/${partes[1]}/${partes[0]}`;
            if (horaSeleccionada) {
                fechaFormateada += ` - ${horaSeleccionada}`;
            }
        }
        lblResumenFechaHora.textContent = fechaFormateada;

        // Precios y cálculo de abono (50%)
        lblPrecioTotal.textContent = `$ ${precioBase.toLocaleString('es-CL')}`;

        const tipoPago = document.querySelector('input[name="tipoPago"]:checked').value;
        const montoFinal = tipoPago === 'abono' ? precioBase / 2 : precioBase;
        const textoAbono = tipoPago === 'abono' ? 'Abono (50%)' : 'Pago Total (100%)';
        
        lblMontoPagar.innerHTML = `${textoAbono}: <strong class="text-danger">$ ${montoFinal.toLocaleString('es-CL')}</strong>`;
    }

    if (selectProfesional) selectProfesional.addEventListener('change', actualizarResumen);
    if (inputFechaCita) inputFechaCita.addEventListener('change', actualizarResumen);
    radiosHora.forEach(r => {
        r.addEventListener('change', function() {
            if (this.checked) {
                horaSeleccionada = this.value;
                actualizarResumen();
            }
        });
    });
    radiosPago.forEach(r => r.addEventListener('change', actualizarResumen));

    // Ejecutar una vez al cargar para pintar el precio inicial
    actualizarResumen();

    // 4. Validaciones al enviar el formulario
    const formAgendar = document.getElementById('formAgendar');
    if (formAgendar) {
        formAgendar.addEventListener('submit', function(event) {
            let formIsValid = true;

            // Validar Nombre (solo letras y espacios, al menos 2 caracteres)
            const nombre = document.getElementById('nombre');
            const regexTexto = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{2,}$/;
            if (!regexTexto.test(nombre.value.trim())) {
                nombre.classList.add('is-invalid');
                formIsValid = false;
            } else {
                nombre.classList.remove('is-invalid');
            }

            // Validar Apellido (solo letras y espacios, al menos 2 caracteres)
            const apellido = document.getElementById('apellido');
            if (!regexTexto.test(apellido.value.trim())) {
                apellido.classList.add('is-invalid');
                formIsValid = false;
            } else {
                apellido.classList.remove('is-invalid');
            }

            // Validar RUT chileno (ej: 12345678-9 o 12345678-K)
            const rut = document.getElementById('rut');
            const regexRut = /^\d{7,8}-[\dKk]$/;
            if (!regexRut.test(rut.value.trim())) {
                rut.classList.add('is-invalid');
                formIsValid = false;
            } else {
                rut.classList.remove('is-invalid');
            }

            // Validar Teléfono (admite formato chileno +569XXXXXXXX o 9XXXXXXXX)
            const telefono = document.getElementById('telefono');
            const regexTelefono = /^(\+?56)?9\d{8}$|^\d{9}$/;
            if (!regexTelefono.test(telefono.value.trim())) {
                telefono.classList.add('is-invalid');
                formIsValid = false;
            } else {
                telefono.classList.remove('is-invalid');
            }

            // Validar Correo Electrónico
            const correo = document.getElementById('correo');
            const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexCorreo.test(correo.value.trim())) {
                correo.classList.add('is-invalid');
                formIsValid = false;
            } else {
                correo.classList.remove('is-invalid');
            }

            // Si hay errores, detenemos el envío
            if (!formIsValid) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault();

                // Capturamos los datos para enviarlos a la vista de confirmación
                const nombreVal = document.getElementById('nombre').value;
                const apellidoVal = document.getElementById('apellido').value;
                const correoVal = document.getElementById('correo').value;
                const profesionalVal = document.getElementById('profesional').value;
                const fechaVal = document.getElementById('fechaCita').value;
                const horaVal = document.querySelector('input[name="hora"]:checked').value;
                const tipoPagoVal = document.querySelector('input[name="tipoPago"]:checked').value;
                
                // Calculamos el monto pagado para el resumen
                const montoPagado = tipoPagoVal === 'abono' ? precioBase / 2 : precioBase;

                // Creamos un objeto con la información de la cita
                const detalleCita = {
                    nombre: nombreVal,
                    apellido: apellidoVal,
                    correo: correoVal,
                    servicio: nombreServicio,
                    profesional: profesionalVal,
                    fecha: fechaVal,
                    hora: horaVal,
                    tipoPago: tipoPagoVal,
                    montoPagado: montoPagado
                };

                // Guardamos en sessionStorage para leerlo en la otra vista
                sessionStorage.setItem('detallesCita', JSON.stringify(detalleCita));
                
                //Guardar en el historial general para el panel de Admin
                let listaCitas = JSON.parse(localStorage.getItem('citasSakura')) || [];
                listaCitas.push(detalleCita);
                localStorage.setItem('citasSakura', JSON.stringify(listaCitas));


                // Redirigimos a la nueva vista de confirmación 
                window.location.href = 'confirmacion.html';
            }
        });
        


    }
});
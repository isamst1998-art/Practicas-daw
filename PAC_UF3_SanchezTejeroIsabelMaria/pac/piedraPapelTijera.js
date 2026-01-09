// Este array no se puede modificar (suministrado).
var posibilidades = ["piedra", "papel", "tijera"];

// Espera a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
  // --- Referencias DOM ---
  const inputNombre = document.querySelector('input[name="nombre"]');
  const inputPartidas = document.querySelector('input[name="partidas"]');
  const botones = document.querySelectorAll('button'); // [¡JUGAR!, ¡YA!, RESET] según el HTML.
  const btnJugar = botones[0];
  const btnYa = botones[1];
  const btnReset = botones[2];

  const spanActual = document.getElementById('actual');
  const spanTotal  = document.getElementById('total');

  const divJugador = document.getElementById('jugador');
  const imgsJugador = Array.from(divJugador.querySelectorAll('img'));
  const divMaquina = document.getElementById('maquina');
  const imgMaquina = divMaquina.querySelector('img');

  const ulHistorial = document.getElementById('historial');

  // Estado de la partida
  let jugadorSeleccionado = null; // índice en posibilidades o null
  let contadorActual = 0;
  let contadorTotal = 0;
  let nombreJugador = '';

  // --- Inicializar imágenes del jugador a partir del array 'posibilidades' ---
  // Se asigna a cada <img> la ruta: img/Jugador_<opcion>.png (según posición).
  // Si el número de <img> coincide con el array, se mapeará 1:1.
  for (let i = 0; i < imgsJugador.length; i++) {
    const opcion = posibilidades[i];
    // ruta: img/Jugador_piedra.png  (supón .png; ajusta si tus imágenes tienen otra extensión)
    imgsJugador[i].src = 'img/Jugador_' + opcion + '.png';
    imgsJugador[i].classList.remove('seleccionado');
    imgsJugador[i].classList.add('noSeleccionado');

    // Evento para seleccionar opción de jugador
    imgsJugador[i].addEventListener('click', function() {
      // aplicar clases
      imgsJugador.forEach(img => {
        img.classList.remove('seleccionado');
        img.classList.add('noSeleccionado');
      });
      this.classList.remove('noSeleccionado');
      this.classList.add('seleccionado');

      // guardar selección (por índice)
      jugadorSeleccionado = i;
    });
  }

  // --- Función de validación para nombre y partidas ---
  function validarNombre(n) {
    if (!n) return false;
    if (n.length <= 3) return false;
    // primer carácter no puede ser número
    return isNaN(parseInt(n.charAt(0), 10));
  }
  function validarPartidas(p) {
    return Number.isInteger(p) && p > 0;
  }

  // --- Evento botón ¡JUGAR! ---
  btnJugar.addEventListener('click', function() {
    const nombre = inputNombre.value.trim();
    const partidas = parseInt(inputPartidas.value, 10);

    let nombreOK = validarNombre(nombre);
    let partidasOK = validarPartidas(partidas);

    // Marcar errores con clase 'fondoRojo' según enunciado
    if (!nombreOK) {
      inputNombre.classList.add('fondoRojo');
    } else {
      inputNombre.classList.remove('fondoRojo');
    }
    if (!partidasOK) {
      inputPartidas.classList.add('fondoRojo');
    } else {
      inputPartidas.classList.remove('fondoRojo');
    }

    if (nombreOK && partidasOK) {
      // Guardar estado y deshabilitar campos
      nombreJugador = nombre;
      contadorTotal = partidas;
      spanTotal.textContent = contadorTotal;
      inputNombre.disabled = true;
      inputPartidas.disabled = true;
      // quitar estilos de error si los hubiera
      inputNombre.classList.remove('fondoRojo');
      inputPartidas.classList.remove('fondoRojo');
      // activar botón ¡YA! si estaba desactivado
      btnYa.disabled = false;
    } else {
      // dejar feedback; no continuar
      // (no hacemos alert para no romper el flujo; la clase 'fondoRojo' indica)
    }
  });

  // --- Evento botón ¡YA! (realizar tirada) ---
  btnYa.addEventListener('click', function() {
    // comprobar que hay partidas totales definidas
    if (contadorTotal <= 0) {
      // no se ha iniciado la partida correctamente
      inputPartidas.classList.add('fondoRojo');
      return;
    }
    // comprobar que el jugador ha seleccionado una opción
    if (jugadorSeleccionado === null) {
      // opción: no hacemos nada o mostramos una línea en historial que recuerde seleccionar
      const li = document.createElement('li');
      li.textContent = 'Seleccione una opción para jugar.';
      ulHistorial.prepend(li);
      return;
    }

    // generar opción aleatoria para la máquina
    const randIndex = Math.floor(Math.random() * posibilidades.length);
    const opcionMaquina = posibilidades[randIndex];
    imgMaquina.src = 'img/Ordenador_' + opcionMaquina + '.png';

    // actualizar contadores
    contadorActual++;
    spanActual.textContent = contadorActual;

    // obtener índices
    const idxJugador = jugadorSeleccionado;
    const idxMaquina = randIndex;

    // determinar resultado siguiendo las reglas:
    // - si iguales -> empate
    // - si jugadorIndex === (maquinaIndex + 1) % length -> gana jugador
    // - else gana la máquina
    const n = posibilidades.length;
    let resultadoTexto = '';
    if (idxJugador === idxMaquina) {
      resultadoTexto = 'Empate';
    } else if (idxJugador === ((idxMaquina + 1) % n)) {
      resultadoTexto = 'Gana ' + nombreJugador;
    } else {
      resultadoTexto = 'Gana la máquina';
    }

    // insertar en historial (al principio para ver las últimas primero)
    const li = document.createElement('li');
    li.textContent = resultadoTexto;
    ulHistorial.prepend(li);

    // Si hemos alcanzado el total, desactivar YA para que no siga jugando
    if (contadorActual >= contadorTotal) {
      btnYa.disabled = true;
    }
  });

  // --- Evento RESET ---
  btnReset.addEventListener('click', function() {
    // Mensaje en historial
    const li = document.createElement('li');
    li.textContent = 'Nueva partida';
    ulHistorial.prepend(li);

    // reactivar campos de texto; dejar el nombre pero partidas a 0
    inputNombre.disabled = false;
    inputPartidas.disabled = false;
    inputPartidas.value = 0;

    // mantener el nombre (no se borra)
    // reset contadores
    contadorActual = 0;
    contadorTotal = 0;
    spanActual.textContent = contadorActual;
    spanTotal.textContent = contadorTotal;

    // volver imagen de máquina a defecto
    imgMaquina.src = 'img/defecto.png';

    // permitir volver a jugar
    btnYa.disabled = false;

    // mantener historial (como exige el enunciado)
  });

  // --- Estado inicial: asegurar que YA está activo solo si hay una partida ---
  btnYa.disabled = false; // se controla después por lógica (si no hay total, no podrá jugar correctamente)
});

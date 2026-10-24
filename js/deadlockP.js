const CLAVE_STORAGE = "deadlock-personajes-v3";
let almacenamientoValido = true;
let idEnEdicion = null;

const personajesIniciales = [
  {
    id: "deadlock-mina",
    nombre: "Mina",
    imagen: "https://cdn.deadlock.wiki/Mina_card.png",
    rol: "Harasser, Nimble, Vexing.",
    descripcion: "Trust me. The longer this goes on, the worse it's gonna get for you!."
  },
  {
    id: "deadlock-celeste",
    nombre: "Celeste",
    imagen: "https://cdn.deadlock.wiki/Celeste_card.png",
    rol: "Performer, Disruptive, Dazzling.",
    descripcion: "Let's contribute to the chaos!"
  },
  {
    id: "deadlock-doctora-hallow",
    nombre: "Enfermera Hallow",
    imagen: "https://cdn.deadlock.wiki/Nurse_Harrow_card.png",
    rol: "Strict, Terrifying, Savior",
    descripcion: "There will be ecstasy, there will be agony, and then you will be as you were."
  },
  {
    id: "deadlock-solomon",
    nombre: "Solomon",
    imagen: "https://cdn.deadlock.wiki/Solomon_card.png",
    rol: "Strategist, Focused, Checkmate",
    descripcion: "I'll come at the problem from all kinds of angles."
  },
  {
    id: "deadlock-vindicta",
    nombre: "Vindicta",
    imagen: "https://cdn.deadlock.wiki/Vindicta_card.png",
    rol: "Sniper, Soaring, One Shot Kill",
    descripcion: "If they don't have an Achilles' heel, I'll make one."
  },
  {
    id: "deadlock-seven",
    nombre: "Seven",
    imagen: "https://cdn.deadlock.wiki/Seven_card.png",
    rol: "High Voltage, Merciless, Area Denial",
    descripcion: "Greatness can be hindered, but it can never be stopped."
  }
].map((personaje) => ({
  origen: "",
  imagen: "",
  ...personaje,
  fechaCreacion: new Date().toISOString()
}));

function guardarPersonajes(lista) {
  if (!almacenamientoValido) {
    document.getElementById("mensaje").textContent =
      "Los datos guardados están dañados. Antes de guardar, recupera una copia válida.";
    return false;
  }
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(lista));
    return true;
  } catch (error) {
    document.getElementById("mensaje").textContent =
      "No se pudo guardar la colección en este navegador.";

    return false;
  }
}

function cargarPersonajes() {
  try {
    const datos = localStorage.getItem(CLAVE_STORAGE);

    // Solo cargamos los ejemplos cuando todavía no hay una colección.
    if (datos === null) {
      guardarPersonajes(personajesIniciales);
      return personajesIniciales;
    }

    const lista = JSON.parse(datos);

    const datosValidos =
      Array.isArray(lista) &&
      lista.every((personaje) =>
        personaje !== null &&
        typeof personaje === "object" &&
        typeof personaje.id === "string" &&
        typeof personaje.nombre === "string" &&
        typeof personaje.rol === "string"
      );

    if (!datosValidos) {
      throw new Error("La colección guardada no tiene el formato esperado.");
    }

    return lista;
  } catch (error) {
    almacenamientoValido = false;
    document.getElementById("mensaje").textContent =
      "No se pudo leer la colección guardada. No se han sobrescrito los datos.";

    return [];
  }
}

function renderizarGrid() {
  const contenedor = document.getElementById("lista-personajes");
  const contador = document.getElementById("contador");
  const estadoVacio = document.getElementById("estado-vacio");

  contenedor.replaceChildren();

  const consulta = normalizar(document.getElementById("busqueda").value.trim());
  const resultados = personajes.filter((personaje) =>
    normalizar(personaje.nombre).includes(consulta) ||
    normalizar(personaje.rol).includes(consulta)
  );

  resultados.forEach((personaje) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-personaje";

    const iniciales = document.createElement("div");
    iniciales.className = "avatar-personaje";
    iniciales.textContent = personaje.nombre.slice(0, 2).toUpperCase();
    iniciales.setAttribute("aria-hidden", "true");
    colocarImagen(iniciales, personaje);

    const nombre = document.createElement("h3");
    nombre.textContent = personaje.nombre;

    const rol = document.createElement("p");
    rol.className = "rol-personaje";
    rol.textContent = personaje.rol;

    const descripcion = document.createElement("p");
    descripcion.textContent = personaje.descripcion || "Sin descripción.";

    const detalle = crearBoton("Ver detalle", () => mostrarDetalle(personaje.id));
    detalle.setAttribute("aria-label", `Ver detalle de ${personaje.nombre}`);
    tarjeta.append(iniciales, nombre, rol, descripcion, detalle);
    contenedor.appendChild(tarjeta);
  });

  contador.textContent =
    consulta ? `${resultados.length} coincidencias de ${personajes.length} personajes` :
    `${personajes.length} ${personajes.length === 1 ? "personaje" : "personajes"}`;

  estadoVacio.hidden = resultados.length > 0;
  estadoVacio.textContent = personajes.length === 0
    ? "Tu colección está vacía. ¡Agrega tu primer personaje!"
    : "Sin resultados. Prueba otro nombre o rol, o limpia la búsqueda.";
  document.getElementById("btn-limpiar").hidden = !consulta;
}

// Buscar
function normalizar(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function crearBoton(texto, accion) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.textContent = texto;
  boton.addEventListener("click", accion);
  return boton;
}

function colocarImagen(contenedor, personaje) {
  if (!personaje.imagen || !/^https?:\/\//i.test(personaje.imagen)) return;
  const imagen = document.createElement("img");
  imagen.alt = personaje.nombre;
  imagen.src = personaje.imagen;
  imagen.addEventListener("load", () => contenedor.replaceChildren(imagen));
  // Si no carga, las iniciales permanecen visibles
  imagen.addEventListener("error", () => imagen.remove());
}

function cambiarVista(vista) {
  document.querySelector('[aria-labelledby="titulo-coleccion"]').hidden = vista !== "coleccion";
  document.getElementById("seccion-formulario").hidden = vista !== "formulario";
  document.getElementById("seccion-detalle").hidden = vista !== "detalle";
}

function volverColeccion() {
  cambiarVista("coleccion");
  renderizarGrid();
  document.getElementById("btn-agregar").focus();
}

function mostrarDetalle(id) {
  const personaje = personajes.find((actual) => actual.id === id);
  if (!personaje) return;
  const contenedor = document.getElementById("contenido-detalle");
  contenedor.replaceChildren();
  const titulo = document.createElement("h3");
  titulo.textContent = personaje.nombre;
  titulo.tabIndex = -1;
  const avatar = document.createElement("div");
  avatar.className = "avatar-personaje";
  avatar.textContent = personaje.nombre.slice(0, 2).toUpperCase();
  colocarImagen(avatar, personaje);
  contenedor.append(avatar, titulo);
  for (const [etiqueta, valor] of [
    ["Rol", personaje.rol], ["Origen", personaje.origen],
    ["Descripción", personaje.descripcion]
  ]) {
    const parrafo = document.createElement("p");
    parrafo.textContent = `${etiqueta}: ${valor || "Sin especificar"}`;
    contenedor.append(parrafo);
  }
  contenedor.append(
    crearBoton("Editar", () => abrirFormulario(id)),
    crearBoton("Eliminar", () => eliminarPersonaje(id))
  );
  cambiarVista("detalle");
  titulo.focus();
}

function limpiarErrores() {
  document.querySelectorAll(".error-campo").forEach((elemento) => elemento.remove());
  document.querySelectorAll("[aria-invalid]").forEach((elemento) => {
    elemento.removeAttribute("aria-invalid");
    elemento.removeAttribute("aria-describedby");
  });
}

function marcarError(campo, mensaje) {
  const entrada = document.getElementById(campo);
  const error = document.createElement("p");
  error.id = `error-${campo}`;
  error.className = "error-campo";
  error.textContent = mensaje;
  entrada.setAttribute("aria-invalid", "true");
  entrada.setAttribute("aria-describedby", error.id);
  entrada.after(error);
}

function abrirFormulario(id = null) {
  idEnEdicion = id;
  document.getElementById("formulario-personaje").reset();
  limpiarErrores();
  document.getElementById("mensaje").textContent = "";
  document.getElementById("titulo-formulario").textContent = id ? "Editar personaje" : "Agregar personaje";
  const personaje = personajes.find((actual) => actual.id === id);
  if (personaje) {
    for (const campo of ["nombre", "rol", "origen", "imagen", "descripcion"]) {
      document.getElementById(campo).value = personaje[campo] || "";
    }
  }
  cambiarVista("formulario");
  document.getElementById("nombre").focus();
}

function guardarFormulario(evento) {
  evento.preventDefault();
  limpiarErrores();
  const datos = {};
  for (const campo of ["nombre", "rol", "origen", "imagen", "descripcion"]) {
    datos[campo] = document.getElementById(campo).value.trim();
  }
  if (!datos.nombre) marcarError("nombre", "Escribe un nombre; no puede contener solo espacios.");
  if (!datos.rol) marcarError("rol", "Escribe un rol para el personaje.");
  if (datos.nombre && personajes.some((personaje) =>
    personaje.id !== idEnEdicion && normalizar(personaje.nombre.trim()) === normalizar(datos.nombre)
  )) marcarError("nombre", "Ya existe un personaje con ese nombre.");
  if (datos.imagen) {
    try {
      const direccion = new URL(datos.imagen);
      if (!["http:", "https:"].includes(direccion.protocol)) throw new Error("URL inválida");
    } catch {
      marcarError("imagen", "Usa una dirección completa que empiece con https:// o http://.");
    }
  }
  const primerError = document.querySelector('[aria-invalid="true"]');
  if (primerError) { primerError.focus(); return; }

  const anterior = personajes.find((personaje) => personaje.id === idEnEdicion);
  const personaje = {
    ...datos,
    id: anterior ? anterior.id : crypto.randomUUID(),
    fechaCreacion: anterior ? anterior.fechaCreacion : new Date().toISOString()
  };
  const nuevaLista = anterior
    ? personajes.map((actual) => actual.id === idEnEdicion ? personaje : actual)
    : [...personajes, personaje];
  // Solo actualizamos si se guardo con exito
  if (!guardarPersonajes(nuevaLista)) return;
  personajes = nuevaLista;
  document.getElementById("busqueda").value = "";
  renderizarGrid();
  mostrarDetalle(personaje.id);
  document.getElementById("mensaje").textContent = anterior ? "Cambios guardados." : "Personaje agregado.";
}

function eliminarPersonaje(id) {
  const personaje = personajes.find((actual) => actual.id === id);
  if (!personaje || !confirm(`¿Eliminar a ${personaje.nombre}?`)) return;
  const nuevaLista = personajes.filter((actual) => actual.id !== id);
  if (!guardarPersonajes(nuevaLista)) return;
  personajes = nuevaLista;
  volverColeccion();
  document.getElementById("mensaje").textContent = "Personaje eliminado.";
}

let personajes = cargarPersonajes();

renderizarGrid();

document.getElementById("busqueda").addEventListener("input", renderizarGrid);
document.getElementById("btn-limpiar").addEventListener("click", () => {
  document.getElementById("busqueda").value = "";
  renderizarGrid();
  document.getElementById("busqueda").focus();
});
document.getElementById("btn-agregar").addEventListener("click", () => abrirFormulario());
document.getElementById("btn-cancelar").addEventListener("click", volverColeccion);
document.getElementById("btn-volver").addEventListener("click", volverColeccion);
document.getElementById("formulario-personaje").addEventListener("submit", guardarFormulario);


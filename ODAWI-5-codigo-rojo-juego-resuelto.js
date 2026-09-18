const crearSalas = () => {
  return [
    { id: "entrada", nombre: "Acceso principal", conexiones: ["laboratorio", "archivo"], objetos: ["kit"] },
    { id: "laboratorio", nombre: "Laboratorio", conexiones: ["entrada"], objetos: ["fusible"] },
    { id: "archivo", nombre: "Archivo", conexiones: ["entrada", "hangar"], objetos: ["tarjeta"] },
    { id: "hangar", nombre: "Hangar de evacuación", conexiones: ["archivo"], objetos: [] }
  ];
};

const crearPartida = (nombreJugador) => {
  return { nombreJugador: nombreJugador, salas: crearSalas(), salaActual: "entrada", inventario: [], oxigeno: 12, energiaRestaurada: false, estado: "En juego", historial: [] };
};

const buscarSala = (salas, idSala) => {
  return salas.find((sala) => sala.id === idSala) || null;
};

const describirSala = (partida) => {
  const sala = buscarSala(partida.salas, partida.salaActual);
  const objetos = sala.objetos.length > 0 ? sala.objetos.join(", ") : "ninguno";
  return sala.nombre + " | Conexiones: " + sala.conexiones.join(", ") + " | Objetos: " + objetos;
};

const listarInventario = (partida) => {
  return partida.inventario.length === 0 ? "Inventario vacío" : "Inventario: " + partida.inventario.join(", ");
};

const normalizarEntrada = (entrada) => {
  return entrada === null ? "cancelar" : entrada.trim().toLowerCase();
};

const separarComando = (entrada) => {
  const texto = normalizarEntrada(entrada);
  const partes = texto === "" ? [] : texto.split(/\s+/);
  return { accion: partes[0] || "", objetivo: partes[1] || "", cantidadPartes: partes.length };
};

const validarComando = (comando) => {
  const conObjetivo = ["mover", "tomar"];
  const sinObjetivo = ["usar-kit", "reparar", "escapar", "cancelar"];
  return conObjetivo.includes(comando.accion)
    ? comando.cantidadPartes === 2
    : sinObjetivo.includes(comando.accion) && comando.cantidadPartes === 1;
};

const tieneObjeto = (partida, objeto) => {
  return partida.inventario.includes(objeto);
};

const puedeMoverse = (partida, destino) => {
  const sala = buscarSala(partida.salas, partida.salaActual);
  if (!sala || !sala.conexiones.includes(destino)) { return false; }
  return destino === "hangar"
    ? partida.energiaRestaurada && tieneObjeto(partida, "tarjeta")
    : true;
};

const mover = (partida, destino) => {
  if (!puedeMoverse(partida, destino)) { return { valido: false, mensaje: "Destino bloqueado o no conectado" }; }
  partida.salaActual = destino;
  return { valido: true, mensaje: "Entraste en " + destino };
};

const tomar = (partida, objeto) => {
  const sala = buscarSala(partida.salas, partida.salaActual);
  const posicion = sala.objetos.indexOf(objeto);
  if (posicion === -1) { return { valido: false, mensaje: "Ese objeto no está en esta sala" }; }
  sala.objetos.splice(posicion, 1);
  partida.inventario.push(objeto);
  return { valido: true, mensaje: "Recogiste " + objeto };
};

const usarKit = (partida) => {
  if (!tieneObjeto(partida, "kit") || partida.oxigeno >= 12) {
    return { valido: false, mensaje: "Necesitás un kit y oxígeno menor a 12" };
  }
  partida.inventario.splice(partida.inventario.indexOf("kit"), 1);
  partida.oxigeno = Math.min(12, partida.oxigeno + 4);
  return { valido: true, mensaje: "Kit aplicado" };
};

const reparar = (partida) => {
  if (partida.salaActual !== "laboratorio" || !tieneObjeto(partida, "fusible") || partida.energiaRestaurada) {
    return { valido: false, mensaje: "Reparación no disponible" };
  }
  partida.inventario.splice(partida.inventario.indexOf("fusible"), 1);
  partida.energiaRestaurada = true;
  return { valido: true, mensaje: "Energía restaurada" };
};

const escapar = (partida) => {
  if (partida.salaActual !== "hangar" || !partida.energiaRestaurada || !tieneObjeto(partida, "tarjeta")) {
    return { valido: false, mensaje: "No podés escapar todavía" };
  }
  partida.estado = "Escapaste";
  return { valido: true, mensaje: "Evacuación completada" };
};

const aplicarComando = (partida, comando) => {
  if (comando.accion === "cancelar") { partida.estado = "Cancelado"; return { valido: false, mensaje: "Misión cancelada" }; }
  if (comando.accion === "mover") { return mover(partida, comando.objetivo); }
  if (comando.accion === "tomar") { return tomar(partida, comando.objetivo); }
  if (comando.accion === "usar-kit") { return usarKit(partida); }
  if (comando.accion === "reparar") { return reparar(partida); }
  return escapar(partida);
};

const resolverEstado = (estadoActual, oxigeno) => {
  if (estadoActual === "Escapaste" || estadoActual === "Cancelado") { return estadoActual; }
  return oxigeno <= 0 ? "Sin oxígeno" : "En juego";
};

const consumirOxigeno = (partida) => {
  partida.oxigeno = Math.max(0, partida.oxigeno - 1);
  partida.estado = resolverEstado(partida.estado, partida.oxigeno);
};

const registrarEvento = (partida, entrada, resultado) => {
  partida.historial.push({ comando: normalizarEntrada(entrada), valido: resultado.valido, mensaje: resultado.mensaje, oxigeno: partida.oxigeno });
};

const ejecutarTurno = (partida, entrada) => {
  if (partida.estado !== "En juego") { return { valido: false, mensaje: "La misión terminó" }; }
  const comando = separarComando(entrada);
  const resultado = validarComando(comando)
    ? aplicarComando(partida, comando)
    : { valido: false, mensaje: "Comando inválido" };
  if (resultado.valido) { consumirOxigeno(partida); }
  registrarEvento(partida, entrada, resultado);
  return resultado;
};

const crearResumen = (partida) => {
  const accionesValidas = partida.historial.filter((evento) => evento.valido);
  return { estado: partida.estado, oxigeno: partida.oxigeno, accionesValidas: accionesValidas.length, comandos: accionesValidas.map((evento) => evento.comando) };
};

const jugarPartida = () => {
  const nombreJugador = prompt("Nombre de la misión:");
  if (nombreJugador === null) { return null; }
  const partida = crearPartida(nombreJugador);
  alert("Código rojo. Tenés 12 unidades de oxígeno.");
  while (partida.estado === "En juego") {
    console.log(describirSala(partida));
    console.log(listarInventario(partida));
    console.log("Oxígeno: " + partida.oxigeno);
    const entrada = prompt("mover sala | tomar objeto | usar-kit | reparar | escapar | cancelar");
    const resultado = ejecutarTurno(partida, entrada);
    alert(resultado.mensaje);
  }
  console.log(crearResumen(partida));
  alert(partida.estado);
  return partida;
};

jugarPartida();
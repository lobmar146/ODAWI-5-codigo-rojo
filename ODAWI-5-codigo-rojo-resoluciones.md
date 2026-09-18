# ODAWI 05 · Resoluciones explicadas

Cada resolución es independiente y se puede ejecutar en el laboratorio. Desde el primer ejercicio todas incluyen funciones flecha. En condicionales se combinan if y ternarias, y el juego final reutiliza esas mismas soluciones. Las ayudas de ejercicios anteriores se entregan en las plantillas.

## Etapa 1. Texto y comandos

### Ejercicio 1. Normalizar la entrada

```javascript
const normalizarEntrada = (entrada) => {
  return entrada === null ? "cancelar" : entrada.trim().toLowerCase();
};
```

La ternaria permite distinguir Cancelar antes de llamar métodos de texto.

### Ejercicio 2. Interpretar una orden

```javascript
const normalizarEntrada = (entrada) => {
  return entrada === null ? "cancelar" : entrada.trim().toLowerCase();
};

const separarComando = (entrada) => {
  const texto = normalizarEntrada(entrada);
  const partes = texto === "" ? [] : texto.split(/\s+/);
  return { accion: partes[0] || "", objetivo: partes[1] || "", cantidadPartes: partes.length };
};
```

No descartes silenciosamente un tercer término: cantidadPartes debe contarlo.

### Ejercicio 3. Validar la forma

```javascript
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
```

Esta función solo valida la forma de la orden. Que exista la sala o el objeto se verifica después.

## Etapa 2. Mapa y estado inicial

### Ejercicio 4. Construir el mapa

```javascript
const crearSalas = () => {
  return [
    { id: "entrada", nombre: "Acceso principal", conexiones: ["laboratorio", "archivo"], objetos: ["kit"] },
    { id: "laboratorio", nombre: "Laboratorio", conexiones: ["entrada"], objetos: ["fusible"] },
    { id: "archivo", nombre: "Archivo", conexiones: ["entrada", "hangar"], objetos: ["tarjeta"] },
    { id: "hangar", nombre: "Hangar de evacuación", conexiones: ["archivo"], objetos: [] }
  ];
};
```

Los nombres visibles pueden llevar tildes; los identificadores y comandos se escriben como indica la consigna.

### Ejercicio 5. Buscar por identificador

```javascript
const crearSalas = () => {
  return [
    { id: "entrada", nombre: "Acceso principal", conexiones: ["laboratorio", "archivo"], objetos: ["kit"] },
    { id: "laboratorio", nombre: "Laboratorio", conexiones: ["entrada"], objetos: ["fusible"] },
    { id: "archivo", nombre: "Archivo", conexiones: ["entrada", "hangar"], objetos: ["tarjeta"] },
    { id: "hangar", nombre: "Hangar de evacuación", conexiones: ["archivo"], objetos: [] }
  ];
};

const buscarSala = (salas, idSala) => {
  return salas.find((sala) => sala.id === idSala) || null;
};
```

La ausencia se expresa con null para que quien llama pueda comprobarla.

### Ejercicio 6. Preparar una misión

```javascript
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
```

Las salas y el inventario de una misión no deben modificar otra misión.

## Etapa 3. Reglas y prioridades

### Ejercicio 7. Consultar el inventario

```javascript
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

const tieneObjeto = (partida, objeto) => {
  return partida.inventario.includes(objeto);
};
```

La consulta no consume el objeto.

### Ejercicio 8. Comprobar un movimiento

```javascript
const buscarSala = (salas, idSala) => {
  return salas.find((sala) => sala.id === idSala) || null;
};

const tieneObjeto = (partida, objeto) => {
  return partida.inventario.includes(objeto);
};

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

const puedeMoverse = (partida, destino) => {
  const sala = buscarSala(partida.salas, partida.salaActual);
  if (!sala || !sala.conexiones.includes(destino)) { return false; }
  return destino === "hangar"
    ? partida.energiaRestaurada && tieneObjeto(partida, "tarjeta")
    : true;
};
```

El hangar exige las dos condiciones, no una de ellas. No modifiques la sala actual.

### Ejercicio 9. Priorizar el desenlace

```javascript
const resolverEstado = (estadoActual, oxigeno) => {
  if (estadoActual === "Escapaste" || estadoActual === "Cancelado") { return estadoActual; }
  return oxigeno <= 0 ? "Sin oxígeno" : "En juego";
};
```

Escapar usando la última unidad de oxígeno gana.

## Etapa 4. Turnos y registro

### Ejercicio 10. Cobrar una acción

```javascript
const resolverEstado = (estadoActual, oxigeno) => {
  if (estadoActual === "Escapaste" || estadoActual === "Cancelado") { return estadoActual; }
  return oxigeno <= 0 ? "Sin oxígeno" : "En juego";
};

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

const consumirOxigeno = (partida) => {
  partida.oxigeno = Math.max(0, partida.oxigeno - 1);
  partida.estado = resolverEstado(partida.estado, partida.oxigeno);
};
```

Esta función se llama una sola vez por acción válida. No se llama para órdenes rechazadas.

### Ejercicio 11. Guardar una instantánea

```javascript
const normalizarEntrada = (entrada) => {
  return entrada === null ? "cancelar" : entrada.trim().toLowerCase();
};

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

const registrarEvento = (partida, entrada, resultado) => {
  partida.historial.push({ comando: normalizarEntrada(entrada), valido: resultado.valido, mensaje: resultado.mensaje, oxigeno: partida.oxigeno });
};
```

Un registro debe conservar su oxígeno aunque más tarde la partida cambie.

### Ejercicio 12. Cambiar de sala

```javascript
const buscarSala = (salas, idSala) => {
  return salas.find((sala) => sala.id === idSala) || null;
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

const mover = (partida, destino) => {
  if (!puedeMoverse(partida, destino)) { return { valido: false, mensaje: "Destino bloqueado o no conectado" }; }
  partida.salaActual = destino;
  return { valido: true, mensaje: "Entraste en " + destino };
};
```

Un movimiento rechazado deja intacta la posición.

## Etapa 5. Inventario y recursos

### Ejercicio 13. Recoger un objeto

```javascript
const buscarSala = (salas, idSala) => {
  return salas.find((sala) => sala.id === idSala) || null;
};

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

const tomar = (partida, objeto) => {
  const sala = buscarSala(partida.salas, partida.salaActual);
  const posicion = sala.objetos.indexOf(objeto);
  if (posicion === -1) { return { valido: false, mensaje: "Ese objeto no está en esta sala" }; }
  sala.objetos.splice(posicion, 1);
  partida.inventario.push(objeto);
  return { valido: true, mensaje: "Recogiste " + objeto };
};
```

Todos los resultados son objetos {valido, mensaje}. Quitar el objeto evita recogerlo dos veces.

### Ejercicio 14. Recuperar oxígeno

```javascript
const tieneObjeto = (partida, objeto) => {
  return partida.inventario.includes(objeto);
};

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

const usarKit = (partida) => {
  if (!tieneObjeto(partida, "kit") || partida.oxigeno >= 12) {
    return { valido: false, mensaje: "Necesitás un kit y oxígeno menor a 12" };
  }
  partida.inventario.splice(partida.inventario.indexOf("kit"), 1);
  partida.oxigeno = Math.min(12, partida.oxigeno + 4);
  return { valido: true, mensaje: "Kit aplicado" };
};
```

Con 10 de oxígeno, la acción deja 12 antes del costo; el turno completo deja 11.

### Ejercicio 15. Restaurar la energía

```javascript
const tieneObjeto = (partida, objeto) => {
  return partida.inventario.includes(objeto);
};

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

const reparar = (partida) => {
  if (partida.salaActual !== "laboratorio" || !tieneObjeto(partida, "fusible") || partida.energiaRestaurada) {
    return { valido: false, mensaje: "Reparación no disponible" };
  }
  partida.inventario.splice(partida.inventario.indexOf("fusible"), 1);
  partida.energiaRestaurada = true;
  return { valido: true, mensaje: "Energía restaurada" };
};
```

La reparación es de una sola vez y requiere las tres condiciones.

## Etapa 6. Motor de comandos

### Ejercicio 16. Completar la evacuación

```javascript
const tieneObjeto = (partida, objeto) => {
  return partida.inventario.includes(objeto);
};

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

const escapar = (partida) => {
  if (partida.salaActual !== "hangar" || !partida.energiaRestaurada || !tieneObjeto(partida, "tarjeta")) {
    return { valido: false, mensaje: "No podés escapar todavía" };
  }
  partida.estado = "Escapaste";
  return { valido: true, mensaje: "Evacuación completada" };
};
```

El turno cobra después del cambio de estado; resolverEstado conserva la victoria.

### Ejercicio 17. Despachar una orden

```javascript
const buscarSala = (salas, idSala) => {
  return salas.find((sala) => sala.id === idSala) || null;
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

const aplicarComando = (partida, comando) => {
  if (comando.accion === "cancelar") { partida.estado = "Cancelado"; return { valido: false, mensaje: "Misión cancelada" }; }
  if (comando.accion === "mover") { return mover(partida, comando.objetivo); }
  if (comando.accion === "tomar") { return tomar(partida, comando.objetivo); }
  if (comando.accion === "usar-kit") { return usarKit(partida); }
  if (comando.accion === "reparar") { return reparar(partida); }
  return escapar(partida);
};
```

Esta función supone una de las seis acciones válidas; ejecutarTurno protege ese contrato.

### Ejercicio 18. Resolver el turno completo

```javascript
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

const buscarSala = (salas, idSala) => {
  return salas.find((sala) => sala.id === idSala) || null;
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
```

El registro ocurre después del costo. Una orden inválida no consume oxígeno ni modifica la sala o inventario.

## Etapa 7. Informes con métodos

### Ejercicio 19. Mostrar el entorno

```javascript
const buscarSala = (salas, idSala) => {
  return salas.find((sala) => sala.id === idSala) || null;
};

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

const describirSala = (partida) => {
  const sala = buscarSala(partida.salas, partida.salaActual);
  const objetos = sala.objetos.length > 0 ? sala.objetos.join(", ") : "ninguno";
  return sala.nombre + " | Conexiones: " + sala.conexiones.join(", ") + " | Objetos: " + objetos;
};
```

Las conexiones muestran el mapa físico; el acceso al hangar puede seguir bloqueado por sus requisitos.

### Ejercicio 20. Mostrar los recursos

```javascript
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

const listarInventario = (partida) => {
  return partida.inventario.length === 0 ? "Inventario vacío" : "Inventario: " + partida.inventario.join(", ");
};
```

Esta función retorna texto; quien la llama decide dónde mostrarlo.

### Ejercicio 21. Filtrar el historial

```javascript
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

const buscarSala = (salas, idSala) => {
  return salas.find((sala) => sala.id === idSala) || null;
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
```

El historial completo conserva errores; el resumen selecciona solo acciones que consumieron oxígeno.

## Etapa 8. Simulación y misión final

### Ejercicio 22. Ejecutar una ruta

```javascript
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

const buscarSala = (salas, idSala) => {
  return salas.find((sala) => sala.id === idSala) || null;
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

const simularRuta = (comandos) => {
  const partida = crearPartida("Simulación");
  for (const comando of comandos) {
    if (partida.estado !== "En juego") { break; }
    ejecutarTurno(partida, comando);
  }
  return crearResumen(partida);
};
```

Cada simulación comienza desde cero. Después de escapar o cancelar no se ejecuta el resto de la ruta.

### Ejercicio 23. Comparar planes

```javascript
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

const buscarSala = (salas, idSala) => {
  return salas.find((sala) => sala.id === idSala) || null;
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

const simularRuta = (comandos) => {
  const partida = crearPartida("Simulación");
  for (const comando of comandos) {
    if (partida.estado !== "En juego") { break; }
    ejecutarTurno(partida, comando);
  }
  return crearResumen(partida);
};

const compararRutas = (rutas) => {
  return rutas.map((ruta, indice) => {
    return { numero: indice + 1, resumen: simularRuta(ruta) };
  }).filter((ruta) => ruta.resumen.estado === "Escapaste")
    .sort((primera, segunda) => segunda.resumen.oxigeno - primera.resumen.oxigeno || primera.numero - segunda.numero);
};
```

Este es un analizador para planificar. La misión interactiva reutiliza el motor, pero no necesita ejecutar rutas prearmadas.

### Ejercicio 24. Código rojo: escapar

```javascript
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
```

El juego permite ensayar cualquier ruta. No hay reloj: el oxígeno solo baja por acciones válidas. El kit recupera hasta cuatro unidades antes de pagar el costo del turno.

## Contratos del motor

normalizarEntrada, separarComando y validarComando procesan texto sin modificar la partida. crearSalas y crearPartida generan datos independientes. buscarSala y tieneObjeto consultan el estado.

Las acciones mover, tomar, usarKit, reparar y escapar retornan un objeto {valido, mensaje}. Modifican la partida solo si la acción se acepta y no cobran oxígeno por sí mismas. aplicarComando despacha órdenes cuya forma ya fue validada.

ejecutarTurno coordina todo: valida, aplica la acción, cobra exactamente una vez si es válida y registra el resultado. Antes de comenzar comprueba que la misión siga activa.

crearResumen filtra el historial; simularRuta usa el mismo motor en una partida nueva; compararRutas ordena planes ganadores. Estas simulaciones preparan la estrategia. jugarPartida conecta el motor con prompt, alert y console.log.

## Una ruta de referencia

Para revisar después de intentar: mover laboratorio → tomar fusible → reparar → mover entrada → mover archivo → tomar tarjeta → mover hangar → escapar. Son ocho acciones y quedan cuatro unidades de oxígeno.

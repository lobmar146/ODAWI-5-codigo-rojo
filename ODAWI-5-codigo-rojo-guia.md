# ODAWI 05 · Código rojo

24 ejercicios · 8 etapas · 80 pruebas automáticas

## Cómo trabajar

1. Leé la consigna y el recordatorio.
2. Escribí tu solución y tocá Ejecutar para usar tus propias entradas.
3. Tocá Comprobar para ejecutar los casos preparados. Abrí cada caso para comparar esperado y recibido.
4. Corregí y volvé a comprobar. Después explicá qué recibe y devuelve cada función.
5. Consultá la pista o resolución después de intentar.

Las pruebas evalúan los casos incluidos, no todas las soluciones imaginables. En los ejercicios de funciones, los nombres y parámetros son parte de la consigna. Las pruebas llaman a esas funciones; no hace falta escribir las expresiones de prueba más largas. Al modificar el código, los resultados anteriores dejan de estar vigentes.

El código de ejemplo del programa principal se ejecuta primero con respuestas de demostración; luego cada prueba reinicia las respuestas y el azar controlado. La estación es determinista: no hay azar. El programa de demostración cancela antes de ejecutar los casos preparados. Todas las funciones se inicializan antes de la llamada final.

## Reglas de Código rojo

Recorrido avanzado: funciones flecha, ternarias, estado compartido, arreglos de objetos, simulación y comparación de rutas.

Mapa: laboratorio ↔ entrada ↔ archivo ↔ hangar. Se empieza en entrada. Laboratorio contiene fusible; entrada contiene kit; archivo contiene tarjeta.

Comandos: mover [sala], tomar [objeto], usar-kit, reparar, escapar, cancelar. Se ignoran mayúsculas y espacios externos; los argumentos sobrantes son inválidos.

- Oxígeno inicial: 12. Cada acción válida cuesta 1. No hay reloj.
- Entradas inválidas y acciones rechazadas no gastan oxígeno.
- El kit se consume: suma 4 hasta un máximo de 12 antes de cobrar el turno.
- Reparar exige estar en laboratorio y tener fusible; consume el fusible y restaura energía.
- Entrar al hangar exige energía y tarjeta. Escapar exige hangar, energía y tarjeta.
- Escapar con la última unidad gana; llegar a cero con otra acción termina en Sin oxígeno.
- Cancelar conserva recursos y termina la misión.
- Un estado terminal no puede volver a modificarse.

## Editor

Al Ejecutar, alert muestra una ventana con estilo que espera Aceptar. Detener programa interrumpe la ejecución. console.log escribe en Resultados. Comprobar captura los mensajes automáticamente para validar cada caso, sin abrir ventanas.

Colores One Dark y autocompletado incluidos sin conexión. Ctrl + Espacio abre sugerencias; Enter o Tab acepta; Esc cierra; Ctrl + Enter ejecuta. Pantalla completa amplía el editor; el mismo botón o Escape permite volver. El botón Comprobar corre las pruebas. Detener interrumpe una ejecución. Los borradores se conservan mientras la página permanece abierta.

## Etapa 1. Texto y comandos

Convertí entradas libres en órdenes precisas.

Este recorrido supone que ya practicás funciones flecha, arreglos y objetos. No hay repaso desde cero. trim quita espacios externos; toLowerCase normaliza; split con /\s+/ separa uno o más espacios.

```javascript
const partes = "mover archivo".split(/\s+/);
console.log(partes); // ["mover", "archivo"]
```

### Ejercicio 1. Normalizar la entrada

El motor debe entender la misma orden aunque el jugador use mayúsculas o espacios externos. Implementá normalizarEntrada para limpiar esos textos y convertir null en «cancelar», evitando llamar métodos de texto sobre una cancelación.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. null se convierte en "cancelar".
3. Las demás entradas son textos: quitá espacios externos y pasá a minúsculas.

**Pista:** La ternaria permite distinguir Cancelar antes de llamar métodos de texto.

**Plantilla**

```javascript
const normalizarEntrada = (entrada) => {
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- Espacios y mayúsculas. Respuestas: []. Esperado: "mover archivo".
- Cancelar. Respuestas: []. Esperado: "cancelar".
- Vacía. Respuestas: []. Esperado: "".

### Ejercicio 2. Interpretar una orden

Una orden como «mover archivo» contiene una acción y un objetivo. Implementá separarComando para normalizarla y retornar un objeto con esas partes y su cantidad total, conservando la información necesaria para detectar argumentos sobrantes.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. Normalizá la entrada. Separá por uno o más espacios; un texto vacío produce un arreglo vacío.
3. Retorná {accion, objetivo, cantidadPartes}. Usá "" si falta acción u objetivo.
4. Conservá la cantidad de partes para rechazar argumentos extra después.

**Pista:** No descartes silenciosamente un tercer término: cantidadPartes debe contarlo.

**Plantilla**

```javascript
const normalizarEntrada = (entrada) => {
  return entrada === null ? "cancelar" : entrada.trim().toLowerCase();
};

const separarComando = (entrada) => {
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- Dos partes. Respuestas: []. Esperado: {"accion":"mover","objetivo":"archivo","cantidadPartes":2}.
- Vacío. Respuestas: []. Esperado: {"accion":"","objetivo":"","cantidadPartes":0}.
- Argumento extra. Respuestas: []. Esperado: {"accion":"mover","objetivo":"archivo","cantidadPartes":3}.
- Cancelar. Respuestas: []. Esperado: {"accion":"cancelar","objetivo":"","cantidadPartes":1}.

### Ejercicio 3. Validar la forma

Antes de ejecutar una orden, debemos saber si está bien formada. Implementá validarComando para exigir un objetivo en mover y tomar, y ningún argumento en las demás acciones admitidas. Esta comprobación no decide todavía si existe el destino o el objeto.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. mover y tomar exigen exactamente dos partes.
3. usar-kit, reparar, escapar y cancelar exigen exactamente una parte.
4. Cualquier otra acción retorna false. Usá includes y una ternaria.

**Pista:** Esta función solo valida la forma de la orden. Que exista la sala o el objeto se verifica después.

**Plantilla**

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
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- Movimiento. Respuestas: []. Esperado: true.
- Sin destino. Respuestas: []. Esperado: false.
- Sobra argumento. Respuestas: []. Esperado: false.
- Desconocida. Respuestas: []. Esperado: false.
- Kit. Respuestas: []. Esperado: true.

## Etapa 2. Mapa y estado inicial

Modelá una estación con objetos conectados.

Cada sala tiene id, nombre, conexiones y objetos. Las conexiones son identificadores. find devuelve el primer elemento encontrado o undefined. Las partidas deben ser independientes.

```javascript
const sala = { id: "entrada", conexiones: ["archivo"], objetos: ["kit"] };
```

### Ejercicio 4. Construir el mapa

La misión ocurre en cuatro salas conectadas, cada una con sus propios recursos. Implementá crearSalas para construir el mapa descrito abajo mediante objetos y arreglos nuevos, de modo que dos misiones no compartan cambios en sus salas.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. Retorná cuatro objetos: entrada, laboratorio, archivo y hangar.
3. entrada: nombre Acceso principal, conexiones laboratorio y archivo, objeto kit.
4. laboratorio: nombre Laboratorio, conexión entrada, objeto fusible.
5. archivo: nombre Archivo, conexiones entrada y hangar, objeto tarjeta.
6. hangar: nombre Hangar de evacuación, conexión archivo, sin objetos.
7. Cada llamada crea salas y arreglos nuevos.

**Pista:** Los nombres visibles pueden llevar tildes; los identificadores y comandos se escriben como indica la consigna.

**Plantilla**

```javascript
const crearSalas = () => {
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- Identificadores. Respuestas: []. Esperado: ["entrada","laboratorio","archivo","hangar"].
- Recursos. Respuestas: []. Esperado: [["kit"],["fusible"],["tarjeta"],[]].
- Conexiones. Respuestas: []. Esperado: [["laboratorio","archivo"],["entrada"],["entrada","hangar"],["archivo"]].
- Independientes. Respuestas: []. Esperado: ["kit"].

### Ejercicio 5. Buscar por identificador

Varias acciones necesitan consultar una sala por su identificador. Implementá buscarSala con find para devolver el objeto correspondiente o null cuando no exista, sin modificar el mapa.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. Usá find para buscar idSala en salas.
3. Retorná null si no existe. No modifiques el arreglo.

**Pista:** La ausencia se expresa con null para que quien llama pueda comprobarla.

**Plantilla**

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
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- Archivo. Respuestas: []. Esperado: "Archivo".
- Ausente. Respuestas: []. Esperado: null.

### Ejercicio 6. Preparar una misión

Antes de aceptar órdenes, el juego necesita un estado inicial completo. Implementá crearPartida para reunir el nombre, un mapa nuevo, la posición inicial, el inventario, el oxígeno, la energía, el estado y el historial según los valores indicados.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. Retorná nombreJugador, salas: crearSalas(), salaActual: "entrada", inventario: [], oxigeno: 12, energiaRestaurada: false, estado: "En juego", historial: [].

**Pista:** Las salas y el inventario de una misión no deben modificar otra misión.

**Plantilla**

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
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- Inicio. Respuestas: []. Esperado: ["entrada",12,false,"En juego",[],[]].
- Nombre. Respuestas: []. Esperado: "Ana".
- Partidas independientes. Respuestas: []. Esperado: ["kit"].

## Etapa 3. Reglas y prioridades

Decidí qué se puede hacer antes de modificar datos.

Las condiciones combinan posición, conexiones, inventario y energía. Una misión evacuada gana aunque termine con cero oxígeno. Cancelar también conserva su estado.

```javascript
const tieneTarjeta = (inventario) => inventario.includes("tarjeta");
```

### Ejercicio 7. Consultar el inventario

Las acciones deben poder consultar si el jugador lleva un recurso. Implementá tieneObjeto para buscarlo en el inventario y devolver un booleano, sin consumirlo ni modificar la partida.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. Retorná si inventario incluye objeto.

**Pista:** La consulta no consume el objeto.

**Plantilla**

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
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- Vacío. Respuestas: []. Esperado: false.
- Presente. Respuestas: []. Esperado: true.

### Ejercicio 8. Comprobar un movimiento

No alcanza con que una sala exista: debe estar conectada con la posición actual. Implementá puedeMoverse para comprobar esa conexión y exigir además energía restaurada y tarjeta cuando el destino sea el hangar. Esta función solo decide, sin mover al jugador.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. Buscá la sala actual y verificá que destino esté en conexiones.
3. Para entrar al hangar también se exige energía restaurada y tarjeta.
4. Para otras conexiones basta estar conectado. Retorná un booleano.

**Pista:** El hangar exige las dos condiciones, no una de ellas. No modifiques la sala actual.

**Plantilla**

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
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- Conectada. Respuestas: []. Esperado: true.
- No conectada. Respuestas: []. Esperado: false.
- Bloqueada. Respuestas: []. Esperado: false.
- Habilitada. Respuestas: []. Esperado: true.

### Ejercicio 9. Priorizar el desenlace

El estado final depende del oxígeno y de lo que acaba de ocurrir. Implementá resolverEstado para conservar una evacuación o una cancelación y, en los demás casos, decidir si todavía se puede jugar. Escapar con la última unidad de oxígeno debe contar como victoria.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. Si estadoActual es Escapaste o Cancelado, conservá ese estado.
3. En otro caso, oxigeno <= 0 retorna Sin oxígeno; si no, En juego. Usá ternaria.

**Pista:** Escapar usando la última unidad de oxígeno gana.

**Plantilla**

```javascript
const resolverEstado = (estadoActual, oxigeno) => {
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- Última unidad. Respuestas: []. Esperado: "Escapaste".
- Derrota. Respuestas: []. Esperado: "Sin oxígeno".
- Cancelación. Respuestas: []. Esperado: "Cancelado".
- Continúa. Respuestas: []. Esperado: "En juego".

## Etapa 4. Turnos y registro

Separá el costo del efecto de una acción.

Las acciones modifican posición o inventario; ejecutarTurno será quien cobre exactamente una unidad por acción válida. El historial guarda el oxígeno después de cobrar.

```javascript
const evento = { comando: "tomar kit", valido: true, mensaje: "Recogiste kit", oxigeno: 11 };
```

### Ejercicio 10. Cobrar una acción

Cada acción aceptada tiene un costo de una unidad de oxígeno. Implementá consumirOxigeno para descontarla sin bajar de cero y actualizar el estado mediante resolverEstado. El motor la llamará una sola vez por acción válida.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. Restá una unidad y limitá a cero con Math.max.
3. Actualizá estado llamando a resolverEstado.

**Pista:** Esta función se llama una sola vez por acción válida. No se llama para órdenes rechazadas.

**Plantilla**

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
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- Descuento. Respuestas: []. Esperado: 11.
- Derrota. Respuestas: []. Esperado: [0,"Sin oxígeno"].
- Evacuación. Respuestas: []. Esperado: "Escapaste".

### Ejercicio 11. Guardar una instantánea

Necesitamos poder revisar lo ocurrido en cada turno. Implementá registrarEvento para agregar al historial el comando normalizado, su resultado y el oxígeno actual, guardando valores que no cambien cuando avance la partida.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. Agregá a historial un objeto con comando normalizado, valido y mensaje del resultado, y oxigeno actual.
3. Guardá esos valores, no una referencia al objeto partida.

**Pista:** Un registro debe conservar su oxígeno aunque más tarde la partida cambie.

**Plantilla**

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
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- Instantánea. Respuestas: []. Esperado: {"comando":"tomar kit","valido":true,"mensaje":"Recogiste kit","oxigeno":12}.
- Orden inválida. Respuestas: []. Esperado: 1.

### Ejercicio 12. Cambiar de sala

Ahora implementá el efecto de desplazarse. La función mover debe consultar puedeMoverse y cambiar salaActual únicamente si el destino está habilitado. Debe retornar el resultado indicado, pero no descontar oxígeno: ese costo corresponde al motor del turno.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. Si puedeMoverse es false, retorná {valido:false, mensaje:"Destino bloqueado o no conectado"}.
3. Si se permite, actualizá salaActual y retorná {valido:true, mensaje:"Entraste en " + destino}.
4. No cobres oxígeno aquí.

**Pista:** Un movimiento rechazado deja intacta la posición.

**Plantilla**

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
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- Movimiento válido. Respuestas: []. Esperado: [{"valido":true,"mensaje":"Entraste en archivo"},"archivo",12].
- Bloqueo. Respuestas: []. Esperado: "entrada".

## Etapa 5. Inventario y recursos

Implementá acciones que consumen o trasladan objetos.

indexOf devuelve -1 si un objeto no está. splice elimina por posición. Las acciones exitosas retornan valido:true; las rechazadas no deben modificar nada. No cobran oxígeno por sí mismas.

```javascript
const objetos = ["kit", "fusible"];
objetos.splice(objetos.indexOf("kit"),1);
```

### Ejercicio 13. Recoger un objeto

Un recurso disponible en la sala puede pasar al inventario. Implementá tomar para encontrarlo, quitarlo de la sala y agregarlo al jugador, o rechazar la acción sin cambios si no está allí. Así un mismo objeto no se puede recoger dos veces.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. Buscá objeto en los objetos de la sala actual.
3. Si no está, retorná false con mensaje "Ese objeto no está en esta sala".
4. Si está, quitalo de la sala y agregalo al inventario. Retorná true con "Recogiste " + objeto.

**Pista:** Todos los resultados son objetos {valido, mensaje}. Quitar el objeto evita recogerlo dos veces.

**Plantilla**

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
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- Recoger kit. Respuestas: []. Esperado: [{"valido":true,"mensaje":"Recogiste kit"},["kit"],[]].
- Repetido. Respuestas: []. Esperado: [false,["kit"]].
- Otra sala. Respuestas: []. Esperado: false.

### Ejercicio 14. Recuperar oxígeno

El kit permite recuperar oxígeno, pero se consume al usarlo. Implementá usarKit para exigir que el jugador lo tenga y no esté al máximo, recuperar hasta cuatro unidades con tope de doce y retirar el kit. La unidad que cuesta la acción se cobrará después.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. Se requiere kit en el inventario y oxigeno menor a 12.
3. Si falla, retorná {valido:false, mensaje:"Necesitás un kit y oxígeno menor a 12"}.
4. Consumí el kit, sumá 4 unidades sin superar 12 y retorná true con "Kit aplicado".
5. El turno cobrará una unidad después: no la restes aquí.

**Pista:** Con 10 de oxígeno, la acción deja 12 antes del costo; el turno completo deja 11.

**Plantilla**

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
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- Recuperar. Respuestas: []. Esperado: [true,10,[]].
- Tope. Respuestas: []. Esperado: 12.
- Lleno conserva kit. Respuestas: []. Esperado: [false,["kit"]].
- Sin kit. Respuestas: []. Esperado: false.

### Ejercicio 15. Restaurar la energía

La energía de la estación debe restaurarse antes de entrar al hangar. Implementá reparar para permitirlo únicamente en el laboratorio, con un fusible disponible y la energía aún apagada; una reparación exitosa consume el fusible y activa la energía.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. Exigí salaActual laboratorio, fusible en inventario y energía todavía apagada.
3. Si falla, retorná false con "Reparación no disponible".
4. Consumí el fusible, activá energiaRestaurada y retorná true con "Energía restaurada".

**Pista:** La reparación es de una sola vez y requiere las tres condiciones.

**Plantilla**

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
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- Reparación. Respuestas: []. Esperado: [true,true,[]].
- Lugar incorrecto. Respuestas: []. Esperado: [false,["fusible"]].
- Ya reparada. Respuestas: []. Esperado: false.

## Etapa 6. Motor de comandos

Integrá validación, efectos y costo en un solo turno.

Un turno comprueba que la misión siga activa, interpreta, ejecuta, cobra si corresponde y registra. Cancelar no consume oxígeno. Una partida terminada no debe volver a modificarse.

```javascript
const resultado = { valido: false, mensaje: "Comando inválido" };
```

### Ejercicio 16. Completar la evacuación

Llegar al hangar no termina automáticamente la misión. Implementá escapar para exigir la posición, la energía y la tarjeta necesarias, y cambiar el estado a «Escapaste» solo cuando se cumplan las tres condiciones.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. Exigí hangar, energía restaurada y tarjeta.
3. Si falla, retorná false con "No podés escapar todavía".
4. Si se cumple, cambiá estado a Escapaste y retorná true con "Evacuación completada".

**Pista:** El turno cobra después del cambio de estado; resolverEstado conserva la victoria.

**Plantilla**

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
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- No listo. Respuestas: []. Esperado: false.
- Evacuar. Respuestas: []. Esperado: [{"valido":true,"mensaje":"Evacuación completada"},"Escapaste"].
- Sin tarjeta. Respuestas: []. Esperado: false.

### Ejercicio 17. Despachar una orden

El motor necesita derivar cada orden a la acción correspondiente. Implementá aplicarComando para recibir una orden cuya forma ya fue validada, llamar a la función adecuada y retornar su resultado. La cancelación cambia el estado sin cobrar oxígeno.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. Recibí un comando cuya forma ya fue validada.
3. cancelar cambia estado a Cancelado y devuelve {valido:false, mensaje:"Misión cancelada"}.
4. mover y tomar pasan objetivo a sus funciones. usar-kit llama usarKit; reparar llama reparar; escapar llama escapar.
5. Retorná el resultado de la acción. No cobres ni registres aquí.

**Pista:** Esta función supone una de las seis acciones válidas; ejecutarTurno protege ese contrato.

**Plantilla**

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
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- Tomar. Respuestas: []. Esperado: {"valido":true,"mensaje":"Recogiste kit"}.
- Cancelar. Respuestas: []. Esperado: [false,"Cancelado",12].
- Reparar sin requisitos. Respuestas: []. Esperado: false.

### Ejercicio 18. Resolver el turno completo

Integrá todas las reglas en ejecutarTurno, el punto de entrada del motor. Debe proteger una misión terminada, interpretar y validar la entrada, aplicar la acción, cobrar únicamente si fue válida y registrar el resultado después del costo.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. Si estado no es En juego, retorná false con "La misión terminó", sin registrar ni modificar.
3. Separá y validá entrada. Si la forma falla, usá false con "Comando inválido"; si no, llamá aplicarComando.
4. Cobrá oxígeno únicamente cuando resultado.valido sea true.
5. Registrá todos los comandos de una partida activa, incluso inválidos y cancelar. Retorná resultado.

**Pista:** El registro ocurre después del costo. Una orden inválida no consume oxígeno ni modifica la sala o inventario.

**Plantilla**

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
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- Turno válido. Respuestas: []. Esperado: [11,11,["kit"]].
- Error sin costo. Respuestas: []. Esperado: [12,false].
- Kit con costo. Respuestas: []. Esperado: 11.
- Final intacto. Respuestas: []. Esperado: [[],[],12].
- Cancelación sin costo. Respuestas: []. Esperado: ["Cancelado",12].
- Última unidad. Respuestas: []. Esperado: ["Escapaste",0].

## Etapa 7. Informes con métodos

Transformá el estado en información para el jugador.

Las funciones de consulta no cambian la partida. filter selecciona eventos válidos, map extrae sus comandos y join convierte listas en texto legible.

```javascript
const comandos = [{comando:"tomar kit",valido:true}].filter((e)=>e.valido).map((e)=>e.comando);
```

### Ejercicio 19. Mostrar el entorno

El jugador necesita conocer su entorno antes de elegir una acción. Implementá describirSala para convertir la sala actual en un texto con nombre, conexiones y objetos, indicando «ninguno» si está vacía y sin modificar sus datos.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. Buscá la sala actual.
3. Retorná "[nombre] | Conexiones: [ids separados por coma y espacio] | Objetos: [objetos]".
4. Si no hay objetos, escribí "ninguno" mediante una ternaria.

**Pista:** Las conexiones muestran el mapa físico; el acceso al hangar puede seguir bloqueado por sus requisitos.

**Plantilla**

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
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- Entrada. Respuestas: []. Esperado: "Acceso principal | Conexiones: laboratorio, archivo | Objetos: kit".
- Sin objetos. Respuestas: []. Esperado: "Acceso principal | Conexiones: laboratorio, archivo | Objetos: ninguno".

### Ejercicio 20. Mostrar los recursos

Para planificar el siguiente paso, el jugador debe poder consultar sus recursos. Implementá listarInventario para retornar una descripción del inventario o el mensaje de que está vacío, usando una ternaria y sin consumir objetos.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. Si el inventario está vacío, retorná "Inventario vacío".
3. Si no, retorná "Inventario: " seguido de sus objetos unidos por coma y espacio. Usá ternaria.

**Pista:** Esta función retorna texto; quien la llama decide dónde mostrarlo.

**Plantilla**

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
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- Vacío. Respuestas: []. Esperado: "Inventario vacío".
- Dos objetos. Respuestas: []. Esperado: "Inventario: kit, tarjeta".

### Ejercicio 21. Filtrar el historial

El historial incluye órdenes aceptadas, errores y cancelaciones, pero el resumen debe distinguir las acciones que gastaron oxígeno. Implementá crearResumen con filter y map para retornar el estado, el oxígeno y la lista y cantidad de acciones válidas.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. Filtrá los eventos con valido true.
3. Retorná {estado, oxigeno, accionesValidas: cantidad, comandos: arreglo de comandos válidos}.
4. No cuentes errores ni cancelación como acciones válidas.

**Pista:** El historial completo conserva errores; el resumen selecciona solo acciones que consumieron oxígeno.

**Plantilla**

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
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- Inicio. Respuestas: []. Esperado: {"estado":"En juego","oxigeno":12,"accionesValidas":0,"comandos":[]}.
- Filtrar. Respuestas: []. Esperado: {"estado":"Cancelado","oxigeno":11,"accionesValidas":1,"comandos":["tomar kit"]}.

## Etapa 8. Simulación y misión final

Probá rutas antes de jugar con entradas reales.

Una simulación crea una partida independiente. Ordená rutas ganadoras por oxígeno restante descendente, con número de ruta como desempate. El juego interactivo usa el mismo motor.

```javascript
const ordenados = [3,1,2].sort((a,b)=>b-a);
```

### Ejercicio 22. Ejecutar una ruta

Antes de jugar, podemos ensayar una ruta sin pedir datos al usuario. Implementá simularRuta para crear una misión independiente, ejecutar sus comandos en orden hasta que termine y retornar el resumen, sin modificar el arreglo de instrucciones recibido.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. Creá una partida llamada Simulación.
3. Recorré comandos y ejecutá cada turno mientras siga En juego. Cortá si termina.
4. Retorná crearResumen. No modifiques el arreglo recibido.

**Pista:** Cada simulación comienza desde cero. Después de escapar o cancelar no se ejecuta el resto de la ruta.

**Plantilla**

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
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- Ruta ganadora. Respuestas: []. Esperado: {"estado":"Escapaste","oxigeno":4,"accionesValidas":8,"comandos":["mover laboratorio","tomar fusible","reparar","mover entrada","mover archivo","tomar tarjeta","mover hangar","escapar"]}.
- Cancelada. Respuestas: []. Esperado: {"estado":"Cancelado","oxigeno":12,"accionesValidas":0,"comandos":[]}.
- Errores no gastan. Respuestas: []. Esperado: 12.

### Ejercicio 23. Comparar planes

Compará varias estrategias usando el simulador que ya construiste. Implementá compararRutas para conservar solo las que logran escapar y ordenarlas por oxígeno restante de mayor a menor, manteniendo el número original de ruta para identificar y desempatar resultados.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. Usá map para crear {numero: indice + 1, resumen: simularRuta(ruta)}.
3. Filtrá las rutas que terminan en Escapaste.
4. Ordená por oxígeno restante, de mayor a menor. Si empatan, por numero ascendente.
5. No cambies los arreglos de rutas recibidos.

**Pista:** Este es un analizador para planificar. La misión interactiva reutiliza el motor, pero no necesita ejecutar rutas prearmadas.

**Plantilla**

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
  // TODO: implementá los pasos de la consigna.
};
```

**Pruebas incluidas**

- Solo ganadoras. Respuestas: []. Esperado: [2,3].
- Mayor oxígeno primero. Respuestas: []. Esperado: [2,1].
- Ninguna. Respuestas: []. Esperado: [].

### Ejercicio 24. Código rojo: escapar

Construí la misión interactiva de Código rojo conectando el motor con prompt, alert y console.log. Completá jugarPartida para mostrar el entorno, recibir órdenes y presentar sus resultados hasta escapar, quedarse sin oxígeno o cancelar. Reutilizá las acciones y validaciones existentes en lugar de volver a escribir sus reglas.

**Para el juego:** El juego final reutiliza esta lógica. Las funciones de apoyo ya trabajadas están incluidas; completá solamente la función indicada.

1. Usá una función flecha con los parámetros de la plantilla.
2. Pedí el nombre; si se cancela, retorná null. Creá la partida.
3. Mostrá el aviso "Código rojo. Tenés 12 unidades de oxígeno.".
4. Mientras esté En juego, mostrá describirSala, listarInventario y "Oxígeno: " con el valor actual.
5. Pedí una orden, pasala a ejecutarTurno y mostrá resultado.mensaje con alert.
6. Al terminar, mostrá crearResumen por consola, el estado con alert y retorná la partida.
7. Usá el motor ya construido: no reimplementes acciones, validaciones ni costos.

**Pista:** El juego permite ensayar cualquier ruta. No hay reloj: el oxígeno solo baja por acciones válidas. El kit recupera hasta cuatro unidades antes de pagar el costo del turno.

**Plantilla**

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
  // TODO: implementá los pasos de la consigna.
};

jugarPartida();
```

**Pruebas incluidas**

- Escape completo. Respuestas: ["Ana","mover laboratorio","tomar fusible","reparar","mover entrada","mover archivo","tomar tarjeta","mover hangar","escapar"]. Esperado: {"estado":"Escapaste","oxigeno":4,"accionesValidas":8,"comandos":["mover laboratorio","tomar fusible","reparar","mover entrada","mover archivo","tomar tarjeta","mover hangar","escapar"]}.
- Cancelación de nombre. Respuestas: [null]. Esperado: null.
- Órdenes inválidas y cancelación. Respuestas: ["Ana","volar","mover hangar",null]. Esperado: {"estado":"Cancelado","oxigeno":12,"accionesValidas":0,"comandos":[]}.
- Oxígeno agotado. Respuestas: ["Ana","mover archivo","mover entrada","mover archivo","mover entrada","mover archivo","mover entrada","mover archivo","mover entrada","mover archivo","mover entrada","mover archivo","mover entrada"]. Esperado: "Sin oxígeno".
- Victoria con último oxígeno. Respuestas: ["Ana","mover archivo","mover entrada","mover archivo","mover entrada","mover laboratorio","tomar fusible","reparar","mover entrada","mover archivo","tomar tarjeta","mover hangar","escapar"]. Esperado: {"estado":"Escapaste","oxigeno":0,"accionesValidas":12,"comandos":["mover archivo","mover entrada","mover archivo","mover entrada","mover laboratorio","tomar fusible","reparar","mover entrada","mover archivo","tomar tarjeta","mover hangar","escapar"]}.
- Hangar bloqueado desde archivo. Respuestas: ["Ana","mover archivo","mover hangar",null]. Esperado: {"estado":"Cancelado","oxigeno":11,"accionesValidas":1,"comandos":["mover archivo"]}.
- Kit consumido una sola vez. Respuestas: ["Ana","tomar kit","usar-kit","usar-kit",null]. Esperado: {"estado":"Cancelado","oxigeno":11,"accionesValidas":2,"comandos":["tomar kit","usar-kit"]}.
- Fusible no se duplica. Respuestas: ["Ana","mover laboratorio","tomar fusible","tomar fusible","reparar","reparar",null]. Esperado: [9,[],true].

## Contratos del motor

normalizarEntrada, separarComando y validarComando procesan texto sin modificar la partida. crearSalas y crearPartida generan datos independientes. buscarSala y tieneObjeto consultan el estado.

Las acciones mover, tomar, usarKit, reparar y escapar retornan un objeto {valido, mensaje}. Modifican la partida solo si la acción se acepta y no cobran oxígeno por sí mismas. aplicarComando despacha órdenes cuya forma ya fue validada.

ejecutarTurno coordina todo: valida, aplica la acción, cobra exactamente una vez si es válida y registra el resultado. Antes de comenzar comprueba que la misión siga activa.

crearResumen filtra el historial; simularRuta usa el mismo motor en una partida nueva; compararRutas ordena planes ganadores. Estas simulaciones preparan la estrategia. jugarPartida conecta el motor con prompt, alert y console.log.

## Una ruta de referencia

Para revisar después de intentar: mover laboratorio → tomar fusible → reparar → mover entrada → mover archivo → tomar tarjeta → mover hangar → escapar. Son ocho acciones y quedan cuatro unidades de oxígeno.

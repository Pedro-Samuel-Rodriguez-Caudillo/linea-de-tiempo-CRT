# TODO:
Esto es una 
## Visual
Monitor CRT con aberraciones cromáticas muy notables y en 3D texto en color blanco y fondo negro.
Cada línea se dibuja como una consola antigua.

## Lógica
1. Usuario entra a index.html
2. En primer inicio se hace una simulación de un boot de computadora con datos ficticios `PapuSO`
3. Usuario espera 3 segundos a que termine la simulación.
4. En primera interacción se hace se carga:
    a. Un banner (solo en primera interacción se muestra)
    b. Un texto encriptado (*)
    c. Una pregunta con 3 respuestas, Sí (continuar) [Este es default y no se muestra si es el último evento], Desencriptar, Salir.

| Paso | Sí (continuar) | Desencriptar | Salir |
| 5 | Se muestra el siguiente texto encriptado en formato a. Un texto encriptado(*) b. pregunta | Se inicia un minijuego de la lista de Minijuegos  | Inicia Operación de salida de SO |
| 6 | ... | Al conseguir un punto se desencripta una letra | ... |
| 7 | ... | Si se pierde antes de que se desencripte todo el texto se sale del juego y no desencripta una palabra más (no da ya la opcion de desencriptar) | ... |
| 8 | ... | Si se desencriptan todas las palabras sale una pantalla de `ganaste`, se limpia la pantalla y regresa a punto 5 | ... |


### Lógica del texto encriptado (*)
Recoje de `data.json` en formato:
{
    titulo: "",
    anio: "",
    descripcion: ""
}
Encripta todo por palabras en binario.

## Minujuegos
 Se eligirá aleatoriamente uno de estos, cada punto es una palabra más decifradas y en la esquina superior derecha se viene un texto de  X / Y Palabras descifradas.
 Se sale al:
 a. ganar suficientes puntos para descrifrar suficientes puntos para descifrar todas las palabras.
 b. Perder todas las vidas (en tal caso solo se descifran las palabras alcanzadas).

 ### Lista de Minijuegos

 - Asteroids ASCII (arcade rápido)

En consola funciona como un “campo” rectangular fijo con un borde y un área interna donde todo es grid. La nave puede ser ^ (u otro símbolo según orientación) y los asteroides O/0/o (tamaños). La física continua típica se simplifica a movimiento por celdas con velocidades discretas (p. ej. vx, vy ∈ {-1,0,1}) y una actualización por “ticks” (30–60 ms). Para que se sienta como Asteroids sin complejidad, usa wrap-around en bordes internos (sale por derecha y entra por izquierda) y rotación por 8 direcciones (N, NE, E, …). Disparos como - o | que avanzan recto por un número fijo de ticks. Puntuación: grande=10, mediano=20, pequeño=40, bonus por rachas sin recibir daño. Dificultad: cada oleada aumenta conteo y velocidad.

- Breakout (arcade rápido)

El tablero se vuelve una matriz: fila inferior con la paleta (====), bola como o, bloques como █/#. La adaptación clave es el rebote: al colisionar con la paleta, el ángulo se decide por el punto de impacto (izquierda rebota hacia izquierda, centro hacia arriba, derecha hacia derecha), con 3–5 ángulos discretos (no flotantes). Colisiones con bloques: cuando la bola entra a una celda ocupada, se elimina el bloque, se invierte vy o vx según la dirección previa (regla simple: priorizar inversión vertical si venía más vertical). Puntuación por bloque, multiplicador por romper varios sin perder la bola. Para hacerlo “rápido”, aumenta velocidad gradualmente o reduce el “delay” entre ticks conforme avanza el nivel.

- Pong (arcade rápido)

Representación minimal: dos paletas verticales (| repetidos) y pelota o. Control: W/S para jugador; el rival puede ser IA simple (seguir la pelota con retardo y error aleatorio) para evitar perfección. Rebote en paleta: igual que Breakout, ángulos discretos por zona de contacto (arriba, medio, abajo) para que haya control. Puntuación por puntos ganados; cada punto reinicia pelota con dirección aleatoria. Para mantenerlo “arcade”, agrega “speed-up” cada 3–5 rebotes y límite de velocidad.

- Dodge (esquiva rápida)

Es el más natural en consola: jugador @ en la fila inferior (o penúltima) moviéndose solo en X; desde arriba caen objetos. “Buenos” pueden ser . (dan puntos al recoger) y “malos” */X (quitan vida o terminan). Se actualiza por ticks: en cada tick, los objetos bajan 1 celda; con cierta probabilidad spawneas nuevos en posiciones X aleatorias. Puntuación: +1 por tick sobrevivido y +N por recoger; dificultad: aumentar tasa de spawn, velocidad (bajar 2 celdas cada cierto tiempo), o introducir patrones (lluvia en columnas). Es importante el “input” no bloqueante para que se sienta fluido.

- Space Invaders (arcade rápido)

En consola se ve excelente porque es grid puro. ¡Enemigos como W/M en filas, jugador A o ^ abajo, disparos |, disparos enemigos!. Movimiento de la formación: horizontal en bloque; al tocar pared interna, baja 1 fila y cambia dirección. Barricadas como # con “vida” (se degradan: #→+→.). Puntuación por enemigo y bonus por limpiar oleada. Para velocidad arcade: disminuye el delay del movimiento de la formación conforme quedan menos enemigos (como el original). Simplificación útil: 1 disparo del jugador en pantalla a la vez (clásico), y límite de 2–3 disparos enemigos simultáneos.

Si tu “consola” es en navegador (index.html) pero con estética terminal, estas adaptaciones encajan igual: renderizas el grid como texto monoespaciado en un <pre> y capturas teclado con eventos, manteniendo un game loop por requestAnimationFrame o setInterval. Si es terminal real (ncurses), la lógica es idéntica; solo cambia el render/input.




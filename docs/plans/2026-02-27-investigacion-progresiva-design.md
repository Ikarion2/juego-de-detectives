# Investigacion Progresiva con Puntos de Quiebre — Documento de Diseno

**Fecha:** 2026-02-27
**Proyecto:** Cambia-el-Chip: Juego de Detectives
**Objetivo:** Rediseno profundo para reforzar deduccion, flexibilidad mental, y el principio de que la primera opinion no siempre es la correcta.

---

## 1. Problema

Los estudiantes:
- Adivinan el culpable rapidamente y no cambian de opinion
- Clasifican pistas sin leerlas para avanzar rapido
- Usan el timeline como prueba y error en vez de razonamiento

El juego actual permite "pasar" sin razonar genuinamente. El flujo lineal (pistas -> acusacion -> timeline) no fuerza reconsideracion.

## 2. Solucion: Flujo por Fases Iterativas

### Flujo actual
```
Menu -> Objetivos -> Pistas+Personajes -> Acusacion -> Timeline -> Solucion -> Evaluacion
```

### Flujo propuesto
```
Menu -> Objetivos -> FASE 1 (primeras pistas + hipotesis inicial)
                   -> FASE 2 (pistas contradictorias + revisar hipotesis)
                   -> FASE 3 (pistas finales + acusacion definitiva)
                   -> Timeline (con conexion a evidencia)
                   -> Solucion (con historial de cambios de opinion)
                   -> Evaluacion
```

### Detalle de cada fase

**FASE 1 — "Primera Impresion"**
- El jugador ve todos los personajes + las primeras 4-5 pistas (superficiales/enganosas)
- Debe elegir un sospechoso y escribir brevemente por que
- La hipotesis queda registrada en `playerJourney.phase1`
- Las pistas de esta fase tienen `misleading: true` y `pointsTo: "NombreSospechoso"`

**FASE 2 — "El Giro"**
- Se revelan 4-5 pistas nuevas que contradicen la hipotesis inicial
- Mensaje: "Nueva evidencia encontrada. Mantienes tu hipotesis o cambias?"
- El jugador puede cambiar de sospechoso o mantener
- Debe escribir justificacion (texto libre, NO puntuado)
- Se registra si cambio o no en `playerJourney.phase2`

**FASE 3 — "Acusacion Final"**
- Se revelan las pistas restantes (las mas reveladoras)
- Acusacion definitiva: sospechoso + motivo + metodo
- Se registra si cambio respecto a fases anteriores
- Se almacena en `playerJourney.phase3`

## 3. Estructura de Datos

### 3.1 Pistas por fases (reemplaza array plano)

```javascript
// ANTES
clues: [
  { text: "...", relevant: true },
  ...
]

// DESPUES
clues: {
  phase1: [
    { text: "...", relevant: false, misleading: true, pointsTo: "Sra. Lopez" },
    { text: "...", relevant: true, misleading: false },
    ...
  ],
  phase2: [
    { text: "...", relevant: true, misleading: false, contradicts: "Sra. Lopez" },
    ...
  ],
  phase3: [
    { text: "...", relevant: true, misleading: false }
  ]
}
```

Campos nuevos por pista:
- `misleading` (boolean): pista disenada para enganar
- `pointsTo` (string, opcional): a que sospechoso apunta
- `contradicts` (string, opcional): que hipotesis contradice

### 3.2 Personajes con nivel de sospecha

```javascript
characters: [
  {
    name: "...", image: "...",
    personality: "...", testimony: "...", truth: false,
    suspicionLevel: "high" // high | medium | low
  }
]
```

`suspicionLevel` permite ordenar visualmente (los mas sospechosos primero en Fase 1).

### 3.3 Registro del viaje del jugador (nuevo estado global)

```javascript
playerJourney: {
  phase1: { suspect: "", reasoning: "", timestamp: null },
  phase2: { suspect: "", reasoning: "", changed: false, timestamp: null },
  phase3: { suspect: "", motive: "", method: "", changed: false, timestamp: null },
  totalChanges: 0
}
```

### 3.4 Cronologia con hints de evidencia

```javascript
// ANTES
chronology: ["Evento 1", "Evento 2", ...]

// DESPUES
chronology: [
  { event: "Alguien accedio al laboratorio a las 21:00",
    clueHint: "Registro de acceso digital" },
  { event: "Se encontro el frasco roto junto a la ventana",
    clueHint: "Fragmentos de vidrio con residuo quimico" },
  ...
]
```

## 4. Sistema de Scoring

### Pesos nuevos (4 ejes)
| Categoria | Peso | Que mide |
|-----------|------|----------|
| Deduccion | 25% | Clasificacion correcta de pistas. Bonus por detectar pistas misleading |
| Flexibilidad Mental | 30% | Acciones observables de cambio de opinion (NO texto libre) |
| Acusacion Final | 25% | Culpable correcto + motivo + metodo |
| Timeline | 20% | % de eventos en posicion correcta |

### Logica de Flexibilidad Mental (solo acciones, sin evaluar texto)

```
Si culpable_real != sospechoso_fase1:
  -> Cambio y acerto al final: 100%
  -> Cambio pero no acerto: 50% (el proceso fue correcto)
  -> Nunca cambio: 0% (rigidez mental)

Si culpable_real == sospechoso_fase1:
  -> Mantuvo y acerto: 80%
  -> Cambio y luego volvio: 100% (proceso valido, reconsidero)
  -> Cambio y no volvio: 30% (la evidencia lo confundio)
```

### Estrellas
- 85%+ -> 3 estrellas "Detective Experto"
- 60-84% -> 2 estrellas "Buen Investigador"
- 35-59% -> 1 estrella "Investigador Novato"
- <35% -> sin estrellas

## 5. Pantalla de Solucion Ampliada

### Panel 1: Viaje del Investigador (NUEVO)
Linea visual de las decisiones del jugador a traves de las 3 fases:

```
FASE 1                    FASE 2                    FASE 3
o-------------------------o-------------------------o
Sospechaste de:           Cambiaste a:              Acusacion final:
Sra. Lopez                Sr. Munoz                 Sr. Munoz
                          ^ Cambio OK               = Mantuvo OK
```

Mensajes contextuales:
- Cambio y acerto: "Excelente flexibilidad mental. La nueva evidencia te hizo reconsiderar y llegaste a la verdad."
- Cambio pero no acerto: "Buen intento de adaptarte. La evidencia era enganosa, pero el proceso de reconsiderar es valioso."
- Nunca cambio y acerto: "Tu intuicion inicial era correcta y supiste mantenerla."
- Nunca cambio y fallo: "Tu primera impresion te anclo. Recuerda: la primera opinion no siempre es la correcta."

### Panel 2: Comparacion de Acusacion (existente, se mantiene)

### Panel 3: Scorecard reformulado (4 barras)

### Panel 4: Preguntas de Reflexion (existente, se mantiene)

## 6. Timeline Mejorado

- Cada evento muestra un hint de evidencia relacionada (campo `clueHint`)
- Se relaja el requisito: 70%+ permite avanzar (antes era 100%)
- Se mantiene feedback visual por colores (verde/amarillo/rojo)
- El % logrado se refleja en el score

## 7. Migracion de Casos

Se redistribuyen los 9 casos existentes en 3 fases:

| Fase | Tipo de pistas | Proposito |
|------|---------------|-----------|
| Fase 1 (4-5 pistas) | Irrelevantes + enganosas que apuntan al sospechoso equivocado | Crear sesgo inicial |
| Fase 2 (4-5 pistas) | Contradicen Fase 1 + evidencia ambigua | Provocar el giro |
| Fase 3 (resto) | Reveladoras y concluyentes | Resolver el misterio |

**Restriccion:** Los desenlaces (culpable + imagen de conclusion) NO cambian. Todo lo demas puede modificarse.

Se pueden reescribir pistas, testimonios y personalidades para mejorar la narrativa por fases.

## 8. Cambios en HTML

### Paginas nuevas necesarias:
- `phase1Page` — Personajes + pistas Fase 1 + selector de sospechoso + campo de razonamiento
- `phase2Page` — Nuevas pistas + mensaje de giro + opcion de cambiar/mantener sospechoso
- `phase3Page` — Pistas finales + acusacion definitiva (culpable + motivo + metodo)

### Paginas modificadas:
- `notesPage` se elimina (reemplazada por las 3 fases)
- `suspectsPage` se elimina (integrada en las fases)
- `timelinePage` — Agregar hints de evidencia por evento, relajar 100% a 70%
- `solutionPage` — Agregar panel "Viaje del Investigador"

### Paginas sin cambios:
- `menuPage`
- `objectivesPage`
- `evaluationPage`

## 9. Cambios en JavaScript (game_script.js)

### Estado global nuevo:
```javascript
let playerJourney = {
  phase1: { suspect: '', reasoning: '', timestamp: null },
  phase2: { suspect: '', reasoning: '', changed: false, timestamp: null },
  phase3: { suspect: '', motive: '', method: '', changed: false, timestamp: null },
  totalChanges: 0
};
let currentPhase = 1;
```

### Funciones nuevas:
- `renderPhase1()` — Muestra personajes + pistas fase 1 + selector sospechoso
- `renderPhase2()` — Muestra nuevas pistas + mensaje giro + opcion cambiar
- `renderPhase3()` — Muestra pistas finales + acusacion definitiva
- `calculateFlexibilityScore()` — Calcula score de flexibilidad basado en acciones
- `renderJourneyPanel()` — Dibuja la linea visual del viaje del investigador
- `getJourneyMessage()` — Retorna mensaje contextual segun recorrido

### Funciones modificadas:
- `calculateScore()` — Nuevo calculo con 4 ejes (25/30/25/20)
- `showSolutionPage()` — Integrar panel viaje + nuevo scorecard
- `renderTimelinePage()` — Mostrar clueHint por evento, relajar 70%
- `revealClueSolo()` — Adaptada para trabajar con pistas por fase

### Funciones eliminadas:
- `renderNotesSolo()` — Reemplazada por renderPhase1/2/3
- `renderSuspectsPage()` — Integrada en renderPhase3

## 10. Cambios en CSS (styles.css)

### Nuevos componentes:
- `.phase-indicator` — Barra de progreso de fases (Fase 1 > Fase 2 > Fase 3)
- `.phase-transition` — Animacion/mensaje de transicion entre fases ("Nueva evidencia...")
- `.hypothesis-card` — Tarjeta de hipotesis del jugador (sospechoso + razonamiento)
- `.journey-panel` — Panel visual del viaje del investigador en solucion
- `.journey-line` — Linea conectora entre fases
- `.journey-node` — Nodo de cada fase con datos
- `.clue-hint` — Estilo para el hint de evidencia en timeline

### Componentes modificados:
- `.scorecard` — Agregar 4ta barra (Flexibilidad Mental)
- `.timeline-item` — Agregar espacio para clueHint

## 11. Archivos afectados

| Archivo | Tipo de cambio |
|---------|---------------|
| `index.html` | Reemplazar notesPage y suspectsPage por phase1/2/3Page. Modificar timelinePage y solutionPage |
| `game_script.js` | Reescritura significativa del flujo. Nuevas funciones de fases, scoring, journey |
| `cases.js` | Redistribuir los 9 casos en formato por fases. Reescribir pistas/testimonios |
| `styles.css` | Agregar componentes nuevos. Modificar scorecard y timeline |
| `custom.js` | Sin cambios |
| `add_case.html` / `add_case.js` | Actualizar template para nuevo formato de caso |

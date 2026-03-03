# Investigacion Progresiva — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redisenar el juego de detectives para usar un flujo por fases iterativas que fuerce deduccion, flexibilidad mental y reconsideracion de hipotesis.

**Architecture:** Reemplazar el flujo lineal (pistas -> acusacion -> timeline) por 3 fases iterativas con hipotesis progresivas, un timeline con hints de evidencia, y un panel de "Viaje del Investigador" en la solucion. El scoring se reformula a 4 ejes: Deduccion(25%), Flexibilidad(30%), Acusacion(25%), Timeline(20%).

**Tech Stack:** HTML5, CSS3 (design tokens, glassmorphism), Vanilla JavaScript ES6+, Web Audio API

---

## Task 1: Restructure HTML — Phase Pages

**Files:**
- Modify: `index.html`

Replace the current `notesPage` and `suspectsPage` sections with three new phase pages plus update the timeline and solution pages.

**Step 1: Replace notesPage and suspectsPage with phase1Page, phase2Page, phase3Page**

Remove the existing `notesPage` (lines 66-69) and `suspectsPage` (lines 85-93). Add these new sections inside `#app`:

```html
<!-- FASE 1: Primera Impresion -->
<div id="phase1Page" class="page">
  <div class="phase-indicator">
    <div class="phase-step active">Fase 1</div>
    <div class="phase-step">Fase 2</div>
    <div class="phase-step">Fase 3</div>
    <div class="phase-step">Cronologia</div>
  </div>
  <h2 id="phase1CaseTitle"></h2>
  <div id="phase1Container"></div>
</div>

<!-- FASE 2: El Giro -->
<div id="phase2Page" class="page">
  <div class="phase-indicator">
    <div class="phase-step completed">Fase 1</div>
    <div class="phase-step active">Fase 2</div>
    <div class="phase-step">Fase 3</div>
    <div class="phase-step">Cronologia</div>
  </div>
  <h2 id="phase2CaseTitle"></h2>
  <div id="phase2Container"></div>
</div>

<!-- FASE 3: Acusacion Final -->
<div id="phase3Page" class="page">
  <div class="phase-indicator">
    <div class="phase-step completed">Fase 1</div>
    <div class="phase-step completed">Fase 2</div>
    <div class="phase-step active">Fase 3</div>
    <div class="phase-step">Cronologia</div>
  </div>
  <h2 id="phase3CaseTitle"></h2>
  <div id="phase3Container"></div>
</div>
```

**Step 2: Update timelinePage to include phase indicator and clueHint support**

Add the phase indicator to the timeline page:
```html
<div id="timelinePage" class="page">
  <div class="phase-indicator">
    <div class="phase-step completed">Fase 1</div>
    <div class="phase-step completed">Fase 2</div>
    <div class="phase-step completed">Fase 3</div>
    <div class="phase-step active">Cronologia</div>
  </div>
  <h2 id="timelineCaseTitle"></h2>
  <!-- rest stays the same -->
</div>
```

**Step 3: Add journey panel placeholder in solutionPage**

Add a `<div id="journeyPanel"></div>` as the first child inside `solutionPage`, before the existing solution content.

**Step 4: Verify the page renders without errors**

Open `index.html` in browser. The menu should still appear. No JS errors in console.

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: replace notesPage/suspectsPage with phase1/2/3Page HTML structure"
```

---

## Task 2: Add Phase CSS Components

**Files:**
- Modify: `styles.css`

**Step 1: Add phase indicator styles**

Append after the existing `.page` styles (around line 140):

```css
/* =============================================
   PHASE INDICATOR (progress bar)
   ============================================= */
.phase-indicator {
  display: flex;
  justify-content: center;
  gap: 0;
  margin-bottom: 24px;
  padding: 0 20px;
}

.phase-step {
  flex: 1;
  max-width: 180px;
  text-align: center;
  padding: 10px 8px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.3);
  border-bottom: 3px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s var(--ease-out);
}

.phase-step.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.phase-step.completed {
  color: var(--color-success);
  border-bottom-color: var(--color-success);
}
```

**Step 2: Add phase transition message styles**

```css
/* =============================================
   PHASE TRANSITION
   ============================================= */
.phase-transition {
  background: linear-gradient(135deg, rgba(232, 69, 69, 0.08), rgba(245, 166, 35, 0.06));
  border: 1px solid rgba(232, 69, 69, 0.25);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  margin: 20px 0;
  text-align: center;
  animation: slideDown 0.5s var(--ease-out);
}

.phase-transition h3 {
  color: var(--color-accent);
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

.phase-transition p {
  color: #b0b8c6;
  font-size: 15px;
  line-height: 1.6;
}
```

**Step 3: Add hypothesis card styles**

```css
/* =============================================
   HYPOTHESIS CARD
   ============================================= */
.hypothesis-card {
  background: rgba(20, 28, 40, 0.9);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin: 20px 0;
}

.hypothesis-card h4 {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-accent);
  margin-bottom: 12px;
}

.hypothesis-card .previous-suspect {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-md);
  margin-bottom: 12px;
}

.hypothesis-card .previous-suspect img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.hypothesis-card .change-options {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.hypothesis-card .change-options button {
  flex: 1;
}
```

**Step 4: Add journey panel styles**

```css
/* =============================================
   JOURNEY PANEL (Viaje del Investigador)
   ============================================= */
.journey-panel {
  background: linear-gradient(135deg, rgba(20, 28, 40, 0.95), rgba(15, 20, 30, 0.98));
  border: 1px solid var(--color-border-hover);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 24px;
  animation: slideDown 0.5s var(--ease-out);
}

.journey-panel h3 {
  text-align: center;
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 20px;
}

.journey-line {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  padding: 0 20px;
}

.journey-line::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 60px;
  right: 60px;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 0;
}

.journey-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 1;
  flex: 1;
  max-width: 200px;
}

.journey-node .node-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-secondary);
  border: 3px solid var(--color-border-hover);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 10px;
}

.journey-node.changed .node-dot {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #000;
}

.journey-node.maintained .node-dot {
  background: var(--color-secondary);
  border-color: rgba(255, 255, 255, 0.3);
}

.journey-node .node-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 6px;
}

.journey-node .node-suspect {
  font-size: 14px;
  font-weight: 600;
  color: #eef1f6;
}

.journey-node .node-action {
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
}

.journey-node .node-action.action-changed {
  color: var(--color-accent);
}

.journey-node .node-action.action-maintained {
  color: rgba(255, 255, 255, 0.4);
}

.journey-verdict {
  text-align: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
  font-size: 15px;
  line-height: 1.6;
  color: #c8cdd6;
}

.journey-verdict strong {
  color: var(--color-accent);
}
```

**Step 5: Add clue-hint style for timeline items**

```css
/* Timeline clue hints */
.clue-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: rgba(245, 166, 35, 0.7);
  font-style: italic;
}

.clue-hint::before {
  content: '\U0001F4CE ';
}
```

**Step 6: Update scorecard label width for new 4th category**

In `.score-bar>span:first-child` (line ~1090), change `min-width: 90px` to `min-width: 110px` to fit "Flexibilidad".

**Step 7: Verify styles render correctly**

Open browser, check that no CSS breaks. Phase indicator should be invisible (pages not active yet).

**Step 8: Commit**

```bash
git add styles.css
git commit -m "feat: add CSS for phase indicator, journey panel, hypothesis cards, clue hints"
```

---

## Task 3: Restructure cases.js — Migrate All 9 Cases

**Files:**
- Rewrite: `cases.js`

This is the largest task. Each of the 9 cases needs:
- Clues reorganized into `{ phase1: [], phase2: [], phase3: [] }`
- Each clue gets `misleading`, `pointsTo`, `contradicts` fields
- Characters get `suspicionLevel` field
- Chronology becomes `[{ event, clueHint }]`
- Desenlaces (culprit + consequence image) stay the same

**Step 1: Rewrite Case 1 (Incendio en el laboratorio)**

- Difficulty: Alto
- Solution stays: culprit = shared (Soto negligence + Ramirez recklessness), consequence image stays
- Phase 1 clues: superficial evidence pointing to Ramirez alone (5 clues)
- Phase 2 clues: evidence showing Soto's negligence (5 clues)
- Phase 3 clues: conclusive evidence of shared responsibility (remaining clues)
- Characters get suspicionLevel: Ramirez = high, Soto = low initially

**Step 2: Rewrite Case 2 (Robo en el salon de computacion)**

- Difficulty: Experto
- Solution stays: culprit = Fernando
- Phase 1: red herring clues pointing to the supplier or guard (red cap misdirection)
- Phase 2: clues contradicting Phase 1 theories
- Phase 3: digital evidence confirming Fernando

**Step 3: Rewrite Case 3 (Sabotaje en la feria de ciencias)**

- Difficulty: Hardcore
- Solution stays: culprit = Zuniga
- Phase 1: clues suggesting accident or organizer fault
- Phase 2: evidence of intentional sabotage
- Phase 3: evidence pointing specifically to Zuniga

**Step 4: Rewrite Case 4 (Acto vandalico en la biblioteca)**

- Difficulty: Alto
- Solution stays: culprit = Henriquez
- Phase 1: footprint/paint evidence pointing to wrong suspect
- Phase 2: contradicting evidence, framing revealed
- Phase 3: conclusive evidence of Henriquez

**Step 5: Rewrite Case 5 (Filtracion del examen)**

- Difficulty: Experto
- Solution stays: class representative
- Phase 1: digital breadcrumbs pointing to teacher or IT
- Phase 2: password security evidence shifting suspicion
- Phase 3: conclusive digital forensics

**Step 6: Rewrite Case 6 (Sabotaje en la final deportiva)**

- Difficulty: Hardcore
- Solution stays: rival team captain
- Phase 1: circumstantial evidence pointing to multiple suspects
- Phase 2: physical trace evidence shifting suspicion
- Phase 3: conclusive evidence

**Step 7: Rewrite Cases 7-9**

Same pattern — redistribute clues into phases maintaining existing desenlaces.

**Step 8: Verify all cases parse correctly**

Open browser console, type `window.cases` and verify all 9 cases have the correct structure with phase1/phase2/phase3 clues and chronology objects.

**Step 9: Commit**

```bash
git add cases.js
git commit -m "feat: restructure all 9 cases with phased clues, misleading flags, and chronology hints"
```

---

## Task 4: Rewrite game_script.js — Core Game Logic

**Files:**
- Rewrite: `game_script.js`

This rewrites the game flow. The file is ~846 lines currently and will be substantially modified.

**Step 1: Update global state and page references**

Replace the current state variables (lines 37-52) and pages object (lines 150-158) with:

```javascript
// ======= Estado global =======
let currentCase = null;
let currentSolution = null;
let currentPhase = 1;

// Tracking del viaje del jugador
let playerJourney = {
  phase1: { suspect: '', reasoning: '', timestamp: null },
  phase2: { suspect: '', reasoning: '', changed: false, timestamp: null },
  phase3: { suspect: '', motive: '', method: '', changed: false, timestamp: null },
  totalChanges: 0
};

// Clasificacion de pistas (solo en memoria)
let clueWeights = {};

// ======= Paginas =======
const pages = {
  menu: document.getElementById('menuPage'),
  objectives: document.getElementById('objectivesPage'),
  phase1: document.getElementById('phase1Page'),
  phase2: document.getElementById('phase2Page'),
  phase3: document.getElementById('phase3Page'),
  timeline: document.getElementById('timelinePage'),
  solution: document.getElementById('solutionPage'),
  evaluation: document.getElementById('evaluationPage')
};
```

**Step 2: Update start button to initialize new flow**

Modify the `startBtn` click handler to reset `playerJourney`, `currentPhase`, and `clueWeights`, then navigate to objectives (same as current). The objectives page "Iniciar investigacion" button now calls `renderPhase1()` and shows `phase1`.

**Step 3: Implement renderPhase1()**

This function:
- Sets `phase1CaseTitle` to case title + " — Fase 1: Primera Impresion"
- Renders character grid (same flip cards as current, sorted by suspicionLevel descending)
- Renders phase1 clues with classification buttons
- Shows suspect selection grid (compact, like current suspectsPage)
- Shows reasoning textarea
- Shows "Continuar a Fase 2" button (disabled until suspect selected)
- On continue: saves `playerJourney.phase1` and calls `renderPhase2()`

**Step 4: Implement renderPhase2()**

This function:
- Shows transition message: "Nueva evidencia ha sido encontrada..."
- Shows the player's Phase 1 hypothesis card (suspect image + name + reasoning)
- Renders phase2 clues with classification buttons
- Shows two options: "Cambiar sospechoso" (shows suspect grid) or "Mantener hipotesis"
- Shows reasoning textarea
- On continue: saves `playerJourney.phase2`, tracks if changed, calls `renderPhase3()`

**Step 5: Implement renderPhase3()**

This function:
- Shows transition message if player still has wrong suspect
- Renders phase3 clues with classification buttons
- Shows full accusation form: suspect grid + motive textarea + method textarea
- On continue: saves `playerJourney.phase3`, tracks changes, calls `renderTimelinePage()`

**Step 6: Update renderTimelinePage()**

Modify to:
- Handle chronology as `[{ event, clueHint }]` objects
- Display clueHint under each timeline item as `.clue-hint` span
- Allow advancing at 70%+ (not 100%)
- Calculate and store timeline percentage for scoring

**Step 7: Implement calculateFlexibilityScore()**

```javascript
function calculateFlexibilityScore() {
  const realCulprit = currentSolution.culprit.toLowerCase();
  const p1 = playerJourney.phase1.suspect.toLowerCase();
  const p3 = playerJourney.phase3.suspect.toLowerCase();
  const p3Correct = realCulprit.includes(p3) || p3.includes(realCulprit);
  const p1WasCorrect = realCulprit.includes(p1) || p1.includes(realCulprit);
  const changed = playerJourney.totalChanges > 0;

  if (!p1WasCorrect) {
    // Correct answer was NOT the initial guess — changing was the right move
    if (changed && p3Correct) return 100;  // Changed and got it right
    if (changed && !p3Correct) return 50;  // Changed (good) but wrong answer
    return 0;  // Never changed despite wrong initial guess (rigid)
  } else {
    // Initial guess WAS correct — maintaining was the right move
    if (!changed && p3Correct) return 80;  // Maintained correctly
    if (changed && p3Correct) return 100;  // Changed and came back (full process)
    if (changed && !p3Correct) return 30;  // Changed away from correct answer
    return 80;
  }
}
```

**Step 8: Update calculateScore()**

Replace current scoring with 4-axis system:
- Deduccion (25%): classification accuracy across all 3 phases
- Flexibilidad (30%): from calculateFlexibilityScore()
- Acusacion (25%): culprit correct from phase3
- Timeline (20%): percentage from timeline check

**Step 9: Implement renderJourneyPanel()**

Creates the "Viaje del Investigador" visual in the solution page:
- 3 nodes showing phase1/phase2/phase3 suspects
- Visual indicators for changes (color-coded)
- Contextual verdict message from getJourneyMessage()

**Step 10: Implement getJourneyMessage()**

Returns appropriate message based on journey pattern:
- Changed and correct: flexibility praise
- Changed but wrong: process praise
- Never changed and correct: intuition praise
- Never changed and wrong: anchor bias warning

**Step 11: Update showSolutionPage()**

Integrate journey panel + updated scorecard with 4 bars.

**Step 12: Update clue management functions**

Adapt `getCaseWeights`, `setClueWeight`, `getClueWeight`, `appendClue` to work with phased clues. The clue index now includes phase prefix: `"phase1-0"`, `"phase2-3"`, etc.

**Step 13: Keep SFX, music toggle, evaluation, and CSV export unchanged**

These work independently and need no changes.

**Step 14: Verify complete game flow**

Play through one case start to finish. Verify:
- Phase 1 shows clues + suspect selection
- Phase 2 shows giro message + option to change
- Phase 3 shows final accusation
- Timeline shows clue hints
- Solution shows journey panel + 4-axis score

**Step 15: Commit**

```bash
git add game_script.js
git commit -m "feat: rewrite game logic with 3-phase investigation flow, flexibility scoring, and journey panel"
```

---

## Task 5: Update Evaluation Form for New Metrics

**Files:**
- Modify: `index.html` (evaluation section)
- Modify: `game_script.js` (CSV export)

**Step 1: Update evaluation form fields**

The current form has evalNames, evalCourse, evalComments. Add fields that reflect the new scoring axes:

```html
<div>
  <label for="evalAnalysis">Capacidad de analisis de evidencia (1-5)</label>
  <select id="evalAnalysis">
    <option value="1">1 - Insuficiente</option>
    <option value="2">2 - Basico</option>
    <option value="3">3 - Suficiente</option>
    <option value="4">4 - Bueno</option>
    <option value="5">5 - Excelente</option>
  </select>
</div>
<div>
  <label for="evalTeamwork">Trabajo en equipo (1-5)</label>
  <select id="evalTeamwork">...</select>
</div>
<div>
  <label for="evalFlex">Observaciones sobre flexibilidad mental</label>
  <textarea id="evalFlex"></textarea>
</div>
```

**Step 2: Update CSV export to include journey data**

Add playerJourney data and new score breakdown to the CSV export.

**Step 3: Commit**

```bash
git add index.html game_script.js
git commit -m "feat: update evaluation form with new scoring axes and journey data export"
```

---

## Task 6: Update add_case.html/js for New Format

**Files:**
- Modify: `add_case.html`
- Modify: `add_case.js`

**Step 1: Update the case template/example in add_case.html**

Show the new JSON structure with phased clues, suspicionLevel, and chronology objects as the template.

**Step 2: Update add_case.js validation**

Validate that custom cases have the new structure (clues.phase1/phase2/phase3 exist, chronology items are objects with event+clueHint).

**Step 3: Commit**

```bash
git add add_case.html add_case.js
git commit -m "feat: update case creator for new phased clue structure"
```

---

## Task 7: Final Testing and Polish

**Step 1: Play through all 9 cases**

Test each case end-to-end verifying:
- Phase transitions work smoothly
- Clue classification persists across phases
- Journey tracking is accurate
- Scoring produces reasonable results
- Timeline hints display correctly

**Step 2: Test edge cases**

- Player never changes suspect (all 3 phases same choice)
- Player changes every phase
- Player selects no suspect in Phase 1 (button should be disabled)
- Empty reasoning fields (allowed but noted)

**Step 3: Verify responsive behavior**

Test at mobile (375px), tablet (768px), desktop (1280px) widths.

**Step 4: Final commit**

```bash
git add -A
git commit -m "polish: final testing and minor fixes across all game components"
```

---

## Execution Order Summary

| Task | Description | Dependencies | Estimated Complexity |
|------|------------|-------------|---------------------|
| 1 | HTML structure (phase pages) | None | Low |
| 2 | CSS components (phases, journey) | None | Low |
| 3 | Cases.js (redistribute 9 cases) | None | High (content-heavy) |
| 4 | game_script.js (core logic rewrite) | Tasks 1, 2, 3 | High (logic-heavy) |
| 5 | Evaluation form update | Task 4 | Low |
| 6 | add_case.html/js update | Task 3 | Low |
| 7 | Testing and polish | All above | Medium |

**Tasks 1, 2, and 3 can be done in parallel.** Task 4 depends on all three. Tasks 5 and 6 depend on Task 4 and 3 respectively. Task 7 is final.

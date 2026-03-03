/* ===========================================================
   GAME SCRIPT — Sistema de 3 Fases + Cronologia + Journey
   =========================================================== */

// Asegura que exista el arreglo de casos
window.cases = window.cases || [];

// --- Incorporar casos adicionales almacenados por el usuario ---
try {
  const added = JSON.parse(localStorage.getItem('addedCases') || '[]');
  if (Array.isArray(added)) {
    added.forEach((c) => window.cases.push(c));
  }
} catch (e) {
  console.warn('No se pudieron cargar los casos del usuario', e);
}

// --- Normalizar: si no hay solution pero hay variants, usar primera ---
window.cases.forEach(c => {
  if (!c.solution && Array.isArray(c.variants) && c.variants.length) {
    c.solution = { ...c.variants[0] };
  }
});

// ======= Estado global =======
let currentCase = null;
let currentSolution = null;
let currentPhase = 1;

let playerJourney = {
  phase1: { suspect: '', reasoning: '', timestamp: null },
  phase2: { suspect: '', reasoning: '', changed: false, timestamp: null },
  phase3: { suspect: '', motive: '', method: '', changed: false, timestamp: null },
  totalChanges: 0
};

let clueWeights = {};
let timelineScore = 0;

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

function showPage(name) {
  Object.values(pages).forEach(p => p && p.classList.remove('active'));
  if (pages[name]) pages[name].classList.add('active');
}

// ======= Clasificacion de pistas =======
function getCaseWeights(caseId) {
  if (!clueWeights[caseId]) clueWeights[caseId] = {};
  return clueWeights[caseId];
}

function setClueWeight(caseId, clueIndex, weight) {
  const bag = getCaseWeights(caseId);
  bag[clueIndex] = weight;
}

function getClueWeight(caseId, clueIndex) {
  const bag = getCaseWeights(caseId);
  return bag[clueIndex] || null;
}

function applyClueWeightClass(li, weight) {
  li.classList.remove('irrelevant', 'plausible', 'core');
  if (weight) li.classList.add(weight);
  const btns = li.querySelectorAll('.clue-actions button');
  btns.forEach(b => {
    if (!b.dataset) return;
    b.classList.toggle('active', b.dataset.weight === weight);
  });
}

function appendClue(listEl, clueIndex, text) {
  const li = document.createElement('li');
  li.className = 'clue-item';
  li.dataset.clueIndex = String(clueIndex);

  const txtDiv = document.createElement('div');
  txtDiv.className = 'clue-text';
  txtDiv.textContent = text;
  li.appendChild(txtDiv);

  const actions = document.createElement('div');
  actions.className = 'clue-actions';
  const makeBtn = (label, weight) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.dataset.weight = weight;
    btn.type = 'button';
    btn.addEventListener('click', () => {
      setClueWeight(currentCase.id, clueIndex, weight);
      applyClueWeightClass(li, weight);
    });
    return btn;
  };
  actions.appendChild(makeBtn('Irrelevante', 'irrelevant'));
  actions.appendChild(makeBtn('Plausible', 'plausible'));
  actions.appendChild(makeBtn('Core', 'core'));
  li.appendChild(actions);

  const w0 = getClueWeight(currentCase.id, clueIndex);
  applyClueWeightClass(li, w0);

  listEl.appendChild(li);
  return li;
}

// ======= Helpers reutilizables =======

// Crear panel de caso colapsable
function createCasePanel(caseData) {
  const casePanel = document.createElement('div');
  casePanel.className = 'case-panel';
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  const h = document.createElement('h3');
  h.textContent = caseData.title;
  h.style.margin = '0';
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = 'Ver/ocultar caso';
  toggleBtn.type = 'button';
  toggleBtn.style.padding = '4px 8px';
  toggleBtn.style.fontSize = '14px';
  toggleBtn.style.borderRadius = '6px';
  toggleBtn.style.border = '1px solid rgba(255,255,255,0.2)';
  toggleBtn.style.background = 'rgba(255,255,255,0.1)';
  toggleBtn.style.color = '#fff';
  toggleBtn.style.cursor = 'pointer';
  header.appendChild(h);
  header.appendChild(toggleBtn);
  const body = document.createElement('div');
  body.style.display = 'none';
  const desc = document.createElement('p');
  desc.textContent = caseData.description;
  desc.style.marginTop = '6px';
  body.appendChild(desc);
  const goals = document.createElement('ul');
  goals.style.margin = '6px 0 0 18px';
  (caseData.objectives || []).forEach(obj => {
    const li = document.createElement('li');
    li.textContent = obj;
    goals.appendChild(li);
  });
  body.appendChild(goals);
  toggleBtn.addEventListener('click', () => {
    body.style.display = body.style.display === 'none' ? 'block' : 'none';
  });
  casePanel.appendChild(header);
  casePanel.appendChild(body);
  return casePanel;
}

// Crear grid de personajes (flip cards) — ordena por suspicionLevel
function createCharacterGrid(characters) {
  const sortOrder = { high: 0, medium: 1, low: 2 };
  const sorted = (characters || []).slice().sort((a, b) => {
    return (sortOrder[a.suspicionLevel] || 2) - (sortOrder[b.suspicionLevel] || 2);
  });

  const charGrid = document.createElement('div');
  charGrid.className = 'character-grid';
  sorted.forEach(ch => {
    const card = document.createElement('div');
    card.className = 'character-card';
    const inner = document.createElement('div');
    inner.className = 'card-inner';
    const front = document.createElement('div');
    front.className = 'card-face card-front';
    front.innerHTML = '<img src="' + ch.image + '" alt="' + ch.name + '" onerror="this.style.display=\'none\'"><div class="name">' + ch.name + '</div>';
    const back = document.createElement('div');
    back.className = 'card-face card-back';
    const scrollDiv = document.createElement('div');
    scrollDiv.className = 'scroll';
    scrollDiv.innerHTML = '<strong>Personalidad:</strong> ' + ch.personality + '<br><br><strong>Testimonio:</strong> ' + ch.testimony;
    back.appendChild(scrollDiv);
    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      SFX.play('flip');
    });
    charGrid.appendChild(card);
  });
  return charGrid;
}

// Crear grid de sospechosos (compacto) — retorna { grid, getSelected }
function createSuspectGrid(characters, onSelect) {
  const grid = document.createElement('div');
  grid.className = 'suspect-grid';
  let selectedName = '';

  (characters || []).forEach(ch => {
    const card = document.createElement('div');
    card.className = 'suspect-card';
    card.innerHTML = '<img src="' + ch.image + '" alt="' + ch.name + '" onerror="this.style.display=\'none\'"><span class="suspect-name">' + ch.name + '</span>';
    card.addEventListener('click', () => {
      grid.querySelectorAll('.suspect-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedName = ch.name;
      SFX.play('click');
      if (onSelect) onSelect(ch.name);
    });
    grid.appendChild(card);
  });

  return {
    grid,
    getSelected: () => selectedName
  };
}

// Crear seccion de pistas para una fase
function createClueSection(phaseKey, clues, title) {
  const section = document.createElement('div');
  section.style.marginTop = '24px';
  const h = document.createElement('h3');
  h.textContent = title || 'Pistas';
  section.appendChild(h);

  const list = document.createElement('ul');
  list.className = 'clues-list';
  (clues || []).forEach((clue, i) => {
    const compositeKey = phaseKey + '-' + i;
    appendClue(list, compositeKey, clue.text);
  });
  section.appendChild(list);
  return section;
}

// Encontrar datos de un personaje por nombre
function findCharacter(name) {
  if (!currentCase || !name) return null;
  return (currentCase.characters || []).find(ch =>
    ch.name.toLowerCase() === name.toLowerCase()
  ) || null;
}

// ======= Menu y seleccion de caso =======
function updateCaseSelectOptions() {
  const diffSel = document.getElementById('difficulty');
  const caseSel = document.getElementById('caseSelect');
  if (!diffSel || !caseSel) return;
  const diff = diffSel.value;
  caseSel.innerHTML = '';
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Elige un caso...';
  caseSel.appendChild(placeholder);
  window.cases.filter(c => !diff || c.difficulty === diff).forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.title;
    caseSel.appendChild(opt);
  });
}

// ======= Inicio desde el menu =======
const startBtn = document.getElementById('startBtn');
if (startBtn) {
  startBtn.addEventListener('click', () => {
    const diff = document.getElementById('difficulty')?.value || '';
    const caseSelectEl = document.getElementById('caseSelect');
    const selectedId = caseSelectEl ? caseSelectEl.value : '';

    if (selectedId) {
      currentCase = window.cases.find(c => String(c.id) === selectedId);
    } else {
      const pool = window.cases.filter(c => !diff || c.difficulty === diff);
      currentCase = pool.length > 0 ? pool[0] : null;
    }

    if (!currentCase) {
      alert('No hay casos disponibles para esta dificultad.');
      return;
    }

    // Establecer solucion
    currentSolution = currentCase.solution
      || currentCase.solution_for_teacher
      || (Array.isArray(currentCase.variants) && currentCase.variants[0])
      || null;

    if (!currentSolution || !Array.isArray(currentSolution.chronology)) {
      alert('Este caso no tiene una cronologia valida.');
      return;
    }

    // Reset estado
    currentPhase = 1;
    timelineScore = 0;
    playerJourney = {
      phase1: { suspect: '', reasoning: '', timestamp: null },
      phase2: { suspect: '', reasoning: '', changed: false, timestamp: null },
      phase3: { suspect: '', motive: '', method: '', changed: false, timestamp: null },
      totalChanges: 0
    };
    clueWeights = {};

    // Pagina de objetivos
    document.getElementById('caseTitle').textContent = currentCase.title || '';
    document.getElementById('caseDescription').textContent = currentCase.description || '';
    const objList = document.getElementById('objectivesList');
    if (objList) {
      objList.innerHTML = '';
      (currentCase.objectives || []).forEach(obj => {
        const li = document.createElement('li');
        li.textContent = obj;
        objList.appendChild(li);
      });
    }

    showPage('objectives');
  });
}

// ======= Empezar investigacion desde Objetivos =======
const startInvestigationBtn = document.getElementById('startInvestigationBtn');
if (startInvestigationBtn) {
  startInvestigationBtn.addEventListener('click', () => {
    renderPhase1();
    showPage('phase1');
  });
}

// ======= FASE 1: Primera Impresion =======
function renderPhase1() {
  const container = document.getElementById('phase1Container');
  container.innerHTML = '';
  document.getElementById('phase1CaseTitle').textContent = currentCase.title + ' — Fase 1: Primera Impresion';

  // 1. Panel del caso colapsable
  container.appendChild(createCasePanel(currentCase));

  // 2. Grid de personajes (ordenados por suspicionLevel)
  const charTitle = document.createElement('h3');
  charTitle.textContent = 'Personajes';
  charTitle.style.marginTop = '20px';
  container.appendChild(charTitle);
  container.appendChild(createCharacterGrid(currentCase.characters));

  // 3. Pistas de Fase 1
  const phase1Clues = currentCase.clues?.phase1 || [];
  container.appendChild(createClueSection('phase1', phase1Clues, 'Pistas — Fase 1'));

  // 4. Seleccion de sospechoso
  const suspectSection = document.createElement('div');
  suspectSection.style.marginTop = '28px';
  const suspectLabel = document.createElement('h3');
  suspectLabel.textContent = 'Basandote en lo que has visto, selecciona al sospechoso que consideras culpable:';
  suspectSection.appendChild(suspectLabel);

  let phase1SelectedSuspect = '';
  const { grid: suspectGrid } = createSuspectGrid(currentCase.characters, (name) => {
    phase1SelectedSuspect = name;
    continueBtn.disabled = false;
  });
  suspectSection.appendChild(suspectGrid);

  // 5. Razonamiento
  const reasonField = document.createElement('div');
  reasonField.className = 'note-field';
  reasonField.style.marginTop = '16px';
  const reasonLabel = document.createElement('label');
  reasonLabel.textContent = 'Por que sospechas de esta persona?';
  const reasonTextarea = document.createElement('textarea');
  reasonTextarea.placeholder = 'Escribe tu razonamiento aqui...';
  reasonField.appendChild(reasonLabel);
  reasonField.appendChild(reasonTextarea);
  suspectSection.appendChild(reasonField);

  container.appendChild(suspectSection);

  // 6. Boton continuar
  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'page-actions';
  const continueBtn = document.createElement('button');
  continueBtn.className = 'primary-btn';
  continueBtn.textContent = 'Continuar a Fase 2';
  continueBtn.disabled = true;
  continueBtn.addEventListener('click', () => {
    playerJourney.phase1 = {
      suspect: phase1SelectedSuspect,
      reasoning: reasonTextarea.value,
      timestamp: Date.now()
    };
    renderPhase2();
    showPage('phase2');
    SFX.play('reveal');
  });
  actionsDiv.appendChild(continueBtn);
  container.appendChild(actionsDiv);

  // Scroll al inicio
  const page = document.getElementById('phase1Page');
  if (page) page.scrollTop = 0;
}

// ======= FASE 2: El Giro =======
function renderPhase2() {
  const container = document.getElementById('phase2Container');
  container.innerHTML = '';
  document.getElementById('phase2CaseTitle').textContent = currentCase.title + ' — Fase 2: El Giro';

  // 1. Mensaje de transicion
  const transition = document.createElement('div');
  transition.className = 'phase-transition';
  transition.innerHTML = '<h3>Nueva evidencia encontrada</h3><p>La investigacion continua. Han surgido nuevas pistas que podrian cambiar tu perspectiva sobre el caso.</p>';
  container.appendChild(transition);

  // 2. Hypothesis card — sospechoso de Fase 1
  const hypoCard = document.createElement('div');
  hypoCard.className = 'hypothesis-card';
  const hypoTitle = document.createElement('h4');
  hypoTitle.textContent = 'Tu hipotesis anterior';
  hypoCard.appendChild(hypoTitle);

  const prevSuspect = document.createElement('div');
  prevSuspect.className = 'previous-suspect';
  const ch1 = findCharacter(playerJourney.phase1.suspect);
  if (ch1) {
    const img = document.createElement('img');
    img.src = ch1.image;
    img.alt = ch1.name;
    img.onerror = function () { this.style.display = 'none'; };
    prevSuspect.appendChild(img);
  }
  const suspInfo = document.createElement('div');
  suspInfo.innerHTML = '<strong>' + (playerJourney.phase1.suspect || '(sin seleccion)') + '</strong>';
  if (playerJourney.phase1.reasoning) {
    suspInfo.innerHTML += '<br><em style="color:#99a3b3;font-size:13px;">' + playerJourney.phase1.reasoning + '</em>';
  }
  prevSuspect.appendChild(suspInfo);
  hypoCard.appendChild(prevSuspect);
  container.appendChild(hypoCard);

  // 3. Pistas de Fase 2
  const phase2Clues = currentCase.clues?.phase2 || [];
  container.appendChild(createClueSection('phase2', phase2Clues, 'Nuevas Pistas — Fase 2'));

  // 4. Seccion de decision
  const decisionSection = document.createElement('div');
  decisionSection.style.marginTop = '28px';
  const decisionLabel = document.createElement('p');
  decisionLabel.style.fontSize = '16px';
  decisionLabel.style.fontWeight = '600';
  decisionLabel.style.marginBottom = '16px';
  decisionLabel.textContent = 'Con esta nueva evidencia, mantienes tu sospechoso o cambias de opinion?';
  decisionSection.appendChild(decisionLabel);

  let phase2SelectedSuspect = playerJourney.phase1.suspect;
  let decisionMade = false;

  // Botones mantener / cambiar
  const optionsDiv = document.createElement('div');
  optionsDiv.style.display = 'flex';
  optionsDiv.style.gap = '12px';
  optionsDiv.style.marginBottom = '16px';

  const keepBtn = document.createElement('button');
  keepBtn.className = 'secondary-btn';
  keepBtn.textContent = 'Mantener sospechoso';
  keepBtn.type = 'button';

  const changeBtn = document.createElement('button');
  changeBtn.className = 'primary-btn';
  changeBtn.textContent = 'Cambiar sospechoso';
  changeBtn.type = 'button';

  optionsDiv.appendChild(keepBtn);
  optionsDiv.appendChild(changeBtn);
  decisionSection.appendChild(optionsDiv);

  // Contenedor para grid de sospechosos (oculto)
  const changeSuspectContainer = document.createElement('div');
  changeSuspectContainer.style.display = 'none';
  decisionSection.appendChild(changeSuspectContainer);

  keepBtn.addEventListener('click', () => {
    phase2SelectedSuspect = playerJourney.phase1.suspect;
    decisionMade = true;
    changeSuspectContainer.style.display = 'none';
    keepBtn.style.outline = '2px solid var(--color-success)';
    changeBtn.style.outline = 'none';
    continueBtn.disabled = false;
  });

  changeBtn.addEventListener('click', () => {
    changeSuspectContainer.style.display = 'block';
    changeBtn.style.outline = '2px solid var(--color-primary)';
    keepBtn.style.outline = 'none';
    // Si no se habia creado el grid, crearlo
    if (!changeSuspectContainer.hasChildNodes()) {
      const { grid: sg } = createSuspectGrid(currentCase.characters, (name) => {
        phase2SelectedSuspect = name;
        decisionMade = true;
        continueBtn.disabled = false;
      });
      changeSuspectContainer.appendChild(sg);
    }
    // Reset selection state
    decisionMade = false;
    continueBtn.disabled = true;
  });

  // Razonamiento
  const reasonField = document.createElement('div');
  reasonField.className = 'note-field';
  reasonField.style.marginTop = '16px';
  const reasonLabel = document.createElement('label');
  reasonLabel.textContent = 'Explica por que mantienes o cambias tu hipotesis';
  const reasonTextarea = document.createElement('textarea');
  reasonTextarea.placeholder = 'Escribe tu razonamiento...';
  reasonField.appendChild(reasonLabel);
  reasonField.appendChild(reasonTextarea);
  decisionSection.appendChild(reasonField);

  container.appendChild(decisionSection);

  // 5. Boton continuar
  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'page-actions';
  const continueBtn = document.createElement('button');
  continueBtn.className = 'primary-btn';
  continueBtn.textContent = 'Continuar a Fase 3';
  continueBtn.disabled = true;
  continueBtn.addEventListener('click', () => {
    const changed = phase2SelectedSuspect !== playerJourney.phase1.suspect;
    playerJourney.phase2 = {
      suspect: phase2SelectedSuspect,
      reasoning: reasonTextarea.value,
      changed: changed,
      timestamp: Date.now()
    };
    if (changed) playerJourney.totalChanges++;
    renderPhase3();
    showPage('phase3');
    SFX.play('reveal');
  });
  actionsDiv.appendChild(continueBtn);
  container.appendChild(actionsDiv);

  // Scroll
  const page = document.getElementById('phase2Page');
  if (page) page.scrollTop = 0;
}

// ======= FASE 3: Acusacion Final =======
function renderPhase3() {
  const container = document.getElementById('phase3Container');
  container.innerHTML = '';
  document.getElementById('phase3CaseTitle').textContent = currentCase.title + ' — Fase 3: Acusacion Final';

  // 1. Transicion
  const transition = document.createElement('div');
  transition.className = 'phase-transition';
  transition.innerHTML = '<h3>Evidencia definitiva</h3><p>Se han recopilado las ultimas evidencias del caso. Es hora de formular tu acusacion final.</p>';
  container.appendChild(transition);

  // 2. Hypothesis card — sospechoso de Fase 2
  const hypoCard = document.createElement('div');
  hypoCard.className = 'hypothesis-card';
  const hypoTitle = document.createElement('h4');
  hypoTitle.textContent = 'Tu hipotesis actual (Fase 2)';
  hypoCard.appendChild(hypoTitle);

  const prevSuspect = document.createElement('div');
  prevSuspect.className = 'previous-suspect';
  const ch2 = findCharacter(playerJourney.phase2.suspect);
  if (ch2) {
    const img = document.createElement('img');
    img.src = ch2.image;
    img.alt = ch2.name;
    img.onerror = function () { this.style.display = 'none'; };
    prevSuspect.appendChild(img);
  }
  const suspInfo = document.createElement('div');
  suspInfo.innerHTML = '<strong>' + (playerJourney.phase2.suspect || '(sin seleccion)') + '</strong>';
  if (playerJourney.phase2.reasoning) {
    suspInfo.innerHTML += '<br><em style="color:#99a3b3;font-size:13px;">' + playerJourney.phase2.reasoning + '</em>';
  }
  prevSuspect.appendChild(suspInfo);
  hypoCard.appendChild(prevSuspect);

  if (playerJourney.phase2.changed) {
    const changeNote = document.createElement('div');
    changeNote.style.marginTop = '8px';
    changeNote.style.fontSize = '13px';
    changeNote.style.color = 'var(--color-accent)';
    changeNote.textContent = 'Cambiaste de sospechoso en la Fase 2.';
    hypoCard.appendChild(changeNote);
  }
  container.appendChild(hypoCard);

  // 3. Pistas de Fase 3
  const phase3Clues = currentCase.clues?.phase3 || [];
  container.appendChild(createClueSection('phase3', phase3Clues, 'Evidencia Final — Fase 3'));

  // 4. Acusacion final
  const accusationSection = document.createElement('div');
  accusationSection.style.marginTop = '28px';
  const accTitle = document.createElement('h3');
  accTitle.textContent = 'Acusacion Final';
  accusationSection.appendChild(accTitle);

  const accIntro = document.createElement('p');
  accIntro.style.color = '#99a3b3';
  accIntro.style.marginBottom = '16px';
  accIntro.textContent = 'Selecciona al culpable y formula tu acusacion completa.';
  accusationSection.appendChild(accIntro);

  let phase3SelectedSuspect = '';
  const { grid: suspectGrid } = createSuspectGrid(currentCase.characters, (name) => {
    phase3SelectedSuspect = name;
    goTimelineBtn.disabled = false;
  });
  accusationSection.appendChild(suspectGrid);

  // Campos de hipotesis
  const fields = document.createElement('div');
  fields.className = 'accusation-fields';
  fields.style.marginTop = '16px';

  const motiveField = document.createElement('div');
  motiveField.className = 'note-field';
  const motiveLabel = document.createElement('label');
  motiveLabel.textContent = 'Tu hipotesis del motivo';
  const motiveTextarea = document.createElement('textarea');
  motiveTextarea.placeholder = 'Por que crees que lo hizo?';
  motiveField.appendChild(motiveLabel);
  motiveField.appendChild(motiveTextarea);

  const methodField = document.createElement('div');
  methodField.className = 'note-field';
  const methodLabel = document.createElement('label');
  methodLabel.textContent = 'Tu hipotesis del metodo';
  const methodTextarea = document.createElement('textarea');
  methodTextarea.placeholder = 'Como crees que lo hizo?';
  methodField.appendChild(methodLabel);
  methodField.appendChild(methodTextarea);

  fields.appendChild(motiveField);
  fields.appendChild(methodField);
  accusationSection.appendChild(fields);

  container.appendChild(accusationSection);

  // 5. Boton ir a cronologia
  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'page-actions';
  const goTimelineBtn = document.createElement('button');
  goTimelineBtn.className = 'primary-btn';
  goTimelineBtn.textContent = 'Ir a Cronologia';
  goTimelineBtn.disabled = true;
  goTimelineBtn.addEventListener('click', () => {
    const changed = phase3SelectedSuspect !== playerJourney.phase2.suspect;
    playerJourney.phase3 = {
      suspect: phase3SelectedSuspect,
      motive: motiveTextarea.value,
      method: methodTextarea.value,
      changed: changed,
      timestamp: Date.now()
    };
    if (changed) playerJourney.totalChanges++;
    renderTimelinePage();
    showPage('timeline');
  });
  actionsDiv.appendChild(goTimelineBtn);
  container.appendChild(actionsDiv);

  // Scroll
  const page = document.getElementById('phase3Page');
  if (page) page.scrollTop = 0;
}

// ======= Cronologia =======
function renderTimelinePage() {
  document.getElementById('timelineCaseTitle').textContent = currentCase.title;

  const timelineList = document.getElementById('timelineList');
  timelineList.innerHTML = '';

  if (!currentSolution || !Array.isArray(currentSolution.chronology) || currentSolution.chronology.length === 0) {
    const p = document.createElement('li');
    p.textContent = 'Este caso no tiene eventos de cronologia definidos.';
    timelineList.appendChild(p);
    return;
  }

  // Extraer eventos — soportar tanto objetos { event, clueHint } como strings
  const chronoItems = currentSolution.chronology.map(ev => {
    if (typeof ev === 'object' && ev.event) {
      return { event: ev.event, clueHint: ev.clueHint || '' };
    }
    // Legacy: string plain
    const parts = ev.split(':');
    if (parts.length > 1 && /^\d+$/.test(parts[0])) {
      return { event: parts.slice(1).join(':').trim(), clueHint: '' };
    }
    return { event: ev, clueHint: '' };
  });

  // Mezcla aleatoria
  const shuffled = chronoItems.slice().sort(() => Math.random() - 0.5);
  shuffled.forEach(item => {
    const li = document.createElement('li');
    li.draggable = true;

    const eventSpan = document.createElement('span');
    eventSpan.className = 'timeline-event-text';
    eventSpan.textContent = item.event;
    li.appendChild(eventSpan);

    if (item.clueHint) {
      const hintSpan = document.createElement('span');
      hintSpan.className = 'clue-hint';
      hintSpan.textContent = item.clueHint;
      li.appendChild(hintSpan);
    }

    // Almacenar el texto del evento como data attribute para comparacion
    li.dataset.eventText = item.event;
    timelineList.appendChild(li);
  });

  enableDragAndDrop(timelineList);

  // Limpieza
  const res = document.getElementById('timelineResult');
  if (res) { res.textContent = ''; res.style.color = ''; }
  const nextBtn = document.getElementById('timelineNextBtn');
  if (nextBtn) nextBtn.disabled = true;

  const tlPage = document.getElementById('timelinePage');
  if (tlPage) tlPage.scrollTop = 0;
}

// Drag and drop
function enableDragAndDrop(list) {
  let dragSrcEl = null;

  Array.from(list.querySelectorAll('li')).forEach(item => item.setAttribute('draggable', 'true'));

  list.querySelectorAll('li').forEach(item => {
    item.addEventListener('dragstart', (e) => {
      dragSrcEl = item;
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';

      // Limpia feedback al volver a arrastrar
      const res = document.getElementById('timelineResult');
      if (res) res.textContent = '';
      list.querySelectorAll('li').forEach(el =>
        el.classList.remove('tl-correct', 'tl-misplaced', 'tl-wrong')
      );
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    item.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (dragSrcEl && dragSrcEl !== item) {
        const items = Array.from(list.children);
        const srcIdx = items.indexOf(dragSrcEl);
        const dstIdx = items.indexOf(item);
        if (srcIdx < dstIdx) {
          list.insertBefore(dragSrcEl, item.nextSibling);
        } else {
          list.insertBefore(dragSrcEl, item);
        }
      }
      return false;
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
    });
  });
}

// Comprobar orden cronologico
const checkBtn = document.getElementById('checkTimelineBtn');
if (checkBtn) {
  checkBtn.addEventListener('click', () => {
    const listEl = document.getElementById('timelineList');
    const lis = Array.from(listEl.children);

    // Orden actual por data attribute
    const currentOrder = lis.map(li => (li.dataset.eventText || li.textContent).trim());

    // Orden correcto
    const correct = currentSolution.chronology.map(ev => {
      if (typeof ev === 'object' && ev.event) return ev.event;
      const parts = ev.split(':');
      if (parts.length > 1 && /^\d+$/.test(parts[0])) return parts.slice(1).join(':').trim();
      return ev;
    });

    // Limpia marcas
    lis.forEach(li => li.classList.remove('tl-correct', 'tl-misplaced', 'tl-wrong'));

    const expectedIndex = new Map(correct.map((ev, i) => [ev, i]));

    let correctCount = 0;
    lis.forEach((li, i) => {
      const ev = (li.dataset.eventText || li.textContent).trim();
      const exp = expectedIndex.has(ev) ? expectedIndex.get(ev) : -1;
      if (exp === i) { li.classList.add('tl-correct'); correctCount++; }
      else if (exp !== -1) { li.classList.add('tl-misplaced'); }
      else { li.classList.add('tl-wrong'); }
    });

    const pct = correct.length > 0 ? Math.round((correctCount / correct.length) * 100) : 0;
    timelineScore = pct;

    const resultP = document.getElementById('timelineResult');
    const nextBtn = document.getElementById('timelineNextBtn');

    if (correctCount === correct.length) {
      resultP.textContent = 'Orden correcto!';
      resultP.style.color = '#2ecc71';
      if (nextBtn) nextBtn.disabled = false;
      SFX.play('success');
    } else if (pct >= 70) {
      resultP.textContent = 'Tienes ' + correctCount + '/' + correct.length + ' pasos correctos (' + pct + '%). Suficiente para continuar, pero puedes intentar mejorar.';
      resultP.style.color = '#f5a623';
      if (nextBtn) nextBtn.disabled = false;
      SFX.play('success');
    } else {
      resultP.textContent = 'Tienes ' + correctCount + '/' + correct.length + ' pasos en la posicion correcta (' + pct + '%). Necesitas al menos 70% para continuar.';
      resultP.style.color = '#f1c40f';
      if (nextBtn) nextBtn.disabled = true;
      SFX.play('error');
    }
  });
}

// Boton Volver (cronologia -> fase 3)
const timelineBackBtn = document.getElementById('timelineBackBtn');
if (timelineBackBtn) {
  timelineBackBtn.addEventListener('click', () => {
    showPage('phase3');
  });
}

// Boton Siguiente (cronologia -> solucion)
const timelineNextBtn = document.getElementById('timelineNextBtn');
if (timelineNextBtn) {
  timelineNextBtn.addEventListener('click', () => {
    showSolutionPage();
    showPage('solution');
    SFX.play('fanfare');
  });
}

// ======= Puntuacion =======

function calculateFlexibilityScore() {
  const real = (currentSolution.culprit || '').toLowerCase();
  const p1 = (playerJourney.phase1.suspect || '').toLowerCase();
  const p3 = (playerJourney.phase3.suspect || '').toLowerCase();
  const p3Correct = real.includes(p3) || p3.includes(real);
  const p1WasCorrect = real.includes(p1) || p1.includes(real);
  const changed = playerJourney.totalChanges > 0;

  if (!p1WasCorrect) {
    if (changed && p3Correct) return 100;
    if (changed && !p3Correct) return 50;
    return 0;
  } else {
    if (!changed && p3Correct) return 80;
    if (changed && p3Correct) return 100;
    if (changed && !p3Correct) return 30;
    return 80;
  }
}

function calculateScore() {
  if (!currentCase || !currentSolution) {
    return { total: 0, deduction: 0, flexibility: 0, accusation: 0, timeline: 0 };
  }

  // Deduccion (25%): clasificacion de pistas
  const caseW = getCaseWeights(currentCase.id);
  let clueHits = 0;
  let clueTotal = 0;
  ['phase1', 'phase2', 'phase3'].forEach(phase => {
    (currentCase.clues[phase] || []).forEach((clue, i) => {
      const key = phase + '-' + i;
      const w = caseW[key];
      if (!w) return;
      clueTotal++;
      const playerSaysRelevant = (w === 'core' || w === 'plausible');
      if (playerSaysRelevant === clue.relevant) clueHits++;
    });
  });
  const deductionPct = clueTotal > 0 ? (clueHits / clueTotal) * 100 : 0;

  // Flexibilidad (30%)
  const flexPct = calculateFlexibilityScore();

  // Acusacion (25%): culpable de fase 3
  let accPct = 0;
  const solCulprit = (currentSolution.culprit || '').toLowerCase();
  const plCulprit = (playerJourney.phase3.suspect || '').toLowerCase();
  if (plCulprit && (solCulprit.includes(plCulprit) || plCulprit.includes(solCulprit))) accPct = 100;

  // Timeline (20%)
  const tlPct = timelineScore;

  const total = Math.round(deductionPct * 0.25 + flexPct * 0.30 + accPct * 0.25 + tlPct * 0.20);
  return {
    total,
    deduction: Math.round(deductionPct),
    flexibility: Math.round(flexPct),
    accusation: Math.round(accPct),
    timeline: Math.round(tlPct)
  };
}

function getStars(pct) {
  if (pct >= 85) return '\u2B50\u2B50\u2B50';
  if (pct >= 60) return '\u2B50\u2B50';
  if (pct >= 35) return '\u2B50';
  return '\u2014';
}

// ======= Mensaje del viaje =======
function getJourneyMessage() {
  const real = (currentSolution.culprit || '').toLowerCase();
  const p1 = (playerJourney.phase1.suspect || '').toLowerCase();
  const p3 = (playerJourney.phase3.suspect || '').toLowerCase();
  const p3Correct = real.includes(p3) || p3.includes(real);
  const changed = playerJourney.totalChanges > 0;

  if (changed && p3Correct) {
    return 'Excelente flexibilidad mental. La nueva evidencia te hizo reconsiderar y llegaste a la verdad. Supiste adaptar tu hipotesis ante los hechos.';
  }
  if (changed && !p3Correct) {
    return 'Buen intento de adaptarte a la nueva evidencia. Aunque no acertaste, el proceso de reconsiderar tus hipotesis es valioso y demuestra pensamiento critico.';
  }
  if (!changed && p3Correct) {
    return 'Tu intuicion inicial era correcta y supiste mantenerla a pesar de la evidencia contradictoria. A veces la primera impresion si es la correcta.';
  }
  // !changed && !p3Correct
  return 'Tu primera impresion te anclo a un sospechoso incorrecto. Recuerda: la primera opinion no siempre es la correcta. La evidencia nueva debe hacerte reconsiderar.';
}

// ======= Panel del Viaje =======
function createJourneyNode(label, suspect, action, stateClass) {
  const node = document.createElement('div');
  node.className = 'journey-node ' + stateClass;

  const dot = document.createElement('div');
  dot.className = 'node-dot';
  dot.textContent = label.slice(-1);
  node.appendChild(dot);

  const labelEl = document.createElement('div');
  labelEl.className = 'node-label';
  labelEl.textContent = label;
  node.appendChild(labelEl);

  const suspectEl = document.createElement('div');
  suspectEl.className = 'node-suspect';
  suspectEl.textContent = suspect || '(sin seleccion)';
  node.appendChild(suspectEl);

  if (action) {
    const actionEl = document.createElement('div');
    actionEl.className = 'node-action ' + (stateClass === 'changed' ? 'action-changed' : 'action-maintained');
    actionEl.textContent = action;
    node.appendChild(actionEl);
  }

  return node;
}

function renderJourneyPanel() {
  const panel = document.getElementById('journeyPanel');
  panel.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'journey-panel';

  const title = document.createElement('h3');
  title.textContent = 'Tu Viaje de Investigacion';
  wrapper.appendChild(title);

  const line = document.createElement('div');
  line.className = 'journey-line';

  // Fase 1
  const node1 = createJourneyNode('Fase 1', playerJourney.phase1.suspect, '', 'maintained');

  // Fase 2
  const p2Changed = playerJourney.phase2.changed;
  const node2 = createJourneyNode('Fase 2', playerJourney.phase2.suspect,
    p2Changed ? '\u2191 Cambio' : '= Mantuvo',
    p2Changed ? 'changed' : 'maintained');

  // Fase 3
  const p3Changed = playerJourney.phase3.changed;
  const node3 = createJourneyNode('Fase 3', playerJourney.phase3.suspect,
    p3Changed ? '\u2191 Cambio' : '= Mantuvo',
    p3Changed ? 'changed' : 'maintained');

  line.appendChild(node1);
  line.appendChild(node2);
  line.appendChild(node3);
  wrapper.appendChild(line);

  // Veredicto
  const verdict = document.createElement('div');
  verdict.className = 'journey-verdict';
  verdict.innerHTML = '<strong>Veredicto:</strong> ' + getJourneyMessage();
  wrapper.appendChild(verdict);

  panel.appendChild(wrapper);
}

// ======= SFX — Efectos de sonido procedurales =======
const SFX = (function () {
  let ctx = null;
  function getCtx() {
    if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* sin audio */ } }
    return ctx;
  }
  function tone(freq, dur, type, vol) {
    const c = getCtx(); if (!c) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type || 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol || 0.12, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    o.connect(g); g.connect(c.destination);
    o.start(); o.stop(c.currentTime + dur);
  }
  return {
    play: function (name) {
      switch (name) {
        case 'reveal': tone(880, 0.15, 'sine', 0.10); setTimeout(() => tone(1100, 0.2, 'sine', 0.08), 100); break;
        case 'click': tone(600, 0.08, 'triangle', 0.06); break;
        case 'success': tone(523, 0.12, 'sine', 0.10); setTimeout(() => tone(659, 0.12, 'sine', 0.10), 120); setTimeout(() => tone(784, 0.25, 'sine', 0.10), 240); break;
        case 'error': tone(300, 0.15, 'sawtooth', 0.06); setTimeout(() => tone(250, 0.25, 'sawtooth', 0.06), 150); break;
        case 'flip': tone(400, 0.06, 'triangle', 0.05); break;
        case 'fanfare': tone(523, 0.2, 'sine', 0.12); setTimeout(() => tone(659, 0.2, 'sine', 0.12), 200); setTimeout(() => tone(784, 0.2, 'sine', 0.12), 400); setTimeout(() => tone(1047, 0.4, 'sine', 0.14), 600); break;
      }
    }
  };
})();
window.SFX = SFX;

// ======= Pagina de solucion =======
function showSolutionPage() {
  const solPage = document.getElementById('solutionPage');

  // Journey Panel primero
  renderJourneyPanel();

  // --- Comparacion de acusacion ---
  let existingCmp = solPage.querySelector('.accusation-compare');
  if (existingCmp) existingCmp.remove();

  const plCulprit = playerJourney.phase3.suspect || '(no seleccionado)';
  const solCulprit = currentSolution.culprit || '';
  const isCorrect = plCulprit !== '(no seleccionado)' &&
    (solCulprit.toLowerCase().includes(plCulprit.toLowerCase()) ||
      plCulprit.toLowerCase().includes(solCulprit.toLowerCase()));

  const cmp = document.createElement('div');
  cmp.className = 'accusation-compare';
  cmp.innerHTML =
    '<h3>' + (isCorrect ? '\u2705 Acusacion correcta!' : '\u274C Acusacion incorrecta') + '</h3>' +
    '<div class="compare-grid">' +
    '<div class="compare-col">' +
    '<h4>\uD83D\uDD0E Tu hipotesis</h4>' +
    '<p><strong>Culpable:</strong> ' + plCulprit + '</p>' +
    '<p><strong>Motivo:</strong> ' + (playerJourney.phase3.motive || '(no indicado)') + '</p>' +
    '<p><strong>Metodo:</strong> ' + (playerJourney.phase3.method || '(no indicado)') + '</p>' +
    '</div>' +
    '<div class="compare-col compare-col--real">' +
    '<h4>\uD83D\uDCCB Solucion real</h4>' +
    '<p><strong>Culpable:</strong> ' + solCulprit + '</p>' +
    '<p><strong>Motivo:</strong> ' + (currentSolution.motive || '') + '</p>' +
    '<p><strong>Metodo:</strong> ' + (currentSolution.method || '') + '</p>' +
    '</div>' +
    '</div>';

  // Insertar despues del journey panel
  const journeyPanel = document.getElementById('journeyPanel');
  if (journeyPanel && journeyPanel.nextSibling) {
    solPage.insertBefore(cmp, journeyPanel.nextSibling);
  } else {
    solPage.prepend(cmp);
  }

  // Datos de solucion
  document.getElementById('solutionCulpable').textContent = solCulprit;
  document.getElementById('solutionMotivo').textContent = currentSolution.motive || '';
  document.getElementById('solutionMetodo').textContent = currentSolution.method || '';

  // Cronologia — soportar objetos y strings
  const solList = document.getElementById('solutionCronologia');
  if (solList) {
    solList.innerHTML = '';
    (currentSolution.chronology || []).forEach(ev => {
      const li = document.createElement('li');
      if (typeof ev === 'object' && ev.event) {
        li.textContent = ev.event;
      } else {
        li.textContent = ev;
      }
      solList.appendChild(li);
    });
  }

  // Imagen de consecuencia
  const img = document.getElementById('solutionImage');
  if (img && currentSolution.consequence) img.src = currentSolution.consequence;

  // Preguntas de reflexion
  const dq = document.getElementById('debriefQuestions');
  if (dq) {
    dq.innerHTML = '';
    (currentCase.debriefQuestions || []).forEach(q => {
      const li = document.createElement('li');
      li.textContent = q;
      dq.appendChild(li);
    });
  }

  // --- Scorecard ---
  let existingScore = solPage.querySelector('.scorecard');
  if (existingScore) existingScore.remove();

  const score = calculateScore();
  const card = document.createElement('div');
  card.className = 'scorecard';
  card.innerHTML =
    '<h3>Informe del Detective ' + getStars(score.total) + '</h3>' +
    '<div class="score-bar"><span>Deduccion</span><div class="bar"><div class="fill" style="width:' + score.deduction + '%"></div></div><span>' + score.deduction + '%</span></div>' +
    '<div class="score-bar"><span>Flexibilidad</span><div class="bar"><div class="fill" style="width:' + score.flexibility + '%"></div></div><span>' + score.flexibility + '%</span></div>' +
    '<div class="score-bar"><span>Acusacion</span><div class="bar"><div class="fill" style="width:' + score.accusation + '%"></div></div><span>' + score.accusation + '%</span></div>' +
    '<div class="score-bar"><span>Cronologia</span><div class="bar"><div class="fill" style="width:' + score.timeline + '%"></div></div><span>' + score.timeline + '%</span></div>' +
    '<div class="score-total"><strong>Total: ' + score.total + '%</strong></div>';
  solPage.appendChild(card);

  solPage.scrollTop = 0;
}

// ======= Evaluacion y navegacion =======

// Poblar resumen automatico de evaluacion
function populateEvalSummary() {
  const score = calculateScore();

  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setTxt('evalSumCase', currentCase?.title || '—');
  setTxt('evalSumPhase1', playerJourney.phase1.suspect || '(sin seleccion)');

  // Fase 2 — mostrar cambio si lo hubo
  const p2Text = playerJourney.phase2.suspect || '(sin seleccion)';
  const p2Suffix = playerJourney.phase2.changed ? ' (cambio)' : ' (mantuvo)';
  setTxt('evalSumPhase2', p2Text + p2Suffix);

  // Fase 3 — mostrar cambio si lo hubo
  const p3Text = playerJourney.phase3.suspect || '(sin seleccion)';
  const p3Suffix = playerJourney.phase3.changed ? ' (cambio)' : ' (mantuvo)';
  setTxt('evalSumPhase3', p3Text + p3Suffix);

  setTxt('evalSumChanges', String(playerJourney.totalChanges));
  setTxt('evalSumScore', score.total + '%');

  // Aplicar color al puntaje
  const scoreEl = document.getElementById('evalSumScore');
  if (scoreEl) {
    scoreEl.classList.remove('score-high', 'score-mid', 'score-low');
    if (score.total >= 70) scoreEl.classList.add('score-high');
    else if (score.total >= 40) scoreEl.classList.add('score-mid');
    else scoreEl.classList.add('score-low');
  }

  // Justificaciones del alumno
  const reasoningsEl = document.getElementById('evalReasonings');
  if (reasoningsEl) {
    reasoningsEl.innerHTML = '';
    const phases = [
      { label: 'Fase 1', data: playerJourney.phase1 },
      { label: 'Fase 2', data: playerJourney.phase2 },
      { label: 'Fase 3', data: playerJourney.phase3 }
    ];
    phases.forEach(p => {
      const div = document.createElement('div');
      div.className = 'eval-reasoning__phase';
      const title = document.createElement('strong');
      title.textContent = p.label + ' — ' + (p.data.suspect || '(sin seleccion)');
      div.appendChild(title);
      const text = document.createElement('p');
      text.textContent = p.data.reasoning || '(sin justificacion escrita)';
      div.appendChild(text);
      reasoningsEl.appendChild(div);
    });
  }
}

const evaluationBtn = document.getElementById('evaluationBtn');
if (evaluationBtn) {
  evaluationBtn.addEventListener('click', () => {
    populateEvalSummary();
    showPage('evaluation');
  });
}

const solutionBackBtn = document.getElementById('solutionBackBtn');
if (solutionBackBtn) {
  solutionBackBtn.addEventListener('click', () => {
    showPage('menu');
  });
}

const evalBackBtn = document.getElementById('evalBackBtn');
if (evalBackBtn) {
  evalBackBtn.addEventListener('click', () => {
    showPage('solution');
  });
}

// Formulario de evaluacion — descarga CSV completo
const evaluationForm = document.getElementById('evaluationForm');
if (evaluationForm) {
  evaluationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const names = document.getElementById('evalNames')?.value || '';
    const course = document.getElementById('evalCourse')?.value || '';
    const comments = document.getElementById('evalComments')?.value || '';
    const analysis = document.getElementById('evalAnalysis')?.value || '';
    const teamwork = document.getElementById('evalTeamwork')?.value || '';
    const flexObs = document.getElementById('evalFlex')?.value || '';

    const score = calculateScore();

    const headers = [
      'Caso', 'Nombres', 'Curso',
      'Fase 1 Sospechoso', 'Fase 1 Justificacion',
      'Fase 2 Sospechoso', 'Fase 2 Justificacion', 'Fase 2 Cambio',
      'Fase 3 Sospechoso', 'Fase 3 Motivo', 'Fase 3 Metodo', 'Fase 3 Cambio',
      'Total Cambios',
      'Deduccion%', 'Flexibilidad%', 'Acusacion%', 'Cronologia%', 'Total%',
      'Rubrica Analisis (1-5)', 'Rubrica Trabajo Equipo (1-5)',
      'Obs. Flexibilidad', 'Obs. Generales'
    ];

    const row = [
      currentCase?.title || '',
      names.replace(/\n/g, ' '),
      course,
      playerJourney.phase1.suspect,
      (playerJourney.phase1.reasoning || '').replace(/\n/g, ' '),
      playerJourney.phase2.suspect,
      (playerJourney.phase2.reasoning || '').replace(/\n/g, ' '),
      playerJourney.phase2.changed ? 'Si' : 'No',
      playerJourney.phase3.suspect,
      (playerJourney.phase3.motive || '').replace(/\n/g, ' '),
      (playerJourney.phase3.method || '').replace(/\n/g, ' '),
      playerJourney.phase3.changed ? 'Si' : 'No',
      String(playerJourney.totalChanges),
      String(score.deduction),
      String(score.flexibility),
      String(score.accusation),
      String(score.timeline),
      String(score.total),
      analysis,
      teamwork,
      flexObs.replace(/\n/g, ' '),
      comments.replace(/\n/g, ' ')
    ];

    const csvContent = [headers, row]
      .map(r => r.map(item => '"' + (item || '').replace(/"/g, '""') + '"').join(','))
      .join('\n');

    const bom = '\uFEFF'; // BOM para correcto encoding en Excel
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const safeName = (currentCase?.title || 'caso').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
    link.setAttribute('download', 'evaluacion_' + safeName + '_' + Date.now() + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}

// ======= Inicializacion =======
document.addEventListener('DOMContentLoaded', () => {
  updateCaseSelectOptions();
});

// Actualizar selector de casos cuando cambia la dificultad
const diffSelectEl = document.getElementById('difficulty');
if (diffSelectEl) {
  diffSelectEl.addEventListener('change', () => {
    updateCaseSelectOptions();
    const cs = document.getElementById('caseSelect');
    if (cs) cs.value = '';
    const startBtnEl = document.getElementById('startBtn');
    if (startBtnEl) startBtnEl.disabled = true;
  });
}

// Habilitar o deshabilitar boton de inicio segun si hay caso elegido
const caseSelectEl = document.getElementById('caseSelect');
const startBtnEl = document.getElementById('startBtn');
if (caseSelectEl && startBtnEl) {
  caseSelectEl.addEventListener('change', () => {
    startBtnEl.disabled = !caseSelectEl.value;
  });
  startBtnEl.disabled = true;
}

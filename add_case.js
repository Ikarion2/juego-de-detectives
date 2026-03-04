// add_case.js — Agregar caso con validacion v2 (Investigacion Progresiva)
document.addEventListener('DOMContentLoaded', () => {
  const backBtn = document.getElementById('backBtn');
  const saveBtn = document.getElementById('saveBtn');
  const validateBtn = document.getElementById('validateBtn');
  const loadTemplateBtn = document.getElementById('loadTemplateBtn');
  const textarea = document.getElementById('caseJson');
  const resultDiv = document.getElementById('validationResult');

  // --- Plantilla vacia ---
  const TEMPLATE = {
    id: 0,
    difficulty: 'Alto',
    title: '',
    description: '',
    objectives: [''],
    characters: [
      {
        name: '',
        personality: '',
        testimony: '',
        truth: false,
        suspicionLevel: 'high'
      },
      {
        name: '',
        personality: '',
        testimony: '',
        truth: false,
        suspicionLevel: 'medium'
      },
      {
        name: '',
        personality: '',
        testimony: '',
        truth: true,
        suspicionLevel: 'low'
      }
    ],
    clues: {
      phase1: [
        { text: '', relevant: true, misleading: true, pointsTo: '' }
      ],
      phase2: [
        { text: '', relevant: true, misleading: false, contradicts: '' }
      ],
      phase3: [
        { text: '', relevant: true, misleading: false }
      ]
    },
    solution: {
      culprit: '',
      motive: '',
      method: '',
      consequence: 'assets/images/consecuencia.png',
      chronology: [
        { event: '', clueHint: '' }
      ]
    },
    debriefQuestions: ['']
  };

  if (loadTemplateBtn) {
    loadTemplateBtn.addEventListener('click', () => {
      textarea.value = JSON.stringify(TEMPLATE, null, 2);
      showResult('', '');
    });
  }

  // --- Validacion ---
  function validateCase(obj) {
    const errors = [];

    // Campos basicos
    if (!obj.title || typeof obj.title !== 'string') {
      errors.push('Falta "title" (string).');
    }
    if (!obj.difficulty || !['Alto', 'Experto', 'Avanzado'].includes(obj.difficulty)) {
      errors.push('"difficulty" debe ser "Alto", "Experto" o "Avanzado".');
    }
    if (!obj.description) {
      errors.push('Falta "description".');
    }

    // Personajes
    if (!Array.isArray(obj.characters) || obj.characters.length < 3) {
      errors.push('"characters" debe ser un array con al menos 3 personajes.');
    } else {
      obj.characters.forEach((ch, i) => {
        if (!ch.name) errors.push('Personaje ' + (i + 1) + ': falta "name".');
        if (!ch.testimony) errors.push('Personaje ' + (i + 1) + ': falta "testimony".');
        if (!['high', 'medium', 'low'].includes(ch.suspicionLevel)) {
          errors.push('Personaje ' + (i + 1) + ': "suspicionLevel" debe ser "high", "medium" o "low".');
        }
        if (typeof ch.truth !== 'boolean') {
          errors.push('Personaje ' + (i + 1) + ': "truth" debe ser true o false.');
        }
      });
    }

    // Pistas por fases
    if (!obj.clues || typeof obj.clues !== 'object') {
      errors.push('Falta el objeto "clues".');
    } else {
      ['phase1', 'phase2', 'phase3'].forEach(phase => {
        if (!Array.isArray(obj.clues[phase]) || obj.clues[phase].length === 0) {
          errors.push('"clues.' + phase + '" debe ser un array con al menos 1 pista.');
        } else {
          obj.clues[phase].forEach((clue, i) => {
            if (!clue.text) {
              errors.push('clues.' + phase + '[' + i + ']: falta "text".');
            }
            if (typeof clue.relevant !== 'boolean') {
              errors.push('clues.' + phase + '[' + i + ']: "relevant" debe ser boolean.');
            }
          });
        }
      });
    }

    // Solucion — acepta "solution" directo o "variants[0]"
    var sol = obj.solution;
    if (!sol && Array.isArray(obj.variants) && obj.variants.length) {
      sol = obj.variants[0];
    }
    if (!sol || typeof sol !== 'object') {
      errors.push('Falta "solution" (o "variants" con al menos 1 elemento).');
    } else {
      if (!sol.culprit) errors.push('"culprit" es obligatorio en solution/variants.');
      if (!sol.motive) errors.push('"motive" es obligatorio en solution/variants.');
      if (!sol.method) errors.push('"method" es obligatorio en solution/variants.');

      // Cronologia
      if (!Array.isArray(sol.chronology) || sol.chronology.length < 2) {
        errors.push('"chronology" debe ser un array con al menos 2 eventos.');
      } else {
        sol.chronology.forEach((item, i) => {
          if (typeof item !== 'object' || !item.event) {
            errors.push('chronology[' + i + ']: debe ser un objeto con "event" y "clueHint".');
          }
        });
      }
    }

    // Preguntas de debrief
    if (!Array.isArray(obj.debriefQuestions) || obj.debriefQuestions.length === 0) {
      errors.push('"debriefQuestions" debe ser un array con al menos 1 pregunta.');
    }

    return errors;
  }

  function showResult(type, message) {
    if (!resultDiv) return;
    resultDiv.className = type; // 'valid', 'invalid', or ''
    resultDiv.innerHTML = message;
    resultDiv.style.display = type ? 'block' : 'none';
  }

  // Boton validar
  if (validateBtn) {
    validateBtn.addEventListener('click', () => {
      const raw = textarea.value.trim();
      if (!raw) {
        showResult('invalid', 'El campo esta vacio.');
        return;
      }
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        showResult('invalid', '<strong>Error de JSON:</strong> ' + e.message);
        return;
      }
      const errors = validateCase(parsed);
      if (errors.length === 0) {
        showResult('valid', '<strong>JSON valido.</strong> El caso cumple con la estructura requerida.');
      } else {
        showResult('invalid',
          '<strong>' + errors.length + ' problema(s) encontrado(s):</strong><br>' +
          errors.map(e => '• ' + e).join('<br>')
        );
      }
    });
  }

  // --- Navegacion ---
  backBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  // --- Guardar caso ---
  saveBtn.addEventListener('click', () => {
    const raw = textarea.value.trim();
    if (!raw) {
      showResult('invalid', 'Por favor, ingresa el caso en formato JSON.');
      return;
    }

    let newCase;
    try {
      newCase = JSON.parse(raw);
    } catch (e) {
      showResult('invalid', '<strong>Error de JSON:</strong> ' + e.message);
      return;
    }

    // Validar estructura
    const errors = validateCase(newCase);
    if (errors.length > 0) {
      showResult('invalid',
        '<strong>No se puede guardar. ' + errors.length + ' problema(s):</strong><br>' +
        errors.map(e => '• ' + e).join('<br>')
      );
      return;
    }

    // Asignar id si no tiene
    if (!newCase.id) {
      newCase.id = (window.cases || []).length + 1;
    }

    // Anadir a la lista global
    if (window.cases) {
      window.cases.push(newCase);
    }

    // Persistir en localStorage
    const stored = JSON.parse(localStorage.getItem('addedCases') || '[]');
    stored.push(newCase);
    localStorage.setItem('addedCases', JSON.stringify(stored));

    showResult('valid', '<strong>Caso guardado exitosamente.</strong> Redirigiendo...');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1200);
  });
});

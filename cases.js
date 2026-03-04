const cases = [
  {
    id: 1,
    difficulty: 'Alto',
    title: 'Incendio en el laboratorio',
    description: 'Viernes por la tarde, al terminar la jornada, se percibe un olor persistente a solvente en el pasillo del laboratorio. Minutos después, un foco de fuego se inicia sobre la mesa de trabajo principal y es extinguido rápidamente, dejando daños en equipo y materiales. Antes del cierre hubo clase de química donde se utilizaron solventes y mecheros. Tras el último timbre, el flujo de personas disminuye, pero quedaron rastros de manipulación posterior y señales contradictorias. Se logra aislar a las personas que se encontraban cerca del laboratorio en la hora en que ocurrio el incidente y se procede a comparar sus testimonios con las evidencias físicas para reconstruir una cronología fiable de la ocurrencia de los hechos.',
    objectives: [
      'Contrastar testimonios con evidencias físicas y registros',
      'Diferenciar pistas relevantes de aquellas enganosas',
      'Armar la cronología de los hechos ocurridos',
      'Evaluar la credibilidad de cada testigo'
    ],
    characters: [
      {
        name: 'Profesor Soto', image: 'assets/case1/characters/profe.png',
        personality: 'Exigente, organizado a su manera, se le ve corriendo en todo momento. Confia en su rutina y evita reconocer errores pequenos.',
        testimony: '"Hoy hicimos prácticas simples. Dejé el laboratorio ordenado, pero salí apurado por una reunión. Revisé rápido los mecheros y no recuerdo si ventilé bien. Suelo completar el checklist al final; puede que quedara pendiente una casilla."',
        truth: false,
        suspicionLevel: 'high'
      },
      {
        name: 'Estudiante Ramirez', image: 'assets/case1/characters/ramirez.png',
        personality: 'Curioso, proclive a probar cosas por el bien de la ciencia, cree que descubrir cosas nuevas es lo mas importante, no suele medir el riesgo.',
        testimony: 'Olvide mi cuaderno y volvi un segundo. La puerta estaba entreabierta; entre, tome el cuaderno y me fui. Habia un olorcito, pero pense que era normal después de las prácticas. No toque nada, ni el mechero ni los frascos. No vi a nadie mas.',
        truth: false,
        suspicionLevel: 'medium'
      },
      {
        name: 'Estudiante Fernandez', image: 'assets/case1/characters/fernandez.png',
        personality: 'Metodica, estudiosa, suele escribir todo en su agenda. Siempre se le ve estudiar en biblioteca, junto al laboratorio. Destaca por pasar horas leyendo sobre temas que le son de interes.',
        testimony: 'Estuve en la biblioteca revisando guias hasta el último timbre. No me acerque al laboratorio.',
        truth: true,
        suspicionLevel: 'low'
      },
      {
        name: 'Guardia', image: 'assets/case1/characters/guardia.png',
        personality: 'Confiado, tiende a normalizar ruidos menores y no prestarle atención. Tiene un muy buen trato con los alumnos, Se le ha visto dormitando algunas veces en su horario de trabajo.',
        testimony: 'En el pasillo escuche un clic metalico breve, como de llave o de valvula, y senti una rafaga de olor mas fuerte a alcohol cerca de la puerta del laboratorio. Supuse que venia de limpieza o fueron los gatos que mueven cosas a veces. Minutos después avisaron del humo y me acerque. No vi quien entro o salio.',
        truth: false,
        suspicionLevel: 'low'
      },
      {
        name: 'Encargado de Enlaces', image: 'assets/case1/characters/TI.png',
        personality: 'Muy ordenado. Comunmente revisa los cierres de las puertas cuando va camino a la sala de computacion, respalda las camaras y las revisa cuando se debe investigar algo, colabora comunmente con las diversas situaciones que ocurren en la escuela.',
        testimony: 'Volvía de descanso y, en mi revisión de rutina, vi la puerta entreabierta con humo en el interior. Ayudé a extinguir el foco con el extintor. Solicité revisar cámaras: algunos sectores están en mantención, pero sí quedó registrada una apertura después del último timbre.',
        truth: true,
        suspicionLevel: 'low'
      }
    ],
    clues: {
      phase1: [
        { text: "Mochila con inicial 'P.' con leve tostado en una esquina, ubicada en estante bajo (no presenta hollin ni residuo de solvente).", relevant: false, misleading: true, pointsTo: "Profesor Soto" },
        { text: "Tarro de limpiador de pisos abierto en pasillo contiguo (producto jabonoso, no inflamable).", relevant: false, misleading: true, pointsTo: "Guardia" },
        { text: "Checklist de cierre del dia con dos casillas sin marcar: 'abrir ventilacion post-uso' y 'doble revision del cierre de los mecheros'.", relevant: true, misleading: true, pointsTo: "Profesor Soto" },
        { text: "Rumor de 'broma al profe de ed. Fisica' circulando en 2do medio durante la semana.", relevant: false, misleading: true, pointsTo: "Estudiante Ramirez" },
        { text: "Cable USB chamuscado junto a notebook antiguo sin conexion al mechero.", relevant: false, misleading: false }
      ],
      phase2: [
        { text: "Alerta del control de acceso indica una apertura posterior al último timbre.", relevant: true, misleading: false, contradicts: "Profesor Soto" },
        { text: "Mensaje en grupo de curso: 'Alguien se queda practicando hoy? Necesito repetir el montaje'.", relevant: true, misleading: false, contradicts: "Profesor Soto" },
        { text: "Llavero de copias con etiqueta descolorida hallado cerca del mueble de reactivos; registro de prestamo incompleto del mes pasado.", relevant: true, misleading: false },
        { text: "Frasco de etanol con tapa mal sellada y pequenas manchas recientes junto a la base del mechero.", relevant: true, misleading: false },
        { text: "Extractores de aire apagados y ventanas cerradas; olor a solvente mas intenso dentro que en pasillo.", relevant: true, misleading: false, contradicts: "Profesor Soto" }
      ],
      phase3: [
        { text: "Circulo de quemado en la mesa principal alineado con marcas de llama; borde de carbon finamente distribuido.", relevant: true, misleading: false },
        { text: "Mechero principal con la llave de gas girada casi a 'cerrado' (flujo minimo detectable).", relevant: true, misleading: false },
        { text: "Huella de zapato con borde humedo que entra y sale (dos direcciones) desde el umbral hacia la mesa y de vuelta.", relevant: true, misleading: false },
        { text: "Pano de limpieza guardado apresuradamente con fuerte olor a alcohol, parcialmente humedo.", relevant: true, misleading: false },
        { text: "Guantes de nitrilo con leve hollin depositados en contenedor de residuos generales (no en residuo quimico).", relevant: true, misleading: false },
        { text: "Rastro leve de gotas desde el frasco de etanol hacia el borde de la mesa, indicando uso posterior a la limpieza y cierre.", relevant: true, misleading: false },
        { text: "Pequeno rasguno metalico reciente en la perilla del mechero (marca brillante sin oxidacion).", relevant: true, misleading: false },
        { text: "Nota de laboratorio con formulas tachadas y titulo no soluble en agua.", relevant: false, misleading: false },
        { text: "Caja de fosforos vacia en papelera comun, con polvo acumulado (residuo de dias anteriores).", relevant: false, misleading: false },
        { text: "Pizarra del laboratorio aun con el texto de la ultima clase escrito en ella.", relevant: false, misleading: false }
      ]
    },
    partition: {
      A: { characters: [0, 1, 2], clues: [0, 2, 6, 8, 9, 10] },
      B: { characters: [3, 4], clues: [1, 3, 4, 5, 7, 11, 12, 13, 14, 15] }
    },
    variants: [
      {
        culprit: 'Estudiante Ramirez',
        motive: 'Cadena de descuidos + curiosidad fuera de protocolo.',
        method: 'Soto deja el laboratorio en condicion insegura; Ramirez reingresa con llaves, manipula cerca de solventes, enciende el mechero y trata de ocultar.',
        chronology: [
          { event: 'Durante la ultima clase de química se usan solventes y mecheros.', clueHint: 'Frasco de etanol con tapa mal sellada y pequenas manchas recientes junto a la base del mechero.' },
          { event: 'Un frasco de etanol queda mal sellado al finalizar la clase, lo que hace que el ambiente se sature de vapor quimico.', clueHint: 'Extractores de aire apagados y ventanas cerradas; olor a solvente mas intenso dentro que en pasillo.' },
          { event: 'El profesor revisa rápidamente los mecheros sin percatarse de que uno queda con la llave de gas casi cerrada (flujo minimo detectable).', clueHint: 'Checklist de cierre del dia con dos casillas sin marcar: abrir ventilacion post-uso y doble revision del cierre de los mecheros.' },
          { event: 'Antes de salir, olvida activar los extractores; quedan apagados y las ventanas cerradas.', clueHint: 'Extractores de aire apagados y ventanas cerradas; olor a solvente mas intenso dentro que en pasillo.' },
          { event: 'El docente sale sin marcar los ultimos 2 items del checklist: ventilacion post-uso y doble revision de mecheros.', clueHint: 'Checklist de cierre del dia con dos casillas sin marcar.' },
          { event: 'Alguien reingresa al laboratorio usando copias de llaves; unas huellas humedas marcan entrada y salida hasta la mesa.', clueHint: 'Llavero de copias con etiqueta descolorida hallado cerca del mueble de reactivos.' },
          { event: 'Cerca del mechero se manipulan elementos; aparece un rasguno reciente en la perilla.', clueHint: 'Pequeno rasguno metalico reciente en la perilla del mechero (marca brillante sin oxidacion).' },
          { event: 'Con solvente mal sellado y ventilacion apagada, se eleva la concentracion de vapor en torno a la mesa.', clueHint: 'Rastro leve de gotas desde el frasco de etanol hacia el borde de la mesa, indicando uso posterior a la limpieza y cierre.' },
          { event: 'Se produce ignicion en la mesa principal, dejando un circulo de quemado y marcas de llama.', clueHint: 'Circulo de quemado en la mesa principal alineado con marcas de llama.' },
          { event: 'Quien reingreso intenta ocultar el incidente: usa un pano con alcohol y descarta guantes con hollin en residuos generales.', clueHint: 'Guantes de nitrilo con leve hollin depositados en contenedor de residuos generales (no en residuo quimico).' },
          { event: 'Se percibe un clic metalico y el olor a alcohol aumenta en el umbral del laboratorio.', clueHint: 'Alerta del control de acceso indica una apertura posterior al último timbre.' },
          { event: 'El encargado de TI detecta la puerta entreabierta, colabora en la extincion y solicita respaldo de camaras.', clueHint: 'Huella de zapato con borde humedo que entra y sale (dos direcciones) desde el umbral hacia la mesa y de vuelta.' }
        ],
        consequence: 'assets/case1/conclusion/final.png'
      }
    ],
    debriefQuestions: [
      "Selecciona cinco pistas que, conectadas, expliquen por que el foco se origino en la mesa principal.",
      "Indica dos pistas que parecen importantes pero no sostienen la cadena causal y justifica por que son ruido.",
      "Segun los testimonios, asigna una credibilidad (1-5) a cada personaje y cita que evidencia especifica respalda tu puntaje.",
      "Relaciona el 'clic metalico' y el aumento de olor en el umbral con dos pistas materiales dentro del laboratorio."
    ]
  },

  {
    id: 2,
    difficulty: 'Experto',
    title: 'Robo en el salon de computacion',
    description: 'En un intervalo breve, desaparece una laptop del salon de computacion. Coinciden transito de estudiantes y la visita de un proveedor en mantencion. El mobiliario sugiere prisa mas que fuerza: nada esta forzado, pero hay señales de manipulación apresurada. Varios testigos mezclan recuerdos de distintos momentos; una gorra roja capta miradas y sesga la atención. La tarea es cruzar testimonios con evidencias físicas para reconstruir la secuencia real de lo ocurrido.',
    objectives: ['Analizar evidencias físicas', 'Evaluar coartadas y motivos', 'Reconstruir que ocurrio'],
    characters: [
      {
        name: 'Jefe de TI', image: 'assets/case2/characters/1.png',
        personality: 'Metodico, protector del inventario; receloso de externos cuando hay equipos sin anclar.',
        testimony: 'Sali unos minutos a imprimir documentos y a retirar etiquetas de inventario. Al volver, note el armario de red entreabierto, como si el pestillo no hubiese calzado bien. No vi el equipo faltante de inmediato porque habia movimiento en el pasillo.',
        truth: true,
        suspicionLevel: 'low'
      },
      {
        name: 'Estudiante Fernando', image: 'assets/case2/characters/2.png',
        personality: 'Amante de la tecnologia e inteligencia artificial; valora oportunidades de la vida.',
        testimony: 'Entre solo a buscar un cargador que habia dejado en un enchufe. No me quede. No toque los computadores; estaban ocupados y habia apuro en el pasillo por lo que sali rapido.',
        truth: false,
        suspicionLevel: 'medium'
      },
      {
        name: 'Estudiante Laura', image: 'assets/case2/characters/3.png',
        personality: 'Planificada y cuidadosa; estudia en la sala del lado con vista al pasillo, suele tomar notas en fichas.',
        testimony: 'Yo no ingrese al salon. Escuche pasos rapidos que salian hacia la puerta principal y un roce fuerte contra un mueble, como si alguien se apurara.',
        truth: true,
        suspicionLevel: 'low'
      },
      {
        name: 'Proveedor', image: 'assets/case2/characters/4.png',
        personality: 'Pragmatico y apurado por cumplir ruta; minimiza detalles si cree que no afectan el servicio.',
        testimony: 'Reemplace cables del servidor y revise puertos. Deje todo cerrado. La factura la firmo al final de la jornada; no siempre me la devuelven al tiro. No note nada fuera de lo normal.',
        truth: false,
        suspicionLevel: 'high'
      },
      {
        name: 'Guardia', image: 'assets/case2/characters/5.png',
        personality: 'Observador, pero sugestionable por rasgos llamativos; fija la mirada en elementos vistosos.',
        testimony: 'Vi pasar a alguien con gorra roja moviendose rapido hacia la salida. No alcance a ver la cara, solo la gorra y una chaqueta abultada.',
        truth: true,
        suspicionLevel: 'low'
      }
    ],
    clues: {
      phase1: [
        { text: "Gorra de béisbol roja encontrada sobre un escritorio, sin señales de uso reciente (polvo fino en la visera).", relevant: true, misleading: true, pointsTo: "Proveedor" },
        { text: "Factura de mantenimiento sin firmar (documento en blanco, sin correlacion temporal con el retiro del equipo).", relevant: false, misleading: true, pointsTo: "Proveedor" },
        { text: "Caja vacia de equipo nuevo en la papelera general (modelo distinto a la laptop sustraida).", relevant: false, misleading: true, pointsTo: "Jefe de TI" },
        { text: "Cinta adhesiva con pelusas adheridas, sin tension ni restos de fibras del equipo faltante.", relevant: false, misleading: false },
        { text: "Lista de verificacion de TI con una revision de anclaje fisico pendiente de ejecucion.", relevant: false, misleading: true, pointsTo: "Jefe de TI" }
      ],
      phase2: [
        { text: "Armario de red entreabierto; marcas recientes en el pestillo indican cierre incompleto.", relevant: true, misleading: false, contradicts: "Proveedor" },
        { text: "Cable de red con clip del conector partido, colgando del puesto donde falto la laptop.", relevant: true, misleading: false, contradicts: "Proveedor" },
        { text: "Registro del switch indica caida del puerto del puesto afectado posterior al último timbre.", relevant: true, misleading: false, contradicts: "Proveedor" },
        { text: "Huella de zapato con barro junto a la puerta, el patron apunta hacia la salida.", relevant: true, misleading: false },
        { text: "Pano con leve olor a limpiador de pantalla, sin huellas visibles de humedad reciente.", relevant: false, misleading: false }
      ],
      phase3: [
        { text: "Toalla de microfibra con limaduras metalicas finas y polvo de tornillo en una esquina.", relevant: true, misleading: false },
        { text: "Mensaje en chat estudiantil ofreciendo 'equipo casi nuevo' describiendo especificaciones que coinciden con la laptop faltante.", relevant: true, misleading: false },
        { text: "Rastro leve de goma en el borde del escritorio (marca de deslizamiento del equipo hacia el pasillo).", relevant: true, misleading: false },
        { text: "Anclaje de seguridad del puesto con un tornillo parcialmente desatornillado y ausencia del perno de bloqueo.", relevant: true, misleading: false }
      ]
    },
    partition: {
      A: { characters: [0, 1, 2], clues: [0, 2, 4, 5, 6, 8, 12] },
      B: { characters: [3, 4], clues: [1, 3, 7, 9, 10, 11, 13] }
    },
    variants: [
      {
        culprit: 'Estudiante Fernando',
        motive: 'Obtener dinero rapido revendiendo la laptop.',
        method: 'Aprovecha la ventana breve cuando el Jefe de TI se ausenta y el armario queda entreabierto tras la intervencion del proveedor (contexto de cables y movimiento legitimado). Se acerca al puesto, libera el anclaje aflojando el tornillo (micro-limaduras en la microfibra), desconecta el equipo con prisa rompiendo el clip del RJ-45 (puerto del switch cae posterior al último timbre), desliza la laptop hacia si (marca de goma en el borde), la oculta bajo la chaqueta y sale dejando una huella con barro. La gorra roja dirige la atención del guardia y sesga testimonios; una gorra con polvo aparece luego en un escritorio, confundiendose con la prenda observada.',
        chronology: [
          { event: "Breve ventana: Jefe de TI se ausenta; proveedor ha manipulado cables y el armario queda entreabierto (contexto).", clueHint: "Armario de red entreabierto; marcas recientes en el pestillo indican cierre incompleto." },
          { event: "Fernando entra con coartada del cargador y se dirige al puesto especifico.", clueHint: "Registro del switch indica caida del puerto del puesto afectado posterior al último timbre." },
          { event: "Afloja el tornillo del anclaje; quedan limaduras en la microfibra.", clueHint: "Toalla de microfibra con limaduras metalicas finas y polvo de tornillo en una esquina." },
          { event: "Desconecta con prisa y rompe el clip del RJ-45; el puerto del switch cae posterior al último timbre.", clueHint: "Cable de red con clip del conector partido, colgando del puesto donde falto la laptop." },
          { event: "Desliza la laptop (marca de goma) y la oculta bajo la chaqueta.", clueHint: "Rastro leve de goma en el borde del escritorio (marca de deslizamiento del equipo hacia el pasillo)." },
          { event: "Sale rapido, dejando una huella con barro junto a la puerta.", clueHint: "Huella de zapato con barro junto a la puerta, el patron apunta hacia la salida." },
          { event: "La atención del guardia se fija en una gorra roja en movimiento; posteriormente se halla una gorra con polvo en un escritorio (sesgo).", clueHint: "Gorra de béisbol roja encontrada sobre un escritorio, sin señales de uso reciente (polvo fino en la visera)." },
          { event: "Aparece en el chat estudiantil una oferta de 'equipo casi nuevo' compatible con la laptop sustraida.", clueHint: "Mensaje en chat estudiantil ofreciendo equipo casi nuevo describiendo especificaciones que coinciden con la laptop faltante." }
        ],
        consequence: 'assets/case2/conclusion/1.png'
      }
    ],
    debriefQuestions: [
      "Elige cuatro pistas que, conectadas, explican el retiro fisico de la laptop desde el puesto afectado.",
      "Marca dos pistas que parecen importantes pero no sostienen la cadena causal del robo (ruido) y justifica por que.",
      "Cita un elemento material que refuerza o debilita la version del Proveedor y otro que refuerza o debilita la del Jefe de TI.",
      "Como opero el sesgo de atención con la 'gorra roja'? Relacionalo con una pista física concreta dentro del salon.",
      "Relaciona un testimonio con el momento en que el puerto del puesto afectado cae en el switch (posterior al último timbre) y explica su importancia."
    ]
  },

  {
    id: 3,
    difficulty: 'Avanzado',
    title: 'Sabotaje en la feria de ciencias',
    description: 'Durante el montaje de la feria, el proyecto favorito sufre un dano subito en medio de un lugar con transito constante. Herramientas de uso comun estan accesibles y la supervision es intermitente debido a multiples frentes de coordinacion. El mobiliario no muestra fuerza bruta: las señales apuntan a manipulación rapida y localizada. La presion competitiva y la fatiga generan percepciones contradictorias; una nota intimidante aparece y complica la interpretacion. La tarea es cruzar testimonios con evidencia física para distinguir accidente de intervencion intencional y reconstruir la secuencia real.',
    objectives: ['Identificar posibles sabotajes', 'Contrastar testimonios con evidencias', 'Reconstruir la secuencia de eventos'],
    characters: [
      {
        name: 'Profesora y coordinadora del evento', image: 'assets/case3/characters/1.png',
        personality: 'Organizada y capaz de realizar multitarea; delega y confia en los reportes que le entregan, prioriza tiempos y efectividad.',
        testimony: 'Hice rondas entre stands para confirmar señalética y seguridad. Habia recordado que tenian que colocar un cartel que diga no tocar cableado energizado y que las herramientas comunes se devolvieran a la mesa central. En el tramo en que coordine el evento principal en el escenario, el pasillo se lleno de gente y quede sin linea de vista directa del proyecto afectado.',
        truth: true,
        suspicionLevel: 'low'
      },
      {
        name: 'Estudiante Palacios', image: 'assets/case3/characters/2.png',
        personality: 'Entusiasta, detallista en lo visual; suele dispersarse afinando estetica de último minuto.',
        testimony: 'Sali a buscar cartulina y cinta doble faz para el panel frontal. Cuando volvi, el equipo no encendia y el cartel estaba algo torcido, como si lo hubieran movido a la rapida. Note la regleta con el boton en reset, pero pense que alguien la toco sin querer.',
        truth: true,
        suspicionLevel: 'medium'
      },
      {
        name: 'Estudiante Zuniga', image: 'assets/case3/characters/3.png',
        personality: 'Competitiva; usa la ventaja psicologica y observa a rivales. Dice que esta segura que ganara y se mueve con seguridad entre stands mirando a sus competidores, demuestra una alta autoestima.',
        testimony: 'Estuve montando mi proyecto en la mesa contigua. Mire el de ellos para calcular distancia y que mi proyecto no este tan cerca, asi no despintan mi genial exposicion. No toque su instalacion; habia mucha gente pasando y ruido. Si algo se cayo, debio ser por el movimiento.',
        truth: false,
        suspicionLevel: 'low'
      },
      {
        name: 'Profesor Ayudante', image: 'assets/case3/characters/4.png',
        personality: 'Bien intencionado, ansioso por optimizar orden y seguridad; interviene si ve algo fuera de lugar.',
        testimony: 'Revisé cables de forma general, pero no me acerqué a la regleta del stand afectado.',
        truth: false,
        suspicionLevel: 'medium'
      },
      {
        name: 'Estudiante Nunez', image: 'assets/case3/characters/5.png',
        personality: 'Perfeccionista; confia en controles visuales finos, centrada en acabados perfectos, no tolera perder.',
        testimony: 'Pintaba el cartel cuando escuche un golpe seco de la mesa del lado, como si algo cediera. Senti un olor breve a plastico caliente cerca del borde del stand afectado y vi una tira de cinta negra distinta al rollo que usamos.',
        truth: true,
        suspicionLevel: 'high'
      }
    ],
    clues: {
      phase1: [
        { text: "Caja de herramientas comun bajo una mesa lateral, abierta y sin inventario controlado.", relevant: false, misleading: true, pointsTo: "Profesor Ayudante" },
        { text: "Cronograma de la feria arrugado junto a la mesa del jurado.", relevant: false, misleading: false },
        { text: "Cupon de pizza usado en la papelera del pasillo.", relevant: false, misleading: false },
        { text: "Nota intimidante en papel: 'no ganaran' colocada sobre el faldon del stand.", relevant: true, misleading: true, pointsTo: "Estudiante Nunez" },
        { text: "Guante de latex con polvo de carton pluma (espuma) en dedos y palma.", relevant: false, misleading: true, pointsTo: "Estudiante Palacios" }
      ],
      phase2: [
        { text: "Resena del proyecto afectado con marcas de correccion recientes ('puntos debiles' subrayados).", relevant: true, misleading: false, contradicts: "Estudiante Nunez" },
        { text: "Regleta con interruptor en 'reset' y luz indicadora parpadeante tras el incidente.", relevant: true, misleading: false },
        { text: "Tira de cinta de embalaje de otra mesa con corte recto de tijera (color y material distintos).", relevant: false, misleading: false },
        { text: "Cable de alimentacion del equipo con corte limpio y biselado (sin hilos deshilachados).", relevant: true, misleading: false, contradicts: "Profesor Ayudante" },
        { text: "Olor a plastico quemado percibido cerca del conector del modulo afectado (se disipa en minutos).", relevant: true, misleading: false }
      ],
      phase3: [
        { text: "Residuo de plastico derretido en un conector secundario del modulo (decoloracion localizada).", relevant: true, misleading: false },
        { text: "Restos de cinta aislante negra recortada de forma irregular, superpuesta sobre el cableado.", relevant: true, misleading: false },
        { text: "Cuter de uso comun con micro-residuos oscuros compatibles con aislante de PVC.", relevant: true, misleading: false },
        { text: "Ruta del cable reacomodada por detras del panel, diferente al trazado inicial de la manana.", relevant: true, misleading: false },
        { text: "Muesca lineal superficial en la funda del cable, a pocos centimetros del corte principal.", relevant: true, misleading: false }
      ]
    },
    partition: {
      A: { characters: [0, 1, 4], clues: [0, 3, 5, 6, 9] },
      B: { characters: [2, 3], clues: [1, 2, 7, 10, 11, 13, 14, 12, 4] }
    },
    variants: [
      {
        culprit: 'Estudiante Zuniga',
        motive: 'Reducir la competitividad del stand favorito y obtener ventaja psicologica frente a jurado y publico.',
        method: 'Aprovecha la ventana con supervision intermitente (Profesora en coordinacion; Estudiante Palacios fuera). Reacomoda el tendido por detras del panel y realiza un corte limpio al cable de alimentacion con cuter, generando ademas un punto de alta resistencia en un conector secundario (plastico derretido). Encubre con cinta aislante recortada de forma irregular y deja la nota intimidante para dirigir la sospecha hacia un conflicto abierto.',
        chronology: [
          { event: "Dispersion: la Profesora coordina el evento y Palacios sale por cartulina; baja la supervision directa.", clueHint: "Caja de herramientas comun bajo una mesa lateral, abierta y sin inventario controlado." },
          { event: "Zuniga se aproxima al stand rival bajo apariencia de observar distribucion.", clueHint: "Resena del proyecto afectado con marcas de correccion recientes (puntos debiles subrayados)." },
          { event: "Reacomoda discretamente la ruta del cable por detras del panel.", clueHint: "Ruta del cable reacomodada por detras del panel, diferente al trazado inicial de la manana." },
          { event: "Corta con cuter el cable de alimentacion (corte limpio) y manipula un conector secundario que luego mostrara plastico derretido.", clueHint: "Cable de alimentacion del equipo con corte limpio y biselado (sin hilos deshilachados)." },
          { event: "Coloca cinta aislante recortada de forma irregular para disimular la intervencion.", clueHint: "Restos de cinta aislante negra recortada de forma irregular, superpuesta sobre el cableado." },
          { event: "Deja una nota intimidante para orientar la atención hacia la rivalidad.", clueHint: "Nota intimidante en papel: no ganaran colocada sobre el faldon del stand." },
          { event: "Al energizar nuevamente y con el movimiento del pasillo, se produce el fallo subito; la regleta queda en reset y se percibe olor a plastico caliente.", clueHint: "Regleta con interruptor en reset y luz indicadora parpadeante tras el incidente." },
          { event: "El equipo no enciende; se detectan las anomalías de cableado y los indicios fisicos.", clueHint: "Residuo de plastico derretido en un conector secundario del modulo (decoloracion localizada)." }
        ],
        consequence: 'assets/case3/conclusion/1.png'
      }
    ],
    debriefQuestions: [
      "Selecciona cuatro pistas que, conectadas, muestran intervencion intencional sobre el sistema electrico (no accidente).",
      "Elige dos pistas de ruido y justifica por que no sostienen la cadena causal del dano.",
      "Vincula un testimonio con una pista física que lo refuerza o lo contradice (cita ambos con precision).",
      "Indica el momento mas probable de intervencion, usando la lógica de dependencia entre: ruta del cable reacomodada, corte limpio y residuo de plastico derretido.",
      "Explica como la cinta aislante recortada irregularmente se relaciona con el intento de camuflar la manipulación."
    ]
  },

  {
    id: 4,
    difficulty: 'Alto',
    title: 'Acto vandalico en la biblioteca',
    description: 'La biblioteca aparece desordenada con daños focalizados en ciertos libreros, los mas cercanos a la entrada. Hay olor reciente a pintura, restos de pegamento y un mensaje provocador que critica la "aburrida" seleccion de titulos. La bibliotecaria mantiene una rutina breve de cafe en la tarde; algunos estudiantes colaboran con el orden y carteleria; el conserje pasa por el pasillo para retirar basura.',
    objectives: [
      'Analizar rasgos de personalidad y su relacion con los testimonios',
      'Distinguir evidencia relevante de ruido contextual',
      'Construir una cronología lógica del hecho',
      'Evaluar la credibilidad de cada testimonio segun consistencia y soporte material'
    ],
    characters: [
      {
        name: 'Bibliotecaria',
        image: 'assets/case4/characters/Bibliotecaria.png',
        personality: 'Cuidadosa con el orden; frustrada por recortes de presupuesto; valora la exhibicion del frontis como una portada viva de la biblioteca.',
        testimony: 'Sali cinco minutos por un cafe, como todos los dias. Antes de salir, deje el exhibidor frontal con novedades y los carteles informativos alineados. Al volver, vi libros en el suelo y restos de pegamento sobre carteles. Percibi olor a pintura que no tenia sentido oler ahi.',
        truth: true,
        suspicionLevel: 'low'
      },
      {
        name: 'Estudiante Silva',
        image: 'assets/case4/characters/silva.png',
        personality: 'Colaboradora frecuente de la biblioteca, metodica; orgullosa del espacio, prioriza que los libros esten ordenados por autor y etiqueta.',
        testimony: 'Me quede ordenando con permiso de la bibliotecaria. Estaba acomodando libros por autor y rectificando etiquetas. No provoque el desorden, me llamaron por telefono y tuve que salir; regrese minutos después que la bibliotecaria, ya habia libros en el suelo y vi una nota en la mesa. No use pegamento.',
        truth: true,
        suspicionLevel: 'medium'
      },
      {
        name: 'Estudiante Henriquez',
        image: 'assets/case4/characters/malo.png',
        personality: 'Escritor del periodico escolar; es critico de normas del establecimiento; usa humor sarcastico y comentarios sobre censura.',
        testimony: 'Pase por fuera, me dirigia a clases de pintura, no entre. Ese desorden no es mi estilo. La gente se escandaliza por nada; ademas, hoy habia mucho transito por el pasillo.',
        truth: false,
        suspicionLevel: 'low'
      },
      {
        name: 'Conserje',
        image: 'assets/case4/characters/Conserje.png',
        personality: 'Practico, atento a detalles de limpieza; repara elementos de la escuela y realiza mantenimiento del mobiliario.',
        testimony: 'En mi ronda escuché risas y golpes desde la biblioteca. Vi huellas de barro hacia la salida principal, aunque después dudé si ese rastro venía realmente desde el interior.',
        truth: false,
        suspicionLevel: 'low'
      },
      {
        name: 'Estudiante Zuniga',
        image: 'assets/case4/characters/zuniga.png',
        personality: 'Hace murales; cuidadosa del espacio cultural; protege materiales de arte, para ella todo puede ser una obra maestra.',
        testimony: 'Estaba pintando un mural en el pasillo con pintura azul (tarro y rodillo en el suelo, cerca de la entrada). Oi un golpe y voces apuradas alejandose. Despues vi una marca azul dentro de la biblioteca que no hice yo.',
        truth: true,
        suspicionLevel: 'high'
      }
    ],
    clues: {
      phase1: [
        { text: "Huellas de barro que conducen a la salida principal; patron discontinuo y superficial, poco concordantes con el patron de una persona que camina.", relevant: true, misleading: true, pointsTo: "Conserje" },
        { text: "Trazo de pintura azul en el borde de una mesa cercana al desastre, sospechosamente visible.", relevant: true, misleading: true, pointsTo: "Estudiante Zuniga" },
        { text: "Caja de galletas vacia en la mesa de lectura compartida.", relevant: false, misleading: false },
        { text: "Lapiz rojo sin punta en el mostrador.", relevant: false, misleading: false },
        { text: "Libros para ser fotocopiados junto a la fotocopiadora con titulos politicos.", relevant: false, misleading: true, pointsTo: "Estudiante Henriquez" }
      ],
      phase2: [
        { text: "Limpiapies del pasillo de la biblioteca limpio de barro pese a huellas de barro dentro de la biblioteca.", relevant: true, misleading: false, contradicts: "Conserje" },
        { text: "Mancha de pintura azul bajo el borde de la estanteria frontal.", relevant: true, misleading: false, contradicts: "Estudiante Zuniga" },
        { text: "Nota de protesta: 'Libros aburridos!' colocada en la mesa de consultas.", relevant: true, misleading: false },
        { text: "Poleron oscuro dejado en una silla del pasillo con restos de barro seco en el bolsillo interior.", relevant: true, misleading: false },
        { text: "Tiras de papel cortadas a guillotina en caja de sobrantes.", relevant: false, misleading: false }
      ],
      phase3: [
        { text: "Libros del mueble frontal caidos; la mayoria sin dano aparente, dos con lomo marcado por el impacto de caer al suelo.", relevant: true, misleading: false },
        { text: "Pegamento de barra sin tapa junto a carteles informativos rasgados; adhesivo aun pegajoso.", relevant: true, misleading: false },
        { text: "Borde de cartel rasgado con restos de adhesivo fresco y fibras de papel adheridas.", relevant: true, misleading: false },
        { text: "Gotas finas de pegamento en la mesa opuesta al exhibidor (direccion de salpicado orientada hacia la estanteria).", relevant: true, misleading: false },
        { text: "Olor a pintura mas intenso junto a la estanteria frontal que en el pasillo del mural.", relevant: true, misleading: false }
      ]
    },
    partition: {
      A: { characters: [0, 1, 2], clues: [0, 2, 3, 4, 7, 14] },
      B: { characters: [3, 4], clues: [1, 5, 6, 8, 9, 10, 11, 12, 13] }
    },
    solution: {
      culprit: 'Estudiante Henriquez',
      motive: 'Protesta contra reglas de silencio y la curaduria de libros, buscando impacto y burla publica.',
      method: 'Aprovecha la ausencia breve de la bibliotecaria; provoca dano visible en estanterias frontales, rasga carteles informativos y deja una nota provocadora. Para teatralizar la salida, arrastra barro hacia la puerta principal y deja rastro de pintura azul tomada del mural del pasillo.',
      chronology: [
        { event: "Ventana de oportunidad: bibliotecaria sale a tomar un cafe; transito en pasillo donde se esta pintando un mural azul; Silva sale a hablar por telefono al patio del establecimiento.", clueHint: "Limpiapies del pasillo de la biblioteca limpio de barro pese a huellas de barro dentro de la biblioteca." },
        { event: "Ingreso al area de la biblioteca y derribo selectivo de libros para generar impacto.", clueHint: "Libros del mueble frontal caidos; la mayoria sin dano aparente, dos con lomo marcado por el impacto de caer al suelo." },
        { event: "Rasgado de carteles informativos y uso de pegamento de barra sobre estos para destruirlos.", clueHint: "Pegamento de barra sin tapa junto a carteles informativos rasgados; adhesivo aun pegajoso." },
        { event: "Mancha de pintura azul dentro de la biblioteca a altura de la mano para culpar a otra persona.", clueHint: "Trazo de pintura azul en el borde de una mesa cercana al desastre, sospechosamente visible." },
        { event: "Colocacion de la nota provocadora en mesa de consultas.", clueHint: "Nota de protesta: Libros aburridos! colocada en la mesa de consultas." },
        { event: "Creacion de rastro de barro hacia la salida principal.", clueHint: "Huellas de barro que conducen a la salida principal; patron discontinuo y superficial." },
        { event: "Se oyen risas y un golpe; el conserje advierte el rastro; la bibliotecaria regresa y observa el desorden.", clueHint: "Poleron oscuro dejado en una silla del pasillo con restos de barro seco en el bolsillo interior." }
      ],
      consequence: 'assets/case4/conclusion/final.png'
    },
    debriefQuestions: [
      "Que fue lo mas dificil de determinar? Cita las pistas que te hicieron dudar.",
      "Que testimonio levanto tus sospechas primero y cual te parecio mas confiable? Relacionalos con dos evidencias físicas.",
      "Que pista cambio tu hipótesis inicial y por que?",
      "Resume en tres pasos la cadena minima que explica el dano usando solo pistas del caso.",
      "Si pudieras realizar una unica verificacion adicional, cual elegirias y que esperas confirmar?"
    ]
  },

  {
    id: 5,
    difficulty: 'Experto',
    title: 'Filtracion del examen de matematicas',
    description: 'La tarde previa al examen comienza a circular una copia de un archivo identificado como "material de estudio". La docente habia cambiado la contrasena de su correo recientemente, pero durante la jornada mantuvo un post-it visible como recordatorio temporal en su escritorio. En la sala de profesores hay transito intermitente (docentes, entrenador) y acceso a un computador comun con sesion generica. Los indicios duros sugieren acceso oportunista desde este equipo compartido y una posterior distribucion anonima. La representante de curso, habitual puente de comunicaciones, aparece en el centro del flujo de mensajes. La tarea es conectar testimonios con rastro digital y de impresion.',
    objectives: [
      "Investigar accesos y rastro de distribucion de la prueba",
      "Distinguir evidencia relevante de ruido contextual",
      "Reconstruir una cronología lógica sin horas explicitas",
      "Evaluar motivos y credibilidad segun consistencia con las pistas"
    ],
    characters: [
      {
        name: 'Profesora Torres', image: 'assets/case5/characters/1.png',
        personality: 'Estricta, organizada; usa notas temporales para recordar cambios y tareas.',
        testimony: 'Guarde el examen en mi correo, cambie la contrasena porque la anterior la habia olvidado. Sali un momento a fotocopiar la lista de materiales y luego a corregir unas pruebas en la sala de descanso. Pude haber dejado un post-it con la nueva clave que anote para no olvidar mientras la actualizaba, pero lo retire al terminar.',
        truth: true,
        suspicionLevel: 'low'
      },
      {
        name: 'Estudiante Lopez', image: 'assets/case5/characters/2.png',
        personality: 'Metodica; suele tener un discurso en donde menciona rechazar prácticas de copia y reporta anomalías, es la mejor estudiante del curso.',
        testimony: 'En la tarde me llego un whatsapp de un numero desconocido con un archivo llamado "guia" con ejercicios identicos al estilo de la profesora. Me parecio sospechoso y lo reporte de inmediato.',
        truth: true,
        suspicionLevel: 'low'
      },
      {
        name: 'Estudiante Perez', image: 'assets/case5/characters/5.png',
        personality: 'Normaliza ayudas y atajos para conseguir lo que quiere; presume de conocer trucos.',
        testimony: 'No necesito filtrar nada; tengo mis trucos para pasar las pruebas. Si alguien quiso estudiar, no fui yo.',
        truth: false,
        suspicionLevel: 'high'
      },
      {
        name: 'Entrenador de futbol', image: 'assets/case5/characters/3.png',
        personality: 'Orientado a resultados; presionado por otros docentes debido a los bajos promedios que tienen los integrantes del equipo.',
        testimony: 'Escuche rumores en los pasillos de lo que ocurrio, yo solo pase a dejar material deportivo a la sala de profesores. Nada que ver con examenes; me fui rapido.',
        truth: false,
        suspicionLevel: 'high'
      },
      {
        name: 'Representante de curso', image: 'assets/case5/characters/4.png',
        personality: 'Organiza las comunicaciones del curso, asiste a reuniones semanales en la sala de profesores; maneja listados y recordatorios de todas las actividades educativas que se realizan.',
        testimony: 'Recibi una copia de un numero desconocido. La reenvie tal cual a los grupos, pensando que era material de estudio publico. No lo revise y tampoco accedi a nada de la profesora.',
        truth: false,
        suspicionLevel: 'medium'
      }
    ],
    clues: {
      phase1: [
        { text: "Bolsa de deporte olvidada en la sala de profesores.", relevant: false, misleading: true, pointsTo: "Entrenador de futbol" },
        { text: "Listas de atletas con promedios bajos guardadas en una carpeta del entrenador.", relevant: false, misleading: true, pointsTo: "Entrenador de futbol" },
        { text: "Nota con contrasena en un post-it parcialmente legible encontrada en la papelera de la sala de profesores.", relevant: true, misleading: true, pointsTo: "Profesora Torres" },
        { text: "Porta-credenciales vacio con clip flojo hallado en un escritorio.", relevant: false, misleading: false },
        { text: "Apuntes manuscritos con ejercicios similares, fechados dias antes, en el locker de la profesora Torres.", relevant: false, misleading: true, pointsTo: "Estudiante Perez" }
      ],
      phase2: [
        { text: "Mensaje anonimo masivo a varios alumnos con archivo 'guia' adjunta.", relevant: true, misleading: false, contradicts: "Entrenador de futbol" },
        { text: "Historial del navegador del equipo comun con acceso a la carpeta de la profesora (sesion generica 'alumnos').", relevant: true, misleading: false, contradicts: "Estudiante Perez" },
        { text: "Original 'Lista de materiales para examen' fotocopiada en la misma multifuncional.", relevant: true, misleading: false },
        { text: "Hoja atascada recuperada de la multifuncional con encabezado de 'Lista de actividades del colegio 2025'.", relevant: true, misleading: false },
        { text: "Notificacion de almacenamiento casi lleno en el equipo comun (borra temporal sin logs de usuario nominal).", relevant: false, misleading: false }
      ],
      phase3: [
        { text: "Historial de descargas recientes en el computador comun con un archivo llamado 'guia.pdf'.", relevant: true, misleading: false },
        { text: "Trabajo fallido en cola de impresion con titulo generico ('Documento1').", relevant: true, misleading: false },
        { text: "Metadatos del PDF 'guia' sin autor, con creacion posterior al horario lectivo.", relevant: true, misleading: false },
        { text: "Analisis de los registros en la impresora muestra intento de imprimir ('Documento1') en un horario posterior a la salida de clases.", relevant: true, misleading: false }
      ]
    },
    partition: {
      A: { characters: [0, 2, 4], clues: [0, 2, 4, 3, 12] },
      B: { characters: [1, 3], clues: [1, 5, 6, 8, 9, 10, 7, 11, 13] }
    },
    variants: [
      {
        culprit: 'Representante de curso',
        motive: 'Favorecer a su grupo y ganar influencia como "gestora de informacion".',
        method: 'Durante una gestion de curso observa la contrasena en un post-it en el escritorio de la docente; luego accede desde un computador compartido, descarga el examen con nombre camuflado ("guia"), imprime en franja vespertina y distribuye de forma anonima por mensajeria, justificandolo como "material de estudio".',
        chronology: [
          { event: "La docente cambia contrasena y deja un post-it temporal mientras se ausenta de la sala de profesores.", clueHint: "Nota con contrasena en un post-it parcialmente legible encontrada en la papelera de la sala de profesores." },
          { event: "La representante, presente en el lugar para imprimir la lista de actividades, memoriza/fotografia discretamente la contrasena visible.", clueHint: "Hoja atascada recuperada de la multifuncional con encabezado de Lista de actividades del colegio 2025." },
          { event: "En el apuro, no se percata de que el documento que queria imprimir no sale por un atasco de papel y queda en la cola de impresion.", clueHint: "Trabajo fallido en cola de impresion con titulo generico (Documento1)." },
          { event: "Desde el equipo comun con sesion generica, accede al correo de la profesora y descarga el examen renombrandolo como 'guia.pdf'.", clueHint: "Historial de descargas recientes en el computador comun con un archivo llamado guia.pdf." },
          { event: "Consigue un numero de telefono falso y lo agrega a su telefono para compartir la guia.", clueHint: "Mensaje anonimo masivo a varios alumnos con archivo guia adjunta." },
          { event: "Distribuye el archivo por mensajeria como 'material de estudio' de manera anonima.", clueHint: "Metadatos del PDF guia sin autor, con creacion posterior al horario lectivo." },
          { event: "La estudiante Lopez recibe el archivo y reporta el mensaje a la docente.", clueHint: "Original Lista de materiales para examen fotocopiada en la misma multifuncional." }
        ],
        consequence: 'assets/case5/conclusion/1.png'
      }
    ],
    debriefQuestions: [
      "Que fue lo mas dificil de determinar: el punto de acceso o la forma de distribucion? Cita las dos pistas que mas cambiaron tu hipótesis.",
      "Senala un testimonio que te genero sospecha y una pista concreta que lo refuerce o lo contradiga.",
      "Elige la combinacion minima de evidencias que conecta acceso desde equipo comun con la distribucion anonima (nombralas).",
      "Que pista consideraste ruido al inicio y por que no sostiene la cadena causal?",
      "Si pudieras solicitar una unica verificacion tecnica adicional, cual elegirias y que esperas confirmar?"
    ]
  },

  {
    id: 6,
    difficulty: 'Avanzado',
    title: 'Sabotaje en la final deportiva',
    description: 'La final del partido se juega a gimnasio lleno tras una lluvia que dejo barro en los accesos laterales. El piso de la cancha y gimnasio esta mayormente seco. El marcador electronico se ubica junto a la mesa de anotaciones y detras del banco de descanso. La custodia de las llaves del recinto cae en el representante del evento. El conserje entra y sale constantemente de la bodega ubicada cerca de las entradas laterales para intentar mantener el piso seco. Surgen tensiones por los minutos extras agregados: aparecen correcciones de los equipos de ultima hora. En ese contexto, el marcador se apaga en un punto critico del partido.',
    objectives: ['Estudiar comportamientos', 'Relacionar evidencia con motivos', 'Establecer orden de acciones'],
    characters: [
      {
        name: 'Entrenador del equipo A', image: 'assets/case6/characters/1.png',
        personality: 'Severo con el rendimiento; cree en la disciplina tecnica y en controles previos.',
        testimony: 'Revise el tablero y el cableado antes del partido. El equipo estaba bien y fijamos cables con bridas para evitar tirones. Durante el juego me concentre en las rotaciones y en los tiempos.',
        truth: true,
        suspicionLevel: 'medium'
      },
      {
        name: 'Capitan del equipo A', image: 'assets/case6/characters/3.png',
        personality: 'Titular concentrado; evita drama y discusiones.',
        testimony: 'En el descanso yo estaba en la otra mitad, lejos de la mesa y el cableado del marcador. Cuando se corto, yo estaba en cancha mirando la jugada, no cerca de la mesa.',
        truth: true,
        suspicionLevel: 'low'
      },
      {
        name: 'Capitan del equipo B', image: 'assets/case6/characters/2.png',
        personality: 'Ansioso por minutos; resentido por el cambio del tiempo; se mueve con nerviosismo.',
        testimony: 'Estaba en la banca mirando el partido. No me movi de ahi cuando se apago. La mesa estaba llena; si algo paso, no fui yo.',
        truth: false,
        suspicionLevel: 'low'
      },
      {
        name: 'Representante', image: 'assets/case6/characters/4.png',
        personality: 'Encargado de la logistica y cuidado de llaves; cuida la imagen del evento, pero prioriza resolver rapido las situaciones tensas.',
        testimony: 'Fui a entregar credenciales y deje un momento las llaves sobre la mesa de agua, dentro de la zona tecnica. Volvi en seguida; las vi donde mismo. No toque el cableado del marcador.',
        truth: false,
        suspicionLevel: 'high'
      },
      {
        name: 'Conserje', image: 'assets/case6/characters/5.png',
        personality: 'Conoce los patrones de uso del gimnasio y donde se suele danar por lo que esta encargado de reparar los rastros de uso del suelo y mobiliario del gimnasio.',
        testimony: 'Segundos antes del fallo escuche pasos rapidos y un roce de la mesa contra el piso, justo donde esta el marcador. Note barro fresco cerca del cableado. Despues vi que la mesa habia quedado corrida unos centimetros.',
        truth: true,
        suspicionLevel: 'low'
      }
    ],
    clues: {
      phase1: [
        { text: "Instrucciones de modificaciones del tiempo escritas a mano que reducen minutos del tiempo extra.", relevant: true, misleading: true, pointsTo: "Representante" },
        { text: "Llave de la bodega encontrada en el suelo cerca del tablero.", relevant: true, misleading: true, pointsTo: "Conserje" },
        { text: "Barro extendido en accesos laterales del gimnasio; pisadas multiples en varias direcciones, aunque una llega a la bodega.", relevant: false, misleading: true, pointsTo: "Conserje" },
        { text: "Extension electrica de respaldo enrollada y sin uso detras del banco.", relevant: false, misleading: false },
        { text: "Botella de agua volcada junto a la mesa (sin contacto con el cable cortado).", relevant: false, misleading: false }
      ],
      phase2: [
        { text: "Puerta de la bodega con marcas de barro en el canto interior; el suelo inmediato esta seco.", relevant: true, misleading: false, contradicts: "Conserje" },
        { text: "Mensaje anonimo en papel: 'vamos a perder' hallado en la basura.", relevant: true, misleading: false },
        { text: "Cable de alimentacion del marcador con corte limpio en angulo; hilos de cobre alineados lo que evidencia un corte con herramienta.", relevant: true, misleading: false, contradicts: "Representante" },
        { text: "Cinta de embalaje encontrada con fibras textiles adheridas.", relevant: false, misleading: false },
        { text: "Mesa de anotaciones desplazada ~5 cm respecto a marcas de cinta en el piso.", relevant: true, misleading: false }
      ],
      phase3: [
        { text: "Herramienta multiuso con hoja pequena extendida bajo la mesa de anotaciones; restos minimos de vinilo del cable.", relevant: true, misleading: false },
        { text: "Brida de sujecion del cable cortada limpiamente, sin marcas de traccion.", relevant: true, misleading: false },
        { text: "Huella de zapato con barro junto al punto de corte del cable; borde definido con direccion hacia la banca.", relevant: true, misleading: false },
        { text: "Registro de camaras muestra al capitan del equipo B levantandose de la banca y acercandose a la zona tecnica momentos antes del fallo.", relevant: true, misleading: false }
      ]
    },
    partition: {
      A: { characters: [0, 1, 4], clues: [0, 2, 4, 9] },
      B: { characters: [2, 3], clues: [1, 3, 5, 7, 8, 11, 6, 10, 12] }
    },
    variants: [
      {
        culprit: 'Capitan del equipo B',
        motive: 'Forzar una pausa tecnica para alterar el partido y ganar minutos o la suspension de este.',
        method: 'Aprovecha una custodia laxa de llaves cuando la representante se ausenta y la mesa queda sin vigilancia directa, sin que nadie se percate va a la bodega y toma una herramienta multiuso. Se acerca a la zona tecnica, corre levemente la mesa, corta con el multiuso la brida y luego el cable de alimentacion del marcador, y se retira con prisa. Deja el multiuso bajo la mesa y pisa barro junto al punto de corte.',
        chronology: [
          { event: "Reducen minutos del tiempo extra del partido y el equipo B empieza a sentir que van a perder irremediablemente.", clueHint: "Instrucciones de modificaciones del tiempo escritas a mano que reducen minutos del tiempo extra." },
          { event: "El representante deja llaves en la mesa de agua mientras entrega credenciales y atiende a unas autoridades.", clueHint: "Llave de la bodega encontrada en el suelo cerca del tablero." },
          { event: "Aprovechando la oportunidad, el capitan del equipo B se dirige a la bodega y toma una herramienta multiuso.", clueHint: "Puerta de la bodega con marcas de barro en el canto interior; el suelo inmediato esta seco." },
          { event: "El capitan corre la mesa, corta la brida y luego el cable con el multiuso; el marcador se apaga.", clueHint: "Brida de sujecion del cable cortada limpiamente, sin marcas de traccion." },
          { event: "Huella de barro definida junto al punto de corte y una pisada apresurada en direccion a la banca del equipo B.", clueHint: "Huella de zapato con barro junto al punto de corte del cable; borde definido con direccion hacia la banca." },
          { event: "Se encuentra la herramienta multiuso bajo la mesa; la llave de la bodega en el suelo unos metros mas alla.", clueHint: "Herramienta multiuso con hoja pequena extendida bajo la mesa de anotaciones; restos minimos de vinilo del cable." }
        ],
        consequence: 'assets/case6/conclusion/1.png'
      }
    ],
    debriefQuestions: [
      "Senala un testimonio que te levanto sospechas y una evidencia que lo refuerce o lo contradiga (nombralas).",
      "Diferencia 'barro ambiental' del 'barro relevante' del caso: que rasgo te permitio no culpar por simple presencia de barro?",
      "Si pudieras realizar una verificacion adicional, cual elegirias y que esperas confirmar?"
    ]
  },

  {
    id: 7,
    difficulty: 'Alto',
    title: 'Desaparicion del proyecto de arte',
    description: "Horas antes de la exposicion, el taller funciona a medio ritmo: el profesor sale a buscar materiales; la estudiante Alfaro seca piezas en otro meson; el conserje mueve cajas por los pasillos hacia el area de escenario; el fotografo edita con audifonos y apenas levanta la vista. Una escultura de papel mache desaparece sin registro claro. Quedan restos de arcilla en la mesa de trabajo, una foto borrosa de alguien cargando una caja y, mas tarde, huellas de pintura verde en el piso.",
    objectives: [
      "Reconstruir movimientos en el taller a partir de indicios",
      "Evaluar la rivalidad y su relacion con la evidencia material",
      "Separar ruido de señales con valor causal",
      "Estimar una secuencia lógica sin horas explicitas"
    ],
    characters: [
      {
        name: 'Profesor de arte', image: 'assets/case7/characters/Profesor.png',
        personality: 'Creativo, algo disperso; valora vitrinas externas y el impacto visual de la muestra artistica.',
        testimony: 'Fui por materiales a la bodega. Al volver, la escultura ya no estaba. En la mesa quedaban restos de arcilla humeda y algunas herramientas fuera de su sitio. No recuerdo haber dejado cajas abiertas.',
        truth: true,
        suspicionLevel: 'low'
      },
      {
        name: 'Estudiante Alfaro', image: 'assets/case7/characters/Alfaro.png',
        personality: 'Dedicada y protectora de su obra; ordenada con tiempos de secado de las pinturas.',
        testimony: 'Secaba piezas en otro meson, lejos de la entrada. No movi la escultura desaparecida. Escuche a lo lejos el arrastre de una caja, como de carton pesado, y luego silencio.',
        truth: true,
        suspicionLevel: 'low'
      },
      {
        name: 'Estudiante Salinas', image: 'assets/case7/characters/Salinas.png',
        personality: 'Busca reconocimiento rapido; suele "negociar" montajes para quedar mejor posicionado en las exposiciones, lejos de obras que puedan opacar la suya.',
        testimony: 'Solo mire el avance. Nada que ver conmigo. Estaba viendo el mejor lugar para mi montaje y ayudando a despejar el area de fotos. No toque cajas ni piezas.',
        truth: false,
        suspicionLevel: 'low'
      },
      {
        name: 'Conserje del arte', image: 'assets/case7/characters/arte.png',
        personality: 'Orden maniatico; reubica cajas por pasillos.',
        testimony: 'Vi a alguien con una caja grande yendo hacia el fondo del escenario, por la ruta posterior. No distingui la cara porque iba medio cubierto. Despues vi una caja abierta en esa zona.',
        truth: true,
        suspicionLevel: 'medium'
      },
      {
        name: 'Fotografo', image: 'assets/case7/characters/foto.png',
        personality: 'Documenta todo con rigor; cuando se concentra con audifonos, baja la atención que presta al entorno.',
        testimony: 'Dije que no vi casi nada, pero sí tomé una foto borrosa de alguien con una caja. Afirmé que no se distinguía el rostro, aunque alcancé a notar parte del uniforme.',
        truth: false,
        suspicionLevel: 'high'
      }
    ],
    clues: {
      phase1: [
        { text: "Nota con amenaza: 'Tu obra es un plagio' colocada sobre el sector de exhibicion.", relevant: true, misleading: true, pointsTo: "Estudiante Alfaro" },
        { text: "Pincel roto en el basurero, sin pigmento fresco adherido.", relevant: false, misleading: false },
        { text: "Tela de envoltorio con fibras textiles que no pertenecen al taller (probablemente traida de fuera).", relevant: false, misleading: true, pointsTo: "Conserje del arte" },
        { text: "Pote de pintura verde sin tapa en un estante entre la ubicacion de la obra robada y la ubicacion del estudiante Salinas.", relevant: true, misleading: true, pointsTo: "Fotografo" },
        { text: "Huella de pintura verde en el piso con direccion hacia el fondo del escenario; con un patron parcial de suela.", relevant: true, misleading: true, pointsTo: "Conserje del arte" }
      ],
      phase2: [
        { text: "Fotografia borrosa de una silueta cargando una caja rectangular; angulo desde reflejo (sin rasgos faciales).", relevant: true, misleading: false, contradicts: "Conserje del arte" },
        { text: "Caja de materiales abierta detras del escenario, en la ruta posterior.", relevant: true, misleading: false },
        { text: "Restos de arcilla humeda en la mesa de trabajo donde estaba la escultura (consistencia reciente).", relevant: true, misleading: false, contradicts: "Estudiante Alfaro" },
        { text: "Micro-rayas lineales sobre el barniz de la mesa desde la base de la escultura hasta el borde (arrastre suave).", relevant: true, misleading: false },
        { text: "Fragmento de cinta con fibras de papel mache adheridas (de la superficie de la escultura).", relevant: true, misleading: false }
      ],
      phase3: [
        { text: "Cinta de embalar con tres marcas de dedos visibles impregnadas de pintura verde.", relevant: true, misleading: false },
        { text: "Salpicaduras puntuales de pintura verde en el borde interno de la caja abierta.", relevant: true, misleading: false },
        { text: "Pegote de arcilla seca en la tapa de la caja abierta (coincide con material de la obra robada).", relevant: true, misleading: false },
        { text: "Marcas de arrastre en el piso que conectan la mesa de trabajo con la ruta posterior del escenario.", relevant: true, misleading: false }
      ]
    },
    partition: {
      A: { characters: [0, 2, 4], clues: [0, 2, 4, 11] },
      B: { characters: [1, 3], clues: [1, 3, 5, 6, 7, 8, 9, 10, 12] }
    },
    variants: [
      {
        culprit: 'Estudiante Salinas',
        motive: 'Sabotear una obra mejor valorada para reducir competencia y captar atención.',
        method: 'Aprovecha el taller parcialmente desatendido; envuelve la escultura con cinta (queda marca de dedos con pintura verde), la coloca en una caja y la traslada por la ruta posterior del escenario. La nota agresiva remarca rivalidad y distrae la pesquisa.',
        chronology: [
          { event: "Profesor sale a bodega; fotografo editando con audifonos; Alfaro secando piezas; conserje mueve cajas hacia escenario.", clueHint: "Restos de arcilla humeda en la mesa de trabajo donde estaba la escultura (consistencia reciente)." },
          { event: "Estudiante se acerca al meson sin percatarse de la pintura verde en el suelo y desplaza suavemente la escultura desde el centro de la mesa hacia una esquina (micro-rayas en el barniz).", clueHint: "Micro-rayas lineales sobre el barniz de la mesa desde la base de la escultura hasta el borde (arrastre suave)." },
          { event: "Aplica cinta de embalar y quedan marcas verdes en la cinta; fragmento de cinta recoge fibras de papel mache.", clueHint: "Cinta de embalar con tres marcas de dedos visibles impregnadas de pintura verde." },
          { event: "Coloca la obra en una caja; en el borde interno aparecen salpicaduras verdes.", clueHint: "Salpicaduras puntuales de pintura verde en el borde interno de la caja abierta." },
          { event: "Deja la nota 'Tu obra es un plagio' para encuadrar el motivo en rivalidad y no ser culpado.", clueHint: "Nota con amenaza: Tu obra es un plagio colocada sobre el sector de exhibicion." },
          { event: "Avanza hacia el fondo del escenario; queda una huella de pintura verde con direccion consistente.", clueHint: "Huella de pintura verde en el piso con direccion hacia el fondo del escenario." },
          { event: "Al regreso del profesor, la escultura ya no esta; se observa la caja abierta en la ruta posterior y los residuos descritos.", clueHint: "Pegote de arcilla seca en la tapa de la caja abierta (coincide con material de la obra robada)." }
        ],
        consequence: 'assets/case7/conclusion/final.png'
      }
    ],
    debriefQuestions: [
      "Elige un testimonio que te levanto sospechas y relacionalo con una evidencia concreta que lo refuerce o lo contradiga.",
      "Como usaste la foto borrosa sin sobreinterpretarla? Conectala con una pista de ruta.",
      "Resume en tres pasos la cadena minima que explica la desaparicion usando solo pistas del caso.",
      "Si pudieras realizar una verificacion adicional, cual elegirias y que esperas confirmar?"
    ]
  },

  {
    id: 8,
    difficulty: 'Experto',
    title: 'Sabotaje del microfono en el debate',
    description: "Minutos antes de abrir el debate, el podio queda accesible entre pruebas y ajustes. El microfono principal del evento comparte el cableado con los microfonos auxiliares y esta asegurado con bridas plasticas. La mesa tecnica y el profesor moderador alternan su atención entre tiempos y protocolo; equipos rivales deambulan cerca del escenario con agendas de intervencion. Circula una queja previa por volumen (mucho ruido). Antes de iniciar el debate comienza a circular entre los equipos una lista de participantes peligrosos, que sugiere preocupacion por el nivel destacado de algunos de ellos. Cuando va a iniciar el primer debate se produce un fallo en el microfono principal: la conexion aparece suelta y una brida esta cortada a medias.",
    objectives: [
      "Examinar motivos de rivalidad y oportunidad",
      "Relacionar testimonios con evidencias tecnicas del sistema de audio",
      "Organizar una cronología lógica del sabotaje"
    ],
    characters: [
      {
        name: 'Tecnico de sonido', image: 'assets/case8/characters/1.png',
        personality: 'Dice tener gran dominio tecnico de los equipos; se frustra con facilidad cuando no siguen su criterio.',
        testimony: 'Probe todo y funcionaba perfecto. Si algo fallo, fue por como movieron el podio, sabia que ellos lo iban a arruinar, en los ensayos paso lo mismo. Yo hice los ultimos chequeos y me retire a la mesa tecnica.',
        truth: false,
        suspicionLevel: 'low'
      },
      {
        name: 'Capitan de debate equipo A', image: 'assets/case8/characters/2.png',
        personality: 'Altamente competitivo y metodico; suele respetar el orden de intervencion en los debates, muestra una mente calculadora.',
        testimony: 'Nos mantuvimos alejados del podio hasta el inicio. Teniamos claro quien abria y no tocamos nada de los equipos de sonido.',
        truth: true,
        suspicionLevel: 'high'
      },
      {
        name: 'Capitan de debate equipo B', image: 'assets/case8/characters/3.png',
        personality: 'Oportunista; aprende a conocer a su enemigo para atacarlo donde mas debil lo ve. No le presta atención a los detalles tecnicos.',
        testimony: 'No se ni donde van los cables. Me sente atras a revisar mis notas. No me acerque al podio.',
        truth: false,
        suspicionLevel: 'high'
      },
      {
        name: 'Profesor moderador', image: 'assets/case8/characters/4.png',
        personality: 'Una persona con un control estricto de tiempos y protocolos.',
        testimony: 'Estaba calibrando el cronometro y ordenando los ultimos detalles antes de comenzar. Confie en que el equipo tecnico estaba cerrado y no atendi mas el podio.',
        truth: true,
        suspicionLevel: 'low'
      },
      {
        name: 'Conserje', image: 'assets/case8/characters/5.png',
        personality: 'Orden de sillas y accesos; presta atención a los detalles de montaje.',
        testimony: 'Vi a alguien agachado junto al podio minutos antes de empezar. Escuche un clic metalico y luego se levanto rapido. No alcance a ver quien era.',
        truth: true,
        suspicionLevel: 'medium'
      }
    ],
    clues: {
      phase1: [
        { text: "Lista de participantes con marcas de destacador y participantes destacados, hallada cerca del podio.", relevant: true, misleading: true, pointsTo: "Capitan de debate equipo A" },
        { text: "Nota anonima animando al equipo rival.", relevant: false, misleading: true, pointsTo: "Capitan de debate equipo B" },
        { text: "Agenda impresa con horarios del debate y orden del dia.", relevant: false, misleading: false },
        { text: "Correo previo de queja por 'volumen alto' y poco profesionalismo del tecnico de sonido en pruebas.", relevant: true, misleading: true, pointsTo: "Capitan de debate equipo B" },
        { text: "Camiseta con la palabra STAFF estampada sobre la mesa tecnica sin signos de intervencion o uso.", relevant: false, misleading: false }
      ],
      phase2: [
        { text: "Conector del microfono principal levemente desacoplado; el seguro de los cables estaba sin trabar y anillo que los une con leve rayon reciente.", relevant: true, misleading: false, contradicts: "Capitan de debate equipo A" },
        { text: "Destornillador pequeno de punta plana detras del podio, cerca de la mesa de sonido; marcas de grasa recientes.", relevant: true, misleading: false, contradicts: "Capitan de debate equipo B" },
        { text: "Residuo de cinta adhesiva hallada en la base del podio.", relevant: false, misleading: false },
        { text: "Clip de sujecion del cable al conector del microfono girado y suelto, sin evidencia de que se haya cerrado antes de iniciar el debate.", relevant: true, misleading: false },
        { text: "Huella de grasa (pulgar) en la zona de acople de los microfonos muy cerca de los conectores principales.", relevant: true, misleading: false }
      ],
      phase3: [
        { text: "Brida plastica que mantenia unidos los cables cortada hasta la mitad, el resto de la brida parece roto por un tiron de tension; los restos del corte aun estan en el suelo.", relevant: true, misleading: false },
        { text: "Analisis posterior muestra que el microfono se solto producto de la vibracion del suelo al iniciar el debate.", relevant: true, misleading: false },
        { text: "Registro de camaras muestra al tecnico de sonido agachado junto al podio realizando los ultimos ajustes, coincidiendo con el clic metalico reportado por el conserje.", relevant: true, misleading: false },
        { text: "El destornillador hallado pertenece al kit personal del tecnico de sonido, segun inventario de la mesa tecnica.", relevant: true, misleading: false }
      ]
    },
    partition: {
      A: { characters: [0, 2, 4], clues: [0, 2, 4, 9] },
      B: { characters: [1, 3], clues: [5, 7, 11, 1, 3, 6, 8, 10] }
    },
    variants: [
      {
        culprit: 'Tecnico de sonido',
        motive: 'Demostrar que su criterio y "setup" eran superiores, y que las criticas que le hicieron llegar eran infundadas.',
        method: 'Prepara un fallo latente: afloja la conexion del microfono y corta a medias una brida del auxiliar para que la vibracion inicial y el alzamiento del microfono provoquen la desconexion. Deja un destornillador tras el podio y se mueve con coartada de "ultimos chequeos".',
        chronology: [
          { event: "Hace circular una 'lista con participantes peligrosos' que resalta la competitividad entre los equipos; el tecnico discute ajustes y mantiene resentimiento profesional con los otros miembros de staff.", clueHint: "Lista de participantes con marcas de destacador y participantes destacados, hallada cerca del podio." },
          { event: "Se agacha cerca del podio (clic metalico oido por el conserje), afloja el conector y lo deja sin trabar; corta con el destornillador a medias una brida que mantiene los cables unidos.", clueHint: "Brida plastica que mantenia unidos los cables cortada hasta la mitad, el resto de la brida parece roto por un tiron de tension." },
          { event: "Se aleja hacia la mesa tecnica alegando cierre de pruebas; el moderador se centra en tiempos.", clueHint: "Correo previo de queja por volumen alto y poco profesionalismo del tecnico de sonido en pruebas." },
          { event: "Al iniciar el primer turno y acomodar el podio, la tension de los tirones de los cables provoca la desconexion visible del microfono.", clueHint: "Analisis posterior muestra que el microfono se solto producto de la vibracion del suelo al iniciar el debate." },
          { event: "Se encuentra el destornillador, la huella de grasa en el lugar, la brida semi-cortada y el conector sin trabar.", clueHint: "Destornillador pequeno de punta plana detras del podio, cerca de la mesa de sonido; marcas de grasa recientes." },
          { event: "La combinacion de aflojado + brida a medias explica el fallo puntual y vincula la accion a alguien con conocimiento tecnico.", clueHint: "Huella de grasa (pulgar) en la zona de acople de los microfonos muy cerca de los conectores principales." }
        ],
        consequence: 'assets/case8/conclusion/1.png'
      }
    ],
    debriefQuestions: [
      "Que fue lo mas dificil de determinar? Cita dos pistas tecnicas que cambiaron tu hipótesis.",
      "Relaciona un testimonio con una evidencia tecnica que lo refuerce o contradiga.",
      "Explica como la 'lista de participantes peligrosos' influyo tu analisis y con que pista material la conectaste.",
      "Resume en tres pasos la cadena minima que explica el fallo del microfono usando solo pistas del caso.",
      "Si pudieras realizar una verificacion adicional, cual elegirias y que esperas confirmar?"
    ]
  },

  {
    id: 9,
    difficulty: 'Avanzado',
    title: 'Hackeo del portal de calificaciones',
    description: "Noche de cierre de notas. El laboratorio queda semivacio y el portal academico opera con accesos administrativos limitados. El Jefe de TI deja informes y auditorias listas para que las revise el encargado del siguiente turno. Antes del cierre final la jefa de UTP se percata que un grupo de alumnos que destacan por tener bajo rendimiento aparecen con notas sobresalientes y poco usuales. Investigando descubre que la profesora de ciencias confia en su entorno cercano y suele escribir sus claves de trabajo en una libreta física, ademas se entera que hace dias circulan correos anónimos que reclaman injusticias en las notas y, mas tarde ese dia, aparece una nota de chantaje 'Si revierten los cambios borrare todo el sistema'. En un puesto del laboratorio se encuentra un pendrive, rastros de uso reciente y una huella de sudor en el teclado.",
    objectives: ['Analizar accesos y registros', 'Identificar habilidades tecnológicas', 'Ordenar la cronología del hackeo'],
    characters: [
      {
        name: 'Jefe de enlaces', image: 'assets/case9/characters/3.png',
        personality: 'Meticuloso en su trabajo; obsesivo con los registros y respaldos.',
        testimony: 'Deje el portal estable y respaldado. Verifique autenticacion y horarios de auditoria; hay un login fuera de patron en franja de baja afluencia desde un equipo del laboratorio.',
        truth: true,
        suspicionLevel: 'low'
      },
      {
        name: 'Estudiante Soto', image: 'assets/case9/characters/4.png',
        personality: 'Habil y curioso por la tecnologia; le atraen los retos y probar limites, le da pereza estudiar, dice que es demasiado facil.',
        testimony: 'Solo practico en entornos de prueba. No necesito entrar al sistema real; ademas, hoy ni estuve en el laboratorio.',
        truth: true,
        suspicionLevel: 'high'
      },
      {
        name: 'Estudiante en practica', image: 'assets/case9/characters/5.png',
        personality: 'Tiene una excelente disposicion, ingenuo con la seguridad.',
        testimony: 'Vi una pantalla con lineas de comandos y barras de progreso en un equipo. Me asuste y cerre la puerta sin tocar nada. Habia un USB plateado sobre el meson.',
        truth: true,
        suspicionLevel: 'low'
      },
      {
        name: 'Profesora de ciencias', image: 'assets/case9/characters/1.png',
        personality: 'Confia en su entorno cercano; anota todos sus recordatorios en libretas físicas.',
        testimony: 'Revise mis clases y me retire; quiza deje algun material abierto. No uso gestores de contrasenas, a veces anoto recordatorios pero nunca los olvido en ninguna parte.',
        truth: false,
        suspicionLevel: 'medium'
      },
      {
        name: 'Conserje Faundez', image: 'assets/case9/characters/2.png',
        personality: 'Hace rondas constantes; repara luces y sonidos inusuales de puertas o dispositivos.',
        testimony: "Vi a alguien con sudadera frente a un computador cerca de medianoche. Cuando volvi, la sala estaba en silencio y olia a equipo recalentado.",
        truth: false,
        suspicionLevel: 'low'
      }
    ],
    clues: {
      phase1: [
        { text: "Correo anonimo reclamando calificaciones 'injustas' enviado a varios estudiantes y profesores.", relevant: true, misleading: true, pointsTo: "Estudiante Soto" },
        { text: "Manual del sistema de registro de notas abierto en la mesa junto a marcadores extraido de la sala de profesores.", relevant: false, misleading: true, pointsTo: "Jefe de enlaces" },
        { text: "Cafe derramado seco en otro puesto.", relevant: false, misleading: false },
        { text: "Cable de red de repuesto suelto en una bandeja (no conectado).", relevant: false, misleading: false },
        { text: "Se encuentra una libreta con lista de contrasenas; un borde rasgado coincide con un Post-it arrancado.", relevant: true, misleading: true, pointsTo: "Profesora de ciencias" }
      ],
      phase2: [
        { text: "Registro de acceso con login atipico desde un equipo del laboratorio en la noche, luego del cierre de la escuela.", relevant: true, misleading: false, contradicts: "Estudiante Soto" },
        { text: "Nota de chantaje: 'no reviertan los cambios', dejada en el laboratorio, junto a una amenaza de borrar todo el sistema si lo hacen.", relevant: true, misleading: false },
        { text: "Pendrive plateado junto a un equipo; contiene un programa para modificar las notas de manera automatica y pantallazos del portal de notas en una carpeta.", relevant: true, misleading: false, contradicts: "Estudiante Soto" },
        { text: "Se registra el ingreso de un USB en el computador con nombre 'USB_DISK' durante horas en los que solo habian docentes en la escuela.", relevant: true, misleading: false },
        { text: "Registros de ingreso al establecimiento no muestran a nadie ingresando con sudadera al recinto.", relevant: true, misleading: false, contradicts: "Conserje Faundez" }
      ],
      phase3: [
        { text: "Teclado con huella de sudor visible en el mismo puesto desde donde se realizo el ataque.", relevant: true, misleading: false },
        { text: "Dentro del pendrive se guardaron registros del ingreso reciente al portal.", relevant: true, misleading: false },
        { text: "El historial del computador muestra un video de YouTube titulado: 'Como usar el programa cambiador de notas y no ser descubierto'.", relevant: true, misleading: false },
        { text: "Lista de estudiantes con malas notas de varios cursos, se evidencia la marca con lapiz grafito de un asterisco sobre el nombre Patricio Faundez.", relevant: true, misleading: false },
        { text: "Al comparar la nota de amenaza encontrada posteriormente para que no reviertan los cambios se evidencia que la letra es muy similar a la que contiene la lista de alumnos que recibieron el cambio de notas.", relevant: true, misleading: false }
      ]
    },
    partition: {
      A: { characters: [0, 1, 4], clues: [0, 2, 4] },
      B: { characters: [2, 3], clues: [1, 3, 5, 6, 7, 8] }
    },
    variants: [
      {
        culprit: 'Conserje Faundez',
        motive: 'El hijo del conserje esta catalogado como estudiante problematico y este intentando mejorar el rendimiento academico de su hijo procede a ocupar programas e intenta cambiar las notas desde el portal privado de la escuela.',
        method: 'Obtiene credenciales a partir de una libreta física con Post-it de la profesora; ingresa en franja de baja afluencia desde un equipo del laboratorio, ejecuta programas desde un pendrive pero al no funcionar intenta hacerlo manualmente viendo un tutorial de youtube. Deja un mensaje de chantaje para evitar la reversion.',
        chronology: [
          { event: 'Circula un correo anonimo que denuncia calificaciones "injustas" entre estudiantes y profesores.', clueHint: 'Correo anonimo reclamando calificaciones injustas enviado a varios estudiantes y profesores.' },
          { event: 'La profesora de ciencias anota contrasenas en su libreta; un Post-it arrancado de ella queda en la papelera de la sala de profesores.', clueHint: 'Se encuentra una libreta con lista de contrasenas; un borde rasgado coincide con un Post-it arrancado.' },
          { event: 'Durante una franja de baja afluencia, alguien accede al equipo comun del laboratorio usando las credenciales obtenidas del Post-it.', clueHint: 'Registro de acceso con login atipico desde un equipo del laboratorio en la noche, luego del cierre de la escuela.' },
          { event: 'El atacante intenta usar un programa del pendrive para cambiar notas automaticamente, pero no logra hacerlo funcionar.', clueHint: 'Pendrive plateado junto a un equipo; contiene un programa para modificar las notas de manera automatica y pantallazos del portal de notas en una carpeta.' },
          { event: 'Recurre a un tutorial de YouTube y modifica manualmente las calificaciones, dejando huellas de sudor en el teclado y el USB sobre el meson.', clueHint: 'El historial del computador muestra un video de YouTube titulado: Como usar el programa cambiador de notas y no ser descubierto.' },
          { event: 'Deja una nota de chantaje amenazando con borrar todo el sistema si revierten los cambios.', clueHint: 'Al comparar la nota de amenaza se evidencia que la letra es muy similar a la que contiene la lista de alumnos que recibieron el cambio de notas.' }
        ],
        consequence: 'assets/case9/conclusion/1.png'
      }
    ],
    debriefQuestions: [
      "Que te costo mas de este caso?",
      "Que pistas cambiaron tu hipótesis inicial?",
      "Indica la combinacion minima de evidencias que conecta vulnerabilidad humana con ejecucion.",
      "Si pudieras pedir una verificacion adicional, cual elegirias y que esperas confirmar?"
    ]
  }

];

// Expone la lista de casos en el ambito global para otros scripts
if (typeof window !== 'undefined') {
  window.cases = cases;
}

// export { cases };

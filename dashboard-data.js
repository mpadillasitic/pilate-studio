/* Move Studio — Dashboard data
   Realistic mock state for student portal */

const NOW = new Date('2026-05-13T08:35:00');

window.MOVE_DATA = {
  user: {
    name: 'Valeria Morales',
    firstName: 'Valeria',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    member_since: 'Sep 2024',
    plan: 'Flow · 12 clases / mes',
    planTier: 'flow'
  },

  credits: {
    total: 12,
    used: 7,
    remaining: 5,
    cycle_end: '2026-05-31',
    rollover: 2,
    pending_makeup: 1
  },

  // Calendar — week view
  // Times are real, statuses reflect reality
  classes: [
    // TODAY (May 13 — Mon)
    { id:'c01', date:'2026-05-13', start:'07:30', end:'08:20', name:'Reformer Flow',     coach:'Andrea V.', room:'Estudio A', spots_total:8, spots_taken:8, level:'Todos los niveles', mine:true,  status:'completed' },
    { id:'c02', date:'2026-05-13', start:'09:00', end:'09:45', name:'Mat Fundamentos',   coach:'Mateo L.', room:'Estudio B', spots_total:12, spots_taken:9, level:'Principiante',     mine:false },
    { id:'c03', date:'2026-05-13', start:'10:30', end:'11:20', name:'Reformer Strength', coach:'Andrea V.', room:'Estudio A', spots_total:8,  spots_taken:6, level:'Intermedio',        mine:true,  isNext:true },
    { id:'c04', date:'2026-05-13', start:'18:00', end:'18:45', name:'MOTR Dynamic',      coach:'Sofía R.',  room:'Estudio C', spots_total:10, spots_taken:7, level:'Intermedio',        mine:false },
    { id:'c05', date:'2026-05-13', start:'19:30', end:'20:20', name:'Reformer Restore',  coach:'Mateo L.',  room:'Estudio A', spots_total:8,  spots_taken:3, level:'Todos los niveles', mine:false },

    // Tomorrow (May 14 — Tue)
    { id:'c06', date:'2026-05-14', start:'06:30', end:'07:15', name:'Reformer Express',  coach:'Sofía R.', room:'Estudio A', spots_total:8, spots_taken:4, level:'Intermedio', mine:false },
    { id:'c07', date:'2026-05-14', start:'08:00', end:'08:50', name:'Reformer Flow',     coach:'Andrea V.', room:'Estudio A', spots_total:8, spots_taken:5, level:'Todos los niveles', mine:true },
    { id:'c08', date:'2026-05-14', start:'10:00', end:'10:45', name:'Mat Core',          coach:'Mateo L.', room:'Estudio B', spots_total:12, spots_taken:6, level:'Intermedio', mine:false },
    { id:'c09', date:'2026-05-14', start:'17:30', end:'18:20', name:'MOTR Cardio',       coach:'Sofía R.', room:'Estudio C', spots_total:10, spots_taken:9, level:'Avanzado', mine:false },
    { id:'c10', date:'2026-05-14', start:'19:00', end:'19:50', name:'Reformer Strength', coach:'Andrea V.', room:'Estudio A', spots_total:8, spots_taken:7, level:'Intermedio', mine:false },

    // Wed May 15
    { id:'c11', date:'2026-05-15', start:'07:30', end:'08:20', name:'Reformer Flow',     coach:'Andrea V.', room:'Estudio A', spots_total:8, spots_taken:8, level:'Todos los niveles', mine:false },
    { id:'c12', date:'2026-05-15', start:'09:00', end:'09:45', name:'Mat Fundamentos',   coach:'Mateo L.', room:'Estudio B', spots_total:12, spots_taken:4, level:'Principiante', mine:false },
    { id:'c13', date:'2026-05-15', start:'18:00', end:'18:50', name:'Reformer Strength', coach:'Sofía R.', room:'Estudio A', spots_total:8, spots_taken:5, level:'Intermedio', mine:true },

    // Thu May 16
    { id:'c14', date:'2026-05-16', start:'08:00', end:'08:45', name:'MOTR Dynamic',      coach:'Sofía R.', room:'Estudio C', spots_total:10, spots_taken:4, level:'Intermedio', mine:false },
    { id:'c15', date:'2026-05-16', start:'10:30', end:'11:20', name:'Reformer Flow',     coach:'Andrea V.', room:'Estudio A', spots_total:8, spots_taken:6, level:'Todos los niveles', mine:false },
    { id:'c16', date:'2026-05-16', start:'19:00', end:'19:45', name:'Mat Restorative',   coach:'Mateo L.', room:'Estudio B', spots_total:12, spots_taken:3, level:'Todos los niveles', mine:false },

    // Fri May 17
    { id:'c17', date:'2026-05-17', start:'07:30', end:'08:15', name:'Reformer Express',  coach:'Andrea V.', room:'Estudio A', spots_total:8, spots_taken:6, level:'Intermedio', mine:false },
    { id:'c18', date:'2026-05-17', start:'09:00', end:'09:50', name:'Reformer Strength', coach:'Sofía R.', room:'Estudio A', spots_total:8, spots_taken:5, level:'Intermedio', mine:true },
    { id:'c19', date:'2026-05-17', start:'17:30', end:'18:20', name:'MOTR Cardio',       coach:'Sofía R.', room:'Estudio C', spots_total:10, spots_taken:8, level:'Avanzado', mine:false },

    // Sat May 18
    { id:'c20', date:'2026-05-18', start:'08:30', end:'09:20', name:'Reformer Weekend',  coach:'Andrea V.', room:'Estudio A', spots_total:8, spots_taken:5, level:'Todos los niveles', mine:false },
    { id:'c21', date:'2026-05-18', start:'10:00', end:'10:50', name:'Mat & Mobility',    coach:'Mateo L.', room:'Estudio B', spots_total:12, spots_taken:7, level:'Todos los niveles', mine:false },
    { id:'c22', date:'2026-05-18', start:'11:30', end:'12:20', name:'MOTR Flow',         coach:'Sofía R.', room:'Estudio C', spots_total:10, spots_taken:6, level:'Intermedio', mine:false },
  ],

  history: [
    { id:'h01', date:'2026-05-12', start:'18:00', name:'Reformer Strength', coach:'Andrea V.', status:'attended', note:'Trabajo en cadena posterior. Buena progresión en plancha lateral.' },
    { id:'h02', date:'2026-05-10', start:'10:30', name:'Reformer Flow', coach:'Andrea V.', status:'attended', note:'Sesión completa. Aumentar carga en footwork la próxima.' },
    { id:'h03', date:'2026-05-08', start:'07:30', name:'Reformer Flow', coach:'Mateo L.', status:'attended' },
    { id:'h04', date:'2026-05-06', start:'18:00', name:'MOTR Dynamic', coach:'Sofía R.', status:'license', note:'Licencia aprobada — cita médica.' },
    { id:'h05', date:'2026-05-05', start:'10:30', name:'Reformer Strength', coach:'Andrea V.', status:'attended' },
    { id:'h06', date:'2026-05-03', start:'08:30', name:'Mat & Mobility', coach:'Mateo L.', status:'attended', note:'Mejora notable en flexibilidad de cadera derecha.' },
    { id:'h07', date:'2026-05-01', start:'19:00', name:'Reformer Restore', coach:'Mateo L.', status:'attended' },
    { id:'h08', date:'2026-04-29', start:'18:00', name:'Reformer Strength', coach:'Andrea V.', status:'makeup_used', note:'Recuperación de la sesión del 25 abr.' },
    { id:'h09', date:'2026-04-27', start:'10:00', name:'Mat Core', coach:'Mateo L.', status:'attended' },
    { id:'h10', date:'2026-04-25', start:'09:00', name:'Reformer Flow', coach:'Andrea V.', status:'no_show' },
  ],

  makeups: [
    { id:'m01', earned_date:'2026-04-15', reason:'Licencia aprobada · clase 15 abr', status:'pending', expires:'2026-06-15' }
  ],

  notifications: [
    { id:'n01', when:'2026-05-13T07:55', icon:'bell', tag:'Recordatorio', title:'Tu clase Reformer Strength inicia en 30 min', body:'Estudio A · llega 10 min antes para preparar tu reformer.', read:false },
    { id:'n02', when:'2026-05-12T20:10', icon:'star', tag:'Evaluación', title:'Andrea V. agregó notas a tu sesión', body:'Buena progresión en plancha lateral. Trabajo de cadena posterior asignado para la próxima.', read:false },
    { id:'n03', when:'2026-05-12T12:00', icon:'gift', tag:'Recuperación', title:'Tu clase de recuperación está lista', body:'1 sesión disponible. Vence 15 jun. Reserva desde el calendario.', read:false },
    { id:'n04', when:'2026-05-11T09:30', icon:'doc', tag:'Evaluación', title:'Nueva evaluación funcional disponible', body:'Resultados del test de mayo · revisa tu progreso anual.', read:true },
    { id:'n05', when:'2026-05-08T15:20', icon:'card', tag:'Membresía', title:'Tu plan Flow se renueva el 31 may', body:'Sin cambios — 12 clases por $129. Cancela o cambia con 7 días de anticipación.', read:true },
  ],

  evaluations: [
    {
      id:'e03', date:'2026-05-05', title:'Evaluación funcional · Mayo', by:'Andrea V.',
      sections: [
        { label:'Movilidad cadera derecha', value:'62°', delta:'+8°', trend:'up' },
        { label:'Movilidad cadera izquierda', value:'58°', delta:'+5°', trend:'up' },
        { label:'Plancha frontal', value:'1m 45s', delta:'+22s', trend:'up' },
        { label:'Plancha lateral der.', value:'58s', delta:'+18s', trend:'up' },
        { label:'Báscula pélvica', value:'Neutral', delta:'Corregido', trend:'good' },
        { label:'Hombros (rot. externa)', value:'85°', delta:'+3°', trend:'up' },
      ],
      observations:'Excelente progreso. Reducción significativa de la anteversión pélvica. Recomendación: mantener trabajo de cadena posterior y agregar movilidad torácica 2x semana.',
      objectives:'Estabilizar plancha lateral 90s · Aumentar fuerza isquiotibial · Continuar trabajo de control escapular en Reformer.',
      level: 'intermedio'
    },
    {
      id:'e02', date:'2026-02-10', title:'Evaluación postural · Febrero', by:'Andrea V.',
      sections: [
        { label:'Movilidad cadera derecha', value:'54°', delta:'+4°', trend:'up' },
        { label:'Plancha frontal', value:'1m 23s', delta:'+15s', trend:'up' },
        { label:'Plancha lateral der.', value:'40s', delta:'+10s', trend:'up' },
        { label:'Báscula pélvica', value:'Ligera anteversión', delta:'En proceso', trend:'flat' },
      ],
      observations:'Anteversión pélvica leve. Trabajo asignado: fortalecimiento isquiotibial + glúteo medio.',
      level: 'intermedio'
    },
    {
      id:'e01', date:'2024-09-15', title:'Evaluación inicial', by:'Mateo L.',
      sections: [
        { label:'Movilidad cadera derecha', value:'50°' },
        { label:'Plancha frontal', value:'1m 08s' },
        { label:'Báscula pélvica', value:'Anteversión moderada' },
      ],
      observations:'Alumna nueva. Dolor lumbar ocasional reportado. Inicio en nivel principiante.',
      level: 'principiante'
    }
  ],

  upcoming: [
    { date:'2026-05-13', start:'10:30', name:'Reformer Strength', coach:'Andrea V.' },
    { date:'2026-05-14', start:'08:00', name:'Reformer Flow',     coach:'Andrea V.' },
    { date:'2026-05-15', start:'18:00', name:'Reformer Strength', coach:'Sofía R.' },
    { date:'2026-05-17', start:'09:00', name:'Reformer Strength', coach:'Sofía R.' },
  ]
};

// helpers
window.MOVE_HELPERS = {
  now: () => new Date('2026-05-13T08:35:00'),

  toMinutes: (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  },

  formatDate: (iso) => {
    const d = new Date(iso + 'T12:00:00');
    return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  },

  formatShort: (iso) => {
    const d = new Date(iso + 'T12:00:00');
    return d.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' });
  },

  /**
   * Returns minutes until class starts. Negative if class started already.
   * Used for 2-hour license rule.
   */
  minutesUntil: (dateISO, hhmm) => {
    const target = new Date(dateISO + 'T' + hhmm + ':00');
    const now = window.MOVE_HELPERS.now();
    return Math.round((target - now) / 60000);
  },

  /** License allowed if class starts > 120 minutes from now AND class is mine */
  canRequestLicense: (cls) => {
    if (!cls.mine || cls.status === 'completed') return false;
    return window.MOVE_HELPERS.minutesUntil(cls.date, cls.start) > 120;
  },
};

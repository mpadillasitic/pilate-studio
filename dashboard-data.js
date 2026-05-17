/* Lumina Pilates — Dashboard data
   Conectado a Supabase · reemplaza datos mock */

const SUPABASE_URL = 'https://yeaejlbahtkrrsttbprb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllYWVqbGJhaHRrcnJzdHRicHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5Nzk3NTIsImV4cCI6MjA5NDU1NTc1Mn0.gpzc8sNIifOtfbA02nITKF9od8B9thSXlOyKrlA3ic0';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Estado global reactivo ───────────────────────────────────
window.LUMINA_STATE = {
  loading: true,
  user: null,
  perfil: null,
  membresia: null,
  clases: [],
  reservas: [],
  historial: [],
  evaluaciones: [],
  notificaciones: [],
  licencias: [],
  error: null,
};

// ── Callbacks para re-render cuando cambian datos ────────────
window.LUMINA_LISTENERS = [];
window.LUMINA_NOTIFY = () => {
  window.LUMINA_LISTENERS.forEach(fn => fn(window.LUMINA_STATE));
};

// ── Cargar todos los datos del alumno logueado ───────────────
window.LUMINA_LOAD = async () => {
  try {
    // 1. Verificar sesión
    const { data: { session } } = await sb.auth.getSession();
    if (!session) {
      window.location.href = 'login.html';
      return;
    }

    window.LUMINA_STATE.user = session.user;

    // 2. Cargar perfil
    const { data: perfil } = await sb
      .from('perfiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    window.LUMINA_STATE.perfil = perfil;

    // 3. Cargar membresía activa
    const { data: membresias } = await sb
      .from('membresias')
      .select('*, planes(*)')
      .eq('alumno_id', session.user.id)
      .eq('estado', 'activa')
      .gte('fecha_fin', new Date().toISOString().split('T')[0])
      .order('fecha_inicio', { ascending: false })
      .limit(1);

    window.LUMINA_STATE.membresia = membresias?.[0] || null;

    // 4. Cargar clases de la semana actual + próxima
    const hoy = new Date();
    const en14dias = new Date(hoy);
    en14dias.setDate(hoy.getDate() + 14);

    const { data: clases } = await sb
      .from('clases')
      .select(`
        *,
        perfiles!clases_instructor_id_fkey(nombre, apellido)
      `)
      .gte('fecha', hoy.toISOString().split('T')[0])
      .lte('fecha', en14dias.toISOString().split('T')[0])
      .in('estado', ['programada', 'en_curso'])
      .order('fecha', { ascending: true })
      .order('hora_inicio', { ascending: true });

    // 5. Cargar reservas del alumno
    const { data: reservas } = await sb
      .from('reservas')
      .select('*')
      .eq('alumno_id', session.user.id)
      .in('estado', ['confirmada', 'licencia', 'recuperacion']);

    const reservasPorClase = {};
    (reservas || []).forEach(r => { reservasPorClase[r.clase_id] = r; });

    // Enriquecer clases con datos del alumno
    window.LUMINA_STATE.clases = (clases || []).map(c => {
      const reserva = reservasPorClase[c.id];
      const instructor = c.perfiles;
      return {
        id: c.id,
        date: c.fecha,
        start: c.hora_inicio?.slice(0, 5),
        end: c.hora_fin?.slice(0, 5),
        name: c.titulo,
        coach: instructor ? `${instructor.nombre} ${instructor.apellido}` : 'Instructora',
        room: c.tipo === 'reformer' ? 'Estudio A' : c.tipo === 'mat' ? 'Estudio B' : 'Estudio C',
        spots_total: c.capacidad_max,
        spots_taken: 0,
        level: c.tipo === 'terapeutico' ? 'Personalizado' : 'Todos los niveles',
        mine: !!reserva,
        status: reserva?.estado || 'disponible',
        reserva_id: reserva?.id || null,
        tipo: c.tipo,
        descripcion: c.descripcion,
      };
    });

    window.LUMINA_STATE.reservas = reservas || [];

    // 6. Historial de clases pasadas
    const { data: historial } = await sb
      .from('reservas')
      .select(`
        *,
        clases(titulo, fecha, hora_inicio, tipo,
          perfiles!clases_instructor_id_fkey(nombre, apellido))
      `)
      .eq('alumno_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    window.LUMINA_STATE.historial = (historial || [])
      .filter(r => r.clases)
      .map(r => ({
        id: r.id,
        date: r.clases.fecha,
        start: r.clases.hora_inicio?.slice(0, 5),
        name: r.clases.titulo,
        coach: r.clases.perfiles
          ? `${r.clases.perfiles.nombre} ${r.clases.perfiles.apellido}`
          : 'Instructora',
        status: mapearEstado(r.estado),
        note: null,
      }));

    // 7. Evaluaciones
    const { data: evaluaciones } = await sb
      .from('evaluaciones')
      .select(`
        *,
        perfiles!evaluaciones_evaluador_id_fkey(nombre, apellido)
      `)
      .eq('alumno_id', session.user.id)
      .order('fecha', { ascending: false });

    window.LUMINA_STATE.evaluaciones = (evaluaciones || []).map(e => ({
      id: e.id,
      date: e.fecha,
      title: e.titulo,
      by: e.perfiles ? `${e.perfiles.nombre} ${e.perfiles.apellido}` : 'Instructora',
      level: 'intermedio',
      sections: construirSecciones(e),
      observations: e.observaciones,
      objectives: e.objetivos,
    }));

    // 8. Notificaciones
    const { data: notifs } = await sb
      .from('notificaciones')
      .select('*')
      .eq('usuario_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    window.LUMINA_STATE.notificaciones = (notifs || []).map(n => ({
      id: n.id,
      when: n.created_at,
      icon: mapearIcono(n.tipo),
      tag: n.tipo,
      title: n.titulo,
      body: n.mensaje,
      read: n.leida,
    }));

    // 9. Construir MOVE_DATA compatible con los screens existentes
    construirMoveData();

    window.LUMINA_STATE.loading = false;
    window.LUMINA_NOTIFY();

  } catch (err) {
    console.error('Error cargando datos:', err);
    window.LUMINA_STATE.error = err.message;
    window.LUMINA_STATE.loading = false;
    construirMoveSinDatos();
    window.LUMINA_NOTIFY();
  }
};

// ── Construir MOVE_DATA compatible con screens existentes ────
function construirMoveData() {
  const s = window.LUMINA_STATE;
  const perfil = s.perfil;
  const membresia = s.membresia;

  // FIX: sin membresía = 0 créditos, nunca hardcodear 12
  const tieneMem = !!membresia;
  const creditosTotal  = tieneMem ? (membresia.creditos_total ?? null) : null;
  const creditosUsados = tieneMem ? (membresia.creditos_usados ?? 0) : 0;
  const creditosRestantes = !tieneMem
    ? 0
    : creditosTotal === null
      ? '∞'
      : creditosTotal - creditosUsados;

  // Próxima clase del alumno
  const ahora = new Date();
  const misClasesFuturas = s.clases
    .filter(c => c.mine && new Date(c.date + 'T' + c.start) > ahora)
    .sort((a, b) => new Date(a.date + 'T' + a.start) - new Date(b.date + 'T' + b.start));

  if (misClasesFuturas.length > 0) {
    misClasesFuturas[0].isNext = true;
  }

  window.MOVE_DATA = {
    user: {
      // FIX: nunca mostrar 'Alumna' hardcodeado, usar nombre real del perfil
      name: perfil
        ? `${perfil.nombre}${perfil.apellido ? ' ' + perfil.apellido : ''}`
        : 'Usuario',
      firstName: perfil?.nombre || 'Usuario',
      avatar: perfil?.foto_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(perfil?.nombre || 'U')}&background=5C7260&color=fff&size=200`,
      member_since: membresia
        ? new Date(membresia.fecha_inicio).toLocaleDateString('es-BO', { month: 'short', year: 'numeric' })
        : '—',
      plan: membresia?.planes?.nombre || 'Sin membresía',
      planTier: membresia?.planes?.tipo || 'ninguno',
    },

    credits: {
      // FIX: total 0 si no tiene membresía
      total: !tieneMem ? 0 : (creditosTotal === null ? '∞' : creditosTotal),
      used: creditosUsados,
      remaining: creditosRestantes,
      cycle_end: membresia?.fecha_fin || '',
      rollover: 0,
      pending_makeup: 0,
    },

    classes: s.clases,
    // FIX: nunca mostrar datos demo — arrays vacíos si no hay datos reales
    history: s.historial,
    makeups: [],
    notifications: s.notificaciones,
    evaluaciones: s.evaluaciones,
    evaluations: s.evaluaciones,
    upcoming: misClasesFuturas.slice(0, 4).map(c => ({
      date: c.date,
      start: c.start,
      name: c.name,
      coach: c.coach,
    })),
  };
}

// ── Fallback cuando Supabase falla completamente ─────────────
// FIX: sin datos inventados — todo en 0 y vacío
function construirMoveSinDatos() {
  window.MOVE_DATA = {
    user: {
      name: 'Usuario',
      firstName: 'Usuario',
      avatar: 'https://ui-avatars.com/api/?name=U&background=5C7260&color=fff&size=200',
      member_since: '—',
      plan: 'Sin membresía',
      planTier: 'ninguno',
    },
    credits: { total: 0, used: 0, remaining: 0, cycle_end: '', rollover: 0, pending_makeup: 0 },
    classes: [],
    history: [],
    makeups: [],
    notifications: [],
    evaluaciones: [],
    evaluations: [],
    upcoming: [],
  };
}

// ── Acciones reales ──────────────────────────────────────────

window.LUMINA_RESERVAR = async (claseId) => {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return { error: 'No autenticado' };

  const { data, error } = await sb
    .from('reservas')
    .insert({
      clase_id: claseId,
      alumno_id: session.user.id,
      estado: 'confirmada',
    })
    .select()
    .single();

  if (!error) await window.LUMINA_LOAD();
  return { data, error };
};

window.LUMINA_SOLICITAR_LICENCIA = async (reservaId, claseId, motivo) => {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return { error: 'No autenticado' };

  // Verificar plazo de 2 horas
  const clase = window.LUMINA_STATE.clases.find(c => c.id === claseId);
  if (clase) {
    const inicio = new Date(clase.date + 'T' + clase.start);
    const ahora = new Date();
    const diffMinutos = (inicio - ahora) / 60000;
    if (diffMinutos < 120) {
      return {
        error: `El plazo para solicitar licencia ya venció. Debías solicitarla antes de las ${formatearHoraLimite(inicio)}.`,
        fueraDePlazo: true,
      };
    }
  }

  const { data, error } = await sb
    .from('licencias')
    .insert({
      reserva_id: reservaId,
      alumno_id: session.user.id,
      clase_id: claseId,
      motivo: motivo || 'Sin motivo especificado',
      estado: 'pendiente',
    })
    .select()
    .single();

  if (!error) {
    await sb
      .from('reservas')
      .update({ estado: 'licencia' })
      .eq('id', reservaId);

    await window.LUMINA_LOAD();
  }
  return { data, error };
};

window.LUMINA_CERRAR_SESION = async () => {
  await sb.auth.signOut();
  window.location.href = 'login.html';
};

window.LUMINA_MARCAR_NOTIF_LEIDA = async (notifId) => {
  await sb.from('notificaciones').update({ leida: true }).eq('id', notifId);
};

// ── Helpers ──────────────────────────────────────────────────
function mapearEstado(estado) {
  const map = {
    confirmada: 'attended',
    cancelada: 'no_show',
    licencia: 'license',
    recuperacion: 'makeup_used',
    ausente: 'no_show',
  };
  return map[estado] || 'attended';
}

function mapearIcono(tipo) {
  const map = {
    info: 'bell',
    alerta: 'bell',
    creditos: 'card',
    licencia: 'doc',
    evaluacion: 'star',
  };
  return map[tipo] || 'bell';
}

function construirSecciones(eval_) {
  const secciones = [];
  if (eval_.peso_kg)     secciones.push({ label: 'Peso',        value: `${eval_.peso_kg} kg` });
  if (eval_.altura_cm)   secciones.push({ label: 'Altura',      value: `${eval_.altura_cm} cm` });
  if (eval_.imc)         secciones.push({ label: 'IMC',         value: eval_.imc });
  if (eval_.postura)     secciones.push({ label: 'Postura',     value: eval_.postura });
  if (eval_.movilidad)   secciones.push({ label: 'Movilidad',   value: eval_.movilidad });
  if (eval_.fuerza_core) secciones.push({ label: 'Fuerza core', value: eval_.fuerza_core });
  return secciones.length > 0 ? secciones : [{ label: 'Evaluación', value: 'Ver notas' }];
}

function formatearHoraLimite(fechaInicio) {
  const limite = new Date(fechaInicio - 2 * 60 * 60 * 1000);
  return limite.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });
}

// ── Helpers de fecha (compatibles con screens) ───────────────
window.MOVE_HELPERS = {
  now: () => new Date(),

  toMinutes: (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  },

  formatDate: (iso) => {
    const d = new Date(iso + 'T12:00:00');
    return d.toLocaleDateString('es-BO', { weekday: 'long', day: 'numeric', month: 'long' });
  },

  formatShort: (iso) => {
    const d = new Date(iso + 'T12:00:00');
    return d.toLocaleDateString('es-BO', { weekday: 'short', day: 'numeric' });
  },

  minutesUntil: (dateISO, hhmm) => {
    const target = new Date(dateISO + 'T' + hhmm + ':00');
    const now = new Date();
    return Math.round((target - now) / 60000);
  },

  canRequestLicense: (cls) => {
    if (!cls.mine || cls.status === 'completed') return false;
    return window.MOVE_HELPERS.minutesUntil(cls.date, cls.start) > 120;
  },
};

// ── Inicializar al cargar ────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  window.LUMINA_LOAD();
});

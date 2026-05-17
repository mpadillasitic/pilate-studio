/* Lumina Pilates — Dashboard app (root) */

const { useState, useEffect } = React;

const NAV_MAIN = [
  { id:'home',          label:'Inicio',           icon:'home' },
  { id:'calendar',      label:'Calendario',       icon:'calendar' },
  { id:'history',       label:'Historial',        icon:'history' },
  { id:'makeups',       label:'Recuperaciones',   icon:'gift' },
];
const NAV_SECONDARY = [
  { id:'membership',    label:'Mi membresía',     icon:'card' },
  { id:'evaluations',   label:'Evaluaciones',     icon:'star' },
  { id:'notifications', label:'Notificaciones',   icon:'bell' },
  { id:'chat',          label:'Asistente Alma',   icon:'sparkle' },
  { id:'profile',       label:'Perfil',           icon:'user' },
];

function App() {
  const [tab, setTab]       = useState('home');
  const [reserve, setReserve] = useState(null);
  const [license, setLicense] = useState(null);
  const [toast, setToast]   = useState(null);
  const [state, setState]   = useState(window.LUMINA_STATE);

  // Suscribirse a cambios de datos
  useEffect(() => {
    const listener = (newState) => {
      setState({ ...newState });
    };
    window.LUMINA_LISTENERS.push(listener);
    return () => {
      window.LUMINA_LISTENERS = window.LUMINA_LISTENERS.filter(fn => fn !== listener);
    };
  }, []);

  // Leer hash de URL
  useEffect(() => {
    const h = location.hash.replace('#', '');
    if (h && [...NAV_MAIN, ...NAV_SECONDARY].some(n => n.id === h)) setTab(h);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const go = (id) => {
    setTab(id);
    location.hash = id;
    document.querySelector('.body')?.scrollTo({ top: 0, behavior: 'instant' });
  };

  const openReserve = (cls) => setReserve(cls);
  const openLicense = (cls) => { setReserve(null); setLicense(cls); };

  const doReserve = async (cls) => {
    setReserve(null);
    const { error } = await window.LUMINA_RESERVAR(cls.id);
    if (error) {
      showToast(`Error: ${error.message || error}`);
    } else {
      showToast(`✓ Reservada · ${cls.name} · ${cls.start}`);
    }
  };

  const doLicense = async (cls, motivo) => {
    setLicense(null);
    const reservaId = cls.reserva_id;
    if (!reservaId) {
      showToast('No se encontró la reserva.');
      return;
    }
    const { error, fueraDePlazo } = await window.LUMINA_SOLICITAR_LICENCIA(reservaId, cls.id, motivo);
    if (error) {
      showToast(fueraDePlazo ? '⚠ ' + error : 'Error: ' + error);
    } else {
      showToast('✓ Licencia solicitada · pendiente de aprobación');
    }
  };

  // Datos para UI
  const _D = window.MOVE_DATA || {};
  const perfil = state.perfil;
  const membresia = state.membresia;
  const creditosRestantes = _D.credits?.remaining ?? '—';
  const notifNoLeidas = (_D.notifications || []).filter(n => !n.read).length;
  const recuperaciones = (_D.makeups || []).length;

  const navMainConBadge = NAV_MAIN.map(n => ({
    ...n,
    badge: n.id === 'makeups' ? recuperaciones || 0
         : n.id === 'notifications' ? notifNoLeidas
         : 0
  }));
  const navSecConBadge = NAV_SECONDARY.map(n => ({
    ...n,
    badge: n.id === 'notifications' ? notifNoLeidas : 0
  }));

  const renderScreen = () => {
    if (state.loading) return <LoadingScreen />;
    switch (tab) {
      case 'home':          return <HomeScreen go={go} openReserve={openReserve} openLicense={openLicense} />;
      case 'calendar':      return <CalendarScreen openReserve={openReserve} />;
      case 'history':       return <HistoryScreen />;
      case 'makeups':       return <MakeupScreen go={go} />;
      case 'membership':    return <MembershipScreen />;
      case 'evaluations':   return <EvalScreen />;
      case 'notifications': return <NotifScreen />;
      case 'chat':          return <ChatScreen />;
      case 'profile':       return <ProfileScreen onLogout={() => window.LUMINA_CERRAR_SESION()} />;
      default:              return <HomeScreen go={go} openReserve={openReserve} openLicense={openLicense} />;
    }
  };

  const hoy = new Date();
  const todayStr = hoy.toLocaleDateString('es-BO', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="shell">
      <aside className="side">
        <a className="brand" href="index.html">
          <div className="mark">L</div>
          <div>
            <div className="name">Lumina Pilates</div>
            <div className="sub">PORTAL ALUMNO</div>
          </div>
        </a>

        <div className="side-section">
          <div className="label">PRINCIPAL</div>
          {navMainConBadge.map(n => (
            <button key={n.id} className={`nav-btn ${tab === n.id ? 'active' : ''}`} onClick={() => go(n.id)}>
              <Icon name={n.icon} className="ico" />
              <span>{n.label}</span>
              {n.badge > 0 ? <span className="badge">{n.badge}</span> : null}
            </button>
          ))}
        </div>

        <div className="side-section">
          <div className="label">CUENTA</div>
          {navSecConBadge.map(n => (
            <button key={n.id} className={`nav-btn ${tab === n.id ? 'active' : ''}`} onClick={() => go(n.id)}>
              <Icon name={n.icon} className="ico" />
              <span>{n.id === 'chat' ? 'Asistente Alma' : n.label}</span>
              {n.badge > 0 ? <span className="badge">{n.badge}</span> : null}
            </button>
          ))}
        </div>

        <div className="side-bottom">
          <div className="side-user">
            {perfil ? (
              <img
                src={perfil.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(perfil.nombre)}&background=5C7260&color=fff&size=200`}
                alt=""
              />
            ) : (
              <div style={{width:32,height:32,borderRadius:'50%',background:'var(--sage-dark)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:14,fontFamily:'var(--font-serif)'}}>
                {_D.user?.firstName?.[0] || 'A'}
              </div>
            )}
            <div className="meta">
              <div className="name">{_D.user?.firstName || 'Alumna'}</div>
              <div className="plan">{membresia?.planes?.nombre?.toUpperCase() || 'SIN PLAN'}</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="greet">
            <div className="hi">{todayStr.charAt(0).toUpperCase() + todayStr.slice(1)}</div>
            <div className="when">
              {membresia?.planes?.nombre?.toUpperCase() || 'LUMINA PILATES'} ·{' '}
              {creditosRestantes === '∞' ? 'ILIMITADO' : `${creditosRestantes} CRÉDITOS`}
            </div>
          </div>
          <div className="spacer"></div>
          <div className="credits">
            <span className="n">{creditosRestantes}</span>
            <span>CRÉDITOS</span>
          </div>
          <button className="bell" onClick={() => go('notifications')}>
            <Icon name="bell" size={16} />
            {notifNoLeidas > 0 && <span className="pip"></span>}
          </button>
        </div>

        <div className="body">
          {renderScreen()}
        </div>
      </main>

      {reserve && (
        <ReserveModal
          cls={reserve}
          onClose={() => setReserve(null)}
          onReserve={doReserve}
          onCancel={() => setReserve(null)}
          onLicense={openLicense}
        />
      )}
      {license && (
        <LicenseModal
          cls={license}
          onClose={() => setLicense(null)}
          onConfirm={doLicense}
        />
      )}
      {toast && <div className="toast"><Icon name="check" size={14} /> {toast}</div>}
    </div>
  );
}

// ── Pantalla de carga ────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '60vh', gap: 20
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        border: '2px solid var(--line-2)',
        borderTopColor: 'var(--sage-dark)',
        animation: 'spin .8s linear infinite'
      }} />
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--ink-soft)' }}>
        Cargando tu portal...
      </div>
    </div>
  );
}

// ── Agregar keyframe de spin al head ─────────────────────────
const styleEl = document.createElement('style');
styleEl.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleEl);

ReactDOM.createRoot(document.getElementById('app')).render(<App />);

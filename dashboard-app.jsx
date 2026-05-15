/* Move Studio — Dashboard app (root) */

const { useState, useEffect } = React;
const _D = window.MOVE_DATA;

const NAV_MAIN = [
  { id:'home',          label:'Inicio',           icon:'home' },
  { id:'calendar',      label:'Calendario',       icon:'calendar' },
  { id:'history',       label:'Historial',        icon:'history' },
  { id:'makeups',       label:'Recuperaciones',   icon:'gift', badge: _D.makeups.length },
];
const NAV_SECONDARY = [
  { id:'membership',    label:'Mi membresía',     icon:'card' },
  { id:'evaluations',   label:'Evaluaciones',     icon:'star' },
  { id:'notifications', label:'Notificaciones',   icon:'bell', badge: _D.notifications.filter(n=>!n.read).length },
  { id:'chat',          label:'Asistente Maya',   icon:'sparkle' },
  { id:'profile',       label:'Perfil',           icon:'user' },
];

function App() {
  const [tab, setTab] = useState('home');
  const [reserve, setReserve] = useState(null);
  const [license, setLicense] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, showToast] = (() => {
    const [t, setT] = useState(null);
    const show = (msg) => { setT(msg); setTimeout(() => setT(null), 2800); };
    return [t, show];
  })();

  // Read from hash
  useEffect(() => {
    const h = location.hash.replace('#','');
    if (h && [...NAV_MAIN, ...NAV_SECONDARY].some(n => n.id === h)) setTab(h);
  }, []);

  const go = (id) => {
    setTab(id);
    location.hash = id;
    document.querySelector('.body')?.scrollTo({top:0, behavior:'instant'});
  };

  const openReserve = (cls) => setReserve(cls);
  const openLicense = (cls) => { setReserve(null); setLicense(cls); };

  const doReserve = (cls) => {
    setReserve(null);
    showToast(`Clase reservada · ${cls.name} · ${cls.start}`);
  };
  const doConfirmAttend = (cls) => {
    setReserve(null);
    showToast('Asistencia confirmada · te esperamos');
  };
  const doLicense = (cls, reason) => {
    showToast('Licencia registrada · crédito devuelto');
  };

  const renderScreen = () => {
    switch (tab) {
      case 'home':          return <HomeScreen go={go} openReserve={openReserve} openLicense={openLicense} />;
      case 'calendar':      return <CalendarScreen openReserve={openReserve} />;
      case 'history':       return <HistoryScreen />;
      case 'makeups':       return <MakeupScreen go={go} />;
      case 'membership':    return <MembershipScreen />;
      case 'evaluations':   return <EvalScreen />;
      case 'notifications': return <NotifScreen />;
      case 'chat':          return <ChatScreen />;
      case 'profile':       return <ProfileScreen />;
      default:              return <HomeScreen go={go} openReserve={openReserve} openLicense={openLicense} />;
    }
  };

  const today = new Date('2026-05-13T12:00');
  const todayStr = today.toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long'});

  return (
    <div className="shell">
      <aside className="side">
        <a className="brand" href="index.html">
          <div className="mark">M</div>
          <div>
            <div className="name">Move Studio</div>
            <div className="sub">PORTAL ALUMNO</div>
          </div>
        </a>

        <div className="side-section">
          <div className="label">PRINCIPAL</div>
          {NAV_MAIN.map(n => (
            <button key={n.id} className={`nav-btn ${tab===n.id?'active':''}`} onClick={() => go(n.id)}>
              <Icon name={n.icon} className="ico" />
              <span>{n.label}</span>
              {n.badge ? <span className="badge">{n.badge}</span> : null}
            </button>
          ))}
        </div>

        <div className="side-section">
          <div className="label">CUENTA</div>
          {NAV_SECONDARY.map(n => (
            <button key={n.id} className={`nav-btn ${tab===n.id?'active':''}`} onClick={() => go(n.id)}>
              <Icon name={n.icon} className="ico" />
              <span>{n.label}</span>
              {n.badge ? <span className="badge">{n.badge}</span> : null}
            </button>
          ))}
        </div>

        <div className="side-bottom">
          <div className="side-user">
            <img src={_D.user.avatar} alt="" />
            <div className="meta">
              <div className="name">{_D.user.firstName}</div>
              <div className="plan">FLOW · 12/MES</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="greet">
            <div className="hi">{todayStr.charAt(0).toUpperCase() + todayStr.slice(1)}</div>
            <div className="when">CICLO MAY · 5 CRÉDITOS · 1 RECUPERACIÓN</div>
          </div>
          <div className="spacer"></div>
          <div className="search">
            <Icon name="search" size={14} />
            <input placeholder="Buscar clase, instructor..." />
          </div>
          <div className="credits">
            <span className="n">5</span>
            <span>CRÉDITOS</span>
          </div>
          <button className="bell" onClick={() => go('notifications')}>
            <Icon name="bell" size={16} />
            <span className="pip"></span>
          </button>
        </div>

        <div className="body">
          {renderScreen()}
        </div>
      </main>

      {/* Modals */}
      {reserve && <ReserveModal cls={reserve} onClose={() => setReserve(null)} onReserve={doReserve} onCancel={doConfirmAttend} onLicense={openLicense} />}
      {license && <LicenseModal cls={license} onClose={() => setLicense(null)} onConfirm={doLicense} />}
      {toast && <div className="toast"><Icon name="check" size={14} /> {toast}</div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);

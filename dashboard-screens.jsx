/* Move Studio — Dashboard screens */

const { useState, useMemo, useEffect } = React;
const D = window.MOVE_DATA;
const H = window.MOVE_HELPERS;

// ─── shared bits ───────────────────────────────────────────
const Pill = ({ kind, children }) => <span className={`pill ${kind}`}>{children}</span>;
const fmtDate = (iso) => H.formatDate(iso);
const fmtShort = (iso) => H.formatShort(iso);

const STATUS = {
  attended:    { label: 'Asistida',     kind: 'ok' },
  completed:   { label: 'Completada',   kind: 'ok' },
  license:     { label: 'Licencia',     kind: 'license' },
  makeup_used: { label: 'Recuperación', kind: 'makeup' },
  no_show:     { label: 'No asistió',   kind: 'no' },
  scheduled:   { label: 'Reservada',    kind: 'gray' },
};

// Toast
function useToast() {
  const [t, setT] = useState(null);
  const show = (msg) => { setT(msg); setTimeout(() => setT(null), 3000); };
  const node = t ? (
    <div className="toast"><Icon name="check" size={14} /> {t}</div>
  ) : null;
  return [node, show];
}

// ───────────────────────────────────────────────────────────
// 1. HOME (overview)
// ───────────────────────────────────────────────────────────
window.HomeScreen = function HomeScreen({ go, openReserve, openLicense }) {
  const nextCls = D.classes.find(c => c.isNext);
  const used = D.credits.used;
  const total = D.credits.total;
  const remaining = D.credits.remaining;
  const ringPct = used / total;
  const r = 78;
  const c = 2 * Math.PI * r;
  const dashOffset = c * (1 - ringPct);

  const latestEval = D.evaluations[0];
  const unreadNotifs = D.notifications.filter(n => !n.read);

  return (
    <div className="fade-in">
      <div className="page-title">Buen día, {D.user.firstName}.</div>
      <p className="page-sub">Tu próxima sesión empieza pronto — todo en orden.</p>

      <div className="home-grid">
        {/* Next class hero card */}
        <div className="next-class">
          <div className="when">PRÓXIMA CLASE · HOY · 10:30 AM</div>
          <h2>{nextCls.name}</h2>
          <div className="meta">
            <div>con <b>{nextCls.coach}</b></div>
            <div>· {nextCls.room}</div>
            <div>· {nextCls.level}</div>
          </div>
          <div className="countdown">
            <div>
              <span className="cb">EMPIEZA EN</span>
              <span className="cn">1h 55m</span>
            </div>
            <div style={{flex:1}}></div>
            <div>
              <span className="cb">LUGARES OCUPADOS</span>
              <span className="cn">{nextCls.spots_taken}/{nextCls.spots_total}</span>
            </div>
          </div>
          <div className="actions">
            <button className="btn btn-cream" onClick={() => openReserve(nextCls)}>Ver detalles <Icon name="arrow-right" size={14} /></button>
            <button className="btn btn-line" onClick={() => openLicense(nextCls)}>Solicitar licencia</button>
          </div>
        </div>

        {/* Credits ring */}
        <div className="card ring-card">
          <div className="card-h">
            <h3>Tus créditos</h3>
            <span className="right">CICLO MAY</span>
          </div>
          <div className="ring-wrap">
            <svg viewBox="0 0 200 200">
              <circle className="track" cx="100" cy="100" r={r} />
              <circle className="arc" cx="100" cy="100" r={r}
                strokeDasharray={c} strokeDashoffset={dashOffset} />
            </svg>
            <div className="ring-center">
              <div className="n">{remaining}</div>
              <div className="l">DE {total} DISPONIBLES</div>
            </div>
          </div>
          <div className="splits">
            <div className="it"><div className="v">{used}</div><div className="k">USADAS</div></div>
            <div className="it"><div className="v">{D.credits.pending_makeup}</div><div className="k">RECUPERACIÓN</div></div>
            <div className="it"><div className="v">{D.credits.rollover}</div><div className="k">A PRÓXIMO MES</div></div>
          </div>
        </div>
      </div>

      <div className="home-grid" style={{marginTop:18}}>
        {/* Upcoming */}
        <div className="card">
          <div className="card-h">
            <h3>Próximas clases</h3>
            <a onClick={() => go('calendar')} style={{cursor:'pointer',color:'var(--sage-dark)',fontSize:13,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:4}}>Ver calendario <Icon name="arrow-right" size={12} /></a>
          </div>
          <div className="up-list">
            {D.upcoming.map((u, i) => {
              const d = new Date(u.date + 'T12:00');
              return (
                <div key={i} className="up-row">
                  <div className="day">
                    <span className="num">{d.getDate()}</span>
                    {d.toLocaleDateString('es-MX',{weekday:'short'}).slice(0,3)}
                  </div>
                  <div className="info">
                    <div className="name">{u.name}</div>
                    <div className="coach">con {u.coach}</div>
                  </div>
                  <div className="time">{u.start}</div>
                  <button className="btn btn-soft" style={{padding:'7px 14px',fontSize:12}} onClick={() => openReserve(u)}>Detalles</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: latest eval + notifications */}
        <div style={{display:'flex',flexDirection:'column',gap:18}}>
          <div className="card cream">
            <div className="card-h">
              <h3 style={{color:'var(--ink-2)'}}>Tu progreso</h3>
              <a onClick={() => go('evaluations')} style={{cursor:'pointer',color:'var(--ink-2)',fontSize:13,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:4}}>Ver todo <Icon name="arrow-right" size={12} /></a>
            </div>
            <div style={{fontSize:13,color:'var(--ink-2)',opacity:0.7,fontFamily:'var(--font-mono)',letterSpacing:'0.04em',textTransform:'uppercase'}}>ÚLTIMA EVALUACIÓN · {fmtShort(latestEval.date).toUpperCase()}</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:14}}>
              {latestEval.sections.slice(0, 4).map((s, i) => (
                <div key={i} style={{padding:'10px 12px',background:'rgba(255,255,255,0.4)',borderRadius:10}}>
                  <div style={{fontSize:10.5,letterSpacing:'0.04em',color:'var(--ink-2)',opacity:0.6,fontFamily:'var(--font-mono)'}}>{s.label.toUpperCase()}</div>
                  <div style={{fontFamily:'var(--font-serif)',fontSize:20,lineHeight:1,marginTop:4,color:'var(--ink-2)'}}>{s.value}</div>
                  {s.delta && <div style={{fontSize:11,marginTop:4,color:'var(--ok)',fontFamily:'var(--font-mono)'}}>↑ {s.delta}</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-h">
              <h3>Notificaciones</h3>
              <a onClick={() => go('notifications')} style={{cursor:'pointer',color:'var(--sage-dark)',fontSize:13,textDecoration:'none'}}>Ver todas ({unreadNotifs.length})</a>
            </div>
            {unreadNotifs.slice(0, 3).map(n => (
              <div key={n.id} style={{display:'flex',gap:12,padding:'12px 0',borderBottom:'1px solid var(--line)'}}>
                <div style={{width:32,height:32,borderRadius:8,background:'var(--bg-2)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--sage-dark)',flexShrink:0}}>
                  <Icon name={n.icon} size={15} />
                </div>
                <div style={{flex:1,fontSize:13}}>
                  <div style={{color:'var(--ink)',fontWeight:500,lineHeight:1.3}}>{n.title}</div>
                  <div style={{color:'var(--muted)',fontSize:11.5,marginTop:3,fontFamily:'var(--font-mono)',letterSpacing:'0.04em'}}>{n.tag.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────
// 2. CALENDAR
// ───────────────────────────────────────────────────────────
window.CalendarScreen = function CalendarScreen({ openReserve }) {
  const [weekStart, setWeekStart] = useState(0); // 0 = current

  const days = ['2026-05-13','2026-05-14','2026-05-15','2026-05-16','2026-05-17','2026-05-18'];
  const timeSlots = ['07:00','08:00','09:00','10:00','11:00','17:00','18:00','19:00'];

  // Group classes by day
  const byDay = useMemo(() => {
    const g = {};
    days.forEach(d => g[d] = []);
    D.classes.forEach(c => { if (g[c.date]) g[c.date].push(c); });
    return g;
  }, []);

  const slotForClass = (c) => {
    const h = parseInt(c.start.split(':')[0], 10);
    if (h < 8) return '07:00';
    if (h < 9) return '08:00';
    if (h < 10) return '09:00';
    if (h < 11) return '10:00';
    if (h < 17) return '11:00';
    if (h < 18) return '17:00';
    if (h < 19) return '18:00';
    return '19:00';
  };

  return (
    <div className="fade-in">
      <div className="cal-head">
        <div>
          <div className="page-title">Calendario</div>
          <p className="page-sub">Semana del 13 al 18 de mayo · 22 clases programadas · 5 son tuyas</p>
        </div>
        <div className="nav-btns">
          <button title="Semana anterior"><Icon name="chev-left" size={16} /></button>
          <button className="btn btn-soft" style={{borderRadius:999,padding:'8px 16px',fontSize:13}}>Esta semana</button>
          <button title="Semana siguiente"><Icon name="chev-right" size={16} /></button>
        </div>
      </div>

      {/* Legend */}
      <div style={{display:'flex',gap:18,marginBottom:18,fontSize:12,color:'var(--muted)',fontFamily:'var(--font-mono)',letterSpacing:'0.04em'}}>
        <span style={{display:'flex',alignItems:'center',gap:6}}><span style={{width:10,height:10,borderRadius:3,background:'var(--ink-2)'}}></span>MIS RESERVAS</span>
        <span style={{display:'flex',alignItems:'center',gap:6}}><span style={{width:10,height:10,borderRadius:3,background:'var(--bg-2)',border:'1px solid var(--line-2)'}}></span>DISPONIBLE</span>
        <span style={{display:'flex',alignItems:'center',gap:6}}><span style={{width:10,height:10,borderRadius:3,background:'var(--bg-3)'}}></span>LLENO</span>
      </div>

      <div className="cal-week">
        <div className="cal-col times">
          <div className="cal-day-head">&nbsp;</div>
          {timeSlots.map(t => <div key={t} className="cal-slot">{t}</div>)}
        </div>
        {days.map((d, i) => {
          const date = new Date(d + 'T12:00');
          const isToday = d === '2026-05-13';
          const classes = byDay[d] || [];
          return (
            <div key={d} className="cal-col">
              <div className={`cal-day-head ${isToday ? 'today' : ''}`}>
                {date.toLocaleDateString('es-MX',{weekday:'short'}).toUpperCase()}
                <span className="num">{date.getDate()}</span>
              </div>
              {timeSlots.map(slot => {
                const here = classes.filter(c => slotForClass(c) === slot);
                return (
                  <div key={slot} className="cal-cell">
                    {here.map(cls => {
                      const full = cls.spots_taken >= cls.spots_total;
                      const klass = ['cls-chip'];
                      if (cls.mine) klass.push('mine');
                      if (cls.status === 'completed') klass.push('completed');
                      if (full && !cls.mine) klass.push('full');
                      return (
                        <div key={cls.id} className={klass.join(' ')} onClick={() => openReserve(cls)}>
                          <div className="name">{cls.name}</div>
                          <div className="meta">{cls.start} · {cls.coach.split(' ')[0]} {!cls.mine && !full && `· ${cls.spots_total - cls.spots_taken}`}</div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────
// 3. HISTORY
// ───────────────────────────────────────────────────────────
window.HistoryScreen = function HistoryScreen() {
  const counts = D.history.reduce((acc, h) => { acc[h.status] = (acc[h.status]||0)+1; return acc; }, {});

  return (
    <div className="fade-in">
      <div className="page-title">Historial</div>
      <p className="page-sub">Tu práctica en los últimos meses · {D.history.length} sesiones registradas</p>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
        <div className="card tint" style={{padding:18}}>
          <div style={{fontSize:11,color:'var(--muted)',fontFamily:'var(--font-mono)',letterSpacing:'0.06em'}}>TOTAL ESTE AÑO</div>
          <div style={{fontFamily:'var(--font-serif)',fontSize:36,marginTop:8,lineHeight:1}}>42</div>
          <div style={{fontSize:11,color:'var(--ok)',marginTop:6,fontFamily:'var(--font-mono)'}}>↑ 18% vs 2025</div>
        </div>
        <div className="card tint" style={{padding:18}}>
          <div style={{fontSize:11,color:'var(--muted)',fontFamily:'var(--font-mono)',letterSpacing:'0.06em'}}>ASISTENCIA</div>
          <div style={{fontFamily:'var(--font-serif)',fontSize:36,marginTop:8,lineHeight:1}}>91%</div>
          <div style={{fontSize:11,color:'var(--muted)',marginTop:6,fontFamily:'var(--font-mono)'}}>{counts.attended || 0} ASISTIDAS</div>
        </div>
        <div className="card tint" style={{padding:18}}>
          <div style={{fontSize:11,color:'var(--muted)',fontFamily:'var(--font-mono)',letterSpacing:'0.06em'}}>LICENCIAS</div>
          <div style={{fontFamily:'var(--font-serif)',fontSize:36,marginTop:8,lineHeight:1}}>{counts.license || 0}</div>
          <div style={{fontSize:11,color:'var(--muted)',marginTop:6,fontFamily:'var(--font-mono)'}}>ÚLTIMOS 3 MESES</div>
        </div>
        <div className="card tint" style={{padding:18}}>
          <div style={{fontSize:11,color:'var(--muted)',fontFamily:'var(--font-mono)',letterSpacing:'0.06em'}}>DISCIPLINA TOP</div>
          <div style={{fontFamily:'var(--font-serif)',fontSize:24,marginTop:8,lineHeight:1.1}}>Reformer</div>
          <div style={{fontSize:11,color:'var(--muted)',marginTop:6,fontFamily:'var(--font-mono)'}}>32 SESIONES</div>
        </div>
      </div>

      <div className="card">
        <div className="card-h">
          <h3>Sesiones recientes</h3>
          <div style={{display:'flex',gap:6}}>
            <button className="btn btn-soft" style={{padding:'7px 14px',fontSize:12}}>Todas</button>
            <button className="btn btn-ghost" style={{padding:'7px 14px',fontSize:12,borderColor:'var(--line)'}}>Reformer</button>
            <button className="btn btn-ghost" style={{padding:'7px 14px',fontSize:12,borderColor:'var(--line)'}}>Mat</button>
            <button className="btn btn-ghost" style={{padding:'7px 14px',fontSize:12,borderColor:'var(--line)'}}>MOTR</button>
          </div>
        </div>
        <div>
          {D.history.map(h => {
            const d = new Date(h.date + 'T12:00');
            const st = STATUS[h.status];
            return (
              <div key={h.id} className="list-row">
                <div className="when">
                  <span className="num">{d.getDate()}</span>
                  {d.toLocaleDateString('es-MX',{month:'short'}).toUpperCase().slice(0,3)} · {h.start}
                </div>
                <div>
                  <div className="name">{h.name}</div>
                  <div className="coach">con {h.coach}</div>
                  {h.note && <div className="note">{h.note}</div>}
                </div>
                <Pill kind={st.kind}>{st.label}</Pill>
                <button className="btn btn-soft" style={{padding:'7px 12px',fontSize:12}}>Detalles</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────
// 4. MEMBERSHIP
// ───────────────────────────────────────────────────────────
window.MembershipScreen = function MembershipScreen() {
  const plans = [
    { id:'ess',     name:'Essential', count:'8 clases / mes',     price:89,  features:['8 créditos mensuales','1 recuperación al mes','Reserva con 5 días anticipación'] },
    { id:'flow',    name:'Flow',      count:'12 clases / mes',    price:129, features:['12 créditos mensuales','2 recuperaciones al mes','2 créditos transferibles','Acceso prioritario','Evaluaciones trimestrales'], current:true },
    { id:'bound',   name:'Boundless', count:'Ilimitado',          price:189, features:['Clases ilimitadas','Acceso a workshops','3 invitados por mes','Sesiones 1-on-1: 1 al mes','Evaluación mensual'] },
  ];

  return (
    <div className="fade-in">
      <div className="page-title">Mi membresía</div>
      <p className="page-sub">Plan activo desde {D.user.member_since} · Próxima renovación 31 mayo</p>

      <div className="card dark" style={{marginBottom:18,padding:32,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-60,right:-60,width:280,height:280,borderRadius:'50%',background:'radial-gradient(circle,rgba(232,220,196,0.18) 0%,transparent 70%)',pointerEvents:'none'}}></div>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:32,alignItems:'center'}}>
          <div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.14em',color:'var(--cream)',marginBottom:12}}>TU PLAN ACTUAL</div>
            <div style={{fontFamily:'var(--font-serif)',fontSize:56,lineHeight:1,letterSpacing:'-0.02em'}}>Flow</div>
            <div style={{fontSize:14,opacity:0.7,marginTop:8}}>12 clases por mes · $129 / mes · facturación automática</div>
            <div style={{display:'flex',gap:8,marginTop:22,flexWrap:'wrap'}}>
              <button className="btn" style={{background:'var(--cream)',color:'var(--ink-2)'}}>Cambiar plan</button>
              <button className="btn btn-line" style={{color:'var(--bg)',borderColor:'rgba(250,247,242,0.25)',background:'transparent'}}>Pausar membresía</button>
            </div>
          </div>
          <div>
            <div style={{padding:16,background:'rgba(250,247,242,0.06)',borderRadius:14}}>
              <div style={{fontSize:11,fontFamily:'var(--font-mono)',color:'rgba(250,247,242,0.6)',letterSpacing:'0.06em'}}>SIGUIENTE CARGO</div>
              <div style={{fontFamily:'var(--font-serif)',fontSize:32,marginTop:8,lineHeight:1}}>$129.00</div>
              <div style={{fontSize:12,opacity:0.6,marginTop:4}}>31 may · Visa ····2847</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-h" style={{marginBottom:14,marginTop:32}}>
        <h3 style={{fontFamily:'var(--font-serif)',fontSize:26,margin:0}}>Otros planes</h3>
        <div style={{fontSize:13,color:'var(--muted)'}}>Cambios entran en vigor en el siguiente ciclo</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
        {plans.map(p => (
          <div key={p.id} className={`card`} style={{padding:24,position:'relative',borderColor:p.current?'var(--sage)':'var(--line)',background:p.current?'var(--bg-2)':'var(--paper)'}}>
            {p.current && <span style={{position:'absolute',top:14,right:14,background:'var(--sage-dark)',color:'var(--bg)',fontSize:10,letterSpacing:'0.1em',padding:'3px 8px',borderRadius:999,fontFamily:'var(--font-mono)'}}>ACTUAL</span>}
            <div style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.1em',color:'var(--muted)'}}>{p.count.toUpperCase()}</div>
            <div style={{fontFamily:'var(--font-serif)',fontSize:38,marginTop:8,lineHeight:1}}>{p.name}</div>
            <div style={{display:'flex',alignItems:'baseline',gap:4,marginTop:14}}>
              <div style={{fontFamily:'var(--font-serif)',fontSize:32}}>${p.price}</div>
              <div style={{fontSize:13,color:'var(--muted)'}}>/ mes</div>
            </div>
            <ul style={{listStyle:'none',padding:0,margin:'18px 0 22px',display:'flex',flexDirection:'column',gap:8}}>
              {p.features.map((f,i) => (
                <li key={i} style={{fontSize:13,color:'var(--ink-soft)',display:'flex',gap:8,alignItems:'flex-start'}}>
                  <Icon name="check" size={14} style={{color:'var(--sage-dark)',flexShrink:0,marginTop:2}} />
                  {f}
                </li>
              ))}
            </ul>
            <button className="btn btn-ghost" disabled={p.current} style={{width:'100%',justifyContent:'center',opacity:p.current?0.5:1,cursor:p.current?'default':'pointer'}}>
              {p.current ? 'Plan actual' : 'Cambiar a ' + p.name}
            </button>
          </div>
        ))}
      </div>

      {/* Billing history */}
      <div className="card" style={{marginTop:18}}>
        <div className="card-h"><h3>Historial de pagos</h3></div>
        {[
          { date:'1 May 2026', amount:'$129.00', method:'Visa ····2847', status:'Pagado' },
          { date:'1 Abr 2026', amount:'$129.00', method:'Visa ····2847', status:'Pagado' },
          { date:'1 Mar 2026', amount:'$129.00', method:'Visa ····2847', status:'Pagado' },
          { date:'1 Feb 2026', amount:'$89.00', method:'Visa ····2847', status:'Pagado · Essential' },
        ].map((p,i) => (
          <div key={i} style={{display:'grid',gridTemplateColumns:'120px 1fr auto auto',gap:18,padding:'14px 0',borderBottom:'1px solid var(--line)',alignItems:'center'}}>
            <div style={{fontSize:13,color:'var(--ink)',fontFamily:'var(--font-mono)',letterSpacing:'0.02em'}}>{p.date}</div>
            <div style={{fontSize:13,color:'var(--muted)'}}>{p.method}</div>
            <div style={{fontFamily:'var(--font-serif)',fontSize:18}}>{p.amount}</div>
            <button className="btn btn-soft" style={{padding:'7px 12px',fontSize:11,letterSpacing:'0.04em'}}><Icon name="download" size={12} /> Recibo</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────
// 5. EVALUATIONS
// ───────────────────────────────────────────────────────────
window.EvalScreen = function EvalScreen() {
  return (
    <div className="fade-in">
      <div className="page-title">Evaluaciones</div>
      <p className="page-sub">Tu progreso físico documentado por tu instructor</p>

      {D.evaluations.map((e, i) => (
        <div key={e.id} className="card" style={{marginBottom:18}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
            <div>
              <div style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.06em',color:'var(--muted)'}}>{fmtDate(e.date).toUpperCase()}</div>
              <div style={{fontFamily:'var(--font-serif)',fontSize:28,letterSpacing:'-0.01em',margin:'8px 0 4px'}}>{e.title}</div>
              <div style={{fontSize:13,color:'var(--ink-soft)'}}>Por {e.by} · Nivel registrado: <b>{e.level}</b></div>
            </div>
            <div style={{display:'flex',gap:6}}>
              <button className="btn btn-soft" style={{padding:'8px 14px',fontSize:12}}><Icon name="download" size={13} /> PDF</button>
            </div>
          </div>

          <div className="eval-grid">
            {e.sections.map((s, j) => (
              <div key={j} className="eval-it">
                <div className="k">{s.label.toUpperCase()}</div>
                <div className="v">{s.value}</div>
                {s.delta && <div className={`d ${s.trend || 'flat'}`}>↑ {s.delta}</div>}
              </div>
            ))}
          </div>

          {e.observations && (
            <div style={{marginTop:14,padding:'14px 16px',background:'var(--bg-2)',borderRadius:12,borderLeft:'2px solid var(--sage)'}}>
              <div style={{fontSize:11,fontFamily:'var(--font-mono)',letterSpacing:'0.06em',color:'var(--muted)',marginBottom:6}}>OBSERVACIONES</div>
              <div style={{fontSize:13.5,lineHeight:1.5,color:'var(--ink)'}}>{e.observations}</div>
            </div>
          )}

          {e.objectives && (
            <div style={{marginTop:10,padding:'14px 16px',background:'var(--cream)',borderRadius:12}}>
              <div style={{fontSize:11,fontFamily:'var(--font-mono)',letterSpacing:'0.06em',color:'var(--ink-2)',opacity:0.7,marginBottom:6}}>OBJETIVOS PRÓXIMO TRIMESTRE</div>
              <div style={{fontSize:13.5,lineHeight:1.5,color:'var(--ink-2)'}}>{e.objectives}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ───────────────────────────────────────────────────────────
// 6. MAKEUPS
// ───────────────────────────────────────────────────────────
window.MakeupScreen = function MakeupScreen({ go }) {
  return (
    <div className="fade-in">
      <div className="page-title">Recuperaciones</div>
      <p className="page-sub">Créditos extra otorgados por licencias aprobadas</p>

      <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:18,marginBottom:18}}>
        <div className="card" style={{padding:28}}>
          <div style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.06em',color:'var(--muted)'}}>RECUPERACIONES DISPONIBLES</div>
          <div style={{fontFamily:'var(--font-serif)',fontSize:84,lineHeight:0.9,margin:'12px 0 6px',color:'var(--sage-dark)'}}>{D.makeups.length}</div>
          <div style={{fontSize:13,color:'var(--ink-soft)'}}>Puedes usarlas en cualquier clase con cupo disponible.</div>
          <button className="btn btn-primary" style={{marginTop:18}} onClick={() => go('calendar')}>
            Reservar recuperación <Icon name="arrow-right" size={14} />
          </button>
        </div>

        <div className="card tint">
          <div className="card-h"><h3>¿Cómo funciona?</h3></div>
          <ol style={{paddingLeft:18,margin:0,fontSize:13.5,lineHeight:1.6,color:'var(--ink-soft)',display:'flex',flexDirection:'column',gap:8}}>
            <li>Solicita licencia con mínimo <b>2 horas</b> de anticipación.</li>
            <li>El admin aprueba y genera un crédito de recuperación.</li>
            <li>Reserva una nueva clase dentro de los próximos 2 meses.</li>
          </ol>
        </div>
      </div>

      <div className="card">
        <div className="card-h"><h3>Tus recuperaciones</h3></div>
        {D.makeups.map(m => (
          <div key={m.id} className="list-row" style={{gridTemplateColumns:'1fr auto auto'}}>
            <div>
              <div className="name">Crédito de recuperación</div>
              <div className="coach">{m.reason} · Vence {fmtDate(m.expires)}</div>
            </div>
            <Pill kind="makeup">Disponible</Pill>
            <button className="btn btn-primary" style={{padding:'8px 14px',fontSize:12}} onClick={() => go('calendar')}>Usar ahora</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────
// 7. NOTIFICATIONS
// ───────────────────────────────────────────────────────────
window.NotifScreen = function NotifScreen() {
  return (
    <div className="fade-in">
      <div className="page-title">Notificaciones</div>
      <p className="page-sub">{D.notifications.filter(n=>!n.read).length} sin leer · Marcadas automáticamente al abrir</p>

      <div className="card">
        {D.notifications.map(n => {
          const dt = new Date(n.when);
          const dStr = dt.toLocaleDateString('es-MX',{day:'numeric',month:'short'});
          const tStr = dt.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'});
          return (
            <div key={n.id} style={{display:'flex',gap:14,padding:'18px 4px',borderBottom:'1px solid var(--line)',position:'relative'}}>
              <div style={{width:38,height:38,borderRadius:10,background:n.read?'var(--bg-2)':'var(--cream)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--ink-2)',flexShrink:0}}>
                <Icon name={n.icon} size={17} />
              </div>
              <div style={{flex:1}}>
                <div style={{display:'flex',gap:10,alignItems:'center'}}>
                  <span style={{fontSize:10.5,fontFamily:'var(--font-mono)',letterSpacing:'0.06em',color:'var(--muted)'}}>{n.tag.toUpperCase()}</span>
                  <span style={{width:3,height:3,borderRadius:'50%',background:'var(--muted-2)'}}></span>
                  <span style={{fontSize:11,color:'var(--muted)',fontFamily:'var(--font-mono)'}}>{dStr} · {tStr}</span>
                  {!n.read && <span style={{width:7,height:7,borderRadius:'50%',background:'var(--terracotta)'}}></span>}
                </div>
                <div style={{fontSize:14.5,color:'var(--ink)',marginTop:4,fontWeight:500}}>{n.title}</div>
                <div style={{fontSize:13.5,color:'var(--ink-soft)',marginTop:4,lineHeight:1.5}}>{n.body}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────
// 8. PROFILE
// ───────────────────────────────────────────────────────────
window.ProfileScreen = function ProfileScreen() {
  return (
    <div className="fade-in">
      <div className="page-title">Perfil</div>
      <p className="page-sub">Tu información personal y preferencias</p>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
        <div className="card">
          <div style={{display:'flex',alignItems:'center',gap:18,paddingBottom:22,borderBottom:'1px solid var(--line)'}}>
            <img src={D.user.avatar} style={{width:64,height:64,borderRadius:'50%',objectFit:'cover'}}/>
            <div style={{flex:1}}>
              <div style={{fontFamily:'var(--font-serif)',fontSize:24,lineHeight:1}}>{D.user.name}</div>
              <div style={{fontSize:13,color:'var(--muted)',marginTop:4}}>Miembro desde {D.user.member_since} · {D.user.plan}</div>
            </div>
            <button className="btn btn-soft" style={{padding:'8px 14px',fontSize:12}}>Cambiar foto</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginTop:18}}>
            <div className="field"><div className="label-row">NOMBRE</div><input className="text-area" style={{minHeight:'auto',padding:'10px 14px'}} defaultValue="Valeria Morales"/></div>
            <div className="field"><div className="label-row">CORREO</div><input className="text-area" style={{minHeight:'auto',padding:'10px 14px'}} defaultValue="valeria@correo.com"/></div>
            <div className="field"><div className="label-row">TELÉFONO</div><input className="text-area" style={{minHeight:'auto',padding:'10px 14px'}} defaultValue="+52 55 7821 4456"/></div>
            <div className="field"><div className="label-row">FECHA DE NACIMIENTO</div><input className="text-area" style={{minHeight:'auto',padding:'10px 14px'}} defaultValue="14 / 03 / 1991"/></div>
          </div>
        </div>

        <div className="card">
          <div className="card-h"><h3>Salud y objetivos</h3></div>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div className="field"><div className="label-row">CONDICIONES MÉDICAS</div><textarea className="text-area" defaultValue="Hernia discal L4-L5 (rehabilitada). Lumbalgia ocasional."/></div>
            <div className="field"><div className="label-row">OBJETIVOS PRINCIPALES</div><textarea className="text-area" defaultValue="Mejorar postura · Fortalecer core · Aumentar flexibilidad de cadera"/></div>
            <div className="field"><div className="label-row">CONTACTO DE EMERGENCIA</div><input className="text-area" style={{minHeight:'auto',padding:'10px 14px'}} defaultValue="Ricardo Morales · +52 55 1234 5678"/></div>
          </div>
        </div>
      </div>

      <div className="card" style={{marginTop:18}}>
        <div className="card-h"><h3>Preferencias</h3></div>
        {[
          { t:'Recordatorios de clase', d:'30 min antes · WhatsApp + Push', on:true },
          { t:'Nuevas evaluaciones', d:'Notificarme cuando mi instructor agregue notas', on:true },
          { t:'Promociones y eventos', d:'Workshops, retiros, descuentos exclusivos', on:false },
          { t:'Renovación automática', d:'Cargar mi tarjeta el día 1 de cada mes', on:true },
        ].map((p,i) => (
          <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 0',borderBottom:'1px solid var(--line)'}}>
            <div>
              <div style={{fontSize:14,fontWeight:500}}>{p.t}</div>
              <div style={{fontSize:12,color:'var(--muted)',marginTop:3}}>{p.d}</div>
            </div>
            <div style={{width:44,height:24,borderRadius:999,background:p.on?'var(--sage-dark)':'var(--bg-3)',position:'relative',cursor:'pointer'}}>
              <div style={{position:'absolute',top:2,left:p.on?22:2,width:20,height:20,borderRadius:'50%',background:'var(--white)',transition:'left .2s ease',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}></div>
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop:18,display:'flex',gap:8}}>
        <button className="btn btn-primary">Guardar cambios</button>
        <button className="btn btn-ghost">Descartar</button>
        <div style={{flex:1}}></div>
        <a href="login.html" className="btn btn-ghost" style={{color:'var(--err)',borderColor:'rgba(168,90,74,0.3)'}}>
          <Icon name="logout" size={14} /> Cerrar sesión
        </a>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────
// 9. CHAT (Maya inline)
// ───────────────────────────────────────────────────────────
window.ChatScreen = function ChatScreen() {
  const [msgs, setMsgs] = useState([
    { role:'bot', text:'Hola Valeria 🌿 — ¿en qué te puedo ayudar hoy? Tienes 1h 55m antes de tu próxima clase.' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const suggested = [
    '¿Cuántos créditos me quedan?',
    'Cambiar mi clase de mañana',
    'Solicitar licencia',
    '¿Qué recomienda Andrea para mi espalda?'
  ];

  const PRESET = {
    'créditos': 'Te quedan 5 créditos en tu ciclo actual (cierra 31 may). Además, tienes 1 crédito de recuperación disponible hasta el 15 jun.',
    'mañana': 'Tienes reservada Reformer Flow mañana a las 8:00 AM con Andrea V. ¿Quieres cambiarla, cancelarla o solicitar licencia?',
    'licencia': 'Puedes solicitar licencia hasta 2 horas antes de la clase. ¿Para qué sesión la necesitas? Te muestro tus próximas:\n\n• Hoy 10:30 — Reformer Strength\n• Mañana 8:00 — Reformer Flow\n• Vie 9:00 — Reformer Strength',
    'andrea': 'Según tu última evaluación (5 mayo), Andrea recomienda continuar con cadena posterior y agregar movilidad torácica 2x semana. Sugerencia: Mat & Mobility (sábados 10:00 AM).',
  };

  const send = (text) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { role:'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const lower = text.toLowerCase();
      let reply = '¿Podrías darme más detalles? Mientras tanto, también puedo ayudarte con: créditos, reservas, evaluaciones, membresía.';
      for (const k in PRESET) if (lower.includes(k)) { reply = PRESET[k]; break; }
      setMsgs(m => [...m, { role:'bot', text: reply }]);
    }, 800);
  };

  return (
    <div className="fade-in" style={{maxWidth:780,margin:'0 auto',height:'calc(100vh - 180px)',display:'flex',flexDirection:'column'}}>
      <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:18,padding:'14px 20px',background:'var(--paper)',border:'1px solid var(--line)',borderRadius:20}}>
        <div style={{width:42,height:42,borderRadius:'50%',background:'linear-gradient(135deg,var(--sage),var(--ink-2))',color:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-serif)',fontSize:20}}>M</div>
        <div style={{flex:1}}>
          <div style={{fontSize:15,fontWeight:500}}>Maya</div>
          <div style={{fontSize:11.5,color:'var(--muted)',display:'flex',alignItems:'center',gap:5,marginTop:2}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#6ea84a'}}></span>
            Asistente Move · Tu contexto y datos están conectados
          </div>
        </div>
        <Pill kind="ok"><Icon name="sparkle" size={11} /> IA</Pill>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:'8px 4px',display:'flex',flexDirection:'column',gap:10}}>
        {msgs.map((m, i) => (
          <div key={i} style={{
            maxWidth:'72%',
            padding:'12px 16px',
            borderRadius:18,
            background: m.role==='user' ? 'var(--ink-2)' : 'var(--paper)',
            color: m.role==='user' ? 'var(--bg)' : 'var(--ink)',
            alignSelf: m.role==='user' ? 'flex-end' : 'flex-start',
            border: m.role==='user' ? 'none' : '1px solid var(--line)',
            fontSize:14, lineHeight:1.5, whiteSpace:'pre-wrap',
            borderBottomRightRadius: m.role==='user' ? 6 : 18,
            borderBottomLeftRadius: m.role==='bot' ? 6 : 18,
          }}>{m.text}</div>
        ))}
        {typing && (
          <div style={{alignSelf:'flex-start',padding:'14px 18px',background:'var(--paper)',border:'1px solid var(--line)',borderRadius:18,borderBottomLeftRadius:6,display:'flex',gap:5}}>
            <span className="dot" style={{width:6,height:6,borderRadius:'50%',background:'var(--muted-2)',animation:'mayaTyping 1.2s infinite'}}></span>
            <span className="dot" style={{width:6,height:6,borderRadius:'50%',background:'var(--muted-2)',animation:'mayaTyping 1.2s infinite .15s'}}></span>
            <span className="dot" style={{width:6,height:6,borderRadius:'50%',background:'var(--muted-2)',animation:'mayaTyping 1.2s infinite .3s'}}></span>
          </div>
        )}
      </div>

      {msgs.length === 1 && (
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
          {suggested.map(s => (
            <button key={s} onClick={() => send(s)} className="btn btn-soft" style={{padding:'8px 14px',fontSize:12.5}}>{s}</button>
          ))}
        </div>
      )}

      <div style={{display:'flex',gap:8,alignItems:'center',padding:'10px 14px',background:'var(--paper)',border:'1px solid var(--line)',borderRadius:999}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')send(input)}} placeholder="Pregunta cualquier cosa..." style={{flex:1,border:'none',outline:'none',fontFamily:'var(--font-sans)',fontSize:14,background:'transparent'}}/>
        <button onClick={()=>send(input)} className="btn btn-primary" style={{padding:'8px 14px',fontSize:12}}><Icon name="send" size={13} /> Enviar</button>
      </div>
    </div>
  );
};

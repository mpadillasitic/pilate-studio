/* Lumina Pilates — Dashboard screens */

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

// ───────────────────────────────────────────────────────────
// 1. HOME
// ───────────────────────────────────────────────────────────
window.HomeScreen = function HomeScreen({ go, openReserve, openLicense }) {
  const _D = window.MOVE_DATA || {};
  const nextCls = (_D.classes || []).find(c => c.isNext);
  const used      = _D.credits?.used ?? 0;
  const total     = _D.credits?.total ?? 12;
  const remaining = _D.credits?.remaining ?? 0;
  const ringPct   = total === '∞' || total === 0 ? 0.5 : used / total;
  const r = 78;
  const c = 2 * Math.PI * r;
  const dashOffset = c * (1 - ringPct);
  const latestEval   = (_D.evaluations || _D.evaluaciones || [])[0];
  const unreadNotifs = (_D.notifications || []).filter(n => !n.read);

  return (
    <div className="fade-in">
      <div className="page-title">Hola, {_D.user?.firstName}.</div>
      <p className="page-sub">
        {nextCls ? 'Tu próxima sesión empieza pronto — todo en orden.' : 'Explorá el calendario y reservá tu próxima clase.'}
      </p>

      <div className="home-grid">
        {/* Next class hero card */}
        {nextCls ? (
          <div className="next-class">
            <div className="when">PRÓXIMA CLASE · {new Date(nextCls.date + 'T12:00').toLocaleDateString('es-BO',{weekday:'long'}).toUpperCase()} · {nextCls.start}</div>
            <h2>{nextCls.name}</h2>
            <div className="meta">
              <div>con <b>{nextCls.coach}</b></div>
              <div>· {nextCls.room}</div>
              <div>· {nextCls.level}</div>
            </div>
            <div className="countdown">
              <div>
                <span className="cb">EMPIEZA EN</span>
                <span className="cn">{minutosHasta(nextCls)}</span>
              </div>
              <div style={{flex:1}}></div>
              <div>
                <span className="cb">LUGARES</span>
                <span className="cn">{nextCls.spots_taken}/{nextCls.spots_total}</span>
              </div>
            </div>
            <div className="actions">
              <button className="btn btn-cream" onClick={() => openReserve(nextCls)}>
                Ver detalles <Icon name="arrow-right" size={14} />
              </button>
              {H.canRequestLicense(nextCls) && (
                <button className="btn btn-line" onClick={() => openLicense(nextCls)}>Solicitar licencia</button>
              )}
            </div>
          </div>
        ) : (
          <div className="next-class" style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',textAlign:'center',gap:16}}>
            <div style={{fontFamily:'var(--font-serif)',fontSize:28,color:'var(--ink-soft)'}}>Sin clases reservadas</div>
            <p style={{fontSize:14,color:'var(--muted)'}}>Explorá el calendario y reservá tu próxima sesión.</p>
            <button className="btn btn-cream" onClick={() => go('calendar')}>
              Ver calendario <Icon name="arrow-right" size={14} />
            </button>
          </div>
        )}

        {/* Credits ring */}
        <div className="card ring-card">
          <div className="card-h">
            <h3>Tus créditos</h3>
            <span className="right">{_D.user?.plan || 'PLAN ACTIVO'}</span>
          </div>
          <div className="ring-wrap">
            <svg viewBox="0 0 200 200">
              <circle className="track" cx="100" cy="100" r={r} />
              <circle className="arc" cx="100" cy="100" r={r}
                strokeDasharray={c} strokeDashoffset={dashOffset} />
            </svg>
            <div className="ring-center">
              <div className="n">{remaining}</div>
              <div className="l">{total === '∞' ? 'ILIMITADO' : `DE ${total} DISPONIBLES`}</div>
            </div>
          </div>
          <div className="splits">
            <div className="it"><div className="v">{used}</div><div className="k">USADAS</div></div>
            <div className="it"><div className="v">{_D.credits?.pending_makeup ?? 0}</div><div className="k">RECUPERACIÓN</div></div>
            <div className="it"><div className="v">{_D.credits?.rollover ?? 0}</div><div className="k">A PRÓXIMO MES</div></div>
          </div>
        </div>
      </div>

      <div className="home-grid" style={{marginTop:18}}>
        {/* Upcoming */}
        <div className="card">
          <div className="card-h">
            <h3>Próximas clases</h3>
            <a onClick={() => go('calendar')} style={{cursor:'pointer',color:'var(--sage-dark)',fontSize:13,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:4}}>
              Ver calendario <Icon name="arrow-right" size={12} />
            </a>
          </div>
          <div className="up-list">
            {(_D.upcoming || []).length === 0 && (
              <div style={{padding:'24px 0',textAlign:'center',color:'var(--muted)',fontSize:13}}>
                No tenés clases próximas reservadas.
              </div>
            )}
            {(_D.upcoming || []).map((u, i) => {
              const d = new Date(u.date + 'T12:00');
              return (
                <div key={i} className="up-row">
                  <div className="day">
                    <span className="num">{d.getDate()}</span>
                    {d.toLocaleDateString('es-BO',{weekday:'short'}).slice(0,3)}
                  </div>
                  <div className="info">
                    <div className="name">{u.name}</div>
                    <div className="coach">con {u.coach}</div>
                  </div>
                  <div className="time">{u.start}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div style={{display:'flex',flexDirection:'column',gap:18}}>
          {latestEval ? (
            <div className="card cream">
              <div className="card-h">
                <h3 style={{color:'var(--ink-2)'}}>Tu progreso</h3>
                <a onClick={() => go('evaluations')} style={{cursor:'pointer',color:'var(--ink-2)',fontSize:13,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:4}}>
                  Ver todo <Icon name="arrow-right" size={12} />
                </a>
              </div>
              <div style={{fontSize:13,color:'var(--ink-2)',opacity:0.7,fontFamily:'var(--font-mono)',letterSpacing:'0.04em',textTransform:'uppercase'}}>
                ÚLTIMA EVALUACIÓN · {fmtShort(latestEval.date).toUpperCase()}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:14}}>
                {(latestEval.sections || []).slice(0, 4).map((s, i) => (
                  <div key={i} style={{padding:'10px 12px',background:'rgba(255,255,255,0.4)',borderRadius:10}}>
                    <div style={{fontSize:10.5,letterSpacing:'0.04em',color:'var(--ink-2)',opacity:0.6,fontFamily:'var(--font-mono)'}}>{s.label.toUpperCase()}</div>
                    <div style={{fontFamily:'var(--font-serif)',fontSize:20,lineHeight:1,marginTop:4,color:'var(--ink-2)'}}>{s.value}</div>
                    {s.delta && <div style={{fontSize:11,marginTop:4,color:'var(--ok)',fontFamily:'var(--font-mono)'}}>↑ {s.delta}</div>}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card cream">
              <div className="card-h"><h3 style={{color:'var(--ink-2)'}}>Tu progreso</h3></div>
              <div style={{padding:'24px 0',textAlign:'center',color:'var(--ink-2)',opacity:0.6,fontSize:13}}>
                Tu primera evaluación será agendada por tu instructora.
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-h">
              <h3>Notificaciones</h3>
              <a onClick={() => go('notifications')} style={{cursor:'pointer',color:'var(--sage-dark)',fontSize:13,textDecoration:'none'}}>
                Ver todas ({unreadNotifs.length})
              </a>
            </div>
            {unreadNotifs.length === 0 && (
              <div style={{padding:'16px 0',color:'var(--muted)',fontSize:13}}>Sin notificaciones nuevas.</div>
            )}
            {unreadNotifs.slice(0, 3).map(n => (
              <div key={n.id} style={{display:'flex',gap:12,padding:'12px 0',borderBottom:'1px solid var(--line)'}}>
                <div style={{width:32,height:32,borderRadius:8,background:'var(--bg-2)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--sage-dark)',flexShrink:0}}>
                  <Icon name={n.icon} size={15} />
                </div>
                <div style={{flex:1,fontSize:13}}>
                  <div style={{color:'var(--ink)',fontWeight:500,lineHeight:1.3}}>{n.title}</div>
                  <div style={{color:'var(--muted)',fontSize:11.5,marginTop:3,fontFamily:'var(--font-mono)',letterSpacing:'0.04em'}}>{(n.tag||'').toUpperCase()}</div>
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
  const _D = window.MOVE_DATA || {};
  const clases = _D.classes || [];

  // Calcular días de la semana actual
  const hoy = new Date();
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - hoy.getDay() + 1);
  const days = Array.from({length:6}, (_, i) => {
    const d = new Date(lunes);
    d.setDate(lunes.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const timeSlots = ['07:00','08:00','09:00','10:00','11:00','17:00','18:00','19:00'];
  const todayStr = hoy.toISOString().split('T')[0];

  const byDay = useMemo(() => {
    const g = {};
    days.forEach(d => g[d] = []);
    clases.forEach(c => { if (g[c.date]) g[c.date].push(c); });
    return g;
  }, [clases.length]);

  const slotForClass = (c) => {
    const h = parseInt(c.start.split(':')[0], 10);
    if (h < 8)  return '07:00';
    if (h < 9)  return '08:00';
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
          <p className="page-sub">
            Semana del {new Date(days[0]+'T12:00').toLocaleDateString('es-BO',{day:'numeric',month:'long'})} · {clases.length} clases programadas
          </p>
        </div>
      </div>

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
        {days.map((d) => {
          const date = new Date(d + 'T12:00');
          const isToday = d === todayStr;
          const clasesDelDia = byDay[d] || [];
          return (
            <div key={d} className="cal-col">
              <div className={`cal-day-head ${isToday ? 'today' : ''}`}>
                {date.toLocaleDateString('es-BO',{weekday:'short'}).toUpperCase()}
                <span className="num">{date.getDate()}</span>
              </div>
              {timeSlots.map(slot => {
                const here = clasesDelDia.filter(c => slotForClass(c) === slot);
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
                          <div className="meta">{cls.start} · {cls.coach.split(' ')[0]}</div>
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
  const _D = window.MOVE_DATA || {};
  const historial = _D.history || [];
  const counts = historial.reduce((acc, h) => { acc[h.status] = (acc[h.status]||0)+1; return acc; }, {});

  return (
    <div className="fade-in">
      <div className="page-title">Historial</div>
      <p className="page-sub">Tu práctica registrada · {historial.length} sesiones</p>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
        <div className="card tint" style={{padding:18}}>
          <div style={{fontSize:11,color:'var(--muted)',fontFamily:'var(--font-mono)',letterSpacing:'0.06em'}}>TOTAL REGISTRADAS</div>
          <div style={{fontFamily:'var(--font-serif)',fontSize:36,marginTop:8,lineHeight:1}}>{historial.length}</div>
        </div>
        <div className="card tint" style={{padding:18}}>
          <div style={{fontSize:11,color:'var(--muted)',fontFamily:'var(--font-mono)',letterSpacing:'0.06em'}}>ASISTIDAS</div>
          <div style={{fontFamily:'var(--font-serif)',fontSize:36,marginTop:8,lineHeight:1}}>{counts.attended || 0}</div>
        </div>
        <div className="card tint" style={{padding:18}}>
          <div style={{fontSize:11,color:'var(--muted)',fontFamily:'var(--font-mono)',letterSpacing:'0.06em'}}>LICENCIAS</div>
          <div style={{fontFamily:'var(--font-serif)',fontSize:36,marginTop:8,lineHeight:1}}>{counts.license || 0}</div>
        </div>
        <div className="card tint" style={{padding:18}}>
          <div style={{fontSize:11,color:'var(--muted)',fontFamily:'var(--font-mono)',letterSpacing:'0.06em'}}>RECUPERACIONES</div>
          <div style={{fontFamily:'var(--font-serif)',fontSize:36,marginTop:8,lineHeight:1}}>{counts.makeup_used || 0}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-h"><h3>Sesiones recientes</h3></div>
        {historial.length === 0 && (
          <div style={{padding:'32px 0',textAlign:'center',color:'var(--muted)',fontSize:14}}>
            Aún no tenés historial de clases.
          </div>
        )}
        {historial.map(h => {
          const d = new Date(h.date + 'T12:00');
          const st = STATUS[h.status] || STATUS.scheduled;
          return (
            <div key={h.id} className="list-row">
              <div className="when">
                <span className="num">{d.getDate()}</span>
                {d.toLocaleDateString('es-BO',{month:'short'}).toUpperCase().slice(0,3)} · {h.start}
              </div>
              <div>
                <div className="name">{h.name}</div>
                <div className="coach">con {h.coach}</div>
                {h.note && <div className="note">{h.note}</div>}
              </div>
              <Pill kind={st.kind}>{st.label}</Pill>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────
// 4. MEMBERSHIP
// ───────────────────────────────────────────────────────────
window.MembershipScreen = function MembershipScreen() {
  const _D = window.MOVE_DATA || {};
  const state = window.LUMINA_STATE || {};
  const membresia = state.membresia;

  const planes = [
    { id:'ess',  nombre:'Esencial',  count:'8 clases / mes',   precio:280, features:['8 créditos mensuales','1 recuperación al mes','Reserva online 24/7','Portal del alumno'] },
    { id:'lum',  nombre:'Lumina',    count:'12 clases / mes',  precio:420, features:['12 créditos mensuales','2 recuperaciones al mes','Evaluación inicial','Seguimiento personalizado','Acceso prioritario'], current: membresia?.planes?.tipo === 'creditos_12' },
    { id:'ili',  nombre:'Ilimitado', count:'Clases ilimitadas', precio:620, features:['Clases sin límite','2 clases privadas/mes','Evaluaciones mensuales','Atención preferencial'] },
  ];

  return (
    <div className="fade-in">
      <div className="page-title">Mi membresía</div>
      <p className="page-sub">
        {membresia
          ? `Plan activo desde ${_D.user?.member_since} · Vence ${membresia.fecha_fin}`
          : 'No tenés una membresía activa actualmente.'}
      </p>

      {membresia && (
        <div className="card dark" style={{marginBottom:18,padding:32,position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:-60,right:-60,width:280,height:280,borderRadius:'50%',background:'radial-gradient(circle,rgba(232,220,196,0.18) 0%,transparent 70%)',pointerEvents:'none'}}></div>
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:32,alignItems:'center'}}>
            <div>
              <div style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.14em',color:'var(--cream)',marginBottom:12}}>TU PLAN ACTUAL</div>
              <div style={{fontFamily:'var(--font-serif)',fontSize:56,lineHeight:1,letterSpacing:'-0.02em'}}>{membresia.planes?.nombre || 'Plan activo'}</div>
              <div style={{fontSize:14,opacity:0.7,marginTop:8}}>{membresia.planes?.descripcion || `Vence ${membresia.fecha_fin}`}</div>
              <div style={{display:'flex',gap:8,marginTop:22,flexWrap:'wrap'}}>
                <button className="btn" style={{background:'var(--cream)',color:'var(--ink-2)'}}>Cambiar plan</button>
              </div>
            </div>
            <div>
              <div style={{padding:16,background:'rgba(250,247,242,0.06)',borderRadius:14}}>
                <div style={{fontSize:11,fontFamily:'var(--font-mono)',color:'rgba(250,247,242,0.6)',letterSpacing:'0.06em'}}>CRÉDITOS RESTANTES</div>
                <div style={{fontFamily:'var(--font-serif)',fontSize:48,marginTop:8,lineHeight:1}}>
                  {_D.credits?.remaining === '∞' ? '∞' : _D.credits?.remaining ?? '—'}
                </div>
                <div style={{fontSize:12,opacity:0.6,marginTop:4}}>de {_D.credits?.total ?? '—'} totales</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card-h" style={{marginBottom:14,marginTop:24}}>
        <h3 style={{fontFamily:'var(--font-serif)',fontSize:26,margin:0}}>Planes disponibles</h3>
        <div style={{fontSize:13,color:'var(--muted)'}}>Hablá con administración para cambiar tu plan</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
        {planes.map(p => (
          <div key={p.id} className="card" style={{padding:24,position:'relative',borderColor:p.current?'var(--sage)':'var(--line)',background:p.current?'var(--bg-2)':'var(--paper)'}}>
            {p.current && <span style={{position:'absolute',top:14,right:14,background:'var(--sage-dark)',color:'var(--bg)',fontSize:10,letterSpacing:'0.1em',padding:'3px 8px',borderRadius:999,fontFamily:'var(--font-mono)'}}>ACTUAL</span>}
            <div style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.1em',color:'var(--muted)'}}>{p.count.toUpperCase()}</div>
            <div style={{fontFamily:'var(--font-serif)',fontSize:38,marginTop:8,lineHeight:1}}>{p.nombre}</div>
            <div style={{display:'flex',alignItems:'baseline',gap:4,marginTop:14}}>
              <div style={{fontFamily:'var(--font-serif)',fontSize:32}}>Bs {p.precio}</div>
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
              {p.current ? 'Plan actual' : 'Consultar'}
            </button>
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
  const _D = window.MOVE_DATA || {};
  const evaluaciones = _D.evaluations || _D.evaluaciones || [];

  return (
    <div className="fade-in">
      <div className="page-title">Evaluaciones</div>
      <p className="page-sub">Tu progreso físico documentado por tu instructora</p>

      {evaluaciones.length === 0 && (
        <div className="card" style={{padding:48,textAlign:'center',color:'var(--muted)'}}>
          <div style={{fontFamily:'var(--font-serif)',fontSize:22,marginBottom:8}}>Sin evaluaciones aún</div>
          <div style={{fontSize:14}}>Tu instructora cargará tu primera evaluación luego de la sesión inicial.</div>
        </div>
      )}

      {evaluaciones.map((e) => (
        <div key={e.id} className="card" style={{marginBottom:18}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
            <div>
              <div style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.06em',color:'var(--muted)'}}>{fmtDate(e.date).toUpperCase()}</div>
              <div style={{fontFamily:'var(--font-serif)',fontSize:28,letterSpacing:'-0.01em',margin:'8px 0 4px'}}>{e.title}</div>
              <div style={{fontSize:13,color:'var(--ink-soft)'}}>Por {e.by} · Nivel: <b>{e.level}</b></div>
            </div>
          </div>

          {(e.sections || []).length > 0 && (
            <div className="eval-grid">
              {e.sections.map((s, j) => (
                <div key={j} className="eval-it">
                  <div className="k">{s.label.toUpperCase()}</div>
                  <div className="v">{s.value}</div>
                  {s.delta && <div className={`d ${s.trend || 'flat'}`}>↑ {s.delta}</div>}
                </div>
              ))}
            </div>
          )}

          {e.observations && (
            <div style={{marginTop:14,padding:'14px 16px',background:'var(--bg-2)',borderRadius:12,borderLeft:'2px solid var(--sage)'}}>
              <div style={{fontSize:11,fontFamily:'var(--font-mono)',letterSpacing:'0.06em',color:'var(--muted)',marginBottom:6}}>OBSERVACIONES</div>
              <div style={{fontSize:13.5,lineHeight:1.5,color:'var(--ink)'}}>{e.observations}</div>
            </div>
          )}

          {e.objectives && (
            <div style={{marginTop:10,padding:'14px 16px',background:'var(--cream-soft)',borderRadius:12}}>
              <div style={{fontSize:11,fontFamily:'var(--font-mono)',letterSpacing:'0.06em',color:'var(--ink-2)',opacity:0.7,marginBottom:6}}>OBJETIVOS PRÓXIMO PERÍODO</div>
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
  const _D = window.MOVE_DATA || {};
  const makeups = _D.makeups || [];

  return (
    <div className="fade-in">
      <div className="page-title">Recuperaciones</div>
      <p className="page-sub">Créditos extra otorgados por licencias aprobadas</p>

      <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:18,marginBottom:18}}>
        <div className="card" style={{padding:28}}>
          <div style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.06em',color:'var(--muted)'}}>RECUPERACIONES DISPONIBLES</div>
          <div style={{fontFamily:'var(--font-serif)',fontSize:84,lineHeight:0.9,margin:'12px 0 6px',color:'var(--sage-dark)'}}>{makeups.length}</div>
          <div style={{fontSize:13,color:'var(--ink-soft)'}}>Podés usarlas en cualquier clase con cupo disponible.</div>
          {makeups.length > 0 && (
            <button className="btn btn-primary" style={{marginTop:18}} onClick={() => go('calendar')}>
              Reservar recuperación <Icon name="arrow-right" size={14} />
            </button>
          )}
        </div>

        <div className="card tint">
          <div className="card-h"><h3>¿Cómo funciona?</h3></div>
          <ol style={{paddingLeft:18,margin:0,fontSize:13.5,lineHeight:1.6,color:'var(--ink-soft)',display:'flex',flexDirection:'column',gap:8}}>
            <li>Solicitá licencia con mínimo <b>2 horas</b> de anticipación.</li>
            <li>La administración aprueba y genera un crédito de recuperación.</li>
            <li>Reservá una nueva clase dentro de los próximos 2 meses.</li>
          </ol>
        </div>
      </div>

      {makeups.length === 0 ? (
        <div className="card" style={{padding:32,textAlign:'center',color:'var(--muted)'}}>
          <div style={{fontSize:14}}>No tenés recuperaciones disponibles actualmente.</div>
        </div>
      ) : (
        <div className="card">
          <div className="card-h"><h3>Tus recuperaciones</h3></div>
          {makeups.map(m => (
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
      )}
    </div>
  );
};

// ───────────────────────────────────────────────────────────
// 7. NOTIFICATIONS
// ───────────────────────────────────────────────────────────
window.NotifScreen = function NotifScreen() {
  const _D = window.MOVE_DATA || {};
  const notifs = _D.notifications || [];
  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="fade-in">
      <div className="page-title">Notificaciones</div>
      <p className="page-sub">{unread} sin leer</p>

      <div className="card">
        {notifs.length === 0 && (
          <div style={{padding:'32px 0',textAlign:'center',color:'var(--muted)',fontSize:14}}>
            Sin notificaciones aún.
          </div>
        )}
        {notifs.map(n => {
          const dt = new Date(n.when);
          const dStr = dt.toLocaleDateString('es-BO',{day:'numeric',month:'short'});
          const tStr = dt.toLocaleTimeString('es-BO',{hour:'2-digit',minute:'2-digit'});
          return (
            <div key={n.id} style={{display:'flex',gap:14,padding:'18px 4px',borderBottom:'1px solid var(--line)'}}>
              <div style={{width:38,height:38,borderRadius:10,background:n.read?'var(--bg-2)':'var(--cream)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--ink-2)',flexShrink:0}}>
                <Icon name={n.icon || 'bell'} size={17} />
              </div>
              <div style={{flex:1}}>
                <div style={{display:'flex',gap:10,alignItems:'center'}}>
                  <span style={{fontSize:10.5,fontFamily:'var(--font-mono)',letterSpacing:'0.06em',color:'var(--muted)'}}>{(n.tag||'INFO').toUpperCase()}</span>
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
window.ProfileScreen = function ProfileScreen({ onLogout }) {
  const state = window.LUMINA_STATE || {};
  const perfil = state.perfil || {};
  const _D = window.MOVE_DATA || {};

  return (
    <div className="fade-in">
      <div className="page-title">Perfil</div>
      <p className="page-sub">Tu información personal y preferencias</p>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
        <div className="card">
          <div style={{display:'flex',alignItems:'center',gap:18,paddingBottom:22,borderBottom:'1px solid var(--line)'}}>
            <img
              src={perfil.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent((perfil.nombre||'A')+' '+(perfil.apellido||''))}&background=5C7260&color=fff&size=200`}
              style={{width:64,height:64,borderRadius:'50%',objectFit:'cover'}}
              alt=""
            />
            <div style={{flex:1}}>
              <div style={{fontFamily:'var(--font-serif)',fontSize:24,lineHeight:1}}>{perfil.nombre} {perfil.apellido}</div>
              <div style={{fontSize:13,color:'var(--muted)',marginTop:4}}>Miembro desde {_D.user?.member_since} · {_D.user?.plan}</div>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginTop:18}}>
            <div className="field"><div className="label-row">NOMBRE</div><input className="text-area" style={{minHeight:'auto',padding:'10px 14px'}} defaultValue={perfil.nombre || ''}/></div>
            <div className="field"><div className="label-row">APELLIDO</div><input className="text-area" style={{minHeight:'auto',padding:'10px 14px'}} defaultValue={perfil.apellido || ''}/></div>
            <div className="field"><div className="label-row">CORREO</div><input className="text-area" style={{minHeight:'auto',padding:'10px 14px'}} defaultValue={state.user?.email || ''} readOnly/></div>
            <div className="field"><div className="label-row">TELÉFONO</div><input className="text-area" style={{minHeight:'auto',padding:'10px 14px'}} defaultValue={perfil.telefono || ''}/></div>
          </div>
        </div>

        <div className="card">
          <div className="card-h"><h3>Salud y objetivos</h3></div>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div className="field">
              <div className="label-row">OBSERVACIONES MÉDICAS</div>
              <textarea className="text-area" defaultValue={perfil.observaciones_medicas || 'Sin observaciones registradas.'}/>
            </div>
            <div className="field">
              <div className="label-row">OBJETIVOS PRINCIPALES</div>
              <textarea className="text-area" defaultValue={perfil.objetivos || 'Aún no definidos.'}/>
            </div>
          </div>
        </div>
      </div>

      <div style={{marginTop:18,display:'flex',gap:8}}>
        <button className="btn btn-primary">Guardar cambios</button>
        <div style={{flex:1}}></div>
        <button onClick={onLogout} className="btn btn-ghost" style={{color:'var(--err)',borderColor:'rgba(168,90,74,0.3)'}}>
          <Icon name="logout" size={14} /> Cerrar sesión
        </button>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────
// 9. CHAT — Asistente Alma
// ───────────────────────────────────────────────────────────
window.ChatScreen = function ChatScreen() {
  const _D = window.MOVE_DATA || {};
  const [msgs, setMsgs] = useState([
    { role:'bot', text:`Hola ${_D.user?.firstName || ''} 🌿 — Soy Alma, tu asistente de Lumina Pilates. ¿En qué te puedo ayudar hoy?` }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const suggested = [
    '¿Cuántos créditos me quedan?',
    '¿Cómo solicito una licencia?',
    '¿Cuáles son los planes disponibles?',
    'Quiero hablar con alguien del estudio',
  ];

  const WHATSAPP_URL = 'https://wa.me/59170000000?text=Hola%20Lumina%20Pilates%2C%20necesito%20ayuda';

  const PRESET = {
    'crédito': () => {
      const r = _D.credits?.remaining;
      return `Tenés ${r === '∞' ? 'créditos ilimitados' : `${r} créditos disponibles`} en tu ciclo actual${_D.credits?.cycle_end ? ` (vence ${_D.credits.cycle_end})` : ''}.`;
    },
    'licencia': () => 'Podés solicitar licencia con mínimo 2 horas de anticipación antes de tu clase. Entrá a tu clase reservada desde el Calendario y tocá "Solicitar licencia". Si el plazo ya venció, escribinos al WhatsApp del estudio.',
    'plan': () => `Tenemos 3 planes: Esencial (8 clases · Bs 280), Lumina (12 clases · Bs 420) e Ilimitado (Bs 620/mes). Tu plan actual es: ${_D.user?.plan || 'no registrado'}.`,
    'membresía': () => `Tenemos 3 planes: Esencial (8 clases · Bs 280), Lumina (12 clases · Bs 420) e Ilimitado (Bs 620/mes). Tu plan actual es: ${_D.user?.plan || 'no registrado'}.`,
    'whatsapp': () => 'Te conecto con el estudio por WhatsApp ahora mismo.',
    'hablar': () => 'Te conecto con el estudio por WhatsApp ahora mismo.',
    'reservar': () => 'Podés reservar tus clases desde el Calendario en el menú lateral. ¿Querés que te lleve ahí?',
    'horario': () => 'Los horarios están disponibles en el Calendario. Hay clases de 7:00 a 11:00 AM y de 17:00 a 20:00 PM de lunes a sábado.',
  };

  const send = (text) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { role:'user', text }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const lower = text.toLowerCase();

      // Detectar si necesita WhatsApp
      if (lower.includes('hablar') || lower.includes('whatsapp') || lower.includes('llamar')) {
        setMsgs(m => [...m, {
          role: 'bot',
          text: 'Para consultas más específicas, te conecto directamente con el estudio:',
          link: WHATSAPP_URL,
          linkLabel: '💬 Abrir WhatsApp'
        }]);
        return;
      }

      let reply = 'No tengo información específica sobre eso. Te recomiendo contactar directamente con el estudio:';
      let link = null;
      let linkLabel = null;
      let matched = false;

      for (const k in PRESET) {
        if (lower.includes(k)) {
          reply = PRESET[k]();
          matched = true;
          if (reply.includes('WhatsApp ahora')) {
            link = WHATSAPP_URL;
            linkLabel = '💬 Abrir WhatsApp';
          }
          break;
        }
      }

      if (!matched) {
        link = WHATSAPP_URL;
        linkLabel = '💬 Contactar al estudio';
      }

      setMsgs(m => [...m, { role:'bot', text: reply, link, linkLabel }]);
    }, 800);
  };

  return (
    <div className="fade-in" style={{maxWidth:780,margin:'0 auto',height:'calc(100vh - 180px)',display:'flex',flexDirection:'column'}}>
      <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:18,padding:'14px 20px',background:'var(--paper)',border:'1px solid var(--line)',borderRadius:20}}>
        <div style={{width:42,height:42,borderRadius:'50%',background:'linear-gradient(135deg,var(--sage),var(--ink-2))',color:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-serif)',fontSize:20}}>A</div>
        <div style={{flex:1}}>
          <div style={{fontSize:15,fontWeight:500}}>Alma</div>
          <div style={{fontSize:11.5,color:'var(--muted)',display:'flex',alignItems:'center',gap:5,marginTop:2}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#6ea84a'}}></span>
            Asistente Lumina · Responde preguntas frecuentes
          </div>
        </div>
        <Pill kind="ok"><Icon name="sparkle" size={11} /> IA</Pill>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:'8px 4px',display:'flex',flexDirection:'column',gap:10}}>
        {msgs.map((m, i) => (
          <div key={i} style={{
            maxWidth:'72%', padding:'12px 16px', borderRadius:18,
            background: m.role==='user' ? 'var(--ink-2)' : 'var(--paper)',
            color: m.role==='user' ? 'var(--bg)' : 'var(--ink)',
            alignSelf: m.role==='user' ? 'flex-end' : 'flex-start',
            border: m.role==='user' ? 'none' : '1px solid var(--line)',
            fontSize:14, lineHeight:1.5, whiteSpace:'pre-wrap',
            borderBottomRightRadius: m.role==='user' ? 6 : 18,
            borderBottomLeftRadius: m.role==='bot' ? 6 : 18,
          }}>
            {m.text}
            {m.link && (
              <div style={{marginTop:10}}>
                <a href={m.link} target="_blank" rel="noopener noreferrer"
                  style={{display:'inline-block',padding:'8px 14px',background:'var(--sage-dark)',color:'white',borderRadius:999,fontSize:13,textDecoration:'none',fontWeight:500}}>
                  {m.linkLabel}
                </a>
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div style={{alignSelf:'flex-start',padding:'14px 18px',background:'var(--paper)',border:'1px solid var(--line)',borderRadius:18,borderBottomLeftRadius:6,display:'flex',gap:5}}>
            {[0,.15,.3].map((d,i) => (
              <span key={i} style={{width:6,height:6,borderRadius:'50%',background:'var(--muted-2)',animation:`mayaTyping 1.2s infinite ${d}s`}}></span>
            ))}
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
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if(e.key==='Enter') send(input); }}
          placeholder="Preguntá sobre clases, créditos, membresías..."
          style={{flex:1,border:'none',outline:'none',fontFamily:'var(--font-sans)',fontSize:14,background:'transparent'}}
        />
        <button onClick={() => send(input)} className="btn btn-primary" style={{padding:'8px 14px',fontSize:12}}>
          <Icon name="send" size={13} /> Enviar
        </button>
      </div>
    </div>
  );
};

// ── Helper local ────────────────────────────────────────────
function minutosHasta(cls) {
  if (!cls) return '—';
  const target = new Date(cls.date + 'T' + cls.start + ':00');
  const diff = Math.round((target - new Date()) / 60000);
  if (diff <= 0) return 'Ahora';
  if (diff < 60) return `${diff}m`;
  return `${Math.floor(diff/60)}h ${diff%60}m`;
}
